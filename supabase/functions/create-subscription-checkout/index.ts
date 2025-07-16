
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CheckoutRequest {
  planType: 'free' | 'flow_start' | 'flow_pro' | 'flow_power' | 'flow_enterprise' | 'flow_ultra';
  successUrl?: string;
  cancelUrl?: string;
  test?: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== CREATE SUBSCRIPTION CHECKOUT START ===');
    
    const { planType, successUrl, cancelUrl, test }: CheckoutRequest = await req.json();
    console.log('Request data:', { planType, successUrl, cancelUrl, test });
    
    // If this is a test request, return a mock response
    if (test) {
      console.log('Test mode - returning mock response');
      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Test mode - função funcionando corretamente',
          plan_type: planType,
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
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });
    
    // Get user from auth token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !userData.user) {
      throw new Error('User not authenticated');
    }
    
    const user = userData.user;
    console.log('User authenticated:', user.email);
    
    // Handle free plan
    if (planType === 'free') {
      return new Response(
        JSON.stringify({ 
          message: 'Free plan activated',
          url: successUrl || `${req.headers.get('origin')}/subscription?success=true`
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Handle Flow Ultra plan (custom solution)
    if (planType === 'flow_ultra') {
      return new Response(
        JSON.stringify({ 
          message: 'Entre em contato para soluções customizadas',
          url: `${req.headers.get('origin')}/contact?plan=flow_ultra`
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }
    
    // Initialize Stripe
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error('Stripe secret key not configured');
    }
    
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });
    
    console.log('Stripe initialized');
    
    // Check if customer already exists
    const customers = await stripe.customers.list({
      email: user.email!,
      limit: 1,
    });
    
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log('Existing customer found:', customerId);
    } else {
      // Create new customer
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: {
          user_id: user.id,
        },
      });
      customerId = customer.id;
      console.log('New customer created:', customerId);
    }

    // Plan prices and names
    const planData = {
      flow_start: { price: 19900, name: 'Flow Start - Até 1.000 clientes' },
      flow_pro: { price: 49900, name: 'Flow Pro - 1.001 a 3.000 clientes' },
      flow_power: { price: 89900, name: 'Flow Power - 3.001 a 10.000 clientes' },
      flow_enterprise: { price: 149700, name: 'Flow Enterprise - 10.001 a 30.000 clientes' }
    };

    const selectedPlan = planData[planType as keyof typeof planData];
    if (!selectedPlan) {
      throw new Error('Invalid plan type');
    }
    
    // Create checkout session for subscription
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: selectedPlan.name,
              description: 'Plano Flow - Agentes IA para provedores de internet',
            },
            unit_amount: selectedPlan.price,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      success_url: successUrl || `${req.headers.get('origin')}/subscription?success=true`,
      cancel_url: cancelUrl || `${req.headers.get('origin')}/subscription?canceled=true`,
      metadata: {
        user_id: user.id,
        plan_type: planType,
      },
    });
    
    console.log('Checkout session created:', session.id);
    console.log('=== CREATE SUBSCRIPTION CHECKOUT SUCCESS ===');
    
    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('=== CREATE SUBSCRIPTION CHECKOUT ERROR ===');
    console.error('Error creating checkout session:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to create checkout session'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
