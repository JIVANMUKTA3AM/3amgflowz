import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProviderPlan {
  id: string;
  nome_plano: string;
  preco: number;
  promocao: string | null;
  condicoes: string | null;
  ativo: boolean;
}

interface Provider {
  id: string;
  name: string;
  cnpj_id: string;
  contact: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/');
    const providerId = pathSegments[pathSegments.length - 2]; // Get provider_id from URL

    console.log('Provider ID:', providerId);

    if (!providerId) {
      return new Response(
        JSON.stringify({ error: 'Provider ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get provider information
    const { data: provider, error: providerError } = await supabase
      .from('providers')
      .select('id, name, cnpj_id, contact')
      .eq('id', providerId)
      .single();

    if (providerError || !provider) {
      console.error('Provider error:', providerError);
      return new Response(
        JSON.stringify({ error: 'Provider not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get active plans for the provider
    const { data: plans, error: plansError } = await supabase
      .from('planos_provedores')
      .select('*')
      .eq('provedor_id', providerId)
      .eq('ativo', true)
      .order('nome_plano');

    if (plansError) {
      console.error('Plans error:', plansError);
      return new Response(
        JSON.stringify({ error: 'Error fetching plans' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Format response according to specification
    const response = {
      provedor: provider.name,
      planos: plans?.map(plan => ({
        nome: plan.nome_plano,
        preco: parseFloat(plan.preco),
        promocao: plan.promocao || null
      })) || [],
      condicoes: {
        carencia: "12 meses", // Default condition - can be customized per provider later
        instalacao: "Consulte condições" // Default condition
      }
    };

    console.log('API Response:', response);

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});