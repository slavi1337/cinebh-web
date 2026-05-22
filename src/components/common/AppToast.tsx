import { useAuth } from "@/context/AuthContext";

export default function AppToast() {
  const { toast } = useAuth();

  if (!toast) {
    return null;
  }

  const toastClassName =
    toast.type === "error"
      ? "border-auth-error bg-auth-error/10 text-auth-error-light"
      : "border-auth-input-border bg-white text-page-heading";

  return (
    <div
      className={`fixed right-6 top-24 z-[80] max-w-sm rounded-lg border px-5 py-4 shadow-movie-card ${toastClassName}`}
    >
      <p className="text-body-md font-semibold">{toast.message}</p>
    </div>
  );
}
