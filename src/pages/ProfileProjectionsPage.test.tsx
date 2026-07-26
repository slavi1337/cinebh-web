import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProfileProjectionsPage from "@/pages/ProfileProjectionsPage";
import { getUserProjections } from "@/services/profileService";

vi.mock("@/components/profile/ProfileLayout", () => ({
  default: ({ children }: PropsWithChildren) => <div>{children}</div>,
}));

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    currentUser: { id: "user-1" },
    openSignIn: vi.fn(),
  }),
}));

vi.mock("@/services/profileService", () => ({
  getUserProjections: vi.fn(),
}));

const getUserProjectionsMock = vi.mocked(getUserProjections);

describe("ProfileProjectionsPage", () => {
  beforeEach(() => {
    getUserProjectionsMock.mockReset();
    getUserProjectionsMock.mockResolvedValue([]);
  });

  it("loads the active tab first and fetches the other tab lazily once", async () => {
    render(<ProfileProjectionsPage />);

    await waitFor(() => {
      expect(getUserProjectionsMock).toHaveBeenCalledTimes(1);
      expect(getUserProjectionsMock).toHaveBeenCalledWith("upcoming");
    });

    expect(screen.getByRole("button", { name: "Past" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Past" }));

    await waitFor(() => {
      expect(getUserProjectionsMock).toHaveBeenCalledTimes(2);
      expect(getUserProjectionsMock).toHaveBeenLastCalledWith("past");
    });

    fireEvent.click(screen.getByRole("button", { name: "Upcoming (0)" }));
    fireEvent.click(screen.getByRole("button", { name: "Past (0)" }));

    expect(getUserProjectionsMock).toHaveBeenCalledTimes(2);
  });
});
