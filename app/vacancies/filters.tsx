import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Button } from "@/components/ui/button";
import { FilterSection } from "@/components/ui/filters/FilterSection";
import { FilterCheckboxGroup } from "@/components/ui/filters/FilterCheckboxGroup";
import { getCategories, getSkills, getDomains, getLanguages } from "@/lib/api";
import { WORK_FORMATS, EXPERIENCE_OPTIONS, COMPANY_TYPES, LOCATION_OPTIONS, mapToOptions } from "@/lib/utils";
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

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedCompanyTypes, setSelectedCompanyTypes] = useState<string[]>([]);

  useEffect(() => {
    if (params.skills) setSelectedSkills((params.skills as string).split(","));
    if (params.categoryId) setSelectedCategories((params.categoryId as string).split(","));
    if (params.domain) setSelectedDomains((params.domain as string).split(","));
    if (params.languages) setSelectedLanguages((params.languages as string).split(","));
    if (params.type) setSelectedTypes((params.type as string).split(","));
    if (params.experience) setSelectedExperience((params.experience as string).split(","));
    if (params.location) setSelectedLocations((params.location as string).split(","));
    if (params.companyType) setSelectedCompanyTypes((params.companyType as string).split(","));
  }, []);

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
      } catch (e) {
        console.error(e);
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
            <Text className="text-primary font-medium text-sm">Clear all</Text>
          </Pressable>
          <Pressable onPress={() => router.back()} className="p-2 -mr-2 rounded-full active:bg-muted">
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
        className="px-6 pt-4 bg-background border-t border-border"
      >
        <Button size="lg" onPress={handleApply} className="w-full">
          Show Results
        </Button>
      </View>
    </View>
  );
}
