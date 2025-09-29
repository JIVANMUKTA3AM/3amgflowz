
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerifyPaymentRequest {
  invoiceId?: string;
  sessionId?: string;
  test?: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== VERIFY PAYMENT START ===');
    
    const { invoiceId, sessionId, test }: VerifyPaymentRequest = await req.json();
    console.log('Request data:', { invoiceId, sessionId, test });
    
    // If this is a test request, return a mock response
    if (test) {
      console.log('Test mode - returning mock response');
      return new Response(
        JSON.stringify({ 
          status: 'success',
          message: 'Test mode - função funcionando corretamente',
          test: true
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration');
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });
    
    let paymentStatus = 'pending';
    let paymentData = null;
    
    // If sessionId is provided, check Stripe session
    if (sessionId) {
      try {
        // Initialize Stripe
        const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
        if (!stripeSecretKey) {
          throw new Error('Stripe secret key not configured');
        }
        
        const stripe = new Stripe(stripeSecretKey, {
          apiVersion: '2023-10-16',
        });
        
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        console.log('Stripe session status:', session.payment_status);
        
        if (session.payment_status === 'paid') {
          paymentStatus = 'paid';
          paymentData = {
            stripe_session_id: session.id,
            payment_method: 'card',
            amount: session.amount_total,
            currency: session.currency
          };
        }
      } catch (stripeError) {
        console.error('Error retrieving Stripe session:', stripeError);
        // Don't throw here, just log the error and continue
      }
    }
    
    // If invoiceId is provided, update invoice in database
    if (invoiceId && paymentStatus === 'paid') {
      try {
        const { error: updateError } = await supabase
          .from('invoices')
          .update({
            status: 'paid',
            payment_method: 'card',
            payment_date: new Date().toISOString(),
            payment_data: paymentData,
            updated_at: new Date().toISOString()
          })
          .eq('id', invoiceId);
        
        if (updateError) {
          console.error('Error updating invoice:', updateError);
        } else {
          console.log('Invoice updated successfully');
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
      }
    }
    
    console.log('=== VERIFY PAYMENT SUCCESS ===');
    
    return new Response(
      JSON.stringify({ 
        status: paymentStatus,
        payment_data: paymentData,
        message: paymentStatus === 'paid' ? 'Payment verified successfully' : 'Payment pending'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('=== VERIFY PAYMENT ERROR ===');
    console.error('Error verifying payment:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : String(error),
        details: 'Failed to verify payment'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
