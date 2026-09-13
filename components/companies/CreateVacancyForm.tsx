import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Switch } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createVacancy, getCategories, getSkills, getLanguages } from "@/lib/api";
import { Dictionaries } from "@/types/dictionaries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/store/useToastStore";
import { ArrowLeft } from "lucide-react-native";
import {
  WORK_FORMATS,
  EXPERIENCE_OPTIONS,
  LOCATION_OPTIONS,
  mapToOptions,
} from "@/lib/utils";
import {
  vacancySchema,
  VacancyFormValues,
  VacancyInput,
} from "@/lib/validation/vacancy";

interface CreateVacancyFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

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
    <View className="flex-row flex-wrap gap-2.5">
      {items.map((item) => {
        const isSelected = selectedValues.includes(item.value);
        return (
          <TouchableOpacity
            key={item.value}
            onPress={() => toggle(item.value)}
            className={`flex-row items-center gap-2 rounded-full border px-3 py-1.5 ${isSelected ? "border-primary bg-primary/10" : "border-border bg-card"
              }`}
          >
            <Checkbox checked={isSelected} onCheckedChange={() => toggle(item.value)} />
            <Text
              className={`text-xs font-medium ${isSelected ? "text-primary" : "text-foreground"
                }`}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export const CreateVacancyForm = ({ onBack, onSuccess }: CreateVacancyFormProps) => {
  const [categories, setCategories] = useState<Dictionaries[]>([]);
  const [skills, setSkills] = useState<Dictionaries[]>([]);
  const [languages, setLanguages] = useState<Dictionaries[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingDicts, setIsLoadingDicts] = useState(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([getCategories(), getSkills(), getLanguages()])
      .then(([cats, skls, langs]) => {
        if (isMounted) {
          setCategories(cats || []);
          setSkills(skls || []);
          setLanguages(langs || []);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch dictionaries for vacancy form", err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingDicts(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VacancyFormValues, any, VacancyInput>({
    resolver: zodResolver(vacancySchema),
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      domainId: undefined,
      type: "OFFICE",
      experience: undefined,
      location: undefined,
      salaryMin: undefined,
      salaryMax: undefined,
      skills: [],
      languages: [],
      isActive: true,
    },
  });

  const onInvalid = (formErrors: any) => {
    const errorKeys = Object.keys(formErrors);
    if (errorKeys.length > 0) {
      const firstError =
        formErrors[errorKeys[0]]?.message || "Please check the form for errors";
      toast.error("Validation error", firstError);
    }
  };

  const onSubmit = async (data: VacancyInput) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        experience: data.experience != null ? Number(data.experience) : undefined,
        salaryMin: data.salaryMin != null ? Number(data.salaryMin) : undefined,
        salaryMax: data.salaryMax != null ? Number(data.salaryMax) : undefined,
      };

      const res = await createVacancy(payload);
      if (res.success || res.data || res) {
        toast.success("Vacancy published successfully!");
        reset();
        onSuccess();
      }
    } catch (error: any) {
      toast.error("Failed to create vacancy", error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 gap-6 pb-16">
      <TouchableOpacity onPress={onBack} className="flex-row items-center gap-2 py-1">
        <ArrowLeft size={18} color="#3b82f6" />
        <Text className="font-semibold text-primary">Back to Vacancies</Text>
      </TouchableOpacity>

      <View className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <Text className="mb-1 text-2xl font-bold tracking-tight text-foreground">
          Post a Vacancy
        </Text>
        <Text className="mb-6 text-sm text-muted-foreground">
          Fill in the details below to publish an open role for your company.
        </Text>

        {isLoadingDicts ? (
          <View className="items-center justify-center py-12">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="mt-3 text-xs text-muted-foreground">Loading categories & skills...</Text>
          </View>
        ) : (
          <View className="gap-5">
            <View className="gap-2">
              <Text className="text-sm font-medium text-foreground">
                Job Title <Text className="text-destructive">*</Text>
              </Text>
              <Controller
                control={control}
                name="title"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="e.g. Senior Frontend Engineer"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.title && (
                <Text className="text-xs text-destructive">{errors.title.message}</Text>
              )}
            </View>

            <View className="gap-2">
              <Text className="text-sm font-medium text-foreground">
                Category <Text className="text-destructive">*</Text>
              </Text>
              <Controller
                control={control}
                name="categoryId"
                render={({ field: { onChange, value } }) => (
                  <Select
                    options={mapToOptions(categories)}
                    value={value}
                    onValueChange={onChange}
                    placeholder="Select a category"
                  />
                )}
              />
              {errors.categoryId && (
                <Text className="text-xs text-destructive">{errors.categoryId.message}</Text>
              )}
            </View>

            <View className="gap-2">
              <Text className="text-sm font-medium text-foreground">Work Format</Text>
              <Controller
                control={control}
                name="type"
                render={({ field: { onChange, value } }) => (
                  <Select
                    options={WORK_FORMATS}
                    value={value}
                    onValueChange={onChange}
                    placeholder="Select format"
                  />
                )}
              />
            </View>

            <View className="gap-2">
              <Text className="text-sm font-medium text-foreground">Required Experience</Text>
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
                    placeholder="Select location (optional)"
                  />
                )}
              />
            </View>

            <View className="flex-row gap-3">
              <View className="flex-1 gap-2">
                <Text className="text-sm font-medium text-foreground">Min Salary ($)</Text>
                <Controller
                  control={control}
                  name="salaryMin"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="e.g. 2000"
                      keyboardType="numeric"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value != null ? String(value) : ""}
                    />
                  )}
                />
              </View>
              <View className="flex-1 gap-2">
                <Text className="text-sm font-medium text-foreground">Max Salary ($)</Text>
                <Controller
                  control={control}
                  name="salaryMax"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="e.g. 3500"
                      keyboardType="numeric"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value != null ? String(value) : ""}
                    />
                  )}
                />
              </View>
            </View>
            {errors.salaryMax && (
              <Text className="text-xs text-destructive">{errors.salaryMax.message}</Text>
            )}

            <View className="gap-2">
              <Text className="text-sm font-medium text-foreground">
                Required Skills <Text className="text-destructive">*</Text>
              </Text>
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
              {errors.skills && (
                <Text className="text-xs text-destructive">{errors.skills.message}</Text>
              )}
            </View>

            <View className="gap-2">
              <Text className="text-sm font-medium text-foreground">
                Languages
              </Text>
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
              {errors.languages && (
                <Text className="text-xs text-destructive">{errors.languages.message}</Text>
              )}
            </View>

            <View className="gap-2">
              <Text className="text-sm font-medium text-foreground">
                Description <Text className="text-destructive">*</Text>
              </Text>
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Describe role responsibilities, team, and benefits..."
                    multiline
                    numberOfLines={6}
                    className="h-36 py-3"
                    textAlignVertical="top"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.description && (
                <Text className="text-xs text-destructive">{errors.description.message}</Text>
              )}
            </View>

            <View className="flex-row items-center justify-between rounded-2xl border border-border bg-muted/30 p-4">
              <View className="flex-1 pr-3">
                <Text className="font-semibold text-foreground">Publish Immediately</Text>
                <Text className="text-xs text-muted-foreground">
                  Job posting will be immediately visible in search.
                </Text>
              </View>
              <Controller
                control={control}
                name="isActive"
                render={({ field: { onChange, value } }) => (
                  <Switch value={value} onValueChange={onChange} />
                )}
              />
            </View>

            <View className="mt-2 flex-row gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onPress={onBack}
                disabled={isSubmitting}
              >
                <Text className="font-medium text-foreground">Cancel</Text>
              </Button>
              <Button
                className="flex-1"
                onPress={handleSubmit(onSubmit, onInvalid)}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" className="text-primary-foreground" />
                ) : (
                  <Text className="font-semibold text-primary-foreground">Publish</Text>
                )}
              </Button>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};
