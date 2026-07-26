import { useState } from "react";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { getApiBaseUrl } from "@/constants/apiConfig";
import type { UserProfile } from "@/types/profile";

type AvatarPreviewProps = {
  profile: UserProfile;
  displayName: string;
  isEditable: boolean;
  isUploading: boolean;
  onUploadClick: () => void;
};

function profileImageSrc(profile: UserProfile) {
  if (!profile.profileImageUrl) {
    return null;
  }

  if (!profile.profileImageUrl.includes("/profile-images/")) {
    return profile.profileImageUrl;
  }

  const apiBaseUrl = getApiBaseUrl().replace(/\/$/, "");
  return `${apiBaseUrl}${API_ENDPOINTS.users.profileImage}?v=${encodeURIComponent(
    profile.profileImageUrl,
  )}`;
}

export default function AvatarPreview({
  profile,
  displayName,
  isEditable,
  isUploading,
  onUploadClick,
}: AvatarPreviewProps) {
  const imageSrc = profileImageSrc(profile);
  const [failedImageSrc, setFailedImageSrc] = useState<string | null>(null);
  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const shouldShowImage = imageSrc && failedImageSrc !== imageSrc;

  const content = shouldShowImage ? (
    <img
      src={imageSrc}
      alt={displayName}
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
