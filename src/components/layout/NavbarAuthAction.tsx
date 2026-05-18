import { useState } from "react";
import SignInButton from "@/components/ui/buttons/SignInButton";
import ChevronDownIcon from "@/components/ui/icons/ChevronDownIcon";
import { useAuth } from "@/context/AuthContext";

export default function NavbarAuthAction() {
  const { currentUser, openSignIn, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!currentUser) {
    return <SignInButton onClick={openSignIn} />;
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsMenuOpen((value) => !value)}
        className="flex h-12 items-center gap-1 rounded-lg border border-white px-5 py-3 text-body-md font-semibold text-white transition-colors hover:bg-white/10"
      >
        <span className="max-w-28 truncate">
          {currentUser.fullName || currentUser.email.split("@")[0]}
        </span>
        <ChevronDownIcon />
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 top-14 z-50 w-40 rounded-lg border border-border-default bg-white p-2 shadow-movie-card">
          <button
            type="button"
            onClick={() => {
              setIsMenuOpen(false);
              void logout();
            }}
            className="w-full rounded-md px-3 py-2 text-left text-body-md font-semibold text-page-heading hover:bg-page-background"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
