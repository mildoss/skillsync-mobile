import { useState } from "react";
import { View, Text, Alert, ActivityIndicator } from "react-native";
import { Sparkles, Check, ShieldCheck, Zap } from "lucide-react-native";
import { cssInterop } from "nativewind";
import * as WebBrowser from "expo-web-browser";
import { User } from "@/types/users";
import { Button } from "@/components/ui/button";
import { PRICING_PLANS, PricingPackage } from "@/lib/constans";
import { createCheckoutSession, getMe } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";

[Sparkles, Check, ShieldCheck, Zap].forEach((Icon) => {
  cssInterop(Icon, {
    className: { target: "style", nativeStyleToProp: { color: true } },
  });
});

interface BillingTabProps {
  user?: User | null;
}

export const BillingTab = ({ user }: BillingTabProps) => {
  const credits = user?.aiCredits ?? 0;
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  const handleSelectPlan = async (plan: PricingPackage) => {
    try {
      setLoadingPlanId(plan.id);
      const res = await createCheckoutSession(plan.id);

      if (!res?.checkoutUrl) {
        Alert.alert("Checkout Error", "Failed to retrieve checkout URL from the server.");
        return;
      }

      await WebBrowser.openBrowserAsync(res.checkoutUrl, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
        dismissButtonStyle: "done",
      });

      const freshUser = await getMe();
      if (freshUser) {
        useAuthStore.getState().setUser(freshUser);
      }
    } catch (error: any) {
      Alert.alert("Payment Error", error?.message || "Failed to initiate payment session.");
    } finally {
      setLoadingPlanId(null);
    }
  };

  return (
    <View className="flex-1 pb-16">
      <View className="mb-6">
        <Text className="text-2xl font-bold tracking-tight text-foreground">Billing & Plans</Text>
        <Text className="mt-1 text-sm text-muted-foreground">
          Manage your AI credits and choose the right package for your workflow.
        </Text>
      </View>

      <View className="mb-8 overflow-hidden rounded-3xl border border-primary/20 bg-card p-5 shadow-sm">
        <View className="flex-row items-center gap-4">
          <View className="h-14 w-14 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
            <Sparkles className="text-primary" size={26} />
          </View>
          <View className="flex-1">
            <Text className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Available Balance
            </Text>
            <View className="mt-0.5 flex-row items-baseline gap-2">
              <Text className="text-3xl font-black text-foreground">{credits}</Text>
              <Text className="text-sm font-bold text-primary">Tokens</Text>
            </View>
          </View>
        </View>
        <Text className="mt-4 text-xs text-muted-foreground">
          Tokens never expire and can be used for any AI generation feature across SkillSync.
        </Text>
      </View>

      <View className="mb-4">
        <Text className="text-xl font-bold tracking-tight text-foreground">
          Supercharge with <Text className="text-primary">AI</Text>
        </Text>
        <Text className="mt-1 text-xs text-muted-foreground">
          1 token = 1 AI generation (Cover letters, Vacancy descriptions, Match score).
        </Text>
      </View>

      <View className="gap-5">
        {PRICING_PLANS.map((plan) => {
          const isPopular = plan.isPopular;
          return (
            <View
              key={plan.id}
              className={`relative rounded-3xl border p-6 ${isPopular
                ? "border-primary bg-card shadow-md"
                : "border-border bg-card"
                }`}
            >
              {isPopular && (
                <View className="absolute -top-3 left-6 rounded-full bg-primary px-3.5 py-1 shadow-sm">
                  <Text className="text-[10px] font-extrabold uppercase tracking-widest text-primary-foreground">
                    Best Value
                  </Text>
                </View>
              )}

              <View className="mb-4 flex-row items-start justify-between">
                <View className="flex-1 pr-2">
                  <Text className="text-xl font-bold text-foreground">{plan.title}</Text>
                  <Text className="mt-1 text-xs text-muted-foreground">{plan.description}</Text>
                </View>
                <View className="items-end">
                  <View className="flex-row items-baseline gap-1.5">
                    <Text className="text-3xl font-black text-foreground">${plan.price}</Text>
                    <Text className="text-sm font-medium text-muted-foreground/60 line-through">
                      ${plan.oldPrice}
                    </Text>
                  </View>
                  <Text className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    One-time
                  </Text>
                </View>
              </View>

              <View className="mb-5 flex-row items-center gap-2.5 rounded-2xl bg-muted/60 p-3">
                <View className="rounded-full bg-primary/10 p-1.5">
                  <Sparkles className="text-primary" size={16} />
                </View>
                <Text className="text-sm font-bold text-foreground">
                  {plan.credits} AI Tokens{" "}
                  <Text className="text-xs font-normal text-muted-foreground">included</Text>
                </Text>
              </View>

              <View className="mb-5 gap-2.5">
                {["AI Cover Letter", "AI Vacancy Description", "AI Match Score"].map((feat) => (
                  <View key={feat} className="flex-row items-center gap-2.5">
                    <Check className="text-primary" size={16} />
                    <Text className="text-sm font-medium text-foreground">{feat}</Text>
                  </View>
                ))}
              </View>

              <Button
                onPress={() => handleSelectPlan(plan)}
                variant={isPopular ? "default" : "outline"}
                className="h-12 w-full rounded-2xl"
                disabled={loadingPlanId !== null}
              >
                {loadingPlanId === plan.id ? (
                  <ActivityIndicator
                    size="small"
                    color={isPopular ? "#ffffff" : "#3b82f6"}
                    className="mr-2"
                  />
                ) : (
                  <Zap
                    className={`mr-2 ${isPopular ? "text-primary-foreground" : "text-primary"}`}
                    size={16}
                  />
                )}
                <Text
                  className={`text-sm font-bold ${isPopular ? "text-primary-foreground" : "text-foreground"
                    }`}
                >
                  {loadingPlanId === plan.id ? "Preparing checkout..." : `Choose ${plan.title}`}
                </Text>
              </Button>
            </View>
          );
        })}
      </View>

      <View className="mt-8 flex-row items-center gap-3 rounded-2xl border border-dashed border-border bg-muted/30 p-4">
        <ShieldCheck className="text-muted-foreground" size={22} />
        <Text className="flex-1 text-xs leading-relaxed text-muted-foreground">
          All transactions are processed securely via <Text className="font-semibold text-foreground">Stripe</Text>. Tokens have no expiration date.
        </Text>
      </View>
    </View>
  );
};
