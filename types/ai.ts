export type AiGenerationType = "COVER_LETTER" | "VACANCY" | "MATCHING";

export type AiGenerationResponse = {
  text: string;
  remainingCredits: number;
};

export type AiDraftResponse = {
  id: string;
  type: AiGenerationType;
  text?: string;
  data?: {
    score: number;
    reason: string;
  }; 
  createdAt: string;
};
