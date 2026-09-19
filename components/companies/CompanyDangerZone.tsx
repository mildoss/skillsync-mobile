import { View, Text } from "react-native";
import { Button } from "@/components/ui/button";

interface CompanyDangerZoneProps {
  isDeleting: boolean;
  isPending: boolean;
  onDelete: () => void;
}

export const CompanyDangerZone = ({ isDeleting, isPending, onDelete }: CompanyDangerZoneProps) => {
  return (
    <View className="mt-8 rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
      <Text className="text-lg font-bold text-destructive">Danger Zone</Text>
      <Text className="mt-1 text-sm text-muted-foreground">
        Once you delete your company, there is no going back. All vacancies and team connections
        will be permanently removed.
      </Text>
      <Button
        variant="destructive"
        className="mt-4 border border-destructive/30"
        onPress={onDelete}
        disabled={isDeleting || isPending}
      >
        <Text className="font-semibold text-destructive">
          {isDeleting ? "Deleting..." : "Delete Company"}
        </Text>
      </Button>
    </View>
  );
};
