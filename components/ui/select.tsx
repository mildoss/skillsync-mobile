import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
  StyleSheet,
  Platform,
} from "react-native";
import { ChevronDown, X } from "lucide-react-native";

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string | undefined;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function Select({
  options,
  value,
  onValueChange,
  placeholder = "Select...",
  disabled = false,
}: SelectProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = options.find((o) => o.value === value);

  return (
    <>
      <TouchableOpacity
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
        activeOpacity={0.7}
        className={`h-10 flex-row items-center justify-between rounded-lg border border-input bg-transparent px-3 ${disabled ? "opacity-50" : ""
          }`}
      >
        <Text
          numberOfLines={1}
          style={
            Platform.OS === "android"
              ? { includeFontPadding: false, textAlignVertical: "center" }
              : undefined
          }
          className={`mr-2 flex-1 text-base lg:text-sm ${selectedOption ? "font-medium text-foreground" : "text-muted-foreground"
            }`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <ChevronDown size={16} className="text-muted-foreground" color="#a1a1aa" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Pressable style={styles.backdrop} onPress={() => setModalVisible(false)} />
          <View className="max-h-[65%] min-h-[35%] rounded-t-3xl border-t border-border bg-card p-5 shadow-2xl">
            <View className="mb-4 flex-row items-center justify-between border-b border-border/50 pb-3">
              <Text className="text-lg font-bold text-foreground">{placeholder}</Text>
              <Pressable
                onPress={() => setModalVisible(false)}
                hitSlop={12}
                className="rounded-full p-1.5"
              >
                <X size={20} className="text-foreground" color="#a1a1aa" />
              </Pressable>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = item.value === value;
                return (
                  <Pressable
                    android_ripple={{ color: "rgba(99, 102, 241, 0.12)" }}
                    style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                    className="border-b border-border/50 px-1 py-3.5"
                    onPress={() => {
                      onValueChange(item.value);
                      setModalVisible(false);
                    }}
                  >
                    <Text
                      style={Platform.OS === "android" ? { includeFontPadding: false } : undefined}
                      className={`text-base ${isSelected ? "font-bold text-primary" : "font-normal text-foreground"
                        }`}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
});
