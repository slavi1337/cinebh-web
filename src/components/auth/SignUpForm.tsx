import { useMemo, useState } from "react";
import AuthDivider from "@/components/auth/AuthDivider";
import AuthFormHeader from "@/components/auth/AuthFormHeader";
import AuthFormSwitch from "@/components/auth/AuthFormSwitch";
import AuthInput from "@/components/auth/AuthInput";
import AuthSubmitButton from "@/components/auth/AuthSubmitButton";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import MailIcon from "@/components/ui/icons/MailIcon";
import PasswordInput from "@/components/auth/PasswordInput";
import { useAuth } from "@/context/AuthContext";
import { signupSchema } from "@/schemas/authSchemas";
import { getApiErrorMessage } from "@/utils/auth";
import AuthErrorMessage from "@/components/auth/AuthErrorMessage";

type TouchedFields = {
  email: boolean;
  password: boolean;
  confirmedPassword: boolean;
};

export default function SignUpForm() {
  const { closeAuthDrawer, openSignIn, signup } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [touchedFields, setTouchedFields] = useState<TouchedFields>({
    email: false,
    password: false,
    confirmedPassword: false,
  });

  const formValues = useMemo(
    () => ({
      email,
      password,
      confirmedPassword,
    }),
    [email, password, confirmedPassword],
  );

  const validationResult = useMemo(
    () => signupSchema.safeParse(formValues),
    [formValues],
  );

  const validationErrors = useMemo(() => {
    if (validationResult.success) {
      return {};
    }

    return validationResult.error.flatten().fieldErrors;
  }, [validationResult]);

  const emailError = getFieldError("email");
  const passwordError = getFieldError("password");
  const confirmedPasswordError = getFieldError("confirmedPassword");

  const isSignUpDisabled = !validationResult.success || isLoading;

  function getFieldError(field: keyof TouchedFields) {
    if (!isSubmitted && !touchedFields[field]) {
      return undefined;
    }

    return validationErrors[field]?.[0];
  }

  function markFieldAsTouched(field: keyof TouchedFields) {
    setTouchedFields((currentFields) => ({
      ...currentFields,
      [field]: true,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitted(true);
    setFormError("");

    if (!validationResult.success) {
      return;
    }

    setIsLoading(true);

    try {
      await signup({
        email: validationResult.data.email,
        password: validationResult.data.password,
      });
    } catch (error) {
      setFormError(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <AuthFormHeader title="Sign Up" onBack={closeAuthDrawer} />

      <form
        onSubmit={handleSubmit}
        className="mx-auto flex w-full max-w-[400px] flex-col gap-4"
      >
        {formError && <AuthErrorMessage message={formError} />}

        <AuthInput
          id="signup-email"
          label="Email"
          value={email}
          placeholder="Email Address"
          icon={<MailIcon />}
          error={emailError}
          reserveErrorSpace
          onBlur={() => markFieldAsTouched("email")}
          onChange={(value) => {
            setEmail(value);
            setFormError("");
          }}
        />

        <PasswordInput
          id="signup-password"
          label="Password"
          value={password}
          error={passwordError}
          reserveErrorSpace
          onBlur={() => markFieldAsTouched("password")}
          onChange={(value) => {
            setPassword(value);
            setFormError("");
          }}
        />

        <PasswordInput
          id="signup-confirm-password"
          label="Confirm Password"
          value={confirmedPassword}
          placeholder="Confirm Password"
          error={confirmedPasswordError}
          reserveErrorSpace
          onBlur={() => markFieldAsTouched("confirmedPassword")}
          onChange={(value) => {
            setConfirmedPassword(value);
            setFormError("");
          }}
        />

        <AuthSubmitButton isLoading={isLoading} disabled={isSignUpDisabled}>
          Sign Up
        </AuthSubmitButton>

        <AuthFormSwitch
          text="Already have an account?"
          actionText="Sign In"
          onClick={openSignIn}
        />

        <AuthDivider text="or" />

        <GoogleAuthButton label="Sign up with" />
      </form>
    </>
  );
}
