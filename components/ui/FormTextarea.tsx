import { View, Text } from "react-native";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Input, InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FormTextareaProps<T extends FieldValues> extends InputProps {
  control: Control<T, any>;
  name: Path<T>;
  label?: string;
  required?: boolean;
}

export function FormTextarea<T extends FieldValues>({
  control,
  name,
  label,
  required,
  className,
  onChangeText: customOnChangeText,
  ...props
}: FormTextareaProps<T>) {
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
              {...props}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              onBlur={onBlur}
              onChangeText={(text) => {
                onChange(text);
                customOnChangeText?.(text);
              }}
              value={value}
              className={cn(
                "h-36 py-3",
                error ? "border-destructive focus:border-destructive" : "",
                className
              )}
            />
            {error && <Text className="text-xs text-destructive">{error.message}</Text>}
          </>
        )}
      />
    </View>
  );
}
