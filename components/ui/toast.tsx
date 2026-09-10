import { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react-native";
import { useToastStore, ToastItem } from "@/store/useToastStore";

const ToastCard: React.FC<{ toast: ToastItem; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration || 3500);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  const isSuccess = toast.type === "success";
  const isError = toast.type === "error";

  const borderColor = isSuccess
    ? "border-emerald-500/30"
    : isError
      ? "border-destructive/40"
      : "border-border";

  const iconColor = isSuccess ? "#10b981" : isError ? "#ef4444" : "#3b82f6";

  return (
    <Animated.View
      entering={FadeInUp.springify().damping(15)}
      exiting={FadeOutUp.duration(200)}
      className={`mb-2 w-full max-w-[92%] flex-row items-center justify-between rounded-2xl border bg-card p-4 shadow-xl ${borderColor}`}
    >
      <View className="flex-1 flex-row items-center gap-3">
        <View className="shrink-0">
          {isSuccess && <CheckCircle2 size={22} color={iconColor} />}
          {isError && <AlertCircle size={22} color={iconColor} />}
          {!isSuccess && !isError && <Info size={22} color={iconColor} />}
        </View>

        <View className="flex-1 pr-2">
          <Text className="text-sm font-semibold text-foreground">{toast.title}</Text>
          {toast.description ? (
            <Text className="mt-0.5 text-xs text-muted-foreground">{toast.description}</Text>
          ) : null}
        </View>
      </View>

      <TouchableOpacity
        onPress={() => onDismiss(toast.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        className="shrink-0 p-1"
      >
        <X size={16} color="#a1a1aa" />
      </TouchableOpacity>
    </Animated.View>
  );
};

export const ToastContainer: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { toasts, dismissToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <View
      pointerEvents="box-none"
      style={{ top: Math.max(insets.top, 16) + 8 }}
      className="absolute left-0 right-0 z-50 items-center"
    >
      {toasts.map((item) => (
        <ToastCard key={item.id} toast={item} onDismiss={dismissToast} />
      ))}
    </View>
  );
};
