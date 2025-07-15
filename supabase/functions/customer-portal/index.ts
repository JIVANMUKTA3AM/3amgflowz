
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CustomerPortalRequest {
  returnUrl?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== CUSTOMER PORTAL START ===');
    
    const { returnUrl }: CustomerPortalRequest = await req.json();
    console.log('Request data:', { returnUrl });
    
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
    
    // Initialize Stripe
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error('Stripe secret key not configured');
    }
    
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });
    
    // Find customer by email
    const customers = await stripe.customers.list({
      email: user.email!,
      limit: 1,
    });
    
    if (customers.data.length === 0) {
      throw new Error('Customer not found');
    }
    
    const customer = customers.data[0];
    console.log('Customer found:', customer.id);
    
    // Create portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: returnUrl || `${req.headers.get('origin')}/subscription`,
    });
    
    console.log('Portal session created:', portalSession.id);
    console.log('=== CUSTOMER PORTAL SUCCESS ===');
    
    return new Response(
      JSON.stringify({ 
        url: portalSession.url,
        message: 'Customer portal session created successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('=== CUSTOMER PORTAL ERROR ===');
    console.error('Error creating customer portal session:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to create customer portal session'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
