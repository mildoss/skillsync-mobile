import { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdateEmployerProfileInput,
  EmployerProfileFormValues,
  updateEmployerProfileSchema,
} from "@/lib/validation/user";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { updateUser, uploadAvatar, getMe } from "@/lib/api";
import { User } from "@/types/users";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "@/store/useToastStore";

interface Props {
  user: User;
}

export const EmployerProfileForm = ({ user }: Props) => {
  const { setUser } = useAuthStore();
  const [isPending, setIsPending] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    uri: string;
    mimeType: string;
    name: string;
  } | null>(null);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [hasAvatarChanged, setHasAvatarChanged] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EmployerProfileFormValues, any, UpdateEmployerProfileInput>({
    resolver: zodResolver(updateEmployerProfileSchema),
    defaultValues: {
      name: user.name || "",
      surname: user.surname || "",
      position: user.position || "",
      about: user.about || "",
      avatarUrl: user.avatarUrl || "",
    },
  });

  useEffect(() => {
    reset({
      name: user.name || "",
      surname: user.surname || "",
      position: user.position || "",
      about: user.about || "",
      avatarUrl: user.avatarUrl || "",
    });
  }, [user, reset]);

  const avatarUrl = watch("avatarUrl");
  const name = watch("name");
  const surname = watch("surname");
  const position = watch("position");

  const onInvalid = (formErrors: any) => {
    const errorKeys = Object.keys(formErrors);
    if (errorKeys.length > 0) {
      const firstError = formErrors[errorKeys[0]]?.message || "Please check the form for errors";
      toast.error("Validation error", firstError);
    }
  };

  const onSubmit = async (data: UpdateEmployerProfileInput) => {
    setIsPending(true);
    try {
      let finalAvatarUrl = data.avatarUrl;

      if (hasAvatarChanged) {
        if (selectedFile) {
          const res = await uploadAvatar(
            selectedFile.uri,
            selectedFile.mimeType,
            selectedFile.name,
          );
          if (res && res.url) {
            finalAvatarUrl = res.url;
            setValue("avatarUrl", res.url);
          } else {
            throw new Error("Failed to upload avatar");
          }
        } else if (!avatarUrl) {
          finalAvatarUrl = null;
          setValue("avatarUrl", "");
        }
      } else if (finalAvatarUrl && finalAvatarUrl.startsWith("file://")) {
        finalAvatarUrl = user.avatarUrl || null;
        setValue("avatarUrl", finalAvatarUrl || "");
      }

      const updateRes = await updateUser({
        ...data,
        avatarUrl: finalAvatarUrl,
      });

      if (updateRes.success || updateRes) {
        const freshUser = await getMe();
        if (freshUser) {
          setUser(freshUser);
        } else if (updateRes.user) {
          setUser(updateRes.user);
        }
        setPreviewUri(null);
        setHasAvatarChanged(false);
        setSelectedFile(null);
        toast.success("Profile updated successfully!");
      }
    } catch (error: any) {
      toast.error("Update failed", error.message || "Failed to update profile");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <View className="gap-6 rounded-2xl border border-border bg-card p-6">
      <View className="flex-col gap-6 border-b border-border pb-6">
        <ImageUpload
          currentImageUrl={previewUri || avatarUrl}
          name={name}
          onFileSelectAction={(uri, mimeType, name) => {
            setSelectedFile({ uri, mimeType, name });
            setPreviewUri(uri);
            setHasAvatarChanged(true);
          }}
          onRemoveAction={() => {
            setSelectedFile(null);
            setPreviewUri(null);
            setValue("avatarUrl", "");
            setHasAvatarChanged(true);
          }}
        />

        <View>
          <Text className="truncate text-xl font-bold text-foreground">
            {name || "Name"} {surname || "Surname"}
          </Text>
          <Text className="truncate font-medium text-muted-foreground">
            {position || "Position"}
          </Text>
        </View>
      </View>

      <View className="gap-4">
        <View className="gap-2">
          <Text className="text-sm font-medium text-foreground">Name</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input placeholder="John" onBlur={onBlur} onChangeText={onChange} value={value} />
            )}
          />
          {errors.name && <Text className="text-xs text-destructive">{errors.name.message}</Text>}
        </View>

        <View className="gap-2">
          <Text className="text-sm font-medium text-foreground">Surname</Text>
          <Controller
            control={control}
            name="surname"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input placeholder="Doe" onBlur={onBlur} onChangeText={onChange} value={value} />
            )}
          />
          {errors.surname && (
            <Text className="text-xs text-destructive">{errors.surname.message}</Text>
          )}
        </View>

        <View className="gap-2">
          <Text className="text-sm font-medium text-foreground">Job Title (Position)</Text>
          <Controller
            control={control}
            name="position"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="e.g. HR Manager, Tech Lead"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.position && (
            <Text className="text-xs text-destructive">{errors.position.message}</Text>
          )}
        </View>

        <View className="gap-2">
          <Text className="text-sm font-medium text-foreground">About Me</Text>
          <Controller
            control={control}
            name="about"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Tell candidates a little bit about yourself..."
                multiline
                numberOfLines={4}
                className="h-24 py-2"
                textAlignVertical="top"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.about && <Text className="text-xs text-destructive">{errors.about.message}</Text>}
        </View>
      </View>

      <Button className="mt-4" onPress={handleSubmit(onSubmit, onInvalid)} disabled={isPending}>
        <Text className="font-semibold text-primary-foreground">
          {isPending ? "Saving..." : "Save Changes"}
        </Text>
      </Button>
    </View>
  );
};
