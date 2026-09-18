import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { BrainCircuit, Sparkles } from "lucide-react-native";

interface ApplicationEvaluatorProps {
  matching: { score: number; reason: string } | null;
  isChecking: boolean;
  isEvaluating: boolean;
  onEvaluate: () => void;
}

export const ApplicationEvaluator = ({
  matching,
  isChecking,
  isEvaluating,
  onEvaluate,
}: ApplicationEvaluatorProps) => {
  return (
    <View className="mt-3 rounded-xl border border-border/70 bg-muted/20 p-3">
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center gap-1.5">
          <BrainCircuit size={14} color="#8b5cf6" />
          <Text className="text-xs font-semibold text-foreground">AI Matching</Text>
        </View>
        {matching && (
          <View
            className={`rounded-full px-2 py-0.5 ${
              matching.score >= 80
                ? "bg-green-500/10"
                : matching.score >= 50
                  ? "bg-yellow-500/10"
                  : "bg-red-500/10"
            }`}
          >
            <Text
              className={`text-[10px] font-bold ${
                matching.score >= 80
                  ? "text-green-600 dark:text-green-400"
                  : matching.score >= 50
                    ? "text-yellow-600 dark:text-yellow-400"
                    : "text-red-600 dark:text-red-400"
              }`}
            >
              {matching.score}% MATCH
            </Text>
          </View>
        )}
      </View>

      {isChecking ? (
        <ActivityIndicator size="small" color="#8b5cf6" className="self-start" />
      ) : matching ? (
        <Text className="text-xs leading-relaxed text-muted-foreground">{matching.reason}</Text>
      ) : (
        <TouchableOpacity
          onPress={onEvaluate}
          disabled={isEvaluating}
          className="flex-row items-center self-start gap-1.5 rounded-lg bg-violet-500/10 px-3 py-1.5 active:bg-violet-500/20"
        >
          {isEvaluating ? (
            <ActivityIndicator size="small" color="#8b5cf6" />
          ) : (
            <>
              <Sparkles size={14} color="#8b5cf6" />
              <Text className="text-xs font-semibold text-violet-600 dark:text-violet-400">
                Evaluate Candidate
              </Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};
