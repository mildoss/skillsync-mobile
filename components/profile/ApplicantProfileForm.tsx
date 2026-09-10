import { useState, useEffect } from "react";
import { View, Text, Switch } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdateApplicantProfileInput,
  ApplicantProfileFormValues,
  updateApplicantProfileSchema,
} from "@/lib/validation/user";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { updateUser, uploadAvatar, getMe } from "@/lib/api";
import { toast } from "@/store/useToastStore";
import { User } from "@/types/users";
import { Dictionaries } from "@/types/dictionaries";
import { useAuthStore } from "@/store/useAuthStore";
import {
  EXPERIENCE_OPTIONS,
  LOCATION_OPTIONS,
  WORK_FORMATS,
  EMPLOYMENT_TYPES,
  mapToOptions,
} from "@/lib/utils";

interface Props {
  user: User;
  categories: Dictionaries[];
  skills: Dictionaries[];
  languages: Dictionaries[];
}

export const ApplicantProfileForm = ({ user, categories, skills, languages }: Props) => {
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
  } = useForm<ApplicantProfileFormValues, any, UpdateApplicantProfileInput>({
    resolver: zodResolver(updateApplicantProfileSchema),
    defaultValues: {
      name: user.name ?? "",
      surname: user.surname ?? "",
      position: user.position ?? "",
      categoryId: user.category?.id ?? "",
      experience: user.experience ?? undefined,
      location: user.location ?? undefined,
      about: user.about ?? undefined,
      skills: user.skills?.map((s) => s.id) ?? [],
      languages: user.languages?.map((l) => l.id) ?? [],
      workFormats: user.workFormats ?? [],
      employmentTypes: user.employmentTypes ?? [],
      avatarUrl: user.avatarUrl ?? "",
      cvUrl: user.cvUrl ?? "",
      isActive: user.isActive ?? true,
    },
  });

  useEffect(() => {
    reset({
      name: user.name ?? "",
      surname: user.surname ?? "",
      position: user.position ?? "",
      categoryId: user.category?.id ?? "",
      experience: user.experience ?? undefined,
      location: user.location ?? undefined,
      about: user.about ?? undefined,
      skills: user.skills?.map((s) => s.id) ?? [],
      languages: user.languages?.map((l) => l.id) ?? [],
      workFormats: user.workFormats ?? [],
      employmentTypes: user.employmentTypes ?? [],
      avatarUrl: user.avatarUrl ?? "",
      cvUrl: user.cvUrl ?? "",
      isActive: user.isActive ?? true,
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

  const onSubmit = async (data: UpdateApplicantProfileInput) => {
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

  const MultiSelectGrid = ({
    items,
    selectedValues,
    onChange,
  }: {
    items: { label: string; value: string }[];
    selectedValues: string[];
    onChange: (values: string[]) => void;
  }) => {
    const toggle = (val: string) => {
      if (selectedValues.includes(val)) {
        onChange(selectedValues.filter((v) => v !== val));
      } else {
        onChange([...selectedValues, val]);
      }
    };

    return (
      <View className="flex-row flex-wrap gap-3">
        {items.map((item) => {
          const isSelected = selectedValues.includes(item.value);
          return (
            <View key={item.value} className="flex-row items-center gap-2">
              <Checkbox checked={isSelected} onCheckedChange={() => toggle(item.value)} />
              <Text className="text-sm text-foreground">{item.label}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View className="gap-6 pb-10">
      <View className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <Text className="mb-4 text-xl font-bold text-foreground">Visibility settings</Text>
        <Controller
          control={control}
          name="isActive"
          render={({ field: { onChange, value } }) => (
            <View className="flex-row items-center gap-3">
              <Switch value={value} onValueChange={onChange} />
              <View className="flex-1">
                <Text className="font-medium text-foreground">Active and looking for a job</Text>
                <Text className="text-xs text-muted-foreground">
                  When disabled, recruiters won&apos;t see your profile.
                </Text>
              </View>
            </View>
          )}
        />
      </View>

      {/* Profile Details */}
      <View className="rounded-2xl border border-border bg-card p-6 shadow-sm">
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
              {position || "Profession"}
            </Text>
          </View>
        </View>

        <View className="mt-6 gap-4">
          <View className="gap-2">
            <Text className="text-sm font-medium text-foreground">Name *</Text>
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
          </View>
        </View>
      </View>

      <View className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <Text className="mb-6 text-xl font-bold text-foreground">Professional Details</Text>
        <View className="gap-4">
          <View className="gap-2">
            <Text className="text-sm font-medium text-foreground">Primary Position *</Text>
            <Controller
              control={control}
              name="position"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="e.g. Frontend Developer"
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
            <Text className="text-sm font-medium text-foreground">Category *</Text>
            <Controller
              control={control}
              name="categoryId"
              render={({ field: { onChange, value } }) => (
                <Select
                  options={mapToOptions(categories)}
                  value={value}
                  onValueChange={onChange}
                  placeholder="Select category..."
                />
              )}
            />
            {errors.categoryId && (
              <Text className="text-xs text-destructive">{errors.categoryId.message}</Text>
            )}
          </View>

          <View className="gap-2">
            <Text className="text-sm font-medium text-foreground">Experience (Years)</Text>
            <Controller
              control={control}
              name="experience"
              render={({ field: { onChange, value } }) => (
                <Select
                  options={EXPERIENCE_OPTIONS}
                  value={value?.toString()}
                  onValueChange={(val) => onChange(val ? Number(val) : undefined)}
                  placeholder="Any experience"
                />
              )}
            />
          </View>

          <View className="gap-2">
            <Text className="text-sm font-medium text-foreground">Location</Text>
            <Controller
              control={control}
              name="location"
              render={({ field: { onChange, value } }) => (
                <Select
                  options={LOCATION_OPTIONS}
                  value={value}
                  onValueChange={onChange}
                  placeholder="Not specified"
                />
              )}
            />
          </View>
        </View>
      </View>

      <View className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <Text className="mb-6 text-xl font-bold text-foreground">About & Resume</Text>
        <View className="gap-4">
          <View className="gap-2">
            <Text className="text-sm font-medium text-foreground">About Me</Text>
            <Controller
              control={control}
              name="about"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Tell recruiters about your background..."
                  multiline
                  numberOfLines={4}
                  className="h-32 py-3"
                  textAlignVertical="top"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.about && (
              <Text className="text-xs text-destructive">{errors.about.message}</Text>
            )}
          </View>

          <View className="gap-2">
            <Text className="text-sm font-medium text-foreground">CV / Resume URL (Optional)</Text>
            <Controller
              control={control}
              name="cvUrl"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="https://drive.google.com/..."
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value || ""}
                />
              )}
            />
            {errors.cvUrl && (
              <Text className="text-xs text-destructive">{errors.cvUrl.message}</Text>
            )}
          </View>
        </View>
      </View>

      <View className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <Text className="mb-6 text-xl font-bold text-foreground">Preferences</Text>
        <View className="gap-6">
          <View className="gap-2">
            <Text className="text-sm font-medium text-foreground">Work Format</Text>
            <Controller
              control={control}
              name="workFormats"
              render={({ field: { onChange, value } }) => (
                <MultiSelectGrid
                  items={WORK_FORMATS}
                  selectedValues={value as string[]}
                  onChange={onChange}
                />
              )}
            />
          </View>

          <View className="gap-2">
            <Text className="text-sm font-medium text-foreground">Employment Type</Text>
            <Controller
              control={control}
              name="employmentTypes"
              render={({ field: { onChange, value } }) => (
                <MultiSelectGrid
                  items={EMPLOYMENT_TYPES}
                  selectedValues={value as string[]}
                  onChange={onChange}
                />
              )}
            />
          </View>
        </View>
      </View>

      <View className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <Text className="mb-6 text-xl font-bold text-foreground">Expertise</Text>
        <View className="gap-6">
          <View className="gap-2">
            <Text className="text-sm font-medium text-foreground">Skills</Text>
            <Controller
              control={control}
              name="skills"
              render={({ field: { onChange, value } }) => (
                <MultiSelectGrid
                  items={mapToOptions(skills)}
                  selectedValues={value || []}
                  onChange={onChange}
                />
              )}
            />
          </View>

          <View className="gap-2">
            <Text className="text-sm font-medium text-foreground">Languages</Text>
            <Controller
              control={control}
              name="languages"
              render={({ field: { onChange, value } }) => (
                <MultiSelectGrid
                  items={mapToOptions(languages)}
                  selectedValues={value || []}
                  onChange={onChange}
                />
              )}
            />
          </View>
        </View>
      </View>

      <Button
        className="mt-4"
        size="lg"
        onPress={handleSubmit(onSubmit, onInvalid)}
        disabled={isPending}
      >
        <Text className="font-semibold text-primary-foreground">
          {isPending ? "Saving..." : "Save Profile"}
        </Text>
      </Button>
    </View>
  );
};
