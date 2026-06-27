import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageStatusCard from "@/components/common/PageStatusCard";
import ProfileLayout from "@/components/profile/ProfileLayout";
import ProfileLockIcon from "@/components/profile/ProfileLockIcon";
import EyeIcon from "@/components/ui/icons/EyeIcon";
import EyeOffIcon from "@/components/ui/icons/EyeOffIcon";
import { useAuth } from "@/context/AuthContext";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/schemas/profileSchemas";
import { changeUserPassword } from "@/services/profileService";
import { getApiErrorMessage } from "@/utils/auth";

type PasswordFieldName = keyof ChangePasswordFormValues;

type PasswordErrors = Partial<Record<PasswordFieldName | "form", string>>;

const EMPTY_FORM_VALUES: ChangePasswordFormValues = {
  currentPassword: "",
  newPassword: "",
  repeatNewPassword: "",
};

const STRONG_PASSWORD_PLACEHOLDER = "e.g. StrongPass123";

function validatePasswordForm(values: ChangePasswordFormValues) {
  const result = changePasswordSchema.safeParse(values);

  if (result.success) {
    return {};
  }

  return result.error.issues.reduce<PasswordErrors>((errors, issue) => {
    const fieldName = issue.path[0] as PasswordFieldName | undefined;

    if (fieldName && !errors[fieldName]) {
      errors[fieldName] = issue.message;
    }

    return errors;
  }, {});
}

function PasswordInputField({
  id,
  label,
  value,
  placeholder,
  error,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const hasError = Boolean(error);
  const isMaskedWithValue = !isVisible && value.length > 0;
  const inputClassName = `h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-auth-input-muted ${
    hasError ? "text-auth-error" : "text-page-heading"
  } ${
    isMaskedWithValue
      ? "pb-1 text-[26px] leading-none font-bold tracking-[0.14em]"
      : "text-body-md"
  }`;

  return (
    <div className="w-full max-w-[360px]">
      <label
        htmlFor={id}
        className="mb-2 block text-[14px] leading-5 font-semibold text-page-heading"
      >
        {label}
      </label>
      <div
        className={`flex h-12 items-center gap-3 rounded-lg border bg-white px-4 shadow-page-input ${
          hasError ? "border-auth-error" : "border-auth-input-border"
        }`}
      >
        <span className={hasError ? "text-auth-error" : "text-icon-default"}>
          <ProfileLockIcon className="h-5 w-5" />
        </span>
        <input
          id={id}
          type={isVisible ? "text" : "password"}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={inputClassName}
        />
        <button
          type="button"
          onClick={() => setIsVisible((currentValue) => !currentValue)}
          className={hasError ? "text-auth-error" : "text-auth-input-muted"}
        >
          {isVisible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
      <p
        className={`mt-2 min-h-4 text-xs leading-4 ${
          hasError ? "text-auth-error" : "text-transparent"
        }`}
      >
        {error ?? "No error"}
      </p>
    </div>
  );
}

export default function ProfilePasswordPage() {
  const navigate = useNavigate();
  const { currentUser, openSignIn, showToast, logout } = useAuth();
  const [values, setValues] =
    useState<ChangePasswordFormValues>(EMPTY_FORM_VALUES);
  const [touchedFields, setTouchedFields] = useState<
    Partial<Record<PasswordFieldName, boolean>>
  >({});
  const [serverError, setServerError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const validationErrors = useMemo(() => validatePasswordForm(values), [values]);
  const visibleErrors = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(validationErrors).filter(
          ([fieldName]) => touchedFields[fieldName as PasswordFieldName],
        ),
      ) as PasswordErrors,
    [touchedFields, validationErrors],
  );
  const isFormValid = Object.keys(validationErrors).length === 0;

  useEffect(() => {
    if (!currentUser) {
      openSignIn();
    }
  }, [currentUser, openSignIn]);

  function updateValue(fieldName: PasswordFieldName, value: string) {
    setValues((currentValues) => ({ ...currentValues, [fieldName]: value }));
    setTouchedFields((currentFields) => ({
      ...currentFields,
      [fieldName]: true,
    }));
    setServerError("");
  }

  function resetForm() {
    setValues(EMPTY_FORM_VALUES);
    setTouchedFields({});
    setServerError("");
  }

  async function handleSave() {
    setTouchedFields({
      currentPassword: true,
      newPassword: true,
      repeatNewPassword: true,
    });

    if (!isFormValid) {
      return;
    }

    try {
      setIsSaving(true);
      await changeUserPassword(values);
      resetForm();
      await logout();
      navigate("/", { replace: true });
      openSignIn();
      showToast("Password changed successfully. Sign in with your new password.");
    } catch (error) {
      setServerError(getApiErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  if (!currentUser) {
    return (
      <ProfileLayout title="Change Password">
        <PageStatusCard label="Sign in to change your password." />
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout title="Change Password">
      <div className="max-w-[940px]">
        <div className="space-y-4">
          <PasswordInputField
            id="current-password"
            label="Current Password"
            value={values.currentPassword}
            placeholder={STRONG_PASSWORD_PLACEHOLDER}
            error={visibleErrors.currentPassword || serverError}
            onChange={(value) => updateValue("currentPassword", value)}
          />
          <PasswordInputField
            id="new-password"
            label="New Password"
            value={values.newPassword}
            placeholder={STRONG_PASSWORD_PLACEHOLDER}
            error={visibleErrors.newPassword}
            onChange={(value) => updateValue("newPassword", value)}
          />
          <PasswordInputField
            id="repeat-new-password"
            label="Repeat New Password"
            value={values.repeatNewPassword}
            placeholder={STRONG_PASSWORD_PLACEHOLDER}
            error={visibleErrors.repeatNewPassword}
            onChange={(value) => updateValue("repeatNewPassword", value)}
          />
        </div>

        <div className="mt-7 flex justify-end gap-3 border-t border-border-default pt-6">
          <button
            type="button"
            disabled={isSaving}
            onClick={resetForm}
            className="h-12 rounded-lg border border-brand-red px-6 text-body-md font-semibold text-brand-red transition enabled:cursor-pointer enabled:hover:bg-brand-red/5 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!isFormValid || isSaving}
            onClick={() => void handleSave()}
            className="h-12 rounded-lg bg-brand-red px-6 text-body-md font-semibold text-white transition enabled:cursor-pointer enabled:hover:bg-brand-red/90 disabled:cursor-not-allowed disabled:bg-movie-details-border"
          >
            {isSaving ? "Saving..." : "Save Password"}
          </button>
        </div>
      </div>
    </ProfileLayout>
  );
}
