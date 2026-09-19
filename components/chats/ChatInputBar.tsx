import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Keyboard, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Send } from "lucide-react-native";

interface ChatInputBarProps {
  inputText: string;
  setInputText: (text: string) => void;
  onSend: () => void;
  isConnected: boolean;
  isInputBlocked: boolean;
  isRejected: boolean;
  isApplicantPending: boolean;
  isDark: boolean;
}

export const ChatInputBar = ({
  inputText,
  setInputText,
  onSend,
  isConnected,
  isInputBlocked,
  isRejected,
  isApplicantPending,
  isDark,
}: ChatInputBarProps) => {
  const insets = useSafeAreaInsets();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => setKeyboardVisible(true),
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setKeyboardVisible(false),
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const bottomPadding = !isKeyboardVisible && insets.bottom > 0 ? insets.bottom + 10 : 12;

  return (
    <View
      style={{ paddingBottom: bottomPadding }}
      className="border-t border-border/40 bg-card px-4 pt-3"
    >
      {isRejected ? (
        <View className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3">
          <Text className="text-center text-xs font-semibold text-destructive">
            Discussion closed. The recruiter has rejected this application.
          </Text>
        </View>
      ) : isApplicantPending ? (
        <View className="rounded-xl border border-border/60 bg-secondary px-4 py-3">
          <Text className="text-center text-xs font-medium text-muted-foreground">
            You will be able to send messages once the recruiter accepts your application.
          </Text>
        </View>
      ) : (
        <View className="flex-row items-center gap-2.5 px-0.5">
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder={isConnected ? "Type your message..." : "Connecting..."}
            placeholderTextColor={isDark ? "#71717a" : "#a1a1aa"}
            editable={isConnected && !isInputBlocked}
            multiline
            maxLength={2000}
            className="max-h-24 min-h-[44px] flex-1 rounded-2xl border border-border bg-background px-4 py-2.5 text-sm text-foreground"
          />
          <TouchableOpacity
            onPress={onSend}
            disabled={!inputText.trim() || !isConnected || isInputBlocked}
            className={`h-11 w-11 items-center justify-center rounded-2xl ${
              !inputText.trim() || !isConnected || isInputBlocked
                ? "bg-muted opacity-50"
                : "bg-primary"
            }`}
            activeOpacity={0.7}
          >
            <Send
              size={18}
              color={
                !inputText.trim() || !isConnected || isInputBlocked
                  ? isDark
                    ? "#71717a"
                    : "#9ca3af"
                  : "#ffffff"
              }
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
