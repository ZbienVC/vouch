import { toast as sonnerToast, Toaster } from "sonner"

export const toast = {
  success: (message: string, options?: Parameters<typeof sonnerToast.success>[1]) =>
    sonnerToast.success(message, {
      style: {
        background: "#1A1A24",
        border: "1px solid #2A2A38",
        color: "#F0F0FF",
      },
      ...options,
    }),
  error: (message: string, options?: Parameters<typeof sonnerToast.error>[1]) =>
    sonnerToast.error(message, {
      style: {
        background: "#1A1A24",
        border: "1px solid #FF4D6A",
        color: "#F0F0FF",
      },
      ...options,
    }),
  info: (message: string, options?: Parameters<typeof sonnerToast>[1]) =>
    sonnerToast(message, {
      style: {
        background: "#1A1A24",
        border: "1px solid #2A2A38",
        color: "#F0F0FF",
      },
      ...options,
    }),
  warning: (message: string, options?: Parameters<typeof sonnerToast.warning>[1]) =>
    sonnerToast.warning(message, {
      style: {
        background: "#1A1A24",
        border: "1px solid #FFB547",
        color: "#F0F0FF",
      },
      ...options,
    }),
  loading: (message: string, options?: Parameters<typeof sonnerToast.loading>[1]) =>
    sonnerToast.loading(message, {
      style: {
        background: "#1A1A24",
        border: "1px solid #2A2A38",
        color: "#F0F0FF",
      },
      ...options,
    }),
  dismiss: sonnerToast.dismiss,
}

export function VouchToaster() {
  return (
    <Toaster
      theme="dark"
      toastOptions={{
        style: {
          background: "#1A1A24",
          border: "1px solid #2A2A38",
          color: "#F0F0FF",
          fontFamily: "'DM Sans', sans-serif",
        },
      }}
      position="bottom-right"
    />
  )
}