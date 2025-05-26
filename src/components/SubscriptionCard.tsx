
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap } from "lucide-react";

interface SubscriptionCardProps {
  title: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  isPopular?: boolean;
  isCurrentPlan?: boolean;
  onSubscribe: () => void;
}

const SubscriptionCard = ({
  title,
  description,
  price,
  period,
  features,
  isPopular = false,
  isCurrentPlan = false,
  onSubscribe,
}: SubscriptionCardProps) => {
  return (
    <Card className={`relative ${isPopular ? 'border-blue-500 border-2' : ''} ${isCurrentPlan ? 'border-green-500 border-2' : ''}`}>
      {isPopular && (
        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
          <Crown className="w-3 h-3 mr-1" />
          Mais Popular
        </Badge>
      )}
      
      {isCurrentPlan && (
        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500">
          <Check className="w-3 h-3 mr-1" />
          Seu Plano
        </Badge>
      )}

      <CardHeader className="text-center">
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="mt-4">
          <span className="text-3xl font-bold">{price}</span>
          <span className="text-gray-500">/{period}</span>
        </div>
      </CardHeader>
      
      <CardContent>
        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        
        <Button 
          onClick={onSubscribe}
          className="w-full"
          variant={isCurrentPlan ? "outline" : "default"}
          disabled={isCurrentPlan}
        >
          {isCurrentPlan ? "Plano Atual" : "Assinar Agora"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;
