import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Switch } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createVacancy, updateVacancy, getCategories, getSkills, getLanguages, generateVacancyDescription } from "@/lib/api";
import { Dictionaries } from "@/types/dictionaries";
import { Vacancy } from "@/types/vacancies";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormInput } from "@/components/ui/FormInput";
import { FormSelect } from "@/components/ui/FormSelect";
import { FormTextarea } from "@/components/ui/FormTextarea";
import { toast } from "@/store/useToastStore";
import { ArrowLeft, Sparkles } from "lucide-react-native";
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

interface VacancyFormProps {
  initialData?: Vacancy;
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

export const VacancyForm = ({
  initialData,
  onBack,
  onSuccess,
}: VacancyFormProps) => {
  const isEditing = !!initialData;
  const [categories, setCategories] = useState<Dictionaries[]>([]);
  const [skills, setSkills] = useState<Dictionaries[]>([]);
  const [languages, setLanguages] = useState<Dictionaries[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
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
      title: initialData?.title || "",
      description: initialData?.description || "",
      categoryId: initialData?.category?.id || "",
      domainId: initialData?.domain || undefined,
      type: (initialData?.type as "REMOTE" | "OFFICE" | "HYBRID") || "OFFICE",
      experience: initialData?.experience != null ? Number(initialData.experience) : undefined,
      location: initialData?.location || undefined,
      salaryMin: initialData?.salaryMin != null ? Number(initialData.salaryMin) : undefined,
      salaryMax: initialData?.salaryMax != null ? Number(initialData.salaryMax) : undefined,
      skills: initialData?.skills ? initialData.skills.map((s: any) => (typeof s === "string" ? s : s.id)) : [],
      languages: initialData?.languages ? initialData.languages.map((l: any) => (typeof l === "string" ? l : l.id)) : [],
      isActive: initialData?.isActive ?? true,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || "",
        description: initialData.description || "",
        categoryId: initialData.category?.id || "",
        domainId: initialData.domain || undefined,
        type: (initialData.type as "REMOTE" | "OFFICE" | "HYBRID") || "OFFICE",
        experience: initialData.experience != null ? Number(initialData.experience) : undefined,
        location: initialData.location || undefined,
        salaryMin: initialData.salaryMin != null ? Number(initialData.salaryMin) : undefined,
        salaryMax: initialData.salaryMax != null ? Number(initialData.salaryMax) : undefined,
        skills: initialData.skills ? initialData.skills.map((s: any) => (typeof s === "string" ? s : s.id)) : [],
        languages: initialData.languages ? initialData.languages.map((l: any) => (typeof l === "string" ? l : l.id)) : [],
        isActive: initialData.isActive ?? true,
      });
    }
  }, [initialData, reset]);

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

      if (isEditing && initialData?.id) {
        await updateVacancy(initialData.id, payload);
        toast.success("Vacancy updated successfully!");
      } else {
        await createVacancy(payload);
        toast.success("Vacancy published successfully!");
      }
      reset();
      onSuccess();
    } catch (error: any) {
      toast.error(
        isEditing ? "Failed to update vacancy" : "Failed to create vacancy",
        error.message || "An error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateDescription = async () => {
    const values = control._formValues;
    if (!values.title || !values.skills || values.skills.length === 0) {
      toast.error("Generation failed", "Please fill in Job Title and Required Skills first.");
      return;
    }
    setIsGenerating(true);
    try {
      const selectedSkillLabels = values.skills.map((skillId: string) => {
        const found = skills.find(s => s.id === skillId);
        return found ? found.name : skillId;
      });
      const res = await generateVacancyDescription({
        jobTitle: values.title,
        keywords: selectedSkillLabels,
      });
      reset({ ...values, description: res.text });
      toast.success("Description generated successfully!");
    } catch (error: any) {
      toast.error("Generation failed", error.message || "An unexpected error occurred");
    } finally {
      setIsGenerating(false);
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
          {isEditing ? "Edit Vacancy" : "Post a Vacancy"}
        </Text>
        <Text className="mb-6 text-sm text-muted-foreground">
          {isEditing
            ? "Update the details below for this role."
            : "Fill in the details below to publish an open role for your company."}
        </Text>

        {isLoadingDicts ? (
          <View className="items-center justify-center py-12">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="mt-3 text-xs text-muted-foreground">Loading categories & skills...</Text>
          </View>
        ) : (
          <View className="gap-5">
            <FormInput
              control={control}
              name="title"
              label="Job Title"
              required
              placeholder="e.g. Senior Frontend Engineer"
            />

            <FormSelect
              control={control}
              name="categoryId"
              label="Category"
              required
              options={mapToOptions(categories)}
              placeholder="Select a category"
            />

            <FormSelect
              control={control}
              name="type"
              label="Work Format"
              options={WORK_FORMATS}
              placeholder="Select format"
            />

            <FormSelect
              control={control}
              name="experience"
              label="Required Experience"
              options={EXPERIENCE_OPTIONS}
              placeholder="Any experience"
              valueAsNumber
            />

            <FormSelect
              control={control}
              name="location"
              label="Location"
              options={LOCATION_OPTIONS}
              placeholder="Select location (optional)"
            />

            <View className="flex-row gap-3">
              <View className="flex-1">
                <FormInput
                  control={control}
                  name="salaryMin"
                  label="Min Salary ($)"
                  placeholder="e.g. 2000"
                  keyboardType="numeric"
                />
              </View>
              <View className="flex-1">
                <FormInput
                  control={control}
                  name="salaryMax"
                  label="Max Salary ($)"
                  placeholder="e.g. 3500"
                  keyboardType="numeric"
                />
              </View>
            </View>

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
              <View className="flex-row items-center justify-end">
                <TouchableOpacity
                  onPress={handleGenerateDescription}
                  disabled={isGenerating}
                  className="flex-row items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 active:bg-primary/20"
                >
                  {isGenerating ? (
                    <ActivityIndicator size="small" color="#3b82f6" />
                  ) : (
                    <>
                      <Sparkles size={14} color="#3b82f6" />
                      <Text className="text-xs font-semibold text-primary">Generate with AI</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
              <FormTextarea
                control={control}
                name="description"
                label="Description"
                required
                placeholder="Describe role responsibilities, team, and benefits..."
              />
            </View>

            <View className="flex-row items-center justify-between rounded-2xl border border-border bg-muted/30 p-4">
              <View className="flex-1 pr-3">
                <Text className="font-semibold text-foreground">
                  {isEditing ? "Active Listing" : "Publish Immediately"}
                </Text>
                <Text className="text-xs text-muted-foreground">
                  {isEditing
                    ? "Whether this job posting is active and visible in search."
                    : "Job posting will be immediately visible in search."}
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
                  <Text className="font-semibold text-primary-foreground">
                    {isEditing ? "Save Changes" : "Publish"}
                  </Text>
                )}
              </Button>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};
