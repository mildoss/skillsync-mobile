import { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList, Pressable } from "react-native";
import { ChevronDown, X } from "lucide-react-native";
import Animated, { SlideInDown } from "react-native-reanimated";

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string | undefined;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function Select({ options, value, onValueChange, placeholder = "Select..." }: SelectProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = options.find((o) => o.value === value);

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="h-10 flex-row items-center justify-between rounded-lg border border-input bg-transparent px-3"
      >
        <Text className={selectedOption ? "text-foreground" : "text-muted-foreground"}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <ChevronDown size={16} className="text-muted-foreground" color="#a1a1aa" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/60">
          <Pressable className="flex-1" onPress={() => setModalVisible(false)} />
          <Animated.View
            entering={SlideInDown.duration(250)}
            className="max-h-[60%] min-h-[40%] rounded-t-3xl border-t border-border bg-card p-5 shadow-2xl"
          >
            <View className="mb-4 flex-row items-center justify-between border-b border-border/50 pb-3">
              <Text className="text-lg font-bold text-foreground">{placeholder}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} className="rounded-full p-1">
                <X size={20} className="text-foreground" color="#a1a1aa" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="border-b border-border/50 py-3.5"
                  onPress={() => {
                    onValueChange(item.value);
                    setModalVisible(false);
                  }}
                >
                  <Text
                    className={item.value === value ? "font-bold text-primary" : "text-foreground"}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}
