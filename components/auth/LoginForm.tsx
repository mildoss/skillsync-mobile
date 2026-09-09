import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/validation/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { getMe, loginApi } from "@/lib/api";

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export const LoginForm = ({ onSwitchToRegister }: LoginFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setError(null);
    try {
      const responseData = await loginApi(data);
      const accessToken = responseData["access-token"];
      const refreshToken = responseData["refresh-token"];

      if (accessToken) {
        await login(accessToken, refreshToken, null);
        const user = await getMe(accessToken);
        if (user) {
          useAuthStore.getState().setUser(user);
        }
      }
    } catch (e: any) {
      setError(e.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <View className="flex-1 px-4 py-8">
      <Text className="mb-8 text-center text-3xl font-bold text-foreground">Welcome Back</Text>

      {error && (
        <View className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-3">
          <Text className="text-center font-medium text-red-500">{error}</Text>
        </View>
      )}

      <View className="space-y-4">
        <View>
          <Text className="mb-2 text-sm font-medium text-foreground">Email</Text>
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
          <Text className="mb-2 text-sm font-medium text-foreground">Password</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="rounded-xl border border-border bg-card/50 px-4 py-3 text-foreground focus:border-primary"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Enter your password"
                placeholderTextColor="#666"
                secureTextEntry
              />
            )}
          />
          {errors.password && (
            <Text className="ml-1 mt-1 text-xs text-red-500">{errors.password.message}</Text>
          )}
        </View>

        <TouchableOpacity
          className={`mt-4 items-center rounded-xl bg-primary py-4 ${isSubmitting ? "opacity-70" : ""}`}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-lg font-semibold text-white">Login</Text>
          )}
        </TouchableOpacity>

        <View className="mt-6 flex-row justify-center">
          <Text className="text-muted-foreground">{"Don't have an account? "}</Text>
          <TouchableOpacity onPress={onSwitchToRegister}>
            <Text className="font-medium text-primary">Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
