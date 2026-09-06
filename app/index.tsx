import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-background p-6">
      <View className="w-full flex-1 items-center justify-center">
        <Text className="mb-4 text-center text-4xl font-extrabold tracking-tight text-foreground">
          SkillSync Mobile
        </Text>
        <Text className="mb-12 text-center text-lg text-muted-foreground">
          Find your dream job among hundreds of offers.
        </Text>

        <Button size="lg" className="w-full" onPress={() => router.replace("/(tabs)/vacancies")}>
          Get Started
        </Button>
      </View>
    </SafeAreaView>
  );
}
