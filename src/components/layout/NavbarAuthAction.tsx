import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import SignInButton from "@/components/ui/buttons/SignInButton";
import ChevronDownIcon from "@/components/ui/icons/ChevronDownIcon";
import { useAuth } from "@/context/AuthContext";

type NavbarAuthActionProps = {
  onActionComplete?: () => void;
};

export default function NavbarAuthAction({
  onActionComplete,
}: NavbarAuthActionProps) {
  const { currentUser, openSignIn, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    function handleClickOutside(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  if (!currentUser) {
    return (
      <SignInButton
        onClick={() => {
          openSignIn();
          onActionComplete?.();
        }}
      />
    );
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setIsMenuOpen((value) => !value);
        }}
        className="flex h-12 cursor-pointer items-center gap-1 rounded-lg border border-white px-5 py-3 text-body-md font-semibold text-white transition-colors hover:bg-white/10"
      >
        <span className="max-w-28 truncate">
          {currentUser.fullName || currentUser.email?.split("@")[0]}
        </span>
        <ChevronDownIcon />
      </button>

      {isMenuOpen && (
        <div
          onClick={(event) => event.stopPropagation()}
          className="absolute right-0 top-14 z-[80] w-48 rounded-lg border border-border-default bg-white p-2 shadow-movie-card"
        >
          <Link
            to="/profile"
            onClick={() => {
              setIsMenuOpen(false);
              onActionComplete?.();
            }}
            className="block w-full rounded-md px-3 py-2 text-left text-body-md font-semibold text-page-heading hover:bg-page-background"
          >
            Profile
          </Link>
          <button
            type="button"
            onClick={() => {
              setIsMenuOpen(false);
              void logout();
              onActionComplete?.();
            }}
            className="w-full cursor-pointer rounded-md px-3 py-2 text-left text-body-md font-semibold text-page-heading hover:bg-page-background"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
