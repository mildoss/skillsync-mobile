import { useState } from "react";
import { View, Text, TouchableOpacity, Modal, Pressable } from "react-native";
import { Sun, Moon, Smartphone, Check } from "lucide-react-native";
import { useThemeStore, ThemeMode } from "@/store/useThemeStore";
import { useColorScheme } from "nativewind";

const options: { mode: ThemeMode; label: string; Icon: typeof Sun }[] = [
  { mode: "system", label: "System", Icon: Smartphone },
  { mode: "light", label: "Light", Icon: Sun },
  { mode: "dark", label: "Dark", Icon: Moon },
];

export function ThemeToggle() {
  const [visible, setVisible] = useState(false);
  const { themeMode, setThemeMode } = useThemeStore();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const handleSelect = (mode: ThemeMode) => {
    setThemeMode(mode);
    setVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        className="h-10 w-10 items-center justify-center rounded-xl bg-secondary"
        accessibilityLabel="Change theme"
      >
        {isDark ? (
          <Moon size={20} color="#fafafa" />
        ) : (
          <Sun size={20} color="#09090b" />
        )}
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable
          className="flex-1 justify-end bg-black/40"
          onPress={() => setVisible(false)}
        >
          <Pressable
            className="mx-4 mb-8 overflow-hidden rounded-2xl bg-card"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="items-center border-b border-border bg-muted/30 p-4">
              <Text className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Appearance
              </Text>
              <Text className="mt-1 text-base font-semibold text-foreground">
                Choose Theme
              </Text>
            </View>

            {options.map(({ mode, label, Icon }) => {
              const isSelected = themeMode === mode;
              return (
                <TouchableOpacity
                  key={mode}
                  onPress={() => handleSelect(mode)}
                  className={`flex-row items-center border-b border-border px-4 py-3.5 ${isSelected ? "bg-primary/5" : ""
                    }`}
                  activeOpacity={0.6}
                >
                  <View
                    className={`mr-3 h-9 w-9 items-center justify-center rounded-xl ${isSelected ? "bg-primary/15" : "bg-muted"
                      }`}
                  >
                    <Icon
                      size={18}
                      color={isSelected ? (isDark ? "#818cf8" : "#4f46e5") : (isDark ? "#a1a1aa" : "#71717a")}
                    />
                  </View>
                  <Text
                    className={`flex-1 text-base font-medium ${isSelected ? "text-primary" : "text-foreground"
                      }`}
                  >
                    {label}
                  </Text>
                  {isSelected && (
                    <Check
                      size={20}
                      color={isDark ? "#818cf8" : "#4f46e5"}
                    />
                  )}
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              onPress={() => setVisible(false)}
              className="items-center py-3.5"
              activeOpacity={0.6}
            >
              <Text className="text-base font-medium text-muted-foreground">Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
