
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
    free: { min: 0, max: 99 },
    flow_start: { min: 100, max: 500 },
    flow_pro: { min: 501, max: 1500 },
    flow_power: { min: 1501, max: 5000 },
    flow_enterprise: { min: 5001, max: 15000 },
    flow_ultra: { min: 15001, max: undefined }
  };
  return ranges[planType];
};

export const getPlanBySubscribers = (subscriberCount: number): SubscriptionPlanType => {
  if (subscriberCount < 100) return 'free';
  if (subscriberCount <= 500) return 'flow_start';
  if (subscriberCount <= 1500) return 'flow_pro';
  if (subscriberCount <= 5000) return 'flow_power';
  if (subscriberCount <= 15000) return 'flow_enterprise';
  return 'flow_ultra';
};

export const getPlanPrice = (planType: SubscriptionPlanType, subscriberCount: number = 0): number => {
  const basePrices = {
    free: 0,
    flow_start: 399, // Valor base para 100-500 assinantes
    flow_pro: 699,   // Valor base para 501-1500 assinantes
    flow_power: 1299, // Valor base para 1501-5000 assinantes
    flow_enterprise: 2499, // Valor base para 5001-15000 assinantes
    flow_ultra: 4999 // Valor base para 15000+ assinantes
  };

  let basePrice = basePrices[planType];

  // Cálculo progressivo baseado no número de assinantes
  if (planType === 'flow_start' && subscriberCount > 100) {
    // R$ 399 + R$ 0,50 por assinante adicional após 100
    const additionalSubscribers = subscriberCount - 100;
    basePrice += Math.floor(additionalSubscribers * 0.5);
  } else if (planType === 'flow_pro' && subscriberCount > 500) {
    // R$ 699 + R$ 0,40 por assinante adicional após 500
    const additionalSubscribers = subscriberCount - 500;
    basePrice += Math.floor(additionalSubscribers * 0.4);
  } else if (planType === 'flow_power' && subscriberCount > 1500) {
    // R$ 1299 + R$ 0,30 por assinante adicional após 1500
    const additionalSubscribers = subscriberCount - 1500;
    basePrice += Math.floor(additionalSubscribers * 0.3);
  } else if (planType === 'flow_enterprise' && subscriberCount > 5000) {
    // R$ 2499 + R$ 0,20 por assinante adicional após 5000
    const additionalSubscribers = subscriberCount - 5000;
    basePrice += Math.floor(additionalSubscribers * 0.2);
  } else if (planType === 'flow_ultra' && subscriberCount > 15000) {
    // R$ 4999 + R$ 0,15 por assinante adicional após 15000
    const additionalSubscribers = subscriberCount - 15000;
    basePrice += Math.floor(additionalSubscribers * 0.15);
  }

  return basePrice;
};
