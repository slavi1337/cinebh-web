import { useState } from "react";
import AuthDivider from "@/components/auth/AuthDivider";
import AuthFormHeader from "@/components/auth/AuthFormHeader";
import AuthFormSwitch from "@/components/auth/AuthFormSwitch";
import AuthInput from "@/components/auth/AuthInput";
import AuthSubmitButton from "@/components/auth/AuthSubmitButton";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import MailIcon from "@/components/ui/icons/MailIcon";
import PasswordInput from "@/components/auth/PasswordInput";
import RememberMeCheckbox from "@/components/auth/RememberMeCheckbox";
import { useAuth } from "@/context/AuthContext";
import { getApiErrorMessage } from "@/utils/auth";
import AuthErrorMessage from "@/components/auth/AuthErrorMessage";
import { loginWithGoogle } from "@/services/authService";

export default function SignInForm() {
  const { closeAuthDrawer, login, openSignUp } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError("Email and password are required.");
      return;
    }

    setIsLoading(true);

    try {
      await login({
        email: trimmedEmail,
        password,
        rememberMe,
      });
    } catch (error) {
      setError(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <AuthFormHeader title="Sign In" onBack={closeAuthDrawer} />

      <form
        onSubmit={handleSubmit}
        className="mx-auto flex w-full max-w-[400px] flex-col gap-4.5"
      >
        {error && <AuthErrorMessage message={error} />}

        <AuthInput
          id="signin-email"
          label="Email"
          value={email}
          placeholder="Email Address"
          icon={<MailIcon />}
          onChange={setEmail}
        />

        <PasswordInput
          id="signin-password"
          label="Password"
          value={password}
          onChange={setPassword}
        />

        <RememberMeCheckbox checked={rememberMe} onChange={setRememberMe} />

        <AuthSubmitButton isLoading={isLoading}>Sign In</AuthSubmitButton>

        <AuthFormSwitch
          text="Don’t have an account yet?"
          actionText="Sign Up"
          onClick={openSignUp}
        />

        <AuthDivider text="or" />

        <GoogleAuthButton onClick={loginWithGoogle} />
      </form>
    </>
  );
}
