import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Button } from "@/components/ui/button";
import { getMyRequests, cancelJoinRequest, getMe } from "@/lib/api";
import { toast } from "@/store/useToastStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Building, X, Clock, CheckCircle2, XCircle } from "lucide-react-native";
import { cssInterop } from "nativewind";
import { Image } from "expo-image";
import { formatDate } from "@/lib/utils";

[Building, X, Clock, CheckCircle2, XCircle].forEach((Icon) => {
  cssInterop(Icon, {
    className: { target: "style", nativeStyleToProp: { color: true } },
  });
});

interface MyJoinRequestsProps {
  onBack: () => void;
}

export const MyJoinRequests = ({ onBack }: MyJoinRequestsProps) => {
  const { setUser } = useAuthStore();
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCanceling, setIsCanceling] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchRequests = async () => {
      try {
        const res = await getMyRequests();
        const list = Array.isArray(res) ? res : (res as any)?.data || [];
        if (isMounted) {
          setRequests(list);
        }
      } catch (error) {
        console.error("Failed to fetch requests", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchRequests();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCancel = async (requestId: string) => {
    setIsCanceling(requestId);
    const prevRequests = requests;
    setRequests((prev) => prev.filter((r) => r.id !== requestId));

    try {
      await cancelJoinRequest(requestId);
      toast.success("Request canceled successfully");
      const freshUser = await getMe();
      if (freshUser) {
        setUser(freshUser);
      }
      if (prevRequests.length <= 1) {
        onBack();
      }
    } catch (error: any) {
      setRequests(prevRequests);
      toast.error("Failed to cancel request", error.message);
    } finally {
      setIsCanceling(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="text-amber-500" size={16} />;
      case "APPROVED":
        return <CheckCircle2 className="text-emerald-500" size={16} />;
      case "REJECTED":
        return <XCircle className="text-destructive" size={16} />;
      default:
        return null;
    }
  };

  return (
    <View className="gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <Text className="text-2xl font-bold tracking-tight text-foreground">My Sent Requests</Text>

      {isLoading ? (
        <View className="items-center justify-center py-10">
          <ActivityIndicator size="small" className="text-primary" />
        </View>
      ) : requests.length === 0 ? (
        <View className="items-center justify-center py-10">
          <Text className="text-muted-foreground">No requests found.</Text>
        </View>
      ) : (
        <View className="gap-4">
          {requests.map((request) => (
            <View
              key={request.id}
              className="flex-row items-center gap-4 rounded-xl border border-border bg-background p-4"
            >
              {request.company.logoUrl ? (
                <Image
                  source={{ uri: request.company.logoUrl }}
                  className="h-12 w-12 rounded-lg bg-muted"
                  contentFit="cover"
                />
              ) : (
                <View className="h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Building className="text-primary" size={24} />
                </View>
              )}

              <View className="flex-1">
                <Text className="font-bold text-foreground" numberOfLines={1}>
                  {request.company.name}
                </Text>
                <View className="mt-1 flex-row items-center gap-1">
                  {getStatusIcon(request.status)}
                  <Text className="text-xs text-muted-foreground capitalize">
                    {request.status.toLowerCase()} • {formatDate(request.createdAt)}
                  </Text>
                </View>
              </View>

              {request.status === "PENDING" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onPress={() => handleCancel(request.id)}
                  disabled={isCanceling === request.id}
                >
                  <X className="text-muted-foreground" size={16} />
                </Button>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};
