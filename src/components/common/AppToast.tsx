import { useAuth } from "@/context/AuthContext";

export default function AppToast() {
  const { toast } = useAuth();

  if (!toast) {
    return null;
  }

  return (
    <div className="fixed right-6 top-24 z-[80] max-w-sm rounded-lg border border-auth-input-border bg-white px-5 py-4 shadow-movie-card">
      <p className="text-body-md font-semibold text-page-heading">
        {toast.message}
      </p>
    </div>
  );
}
