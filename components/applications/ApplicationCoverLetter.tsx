import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FileText, ChevronDown, ChevronUp } from "lucide-react-native";

interface ApplicationCoverLetterProps {
  coverLetterText?: string | null;
}

export const ApplicationCoverLetter = ({ coverLetterText }: ApplicationCoverLetterProps) => {
  const [isCoverLetterExpanded, setIsCoverLetterExpanded] = useState(false);
  const text = coverLetterText?.trim();

  if (!text) return null;

  const isLongLetter = text.length > 130;

  return (
    <View className="mt-3 rounded-xl border border-border/70 bg-muted/30 p-3">
      <View className="mb-1 flex-row items-center gap-1.5">
        <FileText size={13} color="#6b7280" />
        <Text className="text-xs font-semibold text-foreground">Cover Letter</Text>
      </View>
      <Text
        className="text-xs leading-relaxed text-muted-foreground"
        numberOfLines={isLongLetter && !isCoverLetterExpanded ? 3 : undefined}
      >
        {text}
      </Text>
      {isLongLetter && (
        <TouchableOpacity
          onPress={() => setIsCoverLetterExpanded(!isCoverLetterExpanded)}
          className="mt-1 flex-row items-center gap-1 self-start py-0.5"
        >
          <Text className="text-xs font-semibold text-primary">
            {isCoverLetterExpanded ? "Show less" : "Read more"}
          </Text>
          {isCoverLetterExpanded ? (
            <ChevronUp size={12} color="#3b82f6" />
          ) : (
            <ChevronDown size={12} color="#3b82f6" />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};
