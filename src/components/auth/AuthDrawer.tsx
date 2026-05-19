import { useEffect, useState } from "react";
import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";
import VerificationCodeForm from "@/components/auth/VerificationCodeForm";
import { useAuth } from "@/context/AuthContext";

const DRAWER_ANIMATION_DURATION = 300;
const DRAWER_OPEN_DELAY = 50;

export default function AuthDrawer() {
  const { authDrawerMode, isAuthDrawerOpen, closeAuthDrawer } = useAuth();

  const [shouldRender, setShouldRender] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  useEffect(() => {
    let openTimeoutId: number | undefined;
    let closeTimeoutId: number | undefined;

    if (isAuthDrawerOpen) {
      setShouldRender(true);

      openTimeoutId = window.setTimeout(() => {
        setIsDrawerVisible(true);
      }, DRAWER_OPEN_DELAY);
    } else {
      setIsDrawerVisible(false);

      closeTimeoutId = window.setTimeout(() => {
        setShouldRender(false);
      }, DRAWER_ANIMATION_DURATION);
    }

    return () => {
      if (openTimeoutId) {
        window.clearTimeout(openTimeoutId);
      }

      if (closeTimeoutId) {
        window.clearTimeout(closeTimeoutId);
      }
    };
  }, [isAuthDrawerOpen]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={`fixed inset-x-0 bottom-0 top-20 z-[60] ${
        isDrawerVisible ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <button
        type="button"
        onClick={closeAuthDrawer}
        className={`absolute inset-0 cursor-pointer bg-auth-overlay transition-opacity duration-300 ${
          isDrawerVisible ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-[528px] flex-col bg-auth-background px-12 py-8 backdrop-blur-[15px] transition-transform duration-300 sm:px-14 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${isDrawerVisible ? "translate-x-0" : "translate-x-full"}`}
      >
        {authDrawerMode === "sign-in" && <SignInForm />}
        {authDrawerMode === "sign-up" && <SignUpForm />}
        {authDrawerMode === "verify" && <VerificationCodeForm />}
      </aside>
    </div>
  );
}
