import { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { useMyVacancies } from "@/hooks/useVacancies";
import { inviteCandidate } from "@/lib/api";
import { toast } from "@/store/useToastStore";
import { X, MailPlus, Send, Briefcase, Check } from "lucide-react-native";
import { Button } from "@/components/ui/button";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId: string;
  candidateName: string;
  onSuccess?: () => void;
}

export const InviteModal = ({
  isOpen,
  onClose,
  candidateId,
  candidateName,
  onSuccess,
}: InviteModalProps) => {
  const [selectedVacancyId, setSelectedVacancyId] = useState<string>("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const { data: myVacancies = [], isLoading: isLoadingVacancies } = useMyVacancies({
    enabled: isOpen,
  });

  const activeVacancies = myVacancies.filter((v) => v.isActive !== false);

  const handleSendInvite = async () => {
    if (!selectedVacancyId) {
      toast.error("Validation error", "Please select a vacancy first");
      return;
    }

    setIsSending(true);
    try {
      await inviteCandidate({
        applicantId: candidateId,
        vacancyId: selectedVacancyId,
        message: message.trim(),
      });

      toast.success(`Invitation sent to ${candidateName}!`);
      setMessage("");
      setSelectedVacancyId("");
      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast.error("Failed to invite candidate", error.message || "An unexpected error occurred");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 justify-end bg-black/50 p-3 pb-8 sm:justify-center sm:p-6">
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <View className="overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
              <View className="border-b border-border/70 p-5">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2.5">
                    <View className="rounded-full bg-success/10 p-2">
                      <MailPlus size={18} color="#16a34a" />
                    </View>
                    <View>
                      <Text className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Invite Candidate
                      </Text>
                      <Text className="text-lg font-bold text-foreground" numberOfLines={1}>
                        {candidateName}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={onClose}
                    className="rounded-full bg-muted/60 p-2 active:bg-muted"
                    accessibilityLabel="Close"
                  >
                    <X size={18} color="#6b7280" />
                  </TouchableOpacity>
                </View>
              </View>

              <View className="p-5">
                {isLoadingVacancies ? (
                  <View className="items-center justify-center py-8">
                    <ActivityIndicator size="small" color="#3b82f6" />
                    <Text className="mt-2 text-xs text-muted-foreground">
                      Loading your vacancies...
                    </Text>
                  </View>
                ) : activeVacancies.length === 0 ? (
                  <View className="items-center py-6 text-center">
                    <Briefcase size={36} color="#9ca3af" className="mb-2" />
                    <Text className="mb-1 text-base font-semibold text-foreground">
                      No Active Vacancies
                    </Text>
                    <Text className="mb-5 text-center text-xs text-muted-foreground">
                      You need to create at least one active vacancy to invite candidates.
                    </Text>
                    <Button variant="outline" onPress={onClose} className="w-full">
                      Close
                    </Button>
                  </View>
                ) : (
                  <>
                    <Text className="mb-2 text-sm font-semibold text-foreground">
                      Select Vacancy <Text className="text-destructive">*</Text>
                    </Text>
                    <ScrollView
                      className="mb-4 max-h-40"
                      nestedScrollEnabled
                      showsVerticalScrollIndicator
                    >
                      <View className="gap-2">
                        {activeVacancies.map((vacancy) => {
                          const isSelected = selectedVacancyId === vacancy.id;
                          return (
                            <TouchableOpacity
                              key={vacancy.id}
                              onPress={() => setSelectedVacancyId(vacancy.id)}
                              className={`flex-row items-center justify-between rounded-xl border p-3 ${
                                isSelected
                                  ? "border-primary bg-primary/10"
                                  : "border-border bg-muted/20"
                              }`}
                            >
                              <View className="flex-1 pr-2">
                                <Text
                                  className={`text-sm font-semibold ${
                                    isSelected ? "text-primary" : "text-foreground"
                                  }`}
                                  numberOfLines={1}
                                >
                                  {vacancy.title}
                                </Text>
                                <Text className="text-xs text-muted-foreground" numberOfLines={1}>
                                  {vacancy.type} • {vacancy.location || "Location not specified"}
                                </Text>
                              </View>
                              {isSelected && (
                                <View className="rounded-full bg-primary p-1">
                                  <Check size={12} color="#ffffff" />
                                </View>
                              )}
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </ScrollView>

                    <Text className="mb-1.5 text-sm font-semibold text-foreground">
                      Message{" "}
                      <Text className="text-xs font-normal text-muted-foreground">(optional)</Text>
                    </Text>
                    <TextInput
                      placeholder="Hi! We loved your profile and would like to invite you to apply..."
                      placeholderTextColor="#9ca3af"
                      multiline
                      numberOfLines={4}
                      value={message}
                      onChangeText={setMessage}
                      textAlignVertical="top"
                      className="h-24 rounded-2xl border border-border bg-muted/20 p-3.5 text-sm leading-relaxed text-foreground focus:border-primary"
                    />

                    <View className="mt-5 flex-row gap-3">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onPress={onClose}
                        disabled={isSending}
                      >
                        <Text className="font-semibold text-foreground">Cancel</Text>
                      </Button>

                      <Button
                        className="flex-1"
                        onPress={handleSendInvite}
                        disabled={isSending || !selectedVacancyId}
                      >
                        {isSending ? (
                          <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                          <>
                            <Send size={15} color="#ffffff" className="mr-1.5" />
                            <Text className="font-semibold text-primary-foreground">
                              Send Invite
                            </Text>
                          </>
                        )}
                      </Button>
                    </View>
                  </>
                )}
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
