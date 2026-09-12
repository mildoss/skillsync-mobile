import { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { getCompany, getCompanyRequests, handleJoinRequest, removeEmployee } from "@/lib/api";
import { toast } from "@/store/useToastStore";
import { User } from "@/types/users";
import { Employee } from "@/types/companies";
import { Check, X, UserMinus, ShieldAlert } from "lucide-react-native";
import { cssInterop } from "nativewind";
import { Image } from "expo-image";

[Check, X, UserMinus, ShieldAlert].forEach((Icon) => {
  cssInterop(Icon, {
    className: { target: "style", nativeStyleToProp: { color: true } },
  });
});

interface MyTeamTabProps {
  user: User;
}

export const MyTeamTab = ({ user }: MyTeamTabProps) => {
  if (!user) return null;

  const [requests, setRequests] = useState<any[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (!user.companyId) return;

    const fetchData = async () => {
      try {
        const [reqRes, compRes] = await Promise.all([
          getCompanyRequests(user.companyId!),
          getCompany(user.companyId!),
        ]);

        if (isMounted) {
          const reqList = Array.isArray(reqRes) ? reqRes : (reqRes as any)?.data || [];
          setRequests(reqList.filter((r: any) => r.status === "PENDING"));
          if (compRes) setEmployees(compRes.employees || []);
        }
      } catch (error) {
        console.error("Failed to fetch team data", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [user.companyId]);

  const activeEmployees = employees.filter((emp) => emp.id !== user.id);

  const handleRequest = async (requestId: string, status: "APPROVED" | "REJECTED") => {
    if (!user.companyId) return;
    setActionId(requestId);
    const prevRequests = requests;
    const prevEmployees = employees;

    const targetReq = requests.find((r) => r.id === requestId);

    setRequests((prev) => prev.filter((r) => r.id !== requestId));

    if (status === "APPROVED" && targetReq?.user) {
      const newRecruiter: Employee = {
        id: targetReq.user.id || targetReq.userId,
        name: targetReq.user.name,
        surname: targetReq.user.surname,
        position: targetReq.user.position || "Recruiter",
        avatarUrl: targetReq.user.avatarUrl || null,
      };
      setEmployees((prev) => {
        if (prev.some((e) => e.id === newRecruiter.id)) return prev;
        return [...prev, newRecruiter];
      });
    }

    try {
      await handleJoinRequest(user.companyId, requestId, status);
      toast.success(status === "APPROVED" ? "Recruiter approved!" : "Request rejected");

      const compRes = await getCompany(user.companyId);
      if (compRes?.employees) {
        setEmployees(compRes.employees);
      }
    } catch (error: any) {
      setRequests(prevRequests);
      setEmployees(prevEmployees);
      toast.error(`Failed to ${status.toLowerCase()} request`, error.message);
    } finally {
      setActionId(null);
    }
  };

  const handleRemove = (employeeId: string, name: string) => {
    Alert.alert(
      "Remove Employee",
      `Are you sure you want to remove ${name} from your company?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            if (!user.companyId) return;
            setActionId(employeeId);
            const prevEmployees = employees;
            setEmployees((prev) => prev.filter((emp) => emp.id !== employeeId));

            try {
              await removeEmployee(user.companyId, employeeId);
              toast.success("Employee removed");
              const compRes = await getCompany(user.companyId);
              if (compRes?.employees) {
                setEmployees(compRes.employees);
              }
            } catch (error: any) {
              setEmployees(prevEmployees);
              toast.error("Failed to remove employee", error.message);
            } finally {
              setActionId(null);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View className="items-center justify-center py-10">
        <ActivityIndicator size="large" className="text-primary" />
      </View>
    );
  }

  return (
    <View className="gap-6 pb-10">
      <View className="mb-2">
        <Text className="text-2xl font-bold tracking-tight text-foreground">Team Management</Text>
        <Text className="text-sm text-muted-foreground">
          Manage your recruiters and pending join requests.
        </Text>
      </View>

      {requests.length > 0 && (
        <View className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <Text className="mb-4 text-xl font-bold text-foreground">
            Pending Requests ({requests.length})
          </Text>
          <View className="gap-4">
            {requests.map((request) => (
              <View
                key={request.id}
                className="flex-row items-center gap-4 rounded-xl border border-border bg-background p-4"
              >
                {request.user.avatarUrl ? (
                  <Image
                    source={{ uri: request.user.avatarUrl }}
                    className="h-10 w-10 rounded-full bg-muted"
                    contentFit="cover"
                  />
                ) : (
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Text className="font-bold text-primary">
                      {request.user.name.charAt(0)}
                    </Text>
                  </View>
                )}
                <View className="flex-1">
                  <Text className="font-bold text-foreground" numberOfLines={1}>
                    {request.user.name} {request.user.surname}
                  </Text>
                  <Text className="text-xs text-muted-foreground" numberOfLines={1}>
                    {request.user.email}
                  </Text>
                </View>
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    className="rounded-full bg-emerald-500/10 p-2"
                    onPress={() => handleRequest(request.id, "APPROVED")}
                    disabled={actionId === request.id}
                  >
                    <Check className="text-emerald-600" size={18} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="rounded-full bg-destructive/10 p-2"
                    onPress={() => handleRequest(request.id, "REJECTED")}
                    disabled={actionId === request.id}
                  >
                    <X className="text-destructive" size={18} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      <View className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <Text className="mb-4 text-xl font-bold text-foreground">
          Active Recruiters ({activeEmployees.length})
        </Text>
        {activeEmployees.length === 0 ? (
          <View className="items-center justify-center rounded-xl border border-dashed border-border py-8">
            <Text className="text-center text-muted-foreground">
              You don't have any recruiters in your team yet.
            </Text>
          </View>
        ) : (
          <View className="gap-4">
            {activeEmployees.map((emp) => (
              <View
                key={emp.id}
                className="flex-row items-center gap-4 rounded-xl border border-border bg-background p-4"
              >
                {emp.avatarUrl ? (
                  <Image
                    source={{ uri: emp.avatarUrl }}
                    className="h-10 w-10 rounded-full bg-muted"
                    contentFit="cover"
                  />
                ) : (
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Text className="font-bold text-primary">
                      {emp.name.charAt(0)}
                    </Text>
                  </View>
                )}
                <View className="flex-1">
                  <Text className="font-bold text-foreground" numberOfLines={1}>
                    {emp.name} {emp.surname}
                  </Text>
                  <Text className="text-xs text-muted-foreground" numberOfLines={1}>
                    {emp.position || "HR / Recruiter"}
                  </Text>
                </View>
                <TouchableOpacity
                  className="rounded-full bg-destructive/10 p-2"
                  onPress={() => handleRemove(emp.id, emp.name)}
                  disabled={actionId === emp.id}
                >
                  <UserMinus className="text-destructive" size={18} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};
