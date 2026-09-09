import { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Button } from "@/components/ui/button";
import { FilterSection } from "@/components/ui/filters/FilterSection";
import { FilterCheckboxGroup } from "@/components/ui/filters/FilterCheckboxGroup";
import { getCategories, getSkills, getDomains, getLanguages } from "@/lib/api";
import {
  WORK_FORMATS,
  EXPERIENCE_OPTIONS,
  COMPANY_TYPES,
  LOCATION_OPTIONS,
  mapToOptions,
} from "@/lib/utils";
import { X } from "lucide-react-native";
import { useColorScheme } from "nativewind";

export default function FiltersModal() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [domains, setDomains] = useState<any[]>([]);
  const [languages, setLanguages] = useState<any[]>([]);

  const [selectedSkills, setSelectedSkills] = useState<string[]>(() =>
    params.skills ? (params.skills as string).split(",") : [],
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() =>
    params.categoryId ? (params.categoryId as string).split(",") : [],
  );
  const [selectedDomains, setSelectedDomains] = useState<string[]>(() =>
    params.domain ? (params.domain as string).split(",") : [],
  );
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(() =>
    params.languages ? (params.languages as string).split(",") : [],
  );
  const [selectedTypes, setSelectedTypes] = useState<string[]>(() =>
    params.type ? (params.type as string).split(",") : [],
  );
  const [selectedExperience, setSelectedExperience] = useState<string[]>(() =>
    params.experience ? (params.experience as string).split(",") : [],
  );
  const [selectedLocations, setSelectedLocations] = useState<string[]>(() =>
    params.location ? (params.location as string).split(",") : [],
  );
  const [selectedCompanyTypes, setSelectedCompanyTypes] = useState<string[]>(() =>
    params.companyType ? (params.companyType as string).split(",") : [],
  );

  useEffect(() => {
    const fetchDictionaries = async () => {
      try {
        const [c, s, d, l] = await Promise.all([
          getCategories(),
          getSkills(),
          getDomains(),
          getLanguages(),
        ]);
        setCategories(c);
        setSkills(s);
        setDomains(d);
        setLanguages(l);
      } catch {
        // Silently handle dictionary fetch failure
      } finally {
        setIsLoading(false);
      }
    };
    fetchDictionaries();
  }, []);

  const handleApply = () => {
    const query: any = {};
    if (selectedSkills.length) query.skills = selectedSkills.join(",");
    if (selectedCategories.length) query.categoryId = selectedCategories.join(",");
    if (selectedDomains.length) query.domain = selectedDomains.join(",");
    if (selectedLanguages.length) query.languages = selectedLanguages.join(",");
    if (selectedTypes.length) query.type = selectedTypes.join(",");
    if (selectedExperience.length) query.experience = selectedExperience.join(",");
    if (selectedLocations.length) query.location = selectedLocations.join(",");
    if (selectedCompanyTypes.length) query.companyType = selectedCompanyTypes.join(",");

    router.replace({
      pathname: "/(tabs)/vacancies",
      params: query,
    });
  };

  const handleClear = () => {
    setSelectedSkills([]);
    setSelectedCategories([]);
    setSelectedDomains([]);
    setSelectedLanguages([]);
    setSelectedTypes([]);
    setSelectedExperience([]);
    setSelectedLocations([]);
    setSelectedCompanyTypes([]);
  };

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row items-center justify-between border-b border-border px-4 py-4">
        <Text className="text-xl font-bold text-foreground">Filters</Text>
        <View className="flex-row items-center">
          <Pressable onPress={handleClear} className="mr-4">
            <Text className="text-sm font-medium text-primary">Clear all</Text>
          </Pressable>
          <Pressable
            onPress={() => router.back()}
            className="-mr-2 rounded-full p-2 active:bg-muted"
          >
            <X size={24} color={isDark ? "#ffffff" : "#09090b"} />
          </Pressable>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        {isLoading ? (
          <ActivityIndicator size="large" color={isDark ? "#ffffff" : "#4f46e5"} className="mt-8" />
        ) : (
          <>
            {categories.length > 0 && (
              <FilterSection title="Category">
                <FilterCheckboxGroup
                  options={mapToOptions(categories)}
                  selectedValues={selectedCategories}
                  onChange={setSelectedCategories}
                />
              </FilterSection>
            )}

            {skills.length > 0 && (
              <FilterSection title="Skills">
                <FilterCheckboxGroup
                  options={mapToOptions(skills)}
                  selectedValues={selectedSkills}
                  onChange={setSelectedSkills}
                />
              </FilterSection>
            )}

            <FilterSection title="Experience">
              <FilterCheckboxGroup
                options={EXPERIENCE_OPTIONS}
                selectedValues={selectedExperience}
                onChange={setSelectedExperience}
              />
            </FilterSection>

            <FilterSection title="Work Format">
              <FilterCheckboxGroup
                options={WORK_FORMATS}
                selectedValues={selectedTypes}
                onChange={setSelectedTypes}
              />
            </FilterSection>

            <FilterSection title="Company Type">
              <FilterCheckboxGroup
                options={COMPANY_TYPES}
                selectedValues={selectedCompanyTypes}
                onChange={setSelectedCompanyTypes}
              />
            </FilterSection>

            {languages.length > 0 && (
              <FilterSection title="Languages">
                <FilterCheckboxGroup
                  options={mapToOptions(languages)}
                  selectedValues={selectedLanguages}
                  onChange={setSelectedLanguages}
                />
              </FilterSection>
            )}

            {domains.length > 0 && (
              <FilterSection title="Domain">
                <FilterCheckboxGroup
                  options={mapToOptions(domains)}
                  selectedValues={selectedDomains}
                  onChange={setSelectedDomains}
                />
              </FilterSection>
            )}

            <FilterSection title="Location">
              <FilterCheckboxGroup
                options={LOCATION_OPTIONS}
                selectedValues={selectedLocations}
                onChange={setSelectedLocations}
              />
            </FilterSection>
            <View className="h-12" />
          </>
        )}
      </ScrollView>

      <View
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        className="border-t border-border bg-background px-6 pt-4"
      >
        <Button size="lg" onPress={handleApply} className="w-full">
          Show Results
        </Button>
      </View>
    </View>
  );
}
