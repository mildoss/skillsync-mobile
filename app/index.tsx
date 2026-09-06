import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background justify-center items-center p-6">
      <View className="items-center flex-1 justify-center w-full">
        <Text className="text-4xl font-extrabold text-foreground tracking-tight text-center mb-4">
          SkillSync Mobile
        </Text>
        <Text className="text-muted-foreground text-center mb-12 text-lg">
          Find your dream job among hundreds of offers.
        </Text>

        <Button 
          size="lg" 
          className="w-full"
          onPress={() => router.replace("/(tabs)/vacancies")}
        >
          Get Started
        </Button>
      </View>
    </SafeAreaView>
  );
}
