import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Modal,
  Platform,
} from "react-native";
import { deleteVacancy } from "@/lib/api";
import { User } from "@/types/users";
import { Vacancy } from "@/types/vacancies";
import { VacancyCard } from "@/components/vacancies/VacancyCard";
import { VacancySkeleton } from "@/components/vacancies/VacancySkeleton";
import { Button } from "@/components/ui/button";
import { toast } from "@/store/useToastStore";
import { Plus, Briefcase } from "lucide-react-native";
import { VacancyForm } from "./VacancyForm";
import { VacancyApplicantsView } from "./VacancyApplicantsView";
import { useMyVacancies } from "@/hooks/useVacancies";
import { EmptyState } from "@/components/shared/EmptyState";

interface MyVacanciesTabProps {
  user: User;
}

export const MyVacanciesTab = ({ user }: MyVacanciesTabProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingVacancy, setEditingVacancy] = useState<Vacancy | null>(null);
  const [viewingApplicantsVacancy, setViewingApplicantsVacancy] =
    useState<Vacancy | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);

  const { data: fetchRes, isLoading, refetch } = useMyVacancies({ enabled: !!user?.companyId });
  const vacancies: Vacancy[] = Array.isArray(fetchRes) ? fetchRes : (fetchRes as any)?.data || [];


  if (!user) return null;

  if (viewingApplicantsVacancy) {
    return (
      <VacancyApplicantsView
        vacancy={viewingApplicantsVacancy}
        onBack={() => setViewingApplicantsVacancy(null)}
      />
    );
  }

  if (isCreating || editingVacancy) {
    return (
      <VacancyForm
        initialData={editingVacancy || undefined}
        onBack={() => {
          setIsCreating(false);
          setEditingVacancy(null);
        }}
        onSuccess={() => {
          setIsCreating(false);
          setEditingVacancy(null);
          refetch();
        }}
      />
    );
  }

  if (isLoading) {
    return (
      <View className="gap-4 pb-10">
        <View className="mb-2">
          <Text className="text-2xl font-bold tracking-tight text-foreground">My Vacancies</Text>
        </View>
        <VacancySkeleton />
        <VacancySkeleton />
      </View>
    );
  }

  const handleDelete = (vacancy: Vacancy) => {
    Alert.alert(
      "Delete Vacancy",
      `Are you sure you want to delete "${vacancy.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeletingId(vacancy.id);
            try {
              await deleteVacancy(vacancy.id);
              refetch();
              toast.success("Vacancy deleted successfully");
            } catch (error: any) {
              toast.error("Failed to delete vacancy", error.message);
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  const handleAction = (action: string) => {
    if (!selectedVacancy) return;
    const vacancy = selectedVacancy;
    setSelectedVacancy(null);

    setTimeout(() => {
      if (action === "edit") {
        setEditingVacancy(vacancy);
      } else if (action === "applicants") {
        setViewingApplicantsVacancy(vacancy);
      } else if (action === "delete") {
        handleDelete(vacancy);
      }
    }, Platform.OS === 'ios' ? 300 : 0);
  };

  return (
    <View className="flex-1 pb-16">
      <View className="mb-6 flex-row items-center justify-between">
        <View className="flex-1 pr-2">
          <Text className="text-2xl font-bold tracking-tight text-foreground">My Vacancies</Text>
          <Text className="text-sm text-muted-foreground">
            Manage your company's active job postings.
          </Text>
        </View>
        <Button size="sm" className="h-10 px-4" onPress={() => setIsCreating(true)}>
          <Plus size={16} color="#ffffff" className="mr-1.5" />
          <Text className="font-semibold text-primary-foreground">Create</Text>
        </Button>
      </View>

      {vacancies.length === 0 ? (
        <EmptyState
          icon={<Briefcase size={32} color="#3b82f6" />}
          title="No Vacancies Yet"
          description="You haven't posted any job openings for your company yet."
          action={
            <Button onPress={() => setIsCreating(true)}>
              <Plus size={16} color="#ffffff" className="mr-2" />
              <Text className="font-semibold text-primary-foreground">Post a Vacancy</Text>
            </Button>
          }
        />
      ) : (
        <View className="gap-4">
          {vacancies.map((vacancy) => (
            <VacancyCard
              key={vacancy.id}
              vacancy={vacancy}
              onActionPress={() => setSelectedVacancy(vacancy)}
              isActionLoading={deletingId === vacancy.id}
            />
          ))}
        </View>
      )}

      <Modal
        visible={!!selectedVacancy}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedVacancy(null)}
      >
        <TouchableOpacity
          className="flex-1 justify-end bg-black/40 p-2 pb-8"
          activeOpacity={1}
          onPress={() => setSelectedVacancy(null)}
        >
          <View className="overflow-hidden rounded-2xl bg-card">
            <View className="border-b border-border p-4 items-center bg-muted/30">
              <Text className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Manage Vacancy
              </Text>
              <Text className="text-base font-semibold text-foreground mt-1" numberOfLines={1}>
                {selectedVacancy?.title}
              </Text>
            </View>

            <TouchableOpacity
              className="border-b border-border p-4 active:bg-muted"
              onPress={() => handleAction("applicants")}
            >
              <Text className="text-center text-lg font-medium text-primary">View Applications</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="border-b border-border p-4 active:bg-muted"
              onPress={() => handleAction("edit")}
            >
              <Text className="text-center text-lg font-medium text-foreground">Edit Vacancy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="p-4 active:bg-muted bg-destructive/5"
              onPress={() => handleAction("delete")}
            >
              <Text className="text-center text-lg font-semibold text-destructive">Delete Vacancy</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="mt-3 rounded-2xl bg-card p-4 active:bg-muted"
            onPress={() => setSelectedVacancy(null)}
          >
            <Text className="text-center text-lg font-semibold text-foreground">Cancel</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

