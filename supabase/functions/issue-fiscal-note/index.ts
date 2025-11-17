import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface IssueNoteRequest {
  invoiceId: string;
  provider: 'nfeio' | 'enotas' | 'other';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

    const { invoiceId, provider } = await req.json() as IssueNoteRequest;

    // Buscar configuração da API fiscal
    const { data: config, error: configError } = await supabaseClient
      .from('fiscal_api_configs')
      .select('*')
      .eq('user_id', user.id)
      .eq('provider', provider)
      .eq('is_active', true)
      .single();

    if (configError || !config) {
      throw new Error('Configuração da API fiscal não encontrada. Configure nas opções de pagamento.');
    }

    // Buscar dados da fatura
    const { data: invoice, error: invoiceError } = await supabaseClient
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .single();

    if (invoiceError || !invoice) {
      throw new Error('Fatura não encontrada');
    }

    // Criar registro de nota fiscal com status "processing"
    const { data: fiscalNote, error: noteError } = await supabaseClient
      .from('fiscal_notes')
      .insert({
        user_id: user.id,
        organization_id: invoice.organization_id,
        invoice_id: invoiceId,
        provider: provider,
        status: 'processing'
      })
      .select()
      .single();

    if (noteError) {
      throw new Error('Erro ao criar registro de nota fiscal');
    }

    // Preparar dados para a API externa
    const noteData = {
      cliente: {
        nome: invoice.cliente_nome || 'Cliente',
        telefone: invoice.cliente_telefone || '',
      },
      servico: {
        descricao: invoice.description,
        valor: invoice.amount / 100, // Convertendo de centavos para reais
      },
      vencimento: invoice.due_date,
    };

    console.log('Enviando para API fiscal:', { provider, noteData });

    // Simular chamada à API externa (adaptar conforme API real)
    let apiResponse;
    try {
      const apiUrl = config.api_url || getDefaultApiUrl(provider);
      
      apiResponse = await fetch(`${apiUrl}/notas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.api_token}`,
        },
        body: JSON.stringify(noteData),
      });

      const responseData = await apiResponse.json();

      if (!apiResponse.ok) {
        throw new Error(responseData.message || 'Erro na API fiscal');
      }

      // Atualizar nota fiscal com sucesso
      const { error: updateError } = await supabaseClient
        .from('fiscal_notes')
        .update({
          status: 'issued',
          note_number: responseData.numero || responseData.number,
          note_key: responseData.chave || responseData.key,
          pdf_url: responseData.pdf_url || responseData.pdfUrl,
          xml_url: responseData.xml_url || responseData.xmlUrl,
          external_id: responseData.id,
          issued_at: new Date().toISOString(),
          metadata: responseData,
        })
        .eq('id', fiscalNote.id);

      if (updateError) {
        console.error('Erro ao atualizar nota:', updateError);
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Nota fiscal emitida com sucesso!',
          data: {
            noteId: fiscalNote.id,
            noteNumber: responseData.numero || responseData.number,
            pdfUrl: responseData.pdf_url || responseData.pdfUrl,
          },
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );

    } catch (apiError: any) {
      console.error('Erro na API fiscal:', apiError);
      
      // Atualizar nota fiscal com erro
      await supabaseClient
        .from('fiscal_notes')
        .update({
          status: 'error',
          error_message: apiError.message || 'Erro ao comunicar com API fiscal',
        })
        .eq('id', fiscalNote.id);

      throw new Error(`Erro ao emitir nota: ${apiError.message}. Verifique suas credenciais e tente novamente.`);
    }

  } catch (error: any) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Erro ao processar solicitação' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});

function getDefaultApiUrl(provider: string): string {
  const urls: Record<string, string> = {
    nfeio: 'https://api.nfe.io/v1',
    enotas: 'https://api.enotas.com.br/v2',
    other: '',
  };
  return urls[provider] || '';
}
