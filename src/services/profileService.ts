import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import api from "@/services/api";
import type {
  ChangePasswordRequest,
  ProfileLocationOptions,
  ProjectionHistoryStatus,
  UpdateUserProfileRequest,
  UserProfile,
  UserProjection,
} from "@/types/profile";

export async function getUserProfile(): Promise<UserProfile> {
  const response = await api.get<UserProfile>(API_ENDPOINTS.users.profile);
  return response.data;
}

export async function getProfileLocationOptions(): Promise<ProfileLocationOptions> {
  const response = await api.get<ProfileLocationOptions>(
    API_ENDPOINTS.users.profileOptions,
  );
  return response.data;
}

export async function updateUserProfile(
  request: UpdateUserProfileRequest,
): Promise<UserProfile> {
  const response = await api.put<UserProfile>(
    API_ENDPOINTS.users.profile,
    request,
  );
  return response.data;
}

export async function uploadUserProfileImage(file: File): Promise<UserProfile> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<UserProfile>(
    API_ENDPOINTS.users.profileImage,
    formData,
  );
  return response.data;
}

export async function changeUserPassword(
  request: ChangePasswordRequest,
): Promise<void> {
  await api.put(API_ENDPOINTS.users.password, request);
}

export async function getUserProjections(
  status: ProjectionHistoryStatus,
): Promise<UserProjection[]> {
  const response = await api.get<UserProjection[]>(API_ENDPOINTS.users.projections, {
    params: { status },
  });
  return response.data;
}

export async function deactivateUserProfile(): Promise<void> {
  await api.delete(API_ENDPOINTS.users.profile);
}
