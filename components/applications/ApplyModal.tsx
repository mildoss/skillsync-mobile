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
} from "react-native";
import { applyToVacancy, getVacancy, generateCoverLetter } from "@/lib/api";
import { toast } from "@/store/useToastStore";
import { useAuthStore } from "@/store/useAuthStore";
import { X, Send, Briefcase, Sparkles } from "lucide-react-native";
import { Button } from "@/components/ui/button";

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  vacancyId: string;
  vacancyTitle: string;
  companyName: string;
  onSuccess: (newApplication?: any) => void;
}

export const ApplyModal = ({
  isOpen,
  onClose,
  vacancyId,
  vacancyTitle,
  companyName,
  onSuccess,
}: ApplyModalProps) => {
  const [coverLetter, setCoverLetter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const user = useAuthStore(state => state.user);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await applyToVacancy(vacancyId, coverLetter.trim() || undefined);
      toast.success("Application sent successfully!");
      setCoverLetter("");
      onSuccess(res?.data);
      onClose();
    } catch (error: any) {
      toast.error(
        "Failed to submit application",
        error.message || "An unexpected error occurred",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateAI = async () => {
    if (!user) {
      toast.error("Error", "Please complete your profile first");
      return;
    }
    setIsGenerating(true);
    try {
      const vacancy = await getVacancy(vacancyId);
      if (!vacancy) throw new Error("Vacancy not found");
      
      const payload = {
        vacancyId,
        vacancyTitle: vacancy.title,
        vacancyDescription: vacancy.description || "",
        candidateAbout: user.about || "",
        candidateSkills: user.skills?.map((s: any) => s.name) || [],
        candidateExperience: user.experience != null ? `${user.experience} years` : "",
      };

      const res = await generateCoverLetter(payload);
      setCoverLetter(res.text);
      toast.success("Cover letter generated successfully!");
    } catch (error: any) {
      toast.error("Generation failed", error.message || "An unexpected error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 justify-end bg-black/50 p-3 pb-8 sm:justify-center sm:p-6">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <View className="overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
              <View className="border-b border-border/70 p-5">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2.5">
                    <View className="rounded-full bg-primary/10 p-2">
                      <Briefcase size={18} color="#3b82f6" />
                    </View>
                    <View>
                      <Text className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Job Application
                      </Text>
                      <Text
                        className="text-lg font-bold text-foreground"
                        numberOfLines={1}
                      >
                        {vacancyTitle}
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
                <Text className="mt-2 text-xs font-medium text-muted-foreground">
                  at {companyName}
                </Text>
              </View>

              <View className="p-5">
                <View className="mb-1.5 flex-row items-center justify-between">
                  <Text className="text-sm font-semibold text-foreground">
                    Cover Letter{" "}
                    <Text className="text-xs font-normal text-muted-foreground">
                      (optional)
                    </Text>
                  </Text>
                  <TouchableOpacity
                    onPress={handleGenerateAI}
                    disabled={isGenerating}
                    className="flex-row items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 active:bg-primary/20"
                  >
                    {isGenerating ? (
                      <ActivityIndicator size="small" color="#3b82f6" />
                    ) : (
                      <>
                        <Sparkles size={14} color="#3b82f6" />
                        <Text className="text-xs font-semibold text-primary">AI Draft</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
                <TextInput
                  placeholder="Introduce yourself, highlight your top skills, and explain why you're a great match for this role..."
                  placeholderTextColor="#9ca3af"
                  multiline
                  numberOfLines={5}
                  value={coverLetter}
                  onChangeText={setCoverLetter}
                  textAlignVertical="top"
                  className="h-36 rounded-2xl border border-border bg-muted/20 p-3.5 text-sm leading-relaxed text-foreground focus:border-primary"
                />

                <Text className="mt-2 text-[11px] text-muted-foreground">
                  Your profile details and contact information will be shared with the recruiter.
                </Text>

                {/* Buttons */}
                <View className="mt-5 flex-row gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onPress={onClose}
                    disabled={isSubmitting}
                  >
                    <Text className="font-semibold text-foreground">Cancel</Text>
                  </Button>

                  <Button
                    className="flex-1"
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <>
                        <Send size={15} color="#ffffff" className="mr-1.5" />
                        <Text className="font-semibold text-primary-foreground">
                          Submit
                        </Text>
                      </>
                    )}
                  </Button>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
