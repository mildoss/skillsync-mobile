import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-950 justify-center items-center p-6">
      <View className="items-center">
        <Text className="text-3xl font-extrabold text-white tracking-tight">
          SkillSync Mobile
        </Text>
      </View>
    </SafeAreaView>
  );
}
