import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import PageStatusCard from "@/components/common/PageStatusCard";
import ProfileBookingDetails from "@/components/profile/ProfileBookingDetails";
import ProfileLayout from "@/components/profile/ProfileLayout";
import ProfileMoviePosterLink from "@/components/profile/ProfileMoviePosterLink";
import ProfileSeatDetails from "@/components/profile/ProfileSeatDetails";
import { useAuth } from "@/context/AuthContext";
import { getUserProjections } from "@/services/profileService";
import type { ProjectionHistoryStatus, UserProjection } from "@/types/profile";
import { getApiErrorMessage } from "@/utils/auth";

type ProjectionCardProps = {
  projection: UserProjection;
};

function ProjectionCard({ projection }: ProjectionCardProps) {
  return (
    <article className="rounded-2xl border border-border-default bg-white p-4 shadow-page-input md:p-5">
      <h2 className="text-[18px] leading-6 font-bold tracking-[-0.0015em] text-page-heading">
        {projection.movieTitle}
      </h2>

      <div className="mt-5 grid gap-5 lg:grid-cols-[116px_minmax(0,1.2fr)_minmax(220px,0.7fr)] lg:items-start">
        <ProfileMoviePosterLink
          movieId={projection.movieId}
          movieTitle={projection.movieTitle}
          posterImageUrl={projection.posterImageUrl}
        />
        <ProfileBookingDetails
          startTime={projection.projectionStartTime}
          venueName={projection.venueName}
          cityName={projection.cityName}
          pgRating={projection.pgRating}
          language={projection.language}
          durationMinutes={projection.durationMinutes}
        />
        <ProfileSeatDetails
          seats={projection.seats}
          hallName={projection.hallName}
          totalPrice={projection.totalPrice}
        />
      </div>
    </article>
  );
}

function ProjectionTabs({
  activeTab,
  upcomingCount,
  pastCount,
  onTabChange,
}: {
  activeTab: ProjectionHistoryStatus;
  upcomingCount: number | null;
  pastCount: number | null;
  onTabChange: (tab: ProjectionHistoryStatus) => void;
}) {
  const tabs: {
    id: ProjectionHistoryStatus;
    label: string;
    count: number | null;
  }[] = [
    { id: "upcoming", label: "Upcoming", count: upcomingCount },
    { id: "past", label: "Past", count: pastCount },
  ];

  return (
    <div className="border-b border-border-default">
      <div className="flex gap-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`border-b-2 pb-3 text-body-md font-semibold transition ${
              activeTab === tab.id
                ? "border-brand-red text-brand-red"
                : "border-transparent text-page-heading hover:text-brand-red"
            }`}
          >
            {tab.label}
            {tab.count === null ? "" : ` (${tab.count})`}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ProfileProjectionsPage() {
  const { currentUser, openSignIn } = useAuth();
  const [activeTab, setActiveTab] =
    useState<ProjectionHistoryStatus>("upcoming");
  const [upcomingProjections, setUpcomingProjections] = useState<
    UserProjection[]
  >([]);
  const [pastProjections, setPastProjections] = useState<UserProjection[]>([]);
  const [loadedTabs, setLoadedTabs] = useState<Set<ProjectionHistoryStatus>>(
    () => new Set(),
  );
  const [errorMessages, setErrorMessages] = useState<
    Record<ProjectionHistoryStatus, string>
  >({ upcoming: "", past: "" });
  const loadingTabsRef = useRef<Set<ProjectionHistoryStatus>>(new Set());

  const loadProjections = useCallback(async (status: ProjectionHistoryStatus) => {
    if (!currentUser) {
      setErrorMessages((currentMessages) => ({
        ...currentMessages,
        [status]: "Sign in to view your projections.",
      }));
      openSignIn();
      return;
    }

    if (loadedTabs.has(status) || loadingTabsRef.current.has(status)) {
      return;
    }

    try {
      loadingTabsRef.current.add(status);
      setErrorMessages((currentMessages) => ({
        ...currentMessages,
        [status]: "",
      }));
      const response = await getUserProjections(status);

      if (status === "upcoming") {
        setUpcomingProjections(response);
      } else {
        setPastProjections(response);
      }
      setLoadedTabs((currentTabs) => new Set(currentTabs).add(status));
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        openSignIn();
        setErrorMessages((currentMessages) => ({
          ...currentMessages,
          [status]: "Sign in to view your projections.",
        }));
        return;
      }

      setErrorMessages((currentMessages) => ({
        ...currentMessages,
        [status]: getApiErrorMessage(error),
      }));
    } finally {
      loadingTabsRef.current.delete(status);
    }
  }, [currentUser, loadedTabs, openSignIn]);

  useEffect(() => {
    void loadProjections(activeTab);
  }, [activeTab, loadProjections]);

  const activeProjections =
    activeTab === "upcoming" ? upcomingProjections : pastProjections;
  const isLoading = !loadedTabs.has(activeTab) && !errorMessages[activeTab];
  const errorMessage = errorMessages[activeTab];

  if (isLoading) {
    return (
      <ProfileLayout title="Projections">
        <PageStatusCard label="Loading projections..." />
      </ProfileLayout>
    );
  }

  if (errorMessage) {
    return (
      <ProfileLayout title="Projections">
        <PageStatusCard label={errorMessage} />
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout title="Projections">
      <ProjectionTabs
        activeTab={activeTab}
        upcomingCount={
          loadedTabs.has("upcoming") ? upcomingProjections.length : null
        }
        pastCount={loadedTabs.has("past") ? pastProjections.length : null}
        onTabChange={setActiveTab}
      />

      {activeProjections.length === 0 ? (
        <div className="mt-6">
          <PageStatusCard
            label={
              activeTab === "upcoming"
                ? "You do not have upcoming projections."
                : "You do not have past projections."
            }
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-5">
          {activeProjections.map((projection) => (
            <ProjectionCard key={projection.bookingId} projection={projection} />
          ))}
        </div>
      )}
    </ProfileLayout>
  );
}
