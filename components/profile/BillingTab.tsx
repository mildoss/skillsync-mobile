import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Sparkles, Check, ShieldCheck, Zap } from "lucide-react-native";
import { cssInterop } from "nativewind";
import { User } from "@/types/users";
import { Button } from "@/components/ui/button";

[Sparkles, Check, ShieldCheck, Zap].forEach((Icon) => {
  cssInterop(Icon, {
    className: { target: "style", nativeStyleToProp: { color: true } },
  });
});

interface BillingTabProps {
  user?: User | null;
}

interface PricingPackage {
  id: string;
  title: string;
  price: string;
  oldPrice: string;
  credits: number;
  description: string;
  isPopular?: boolean;
}

const PRICING_PACKAGES: PricingPackage[] = [
  {
    id: "pack_10",
    title: "Starter",
    price: "2.99",
    oldPrice: "4.99",
    credits: 10,
    description: "Perfect for single tasks and exploring AI capabilities.",
    isPopular: false,
  },
  {
    id: "pack_25",
    title: "Pro",
    price: "5.99",
    oldPrice: "9.99",
    credits: 25,
    description: "The best choice for active job hunting or hiring.",
    isPopular: true,
  },
  {
    id: "pack_50",
    title: "Ultimate",
    price: "9.99",
    oldPrice: "19.99",
    credits: 50,
    description: "Maximum power for HR professionals and agencies.",
    isPopular: false,
  },
];

export const BillingTab = ({ user }: BillingTabProps) => {
  const credits = user?.aiCredits ?? 0;

  const handleSelectPlan = (plan: PricingPackage) => {
    Alert.alert(
      `${plan.title} Plan`,
      `In-app checkout for ${plan.credits} AI Tokens ($${plan.price}) will be available in the upcoming App Store / Google Play update. Web checkout via Stripe is active!`,
      [{ text: "OK" }]
    );
  };

  return (
    <View className="flex-1 pb-16">
      <View className="mb-6">
        <Text className="text-2xl font-bold tracking-tight text-foreground">Billing & Plans</Text>
        <Text className="mt-1 text-sm text-muted-foreground">
          Manage your AI credits and choose the right package for your workflow.
        </Text>
      </View>

      <View className="mb-8 rounded-3xl border border-primary/20 bg-primary/5 p-5 shadow-sm">
        <View className="flex-row items-center gap-4">
          <View className="items-center justify-center rounded-2xl bg-primary/10 p-3.5">
            <Sparkles className="text-primary" size={28} />
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
        {PRICING_PACKAGES.map((plan) => {
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
              >
                <Zap
                  className={`mr-2 ${isPopular ? "text-primary-foreground" : "text-primary"}`}
                  size={16}
                />
                <Text
                  className={`text-sm font-bold ${isPopular ? "text-primary-foreground" : "text-foreground"
                    }`}
                >
                  Choose {plan.title}
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
