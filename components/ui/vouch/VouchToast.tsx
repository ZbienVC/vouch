import { toast as sonnerToast, Toaster } from "sonner"
import { CheckCircle2, XCircle, Info, AlertTriangle } from "lucide-react"

export const toast = {
  success: (message: string, action?: { label: string; onClick: () => void }) =>
    sonnerToast.success(message, {
      icon: <CheckCircle2 size={16} style={{ color: "#2DD4BF" }} />,
      action: action ? { label: action.label, onClick: action.onClick } : undefined,
      style: {
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        color: "var(--text-primary)",
        borderLeft: "3px solid #2DD4BF",
        borderRadius: "14px",
        fontFamily: "'DM Sans', sans-serif",
      },
    }),
  error: (message: string) =>
    sonnerToast.error(message, {
      icon: <XCircle size={16} style={{ color: "#EF4444" }} />,
      style: {
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        color: "var(--text-primary)",
        borderLeft: "3px solid #EF4444",
        borderRadius: "14px",
        fontFamily: "'DM Sans', sans-serif",
      },
    }),
  info: (message: string) =>
    sonnerToast(message, {
      icon: <Info size={16} style={{ color: "var(--accent)" }} />,
      style: {
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        color: "var(--text-primary)",
        borderLeft: "3px solid var(--accent)",
        borderRadius: "14px",
        fontFamily: "'DM Sans', sans-serif",
      },
    }),
  warning: (message: string) =>
    sonnerToast.warning(message, {
      icon: <AlertTriangle size={16} style={{ color: "#F59E0B" }} />,
      style: {
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        color: "var(--text-primary)",
        borderLeft: "3px solid #F59E0B",
        borderRadius: "14px",
        fontFamily: "'DM Sans', sans-serif",
      },
    }),
  loading: (message: string, options?: Parameters<typeof sonnerToast.loading>[1]) =>
    sonnerToast.loading(message, {
      style: {
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        color: "var(--text-primary)",
        borderRadius: "14px",
        fontFamily: "'DM Sans', sans-serif",
      },
      ...options,
    }),
  dismiss: sonnerToast.dismiss,
}

export function VouchToaster() {
  return (
    <Toaster
      position="bottom-right"
      duration={4000}
      richColors={false}
      toastOptions={{
        style: {
          background: "var(--bg-surface)",
          border: "1px solid var(--border-subtle)",
          color: "var(--text-primary)",
          borderRadius: "14px",
          fontFamily: "'DM Sans', sans-serif",
        },
      }}
    />
  )
}
