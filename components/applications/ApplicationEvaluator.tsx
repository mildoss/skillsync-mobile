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
    <View className="mt-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3.5">
      <View className="mb-2.5 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <BrainCircuit size={16} color="#6366f1" />
          <Text className="text-xs font-bold text-indigo-500">AI Candidate Match</Text>
        </View>

        {!matching && !isChecking && (
          <TouchableOpacity
            onPress={onEvaluate}
            disabled={isEvaluating}
            className="flex-row items-center gap-1.5 rounded-lg bg-indigo-500/10 px-2.5 py-1.5 active:bg-indigo-500/20"
          >
            {isEvaluating ? (
              <ActivityIndicator size="small" color="#6366f1" />
            ) : (
              <>
                <Sparkles size={12} color="#6366f1" />
                <Text className="text-xs font-semibold text-indigo-500">Evaluate (1 credit)</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      {isChecking ? (
        <View className="py-1">
          <ActivityIndicator size="small" color="#6366f1" className="self-start" />
        </View>
      ) : matching ? (
        <View className="flex-row items-start gap-3 pt-1">
          <View
            className={`h-11 w-11 shrink-0 items-center justify-center rounded-full ${
              matching.score >= 80
                ? "bg-green-500/20"
                : matching.score >= 50
                  ? "bg-amber-500/20"
                  : "bg-red-500/20"
            }`}
          >
            <Text
              className={`text-sm font-black ${
                matching.score >= 80
                  ? "text-green-600 dark:text-green-400"
                  : matching.score >= 50
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-red-600 dark:text-red-400"
              }`}
            >
              {matching.score}%
            </Text>
          </View>
          <Text className="flex-1 text-xs font-medium leading-relaxed text-foreground/80">
            {matching.reason}
          </Text>
        </View>
      ) : (
        <Text className="text-xs text-muted-foreground">
          AI analysis is not available for this candidate yet.
        </Text>
      )}
    </View>
  );
};
