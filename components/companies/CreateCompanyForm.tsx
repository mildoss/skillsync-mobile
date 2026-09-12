import { useState } from "react";
import { View, Text } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCompanySchema, CreateCompanyInput } from "@/lib/validation/company";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { createCompany, getMe } from "@/lib/api";
import { toast } from "@/store/useToastStore";
import { useAuthStore } from "@/store/useAuthStore";
import { COMPANY_TYPES } from "@/lib/utils";

interface CreateCompanyFormProps {
  onBack: () => void;
}

export const CreateCompanyForm = ({ onBack }: CreateCompanyFormProps) => {
  const { setUser } = useAuthStore();
  const [isPending, setIsPending] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
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

  const onSubmit = async (data: CreateCompanyInput) => {
    setIsPending(true);
    try {
      const res = await createCompany(data);

      if (res.success || res) {
        toast.success("Company created successfully!");
        const freshUser = await getMe();
        if (freshUser) {
          setUser(freshUser);
        }
        onBack();
      }
    } catch (error: any) {
      toast.error("Failed to create company", error.message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <View className="gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <Text className="text-2xl font-bold tracking-tight text-foreground">Create Company</Text>

      <View className="gap-4">

        <View className="gap-2">
          <Text className="text-sm font-medium text-foreground">Company Name *</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input placeholder="Acme Corp" onBlur={onBlur} onChangeText={onChange} value={value} />
            )}
          />
          {errors.name && <Text className="text-xs text-destructive">{errors.name.message}</Text>}
        </View>

        <View className="gap-2">
          <Text className="text-sm font-medium text-foreground">Company Type *</Text>
          <Controller
            control={control}
            name="companyType"
            render={({ field: { onChange, value } }) => (
              <Select
                options={COMPANY_TYPES}
                value={value}
                onValueChange={onChange}
                placeholder="Select company type..."
              />
            )}
          />
          {errors.companyType && (
            <Text className="text-xs text-destructive">{errors.companyType.message}</Text>
          )}
        </View>

        <View className="gap-2">
          <Text className="text-sm font-medium text-foreground">Website (Optional)</Text>
          <Controller
            control={control}
            name="websiteUrl"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="https://example.com"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value || ""}
              />
            )}
          />
          {errors.websiteUrl && (
            <Text className="text-xs text-destructive">{errors.websiteUrl.message}</Text>
          )}
        </View>

        <View className="gap-2">
          <Text className="text-sm font-medium text-foreground">Description (Optional)</Text>
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
              />
            )}
          />
          {errors.description && (
            <Text className="text-xs text-destructive">{errors.description.message}</Text>
          )}
        </View>
      </View>

      <Button className="mt-4" onPress={handleSubmit(onSubmit)} disabled={isPending}>
        <Text className="font-semibold text-primary-foreground">
          {isPending ? "Creating..." : "Create Company"}
        </Text>
      </Button>
    </View>
  );
};
