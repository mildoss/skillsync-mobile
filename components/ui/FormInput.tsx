import { View, Text } from "react-native";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Input, InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FormInputProps<T extends FieldValues> extends InputProps {
  control: Control<T, any>;
  name: Path<T>;
  label?: string;
  required?: boolean;
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  required,
  className,
  ...props
}: FormInputProps<T>) {
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
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <>
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              className={cn(error ? "border-destructive focus:border-destructive" : "", className)}
              {...props}
            />
            {error && <Text className="text-xs text-destructive">{error.message}</Text>}
          </>
        )}
      />
    </View>
  );
}
