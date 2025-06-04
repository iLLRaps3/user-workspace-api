
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCredits } from "@/hooks/useCredits";

export default function PaymentSuccess() {
  const [_, navigate] = useLocation();
  const { user, refetch } = useAuth();
  const { refreshCredits } = useCredits();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Refresh user data and credits after payment
    const refreshData = async () => {
      try {
        await Promise.all([
          refetch(),
          refreshCredits()
        ]);
      } catch (error) {
        console.error("Error refreshing data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Add a small delay to ensure payment has been processed
    const timer = setTimeout(refreshData, 2000);
    return () => clearTimeout(timer);
  }, [refetch, refreshCredits]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center bg-gray-50">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="pt-6 text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
              <h2 className="text-xl font-semibold mb-2">Processing Payment...</h2>
              <p className="text-gray-600">Please wait while we confirm your payment.</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
            <CardDescription>
              Your subscription has been activated and credits have been added to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                <strong>Plan:</strong> {user?.plan || 'Premium'}
              </p>
              <p className="text-sm text-green-800">
                <strong>Status:</strong> Active
              </p>
            </div>
            
            <div className="space-y-2">
              <Button 
                onClick={() => navigate("/chat")}
                className="w-full"
              >
                Start Chatting
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate("/")}
                className="w-full"
              >
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}
