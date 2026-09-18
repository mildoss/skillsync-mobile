import { View, Text } from "react-native";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Select } from "@/components/ui/select";

interface FormSelectProps<T extends FieldValues> {
  control: Control<T, any>;
  name: Path<T>;
  label?: string;
  required?: boolean;
  options: { label: string; value: string }[];
  placeholder?: string;
  className?: string;
  valueAsNumber?: boolean;
  disabled?: boolean;
}

export function FormSelect<T extends FieldValues>({
  control,
  name,
  label,
  required,
  options,
  placeholder,
  className,
  valueAsNumber,
  disabled,
}: FormSelectProps<T>) {
  return (
    <View className="gap-2">
      {label && (
        <Text className="text-sm font-medium text-foreground">
          {label} {required && <Text className="text-destructive">*</Text>}
        </Text>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <Select
              options={options}
              value={value?.toString()}
              onValueChange={(val) => {
                if (valueAsNumber) {
                  onChange(val ? Number(val) : undefined);
                } else {
                  onChange(val);
                }
              }}
              placeholder={placeholder}
              disabled={disabled}
            />
            {error && <Text className="text-xs text-destructive">{error.message}</Text>}
          </>
        )}
      />
    </View>
  );
}
