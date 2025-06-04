import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "./use-toast";
import { useAuth } from "./useAuth";

export function useCredits() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  // Get user credits
  const { data } = useQuery({
    queryKey: ["/api/credits"],
    enabled: !!user,
  });

  const credits = data?.credits || 0;

  // Deduct credits mutation
  const deductCreditsMutation = useMutation({
    mutationFn: async (amount: number) => {
      const res = await apiRequest("POST", "/api/credits/deduct", { amount });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/credits"] });
    },
    onError: (error) => {
      console.error("Error deducting credits:", error);
      toast({
        title: "Error",
        description: "Failed to deduct credits. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Add credits mutation
  const addCreditsMutation = useMutation({
    mutationFn: async (amount: number) => {
      const res = await apiRequest("POST", "/api/credits/add", { amount });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/credits"] });
    },
    onError: (error) => {
      console.error("Error adding credits:", error);
      toast({
        title: "Error",
        description: "Failed to add credits. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deductCredits = async (amount: number) => {
    try {
      if (!user) {
        return { success: false, message: "User not authenticated" };
      }

      if (credits < amount) {
        toast({
          title: "Insufficient Credits",
          description: "You don't have enough credits for this operation. Please purchase more.",
          variant: "destructive",
        });
        return { success: false, message: "Insufficient credits" };
      }

      await deductCreditsMutation.mutateAsync(amount);
      return { success: true };
    } catch (error) {
      return { success: false, message: "Failed to deduct credits" };
    }
  };

  return {
    credits,
    deductCredits,
    addCredits: (amount: number) => addCreditsMutation.mutate(amount),
    isLoading: deductCreditsMutation.isPending || addCreditsMutation.isPending,
  };
}
