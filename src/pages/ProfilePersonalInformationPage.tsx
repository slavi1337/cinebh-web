import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageStatusCard from "@/components/common/PageStatusCard";
import AvatarPreview from "@/components/profile/AvatarPreview";
import DeactivateModal from "@/components/profile/DeactivateModal";
import ProfileFieldIcon from "@/components/profile/ProfileFieldIcon";
import ProfileFormField from "@/components/profile/ProfileFormField";
import ProfileLayout from "@/components/profile/ProfileLayout";
import GlobeIcon from "@/components/ui/icons/GlobeIcon";
import LocationPinIcon from "@/components/ui/icons/LocationPinIcon";
import MailIcon from "@/components/ui/icons/MailIcon";
import PhoneIcon from "@/components/ui/icons/PhoneIcon";
import UserIcon from "@/components/ui/icons/UserIcon";
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
import { blankToNull } from "@/utils/stringUtils";

type ProfileFormState = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  country: string;
  cityId: string;
};

function fullName(profile: UserProfile) {
  const name = [profile.firstName, profile.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return name || profile.email;
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

  const displayName = fullName(profile);
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
              displayName={displayName}
              isEditable={false}
              isUploading={false}
              onUploadClick={() => undefined}
            />
            <div>
              <h2 className="text-[28px] leading-8 font-bold tracking-[-0.0015em] text-page-heading">
                {displayName}
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
                    <LocationPinIcon />
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
              displayName={displayName}
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
                    <LocationPinIcon />
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
