import { create } from "zustand";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastState {
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, "id">) => void;
  dismissToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  showToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts.slice(-1), { ...toast, id }],
    }));
  },
  dismissToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));

export const toast = {
  success: (title: string, description?: string) =>
    useToastStore.getState().showToast({ type: "success", title, description }),
  error: (title: string, description?: string) =>
    useToastStore.getState().showToast({ type: "error", title, description }),
  info: (title: string, description?: string) =>
    useToastStore.getState().showToast({ type: "info", title, description }),
};
