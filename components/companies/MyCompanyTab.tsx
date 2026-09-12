import { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCompanySchema, CreateCompanyInput } from "@/lib/validation/company";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { getCompany, updateCompany, uploadCompanyLogo, deleteCompany, getMe } from "@/lib/api";
import { toast } from "@/store/useToastStore";
import { useAuthStore } from "@/store/useAuthStore";
import { User } from "@/types/users";
import { CompanyDetail } from "@/types/companies";
import { COMPANY_TYPES } from "@/lib/utils";

interface MyCompanyTabProps {
  user: User;
}

export const MyCompanyTab = ({ user }: MyCompanyTabProps) => {
  if (!user) return null;

  const { setUser } = useAuthStore();
  const [company, setCompany] = useState<CompanyDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [selectedFile, setSelectedFile] = useState<{
    uri: string;
    mimeType: string;
    name: string;
  } | null>(null);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [hasLogoChanged, setHasLogoChanged] = useState(false);

  const isReadOnly = user.companyRole !== "OWNER";

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState,
  } = useForm<CreateCompanyInput>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      name: "",
      description: "",
      websiteUrl: "",
      logoUrl: "",
      companyType: undefined,
    },
  });

  useEffect(() => {
    let isMounted = true;
    const fetchCompany = async () => {
      if (!user.companyId) return;
      try {
        const res = await getCompany(user.companyId);
        if (isMounted && res) {
          setCompany(res);
          reset({
            name: res.name || "",
            description: res.description || "",
            websiteUrl: res.websiteUrl || "",
            logoUrl: res.logoUrl || "",
            companyType: res.companyType as any,
          });
        }
      } catch (error) {
        console.error("Failed to fetch company", error);
        try {
          const freshUser = await getMe();
          if (freshUser && isMounted) {
            setUser(freshUser);
          }
        } catch {
          // ignore
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchCompany();
    return () => {
      isMounted = false;
    };
  }, [user.companyId, reset, setUser]);

  const name = watch("name");
  const logoUrl = watch("logoUrl");

  const onSubmit = async (data: CreateCompanyInput) => {
    if (!company) return;
    setIsPending(true);
    try {
      let finalLogoUrl = data.logoUrl;

      if (hasLogoChanged) {
        if (selectedFile) {
          const res = await uploadCompanyLogo(
            selectedFile.uri,
            selectedFile.mimeType,
            selectedFile.name
          );
          if (res && res.url) {
            finalLogoUrl = res.url;
            setValue("logoUrl", res.url, { shouldDirty: true });
          } else {
            throw new Error("Failed to upload company logo");
          }
        } else if (!logoUrl) {
          finalLogoUrl = null;
          setValue("logoUrl", "", { shouldDirty: true });
        }
      } else if (finalLogoUrl && finalLogoUrl.startsWith("file://")) {
        finalLogoUrl = company.logoUrl || null;
        setValue("logoUrl", finalLogoUrl || "");
      }

      const payload: Record<string, any> = {};
      const { dirtyFields } = formState;

      Object.keys(dirtyFields).forEach((key) => {
        payload[key] = data[key as keyof CreateCompanyInput];
      });

      if (hasLogoChanged) {
        payload.logoUrl = finalLogoUrl;
      }

      if (Object.keys(payload).length === 0) {
        toast.success("Company is already up to date!");
        setIsPending(false);
        return;
      }

      const updateRes = await updateCompany(company.id, payload);

      if (updateRes.success || updateRes) {
        setPreviewUri(null);
        setHasLogoChanged(false);
        setSelectedFile(null);
        reset({ ...data, logoUrl: finalLogoUrl }); // reset dirty fields
        toast.success("Company updated successfully!");
      }
    } catch (error: any) {
      toast.error("Update failed", error.message || "Failed to update company");
    } finally {
      setIsPending(false);
    }
  };

  const handleDeleteCompany = () => {
    Alert.alert(
      "Delete Company",
      `Are you absolutely sure you want to delete "${company?.name || "your company"}"? This action cannot be undone. All vacancies and team connections will be permanently removed.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (!company) return;
            setIsDeleting(true);
            try {
              const res = await deleteCompany(company.id);
              if (res.success || res) {
                toast.success("Company deleted permanently");
                const freshUser = await getMe();
                if (freshUser) {
                  setUser(freshUser);
                }
              }
            } catch (error: any) {
              toast.error("Failed to delete company", error.message || "Something went wrong");
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View className="items-center justify-center py-10">
        <ActivityIndicator size="large" className="text-primary" />
      </View>
    );
  }

  if (!company) {
    return (
      <View className="items-center justify-center py-10">
        <Text className="text-muted-foreground">Failed to load company details.</Text>
      </View>
    );
  }

  return (
    <View className="gap-6 pb-10">
      <View className="mb-2">
        <Text className="text-2xl font-bold tracking-tight text-foreground">My Company</Text>
        <Text className="text-sm text-muted-foreground">
          {isReadOnly
            ? "You can view your company's information."
            : "Manage your company identity, description and links."}
        </Text>
      </View>

      <View className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <View className="flex-col gap-6 border-b border-border pb-6">
          <ImageUpload
            currentImageUrl={previewUri || logoUrl}
            name={name || "Company"}
            onFileSelectAction={
              isReadOnly
                ? () => {}
                : (uri, mimeType, name) => {
                    setSelectedFile({ uri, mimeType, name });
                    setPreviewUri(uri);
                    setHasLogoChanged(true);
                  }
            }
            onRemoveAction={
              isReadOnly
                ? () => {}
                : () => {
                    setSelectedFile(null);
                    setPreviewUri(null);
                    setValue("logoUrl", "");
                    setHasLogoChanged(true);
                  }
            }
          />
          <View>
            <Text className="truncate text-xl font-bold text-foreground">
              {name || "Company Name"}
            </Text>
            <Text className="truncate font-medium text-muted-foreground">
              {company.companyType || "Company Type"}
            </Text>
          </View>
        </View>

        <View className="mt-6 gap-4">
          <View className="gap-2">
            <Text className="text-sm font-medium text-foreground">Company Name</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Acme Corp"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  editable={!isReadOnly}
                />
              )}
            />
            {formState.errors.name && (
              <Text className="text-xs text-destructive">{formState.errors.name.message}</Text>
            )}
          </View>

          <View className="gap-2">
            <Text className="text-sm font-medium text-foreground">Company Type</Text>
            <Controller
              control={control}
              name="companyType"
              render={({ field: { onChange, value } }) => (
                <Select
                  options={COMPANY_TYPES}
                  value={value}
                  onValueChange={onChange}
                  placeholder="Select company type..."
                  disabled={isReadOnly}
                />
              )}
            />
            {formState.errors.companyType && (
              <Text className="text-xs text-destructive">
                {formState.errors.companyType.message}
              </Text>
            )}
          </View>

          <View className="gap-2">
            <Text className="text-sm font-medium text-foreground">Website URL</Text>
            <Controller
              control={control}
              name="websiteUrl"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="https://example.com"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value || ""}
                  editable={!isReadOnly}
                />
              )}
            />
            {formState.errors.websiteUrl && (
              <Text className="text-xs text-destructive">
                {formState.errors.websiteUrl.message}
              </Text>
            )}
          </View>

          <View className="gap-2">
            <Text className="text-sm font-medium text-foreground">Description</Text>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Tell candidates about your company..."
                  multiline
                  numberOfLines={4}
                  className="h-24 py-2"
                  textAlignVertical="top"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value || ""}
                  editable={!isReadOnly}
                />
              )}
            />
            {formState.errors.description && (
              <Text className="text-xs text-destructive">
                {formState.errors.description.message}
              </Text>
            )}
          </View>
        </View>
      </View>

      {!isReadOnly && (
        <>
          <Button
            className="mt-4"
            size="lg"
            onPress={handleSubmit(onSubmit)}
            disabled={isPending}
          >
            <Text className="font-semibold text-primary-foreground">
              {isPending ? "Saving..." : "Save Changes"}
            </Text>
          </Button>

          <View className="mt-8 rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
            <Text className="text-lg font-bold text-destructive">Danger Zone</Text>
            <Text className="mt-1 text-sm text-muted-foreground">
              Once you delete your company, there is no going back. All vacancies and team connections
              will be permanently removed.
            </Text>
            <Button
              variant="destructive"
              className="mt-4 border border-destructive/30"
              onPress={handleDeleteCompany}
              disabled={isDeleting || isPending}
            >
              <Text className="font-semibold text-destructive">
                {isDeleting ? "Deleting..." : "Delete Company"}
              </Text>
            </Button>
          </View>
        </>
      )}
    </View>
  );
};
