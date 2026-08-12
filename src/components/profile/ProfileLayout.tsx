import { NavLink } from "react-router-dom";
import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { getReservations } from "@/services/bookingService";
import ProfileLockIcon from "@/components/profile/ProfileLockIcon";

type ProfileLayoutProps = {
  title: string;
  reservationCount?: number;
  children: ReactNode;
  headerAction?: ReactNode;
};

type SidebarLinkProps = {
  to: string;
  label: string;
  icon: ReactNode;
};

function SidebarIcon({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-4 w-4 shrink-0 items-center justify-center text-current">
      {children}
    </span>
  );
}

function SidebarLink({ to, label, icon }: SidebarLinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 whitespace-nowrap text-body-md transition-colors hover:text-white ${
          isActive ? "font-semibold text-white underline" : "text-auth-text-muted"
        }`
      }
    >
      <SidebarIcon>{icon}</SidebarIcon>
      {label}
    </NavLink>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm5 6a5 5 0 0 0-10 0"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M8 4.5V8l2 1.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FilmIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 4h10v9H3V4Zm0 3h10M6 4v9m4-9v9"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SidebarSection({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-58 lg:min-w-0">
      <div className="mb-4 flex items-center gap-3 text-[12px] leading-4 text-auth-text-muted">
        <span>{label}</span>
        <span className="h-px flex-1 bg-navbar-border" />
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function ProfileSidebar({ reservationCount }: { reservationCount: number }) {
  return (
    <aside className="bg-navbar-background px-6 py-7 text-white lg:sticky lg:top-20 lg:h-[calc(100vh-80px)] lg:w-[240px] lg:shrink-0 lg:px-8">
      <h2 className="text-[24px] leading-8 font-bold tracking-[-0.0015em]">
        User Profile
      </h2>

      <nav className="mt-8 flex gap-6 overflow-x-auto pb-2 lg:block lg:space-y-7 lg:overflow-visible lg:pb-0">
        <SidebarSection label="General">
          <SidebarLink
            to="/profile/personal-information"
            label="Personal Information"
            icon={<UserIcon />}
          />
          <SidebarLink
            to="/profile/password"
            label="Password"
            icon={<ProfileLockIcon />}
          />
        </SidebarSection>

        <SidebarSection label="Movies">
          <SidebarLink
            to="/profile/reservations"
            label={`Pending Reservations (${reservationCount})`}
            icon={<ClockIcon />}
          />
          <SidebarLink to="/profile/projections" label="Projections" icon={<FilmIcon />} />
        </SidebarSection>
      </nav>
    </aside>
  );
}

export default function ProfileLayout({
  title,
  reservationCount,
  children,
  headerAction,
}: ProfileLayoutProps) {
  const { currentUser } = useAuth();
  const [loadedReservationCount, setLoadedReservationCount] = useState(0);
  const displayReservationCount = reservationCount ?? loadedReservationCount;

  useEffect(() => {
    if (reservationCount !== undefined || !currentUser) {
      return;
    }

    let isActive = true;

    async function loadReservationCount() {
      try {
        const reservations = await getReservations();

        if (isActive) {
          setLoadedReservationCount(reservations.length);
        }
      } catch {
        if (isActive) {
          setLoadedReservationCount(0);
        }
      }
    }

    void loadReservationCount();

    return () => {
      isActive = false;
    };
  }, [currentUser, reservationCount]);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-page-background">
      <div className="flex min-h-[calc(100vh-80px)] w-full flex-col lg:flex-row">
        <ProfileSidebar reservationCount={displayReservationCount} />
        <section className="min-w-0 flex-1 px-5 py-8 md:px-8 lg:px-8">
          <div className="mx-auto w-full max-w-[1120px]">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-[24px] leading-8 font-bold tracking-[-0.0015em] text-page-heading">
                {title}
              </h1>
              {headerAction}
            </div>
            {children}
          </div>
        </section>
      </div>
    </div>
  );
}
