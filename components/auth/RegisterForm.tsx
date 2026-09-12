import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/lib/validation/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { getMe, registerApi } from "@/lib/api";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm = ({ onSwitchToLogin }: RegisterFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuthStore();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      role: "APPLICANT",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterInput) => {
    setError(null);
    try {
      const responseData = await registerApi(data);
      const accessToken = responseData["access-token"];
      const refreshToken = responseData["refresh-token"];

      if (accessToken) {
        let user = null;
        try {
          user = await getMe(accessToken);
        } catch {
          // fallback if getMe fails immediately
        }
        await login(accessToken, refreshToken, user);
      } else {
        onSwitchToLogin();
      }
    } catch (e: any) {
      setError(e.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <ScrollView className="flex-1 px-4 py-8" showsVerticalScrollIndicator={false}>
      <Text className="mb-8 text-center text-3xl font-bold text-foreground">Create Account</Text>

      {error && (
        <View className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-3">
          <Text className="text-center font-medium text-red-500">{error}</Text>
        </View>
      )}

      <View className="space-y-4 pb-12">
        <View>
          <Text className="mb-2 text-sm font-medium text-foreground">I want to...</Text>
          <View className="flex-row space-x-4">
            <TouchableOpacity
              className={`flex-1 rounded-xl border py-3 ${selectedRole === "APPLICANT" ? "border-primary bg-primary" : "border-border bg-card/50"}`}
              onPress={() => setValue("role", "APPLICANT")}
            >
              <Text
                className={`text-center font-medium ${selectedRole === "APPLICANT" ? "text-white" : "text-foreground"}`}
              >
                Find a job
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 rounded-xl border py-3 ${selectedRole === "EMPLOYER" ? "border-primary bg-primary" : "border-border bg-card/50"}`}
              onPress={() => setValue("role", "EMPLOYER")}
            >
              <Text
                className={`text-center font-medium ${selectedRole === "EMPLOYER" ? "text-white" : "text-foreground"}`}
              >
                Hire people
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <Text className="mb-2 mt-2 text-sm font-medium text-foreground">Email</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="rounded-xl border border-border bg-card/50 px-4 py-3 text-foreground focus:border-primary"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Enter your email"
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />
          {errors.email && (
            <Text className="ml-1 mt-1 text-xs text-red-500">{errors.email.message}</Text>
          )}
        </View>

        <View>
          <Text className="mb-2 mt-2 text-sm font-medium text-foreground">Password</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="rounded-xl border border-border bg-card/50 px-4 py-3 text-foreground focus:border-primary"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Create a password"
                placeholderTextColor="#666"
                secureTextEntry
              />
            )}
          />
          {errors.password && (
            <Text className="ml-1 mt-1 text-xs text-red-500">{errors.password.message}</Text>
          )}
        </View>

        <View>
          <Text className="mb-2 mt-2 text-sm font-medium text-foreground">Confirm Password</Text>
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="rounded-xl border border-border bg-card/50 px-4 py-3 text-foreground focus:border-primary"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Confirm your password"
                placeholderTextColor="#666"
                secureTextEntry
              />
            )}
          />
          {errors.confirmPassword && (
            <Text className="ml-1 mt-1 text-xs text-red-500">{errors.confirmPassword.message}</Text>
          )}
        </View>

        <TouchableOpacity
          className={`mt-6 items-center rounded-xl bg-primary py-4 ${isSubmitting ? "opacity-70" : ""}`}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-lg font-semibold text-white">Sign up</Text>
          )}
        </TouchableOpacity>

        <View className="mt-6 flex-row justify-center">
          <Text className="text-muted-foreground">{"Already have an account? "}</Text>
          <TouchableOpacity onPress={onSwitchToLogin}>
            <Text className="font-medium text-primary">Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};
