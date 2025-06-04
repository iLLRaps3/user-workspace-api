import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  credits: number;
  features: string[];
  popular?: boolean;
}

const pricingPlans: PricingPlan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 0,
    credits: 100,
    features: [
      "Access to Groq AI Assistant",
      "100 messages per month",
      "Basic prompt templates",
      "Standard response time"
    ]
  },
  {
    id: "pro",
    name: "Pro",
    price: 9.99,
    credits: 1000,
    features: [
      "Everything in Basic",
      "1,000 messages per month",
      "Full prompt library access",
      "Priority response time",
      "Save unlimited chat history"
    ],
    popular: true
  },
  {
    id: "premium",
    name: "Premium",
    price: 19.99,
    credits: 3000,
    features: [
      "Everything in Pro",
      "3,000 messages per month",
      "Custom prompt creation",
      "Team sharing features",
      "Advanced model parameters",
      "24/7 priority support"
    ]
  }
];

export default function Pricing() {
  const [_, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [processing, setProcessing] = useState<string | null>(null);
  const [stripeConfigured, setStripeConfigured] = useState<boolean | null>(null);

  // Check Stripe configuration on mount
  useEffect(() => {
    const checkStripe = async () => {
      try {
        const response = await fetch("/api/stripe/status");
        const data = await response.json();
        setStripeConfigured(data.configured);
      } catch (error) {
        console.error("Failed to check Stripe status:", error);
        setStripeConfigured(false);
      }
    };
    
    checkStripe();
  }, []);

  const handlePurchase = async (plan: PricingPlan) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (plan.id === "basic") {
      toast({
        title: "Free Plan Selected",
        description: "You are already on the free plan. Enjoy your 100 credits!",
      });
      return;
    }

    try {
      setProcessing(plan.id);
      
      // Create checkout session
      const response = await apiRequest("POST", "/api/create-checkout", {
        planId: plan.id,
        priceAmount: plan.price,
        credits: plan.credits
      });
      
      const data = await response.json();
      
      // Redirect to checkout
      window.location.href = data.checkoutUrl;
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Error",
        description: stripeConfigured === false 
          ? "Payment processing is not configured. Please contact support."
          : "Unable to process payment. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Choose the Perfect Plan
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get access to the power of Groq AI with a plan that suits your needs
            </p>
            {stripeConfigured === false && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md mx-auto">
                <p className="text-sm text-yellow-800">
                  ⚠️ Payment processing is not fully configured. Please set up Stripe environment variables.
                </p>
              </div>
            )}
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {pricingPlans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative flex flex-col ${
                  plan.popular ? "border-primary shadow-lg" : "border-gray-200"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                    <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>
                    {plan.price === 0 ? "Free" : `$${plan.price} / month`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="font-medium text-lg text-gray-900 mb-4">
                    <span className="text-3xl text-primary">{plan.credits}</span> credits
                  </p>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handlePurchase(plan)}
                    disabled={processing === plan.id}
                  >
                    {processing === plan.id ? (
                      <span className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                      </span>
                    ) : user?.plan === plan.id ? (
                      "Current Plan"
                    ) : (
                      `Get ${plan.name}`
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="mt-16 max-w-3xl mx-auto bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">What are credits?</h3>
                <p className="text-gray-600">Credits are used for each message sent to the AI. Different models and features may use different amounts of credits.</p>
              </div>
              <div>
                <h3 className="font-medium">Do unused credits roll over?</h3>
                <p className="text-gray-600">Yes, unused credits roll over to the next month up to a maximum of twice your monthly allocation.</p>
              </div>
              <div>
                <h3 className="font-medium">Can I change my plan?</h3>
                <p className="text-gray-600">You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.</p>
              </div>
              <div>
                <h3 className="font-medium">How do I cancel my subscription?</h3>
                <p className="text-gray-600">You can cancel your subscription at any time from your account settings. You'll continue to have access until the end of your current billing period.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
