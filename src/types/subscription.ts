
export type SubscriptionPlanType = 
  | 'free' 
  | 'flow_start' 
  | 'flow_pro' 
  | 'flow_power' 
  | 'flow_enterprise' 
  | 'flow_ultra';

export interface SubscriptionPlan {
  id: string;
  plan_type: SubscriptionPlanType;
  name: string;
  description: string;
  price_amount: number;
  price_currency: string;
  billing_interval: string;
  stripe_price_id?: string;
  features: string[];
  is_active: boolean;
  sort_order: number;
  subscriber_range?: {
    min: number;
    max?: number;
  };
}

export const getSubscriberRange = (planType: SubscriptionPlanType) => {
  const ranges = {
    free: { min: 0, max: 0 },
    flow_start: { min: 1, max: 1000 },
    flow_pro: { min: 1001, max: 3000 },
    flow_power: { min: 3001, max: 10000 },
    flow_enterprise: { min: 10001, max: 30000 },
    flow_ultra: { min: 30001, max: undefined }
  };
  return ranges[planType];
};

export const getPlanBySubscribers = (subscriberCount: number): SubscriptionPlanType => {
  if (subscriberCount === 0) return 'free';
  if (subscriberCount <= 1000) return 'flow_start';
  if (subscriberCount <= 3000) return 'flow_pro';
  if (subscriberCount <= 10000) return 'flow_power';
  if (subscriberCount <= 30000) return 'flow_enterprise';
  return 'flow_ultra';
};
