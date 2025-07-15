
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProcessPaymentRequest {
  invoiceId: string;
  paymentMethod: 'pix' | 'boleto' | 'credit_card';
  returnUrl?: string;
  amount?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== PROCESS PAYMENT START ===');
    
    const { invoiceId, paymentMethod, returnUrl, amount }: ProcessPaymentRequest = await req.json();
    console.log('Request data:', { invoiceId, paymentMethod, returnUrl, amount });
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration');
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });
    
    // Get invoice details
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .single();
    
    if (invoiceError || !invoice) {
      throw new Error('Invoice not found');
    }
    
    console.log('Invoice found:', invoice.id);
    
    let paymentUrl = null;
    let paymentData = null;
    
    // Process payment based on method
    switch (paymentMethod) {
      case 'pix':
        // For PIX, generate a simple payment URL (in real implementation, use a payment provider)
        paymentUrl = `${returnUrl || req.headers.get('origin')}/payment-success?invoice=${invoiceId}&method=pix`;
        paymentData = {
          pix_code: `00020126580014BR.GOV.BCB.PIX0136${invoiceId}520400005303986540${(amount || invoice.amount) / 100}5802BR5909AgentFlow6009SAO_PAULO62070503***63047C8A`,
          qr_code: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
        };
        break;
        
      case 'boleto':
        // For Boleto, generate a simple payment URL (in real implementation, use a payment provider)
        paymentUrl = `${returnUrl || req.headers.get('origin')}/payment-success?invoice=${invoiceId}&method=boleto`;
        paymentData = {
          boleto_code: `${invoiceId.replace(/-/g, '').substring(0, 12)}${Date.now().toString().substring(-8)}`,
          due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        };
        break;
        
      case 'credit_card':
        // For credit card, redirect to Stripe or similar
        paymentUrl = `${returnUrl || req.headers.get('origin')}/payment-success?invoice=${invoiceId}&method=credit_card`;
        paymentData = {
          redirect_url: paymentUrl
        };
        break;
        
      default:
        throw new Error('Invalid payment method');
    }
    
    // Update invoice with payment URL and data
    const { error: updateError } = await supabase
      .from('invoices')
      .update({
        payment_url: paymentUrl,
        payment_method: paymentMethod,
        payment_data: paymentData,
        updated_at: new Date().toISOString()
      })
      .eq('id', invoiceId);
    
    if (updateError) {
      console.error('Error updating invoice:', updateError);
      throw new Error('Failed to update invoice');
    }
    
    console.log('Payment processed successfully');
    console.log('=== PROCESS PAYMENT SUCCESS ===');
    
    return new Response(
      JSON.stringify({ 
        success: true,
        payment_url: paymentUrl,
        payment_data: paymentData,
        message: 'Payment processed successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('=== PROCESS PAYMENT ERROR ===');
    console.error('Error processing payment:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        details: 'Failed to process payment'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
