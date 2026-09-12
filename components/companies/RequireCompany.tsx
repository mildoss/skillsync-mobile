import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { User } from "@/types/users";
import { ArrowLeft, Building, Search, ListTodo } from "lucide-react-native";
import { cssInterop } from "nativewind";
import { CreateCompanyForm } from "./CreateCompanyForm";
import { JoinCompanyForm } from "./JoinCompanyForm";
import { MyJoinRequests } from "./MyJoinRequests";

[ArrowLeft, Building, Search, ListTodo].forEach((Icon) => {
  cssInterop(Icon, {
    className: { target: "style", nativeStyleToProp: { color: true } },
  });
});

type RequireCompanyProps = {
  user: User;
  children: React.ReactNode;
};

export const RequireCompany = ({ user, children }: RequireCompanyProps) => {
  const [view, setView] = useState<"select" | "create" | "join" | "requests">("select");

  if (!user || !user.role) {
    return null;
  }

  if (user.role === "APPLICANT" || user.companyId) {
    return <>{children}</>;
  }

  if (view === "select") {
    return (
      <View className="flex-1 items-center justify-center p-6 py-10">
        <View className="bg-primary/10 mb-6 rounded-full p-6">
          <Building className="text-primary" size={48} />
        </View>
        <Text className="mb-2 text-center text-2xl font-bold tracking-tight text-foreground">
          SkillSync Business
        </Text>
        <Text className="mb-8 text-center text-base text-muted-foreground">
          To start posting vacancies and hiring candidates, you need to create a company profile or join an existing team.
        </Text>

        <View className="w-full gap-4">
          <TouchableOpacity
            onPress={() => setView("create")}
            className="flex-row items-center gap-4 rounded-2xl border border-border bg-card p-5 active:bg-muted"
          >
            <View className="bg-primary/10 rounded-full p-3">
              <Building className="text-primary" size={24} />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-foreground">Create Company</Text>
              <Text className="text-xs text-muted-foreground">
                I am a founder or the first HR on the platform.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setView("join")}
            className="flex-row items-center gap-4 rounded-2xl border border-border bg-card p-5 active:bg-muted"
          >
            <View className="bg-primary/10 rounded-full p-3">
              <Search className="text-primary" size={24} />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-foreground">Join Team</Text>
              <Text className="text-xs text-muted-foreground">
                My company is already registered on SkillSync.
              </Text>
            </View>
          </TouchableOpacity>

          {user.pendingCompanyIds && user.pendingCompanyIds.length > 0 && (
            <TouchableOpacity
              onPress={() => setView("requests")}
              className="flex-row items-center justify-between rounded-2xl border border-primary bg-primary/5 p-5 active:bg-primary/10"
            >
              <View className="flex-row items-center gap-4">
                <View className="bg-background rounded-full p-2">
                  <ListTodo className="text-primary" size={20} />
                </View>
                <View>
                  <Text className="font-bold text-foreground">My Sent Requests</Text>
                  <Text className="text-xs text-muted-foreground">
                    You have {user.pendingCompanyIds.length} pending request(s)
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  const renderView = () => {
    switch (view) {
      case "create":
        return <CreateCompanyForm onBack={() => setView("select")} />;
      case "join":
        return <JoinCompanyForm onBack={() => setView("select")} />;
      case "requests":
        return <MyJoinRequests onBack={() => setView("select")} />;
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 pb-10">
      <TouchableOpacity
        className="mb-4 flex-row items-center gap-2 py-2"
        onPress={() => setView("select")}
      >
        <ArrowLeft className="text-muted-foreground" size={20} />
        <Text className="text-base font-medium text-muted-foreground">Back</Text>
      </TouchableOpacity>
      {renderView()}
    </View>
  );
};
