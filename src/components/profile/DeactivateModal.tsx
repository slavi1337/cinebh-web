type DeactivateModalProps = {
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeactivateModal({
  isSubmitting,
  onCancel,
  onConfirm,
}: DeactivateModalProps) {
  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center bg-auth-overlay px-4 pt-30">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="deactivate-profile-title"
        className="w-full max-w-110 rounded-2xl bg-white px-7 py-6 shadow-movie-card"
      >
        <h2
          id="deactivate-profile-title"
          className="text-[20px] leading-6 font-bold text-page-heading"
        >
          Deactivate My Account
        </h2>
        <p className="mt-3 text-[14px] leading-5 text-page-muted">
          This will deactivate your account and sign you out immediately.
        </p>
        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onCancel}
            className="h-10 rounded-lg border border-brand-red px-5 text-[14px] leading-5 font-semibold text-brand-red transition enabled:cursor-pointer enabled:hover:bg-brand-red/5 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onConfirm}
            className="h-10 rounded-lg bg-brand-red px-5 text-[14px] leading-5 font-semibold text-white transition enabled:cursor-pointer enabled:hover:bg-brand-red/90 disabled:cursor-not-allowed disabled:bg-movie-details-border"
          >
            {isSubmitting ? "Deactivating..." : "Deactivate"}
          </button>
        </div>
      </div>
    </div>
  );
}
