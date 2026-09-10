import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera, Trash2 } from "lucide-react-native";
import { cssInterop } from "nativewind";

cssInterop(Camera, { className: { target: "style", nativeStyleToProp: { color: true } } });
cssInterop(Trash2, { className: { target: "style", nativeStyleToProp: { color: true } } });

interface ImageUploadProps {
  currentImageUrl?: string | null;
  name?: string;
  onFileSelectAction: (fileUri: string, mimeType: string, fileName: string) => void;
  onRemoveAction: () => void;
}

export const ImageUpload = ({
  currentImageUrl,
  name,
  onFileSelectAction,
  onRemoveAction,
}: ImageUploadProps) => {
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const uri = asset.uri;
      const extension = uri.split(".").pop()?.split(/\#|\?/)[0]?.toLowerCase() || "jpg";
      const mimeType =
        asset.mimeType ||
        (extension === "png" ? "image/png" : extension === "webp" ? "image/webp" : "image/jpeg");
      const safeName =
        asset.fileName || `avatar-${Date.now()}.${extension.length <= 4 ? extension : "jpg"}`;
      onFileSelectAction(uri, mimeType, safeName);
    }
  };

  const removeImage = () => {
    Alert.alert("Remove Image", "Are you sure you want to remove your avatar?", [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: onRemoveAction },
    ]);
  };

  return (
    <View className="flex-row items-center gap-4">
      <View className="relative h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-primary/10">
        {currentImageUrl ? (
          <Image source={{ uri: currentImageUrl }} className="h-full w-full" />
        ) : (
          <Text className="text-2xl font-bold text-primary">
            {name ? name.charAt(0).toUpperCase() : "?"}
          </Text>
        )}
      </View>
      <View className="flex-col gap-2">
        <TouchableOpacity
          onPress={pickImage}
          className="flex-row items-center gap-2 rounded-lg bg-primary/10 px-4 py-2"
        >
          <Camera size={16} className="text-primary" />
          <Text className="font-medium text-primary">Change photo</Text>
        </TouchableOpacity>
        {currentImageUrl ? (
          <TouchableOpacity
            onPress={removeImage}
            className="flex-row items-center gap-2 rounded-lg bg-destructive/10 px-4 py-2"
          >
            <Trash2 size={16} className="text-destructive" />
            <Text className="font-medium text-destructive">Remove</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};
