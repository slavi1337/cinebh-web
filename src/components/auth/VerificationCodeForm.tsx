import { useEffect, useState } from "react";
import AuthFormHeader from "@/components/auth/AuthFormHeader";
import AuthSubmitButton from "@/components/auth/AuthSubmitButton";
import VerificationCodeInput from "@/components/auth/VerificationCodeInput";
import { useAuth } from "@/context/AuthContext";
import { getApiErrorMessage, maskEmail } from "@/utils/auth";
import AuthErrorMessage from "@/components/auth/AuthErrorMessage";

const RESEND_TIMEOUT_SECONDS = 60;

export default function VerificationCodeForm() {
  const { closeAuthDrawer, verificationEmail, verify, resendVerificationCode } =
    useAuth();

  const [code, setCode] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(RESEND_TIMEOUT_SECONDS);
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSecondsLeft((value) => value - 1);
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [secondsLeft]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (code.length !== 6) {
      setError("Verification code must contain 6 digits.");
      return;
    }

    setIsVerifying(true);

    try {
      await verify({
        email: verificationEmail,
        code,
      });
    } catch (error) {
      setError(getApiErrorMessage(error));
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleResendCode() {
    setError("");
    setIsResending(true);

    try {
      await resendVerificationCode();
      setSecondsLeft(RESEND_TIMEOUT_SECONDS);
    } catch (error) {
      setError(getApiErrorMessage(error));
    } finally {
      setIsResending(false);
    }
  }

  return (
    <>
      <AuthFormHeader title="Code Verification" onBack={closeAuthDrawer} />

      <form
        onSubmit={handleSubmit}
        className="mx-auto flex w-full max-w-[400px] flex-col"
      >
        <p className="mx-auto mb-8 max-w-[270px] text-center text-sm font-normal leading-5 tracking-[0.0025em] text-auth-text-muted">
          We have sent code to your email{" "}
          <span>{maskEmail(verificationEmail)}</span>. Please, enter the code
          below to verify.
        </p>

        <VerificationCodeInput value={code} onChange={setCode} />

        <div className="mt-8 text-center text-sm font-normal leading-5 tracking-[0.0025em] text-auth-text-muted">
          <p>Didn’t receive email?</p>

          {secondsLeft > 0 ? (
            <p className="mt-4">
              You can resend email in{" "}
              <span className="font-semibold text-auth-text-primary">
                {secondsLeft}
              </span>{" "}
              seconds.
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResendCode}
              disabled={isResending}
              className="mt-4 cursor-pointer font-semibold text-auth-text-primary underline disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isResending ? "Sending..." : "Resend verification code"}
            </button>
          )}
        </div>

        {error && <AuthErrorMessage message={error} center />}

        <div className="mt-8">
          <AuthSubmitButton isLoading={isVerifying}>Continue</AuthSubmitButton>
        </div>
      </form>
    </>
  );
}
