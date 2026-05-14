import { toast as sonnerToast, Toaster } from "sonner"
import { CheckCircle2, XCircle, Info, AlertTriangle } from "lucide-react"

export const toast = {
  success: (message: string, action?: { label: string; onClick: () => void }) =>
    sonnerToast.success(message, {
      icon: <CheckCircle2 size={16} style={{ color: "var(--success)" }} />,
      action: action ? { label: action.label, onClick: action.onClick } : undefined,
      style: {
        background: "var(--surface-raised)",
        border: "1px solid var(--success)",
        color: "var(--text-primary)",
        borderLeft: "3px solid var(--success)",
        fontFamily: "'DM Sans', sans-serif",
      },
    }),
  error: (message: string) =>
    sonnerToast.error(message, {
      icon: <XCircle size={16} style={{ color: "var(--error)" }} />,
      style: {
        background: "var(--surface-raised)",
        border: "1px solid var(--error)",
        color: "var(--text-primary)",
        borderLeft: "3px solid var(--error)",
        fontFamily: "'DM Sans', sans-serif",
      },
    }),
  info: (message: string) =>
    sonnerToast(message, {
      icon: <Info size={16} style={{ color: "var(--accent)" }} />,
      style: {
        background: "var(--surface-raised)",
        border: "1px solid rgba(99,102,241,0.3)",
        color: "var(--text-primary)",
        borderLeft: "3px solid var(--accent)",
        fontFamily: "'DM Sans', sans-serif",
      },
    }),
  warning: (message: string) =>
    sonnerToast.warning(message, {
      icon: <AlertTriangle size={16} style={{ color: "var(--warning)" }} />,
      style: {
        background: "var(--surface-raised)",
        border: "1px solid var(--warning)",
        color: "var(--text-primary)",
        borderLeft: "3px solid var(--warning)",
        fontFamily: "'DM Sans', sans-serif",
      },
    }),
  loading: (message: string, options?: Parameters<typeof sonnerToast.loading>[1]) =>
    sonnerToast.loading(message, {
      style: {
        background: "var(--surface-raised)",
        border: "1px solid var(--border)",
        color: "var(--text-primary)",
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
          background: "var(--surface-raised)",
          border: "1px solid var(--border)",
          color: "var(--text-primary)",
          fontFamily: "'DM Sans', sans-serif",
        },
      }}
    />
  )
}