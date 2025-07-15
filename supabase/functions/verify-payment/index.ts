
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
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== VERIFY PAYMENT START ===');
    
    const { invoiceId, sessionId }: VerifyPaymentRequest = await req.json();
    console.log('Request data:', { invoiceId, sessionId });
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration');
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });
    
    // Initialize Stripe
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error('Stripe secret key not configured');
    }
    
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });
    
    let paymentStatus = 'pending';
    let paymentData = null;
    
    // If sessionId is provided, check Stripe session
    if (sessionId) {
      try {
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
        error: error.message,
        details: 'Failed to verify payment'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
