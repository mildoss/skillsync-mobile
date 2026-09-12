import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getCompanies, joinCompany, getMe } from "@/lib/api";
import { Companies } from "@/types/companies";
import { toast } from "@/store/useToastStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Building, Send, CheckCircle2 } from "lucide-react-native";
import { cssInterop } from "nativewind";
import { buildQueryParams } from "@/lib/utils";
import { Image } from "expo-image";

[Building, Send, CheckCircle2].forEach((Icon) => {
  cssInterop(Icon, {
    className: { target: "style", nativeStyleToProp: { color: true } },
  });
});

interface JoinCompanyFormProps {
  onBack: () => void;
}

export const JoinCompanyForm = ({ onBack }: JoinCompanyFormProps) => {
  const { user, setUser } = useAuthStore();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [companies, setCompanies] = useState<Companies[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isJoining, setIsJoining] = useState<string | null>(null);
  const [sentRequests, setSentRequests] = useState<Set<string>>(
    new Set(user?.pendingCompanyIds || [])
  );

  useEffect(() => {
    if (user?.pendingCompanyIds) {
      setSentRequests(new Set(user.pendingCompanyIds));
    }
  }, [user?.pendingCompanyIds]);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch companies when search changes
  useEffect(() => {
    let isMounted = true;
    if (debouncedSearch.length < 2) {
      setCompanies([]);
      return;
    }

    const fetchCompanies = async () => {
      setIsSearching(true);
      try {
        const queryParams = buildQueryParams({ search: debouncedSearch, limit: "5" });
        const res = await getCompanies(queryParams);
        if (isMounted && res.data) {
          setCompanies(res.data);
        }
      } catch (error) {
        console.error("Failed to search companies:", error);
      } finally {
        if (isMounted) setIsSearching(false);
      }
    };

    fetchCompanies();
    return () => {
      isMounted = false;
    };
  }, [debouncedSearch]);

  const handleJoin = async (companyId: string) => {
    setIsJoining(companyId);
    try {
      await joinCompany(companyId);
      setSentRequests((prev) => new Set(prev).add(companyId));

      if (user) {
        setUser({
          ...user,
          pendingCompanyIds: [...(user.pendingCompanyIds || []), companyId],
        });
      }

      toast.success("Join request sent!");

      const freshUser = await getMe();
      if (freshUser) {
        setUser(freshUser);
      }
    } catch (error: any) {
      if (error?.status === 409 || error?.message?.includes("already")) {
        setSentRequests((prev) => new Set(prev).add(companyId));
        toast.info("Request already sent!");
      } else {
        toast.error("Failed to send request", error.message);
      }
    } finally {
      setIsJoining(null);
    }
  };

  return (
    <View className="gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <Text className="text-2xl font-bold tracking-tight text-foreground">Find your company</Text>

      <View className="gap-2">
        <Text className="text-sm font-medium text-foreground">Company Name</Text>
        <Input
          placeholder="Search for companies..."
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
        />
        <Text className="text-xs text-muted-foreground">Type at least 2 characters to search.</Text>
      </View>

      <View className="mt-4 gap-3">
        {isSearching ? (
          <ActivityIndicator size="small" className="text-primary my-4" />
        ) : search.length >= 2 && companies.length === 0 ? (
          <Text className="text-center text-sm text-muted-foreground my-4">
            No companies found. Try a different name.
          </Text>
        ) : (
          companies.map((company) => {
            const isSent = sentRequests.has(company.id) || user?.pendingCompanyIds?.includes(company.id);

            return (
              <View
                key={company.id}
                className="flex-row items-center gap-4 rounded-xl border border-border bg-background p-4"
              >
                {company.logoUrl ? (
                  <Image
                    source={{ uri: company.logoUrl }}
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
                    {company.name}
                  </Text>
                  <Text className="text-xs text-muted-foreground" numberOfLines={1}>
                    {company.companyType}
                  </Text>
                </View>

                {isSent ? (
                  <View className="flex-row items-center gap-1.5 rounded-lg border border-border bg-secondary/60 px-3 py-2">
                    <CheckCircle2 className="text-emerald-500" size={14} />
                    <Text className="text-xs font-semibold text-muted-foreground">Sent</Text>
                  </View>
                ) : (
                  <Button
                    size="sm"
                    onPress={() => handleJoin(company.id)}
                    disabled={isJoining === company.id}
                  >
                    <Send className="mr-2 text-primary-foreground" size={14} />
                    <Text className="text-primary-foreground font-medium">
                      {isJoining === company.id ? "Sending..." : "Join"}
                    </Text>
                  </Button>
                )}
              </View>
            );
          })
        )}
      </View>
    </View>
  );
};
