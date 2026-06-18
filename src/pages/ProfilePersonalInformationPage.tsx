import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageStatusCard from "@/components/common/PageStatusCard";
import ProfileFieldIcon from "@/components/profile/ProfileFieldIcon";
import ProfileFormField from "@/components/profile/ProfileFormField";
import ProfileLayout from "@/components/profile/ProfileLayout";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { getApiBaseUrl } from "@/constants/apiConfig";
import { useAuth } from "@/context/AuthContext";
import {
  deactivateUserProfile,
  getProfileLocationOptions,
  getUserProfile,
  updateUserProfile,
  uploadUserProfileImage,
} from "@/services/profileService";
import type { CityOption, UserProfile } from "@/types/profile";
import { getApiErrorMessage } from "@/utils/auth";

type ProfileFormState = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  country: string;
  cityId: string;
};

function PhoneIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M5.2 2.5 6.3 5 4.9 6.1a8.2 8.2 0 0 0 5 5l1.1-1.4 2.5 1.1-.4 2.6c-.1.6-.6 1-1.2 1A10.4 10.4 0 0 1 1.6 4.1c0-.6.4-1.1 1-1.2l2.6-.4Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2.5 4.5h11v7h-11v-7Zm.7.7L8 8.6l4.8-3.4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 14s4-3.8 4-7a4 4 0 1 0-8 0c0 3.2 4 7 4 7Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="7" r="1.4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M2.7 8h10.6M8 2.5c1.4 1.4 2.1 3.2 2.1 5.5S9.4 12.1 8 13.5C6.6 12.1 5.9 10.3 5.9 8S6.6 3.9 8 2.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm5 6a5 5 0 0 0-10 0"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function fullName(profile: UserProfile) {
  const name = [profile.firstName, profile.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return name || profile.email;
}

function blankToNull(value: string) {
  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : null;
}

function profileToFormState(profile: UserProfile): ProfileFormState {
  return {
    firstName: profile.firstName ?? "",
    lastName: profile.lastName ?? "",
    phone: profile.phone ?? "",
    email: profile.email,
    country: profile.country ?? "",
    cityId: profile.cityId ?? "",
  };
}

function isManagedProfileImageUrl(profileImageUrl: string) {
  return profileImageUrl.includes("/profile-images/");
}

function profileImageSrc(profile: UserProfile) {
  if (!profile.profileImageUrl) {
    return null;
  }

  if (!isManagedProfileImageUrl(profile.profileImageUrl)) {
    return profile.profileImageUrl;
  }

  const apiBaseUrl = getApiBaseUrl().replace(/\/$/, "");
  return `${apiBaseUrl}${API_ENDPOINTS.users.profileImage}?v=${encodeURIComponent(
    profile.profileImageUrl,
  )}`;
}

function AvatarPreview({
  profile,
  isEditable,
  isUploading,
  onUploadClick,
}: {
  profile: UserProfile;
  isEditable: boolean;
  isUploading: boolean;
  onUploadClick: () => void;
}) {
  const imageSrc = profileImageSrc(profile);
  const [failedImageSrc, setFailedImageSrc] = useState<string | null>(null);
  const initials = fullName(profile)
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const shouldShowImage = imageSrc && failedImageSrc !== imageSrc;

  const content = shouldShowImage ? (
    <img
      src={imageSrc}
      alt={fullName(profile)}
      onError={() => setFailedImageSrc(imageSrc)}
      className="h-full w-full object-cover"
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center bg-brand-red/10 text-[44px] font-bold text-brand-red">
      {initials}
    </div>
  );

  return (
    <div className="relative h-50 w-50 overflow-hidden rounded-2xl bg-movie-details-chip-background md:h-56 md:w-56">
      {content}
      {isEditable ? (
        <button
          type="button"
          disabled={isUploading}
          onClick={onUploadClick}
          className="absolute inset-x-0 bottom-0 h-12 bg-auth-overlay text-body-md font-semibold text-white transition enabled:cursor-pointer enabled:hover:bg-navbar-background/80 disabled:cursor-not-allowed"
        >
          {isUploading ? "Uploading..." : "Upload Photo"}
        </button>
      ) : null}
    </div>
  );
}

function DeactivateModal({
  isSubmitting,
  onCancel,
  onConfirm,
}: {
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
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

export default function ProfilePersonalInformationPage() {
  const navigate = useNavigate();
  const { currentUser, openSignIn, refreshCurrentUser, showToast, logout } =
    useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formValues, setFormValues] = useState<ProfileFormState | null>(null);
  const [countries, setCountries] = useState<
    { country: string; cities: CityOption[] }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      if (!currentUser) {
        setIsLoading(false);
        setErrorMessage("Sign in to view your profile.");
        openSignIn();
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage("");
        const [profileResponse, optionsResponse] = await Promise.all([
          getUserProfile(),
          getProfileLocationOptions(),
        ]);

        setProfile(profileResponse);
        setFormValues(profileToFormState(profileResponse));
        setCountries(optionsResponse.countries);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          openSignIn();
          setErrorMessage("Sign in to view your profile.");
          return;
        }

        setErrorMessage(getApiErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    }

    void loadProfile();
  }, [currentUser, openSignIn]);

  const selectedCountryCities = useMemo(() => {
    if (!formValues?.country) {
      return [];
    }

    return (
      countries.find((country) => country.country === formValues.country)
        ?.cities ?? []
    );
  }, [countries, formValues?.country]);

  function updateFormValue(field: keyof ProfileFormState, value: string) {
    setFormValues((currentValues) =>
      currentValues ? { ...currentValues, [field]: value } : currentValues,
    );
  }

  function handleCountryChange(countryName: string) {
    const nextCities =
      countries.find((country) => country.country === countryName)?.cities ?? [];

    setFormValues((currentValues) =>
      currentValues
        ? {
            ...currentValues,
            country: countryName,
            cityId: nextCities.length === 1 ? nextCities[0].id : "",
          }
        : currentValues,
    );
  }

  function cancelEdit() {
    if (profile) {
      setFormValues(profileToFormState(profile));
    }

    setIsEditing(false);
  }

  async function handleSave() {
    if (!formValues || !profile) {
      return;
    }

    try {
      setIsSaving(true);
      const hasCityChanged = formValues.cityId !== (profile.cityId ?? "");
      const updatedProfile = await updateUserProfile({
        firstName: blankToNull(formValues.firstName),
        lastName: blankToNull(formValues.lastName),
        phone: blankToNull(formValues.phone),
        cityId: formValues.cityId || null,
        streetAddress: hasCityChanged ? null : profile.streetAddress,
      });

      setProfile(updatedProfile);
      setFormValues(profileToFormState(updatedProfile));
      setIsEditing(false);
      await refreshCurrentUser();
      showToast("Profile updated successfully.");
    } catch (error) {
      showToast(getApiErrorMessage(error), "error");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleProfileImageChange(file: File | undefined) {
    if (!file) {
      return;
    }

    try {
      setIsUploading(true);
      const updatedProfile = await uploadUserProfileImage(file);
      setProfile(updatedProfile);
      setFormValues(profileToFormState(updatedProfile));
      showToast("Profile photo updated successfully.");
    } catch (error) {
      showToast(getApiErrorMessage(error), "error");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function handleDeactivateProfile() {
    try {
      setIsDeactivating(true);
      await deactivateUserProfile();
      await logout();
      setIsDeactivateModalOpen(false);
      navigate("/", { replace: true });
    } catch (error) {
      showToast(getApiErrorMessage(error), "error");
    } finally {
      setIsDeactivating(false);
    }
  }

  if (isLoading) {
    return (
      <ProfileLayout title="Personal Information">
        <PageStatusCard label="Loading profile..." />
      </ProfileLayout>
    );
  }

  if (errorMessage || !profile || !formValues) {
    return (
      <ProfileLayout title="Personal Information">
        <PageStatusCard label={errorMessage || "Profile could not be loaded."} />
      </ProfileLayout>
    );
  }

  const headerAction = !isEditing ? (
    <button
      type="button"
      onClick={() => setIsEditing(true)}
      className="h-12 rounded-lg bg-brand-red px-6 text-body-md font-semibold text-white transition hover:bg-brand-red/90"
    >
      Edit Profile
    </button>
  ) : null;

  return (
    <ProfileLayout title="Personal Information" headerAction={headerAction}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => void handleProfileImageChange(event.target.files?.[0])}
      />

      {!isEditing ? (
        <article className="rounded-2xl border border-border-default bg-white p-4 shadow-page-input md:p-5">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <AvatarPreview
              profile={profile}
              isEditable={false}
              isUploading={false}
              onUploadClick={() => undefined}
            />
            <div>
              <h2 className="text-[28px] leading-8 font-bold tracking-[-0.0015em] text-page-heading">
                {fullName(profile)}
              </h2>
              <div className="mt-5 space-y-4 text-body-md text-page-heading">
                <p className="flex items-center gap-3">
                  <ProfileFieldIcon>
                    <PhoneIcon />
                  </ProfileFieldIcon>
                  {profile.phone || "No phone number added"}
                </p>
                <p className="flex items-center gap-3">
                  <ProfileFieldIcon>
                    <MailIcon />
                  </ProfileFieldIcon>
                  {profile.email}
                </p>
                <p className="flex items-center gap-3">
                  <ProfileFieldIcon>
                    <LocationIcon />
                  </ProfileFieldIcon>
                  {profile.cityName || "No city selected"}
                </p>
                <p className="flex items-center gap-3">
                  <ProfileFieldIcon>
                    <GlobeIcon />
                  </ProfileFieldIcon>
                  {profile.country || "No country selected"}
                </p>
              </div>
            </div>
          </div>
        </article>
      ) : (
        <div className="rounded-2xl bg-page-background">
          <div className="flex justify-center">
            <AvatarPreview
              profile={profile}
              isEditable
              isUploading={isUploading}
              onUploadClick={() => fileInputRef.current?.click()}
            />
          </div>

          <div className="mt-8 border-t border-border-default pt-8">
            <div className="grid gap-6 md:grid-cols-2">
              <ProfileFormField
                id="first-name"
                label="First Name"
                value={formValues.firstName}
                placeholder="First name"
                icon={
                  <ProfileFieldIcon>
                    <UserIcon />
                  </ProfileFieldIcon>
                }
                onChange={(event) =>
                  updateFormValue("firstName", event.target.value)
                }
              />
              <ProfileFormField
                id="last-name"
                label="Last Name"
                value={formValues.lastName}
                placeholder="Last name"
                icon={
                  <ProfileFieldIcon>
                    <UserIcon />
                  </ProfileFieldIcon>
                }
                onChange={(event) =>
                  updateFormValue("lastName", event.target.value)
                }
              />
              <ProfileFormField
                id="phone"
                label="Phone"
                value={formValues.phone}
                placeholder="+387 62 111 111"
                icon={
                  <ProfileFieldIcon>
                    <PhoneIcon />
                  </ProfileFieldIcon>
                }
                onChange={(event) => updateFormValue("phone", event.target.value)}
              />
              <ProfileFormField
                id="email"
                label="Email"
                value={formValues.email}
                disabled
                icon={
                  <ProfileFieldIcon>
                    <MailIcon />
                  </ProfileFieldIcon>
                }
                onChange={() => undefined}
              />
              <ProfileFormField
                id="city"
                label="City"
                variant="select"
                value={formValues.cityId}
                icon={
                  <ProfileFieldIcon>
                    <LocationIcon />
                  </ProfileFieldIcon>
                }
                onChange={(event) => updateFormValue("cityId", event.target.value)}
              >
                <option value="">Select city</option>
                {selectedCountryCities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </ProfileFormField>
              <ProfileFormField
                id="country"
                label="Country"
                variant="select"
                value={formValues.country}
                icon={
                  <ProfileFieldIcon>
                    <GlobeIcon />
                  </ProfileFieldIcon>
                }
                onChange={(event) => handleCountryChange(event.target.value)}
              >
                <option value="">Select country</option>
                {countries.map((country) => (
                  <option key={country.country} value={country.country}>
                    {country.country}
                  </option>
                ))}
              </ProfileFormField>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-border-default pt-7 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => setIsDeactivateModalOpen(true)}
              className="text-left text-body-md font-semibold text-brand-red underline transition hover:text-brand-red/80"
            >
              Deactivate My Account
            </button>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                disabled={isSaving}
                onClick={cancelEdit}
                className="h-12 rounded-lg border border-brand-red px-6 text-body-md font-semibold text-brand-red transition enabled:cursor-pointer enabled:hover:bg-brand-red/5 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={() => void handleSave()}
                className="h-12 rounded-lg bg-brand-red px-6 text-body-md font-semibold text-white transition enabled:cursor-pointer enabled:hover:bg-brand-red/90 disabled:cursor-not-allowed disabled:bg-movie-details-border"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeactivateModalOpen ? (
        <DeactivateModal
          isSubmitting={isDeactivating}
          onCancel={() => setIsDeactivateModalOpen(false)}
          onConfirm={() => void handleDeactivateProfile()}
        />
      ) : null}
    </ProfileLayout>
  );
}
