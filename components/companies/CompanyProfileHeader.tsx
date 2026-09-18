import { View, Text } from "react-native";
import { ImageUpload } from "@/components/shared/ImageUpload";
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
  return (
    <View className="flex-col gap-6 border-b border-border pb-6">
      <ImageUpload
        currentImageUrl={previewUri || logoUrl}
        name={name || "Company"}
        onFileSelectAction={isReadOnly ? () => {} : onFileSelectAction}
        onRemoveAction={isReadOnly ? () => {} : onRemoveAction}
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
  );
};
