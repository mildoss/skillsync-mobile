import { View, Text } from "react-native";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { CustomAvatar } from "@/components/shared/CustomAvatar";
import { CompanyDetail } from "@/types/companies";

interface CompanyProfileHeaderProps {
  company: CompanyDetail;
  name: string;
  previewUri: string | null;
  logoUrl: string | null;
  isReadOnly: boolean;
  onFileSelectAction: (uri: string, mimeType: string, name: string) => void;
  onRemoveAction: () => void;
}

export const CompanyProfileHeader = ({
  company,
  name,
  previewUri,
  logoUrl,
  isReadOnly,
  onFileSelectAction,
  onRemoveAction,
}: CompanyProfileHeaderProps) => {
  if (isReadOnly) {
    return (
      <View className="flex-row items-center gap-4 border-b border-border pb-6">
        <CustomAvatar imageUrl={previewUri || logoUrl} fallbackText={name || "?"} size="md" />
        <View className="flex-1">
          <Text className="text-xl font-bold text-foreground" numberOfLines={1}>
            {name || "Company Name"}
          </Text>
          <Text className="font-medium text-muted-foreground" numberOfLines={1}>
            {company.companyType || "Company Type"}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-col gap-6 border-b border-border pb-6">
      <ImageUpload
        currentImageUrl={previewUri || logoUrl}
        name={name || "Company"}
        onFileSelectAction={onFileSelectAction}
        onRemoveAction={onRemoveAction}
      />
      <View>
        <Text className="truncate text-xl font-bold text-foreground">{name || "Company Name"}</Text>
        <Text className="truncate font-medium text-muted-foreground">
          {company.companyType || "Company Type"}
        </Text>
      </View>
    </View>
  );
};
