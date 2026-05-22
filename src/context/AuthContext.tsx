import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAuth,
  registerUser,
  verifyAccount,
} from "@/services/authService";
import type {
  AuthUser,
  LoginRequest,
  RegisterRequest,
  VerifyAccountRequest,
} from "@/types/auth";
import {
  clearAuthQueryParams,
  isAccountNotVerifiedError,
  isGoogleAuthSuccessRedirect,
  shouldPersistUserInLocalStorage,
} from "@/utils/auth";

type AuthDrawerMode = "sign-in" | "sign-up" | "verify";

type ToastState = {
  message: string;
  type: "success" | "error";
};

type AuthContextValue = {
  currentUser: AuthUser | null;
  authDrawerMode: AuthDrawerMode;
  isAuthDrawerOpen: boolean;
  verificationEmail: string;
  toast: ToastState | null;
  openSignIn: () => void;
  openSignUp: () => void;
  closeAuthDrawer: () => void;
  showToast: (message: string, type?: ToastState["type"]) => void;
  login: (request: LoginRequest) => Promise<void>;
  signup: (request: RegisterRequest) => Promise<void>;
  verify: (request: VerifyAccountRequest) => Promise<void>;
  resendVerificationCode: () => Promise<void>;
  logout: () => Promise<void>;
};

const AUTH_USER_KEY = "cinebh.auth.user";
const TOAST_DURATION_MS = 3500;

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredUser() {
  const sessionUser = sessionStorage.getItem(AUTH_USER_KEY);
  const localUser = localStorage.getItem(AUTH_USER_KEY);
  const storedUser = sessionUser ?? localUser;

  return storedUser ? (JSON.parse(storedUser) as AuthUser) : null;
}

function persistUser(user: AuthUser, rememberMe: boolean) {
  const value = JSON.stringify(user);

  sessionStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(AUTH_USER_KEY);

  if (rememberMe) {
    localStorage.setItem(AUTH_USER_KEY, value);
    return;
  }

  sessionStorage.setItem(AUTH_USER_KEY, value);
}

function clearStoredUser() {
  sessionStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() =>
    readStoredUser(),
  );
  const [isAuthDrawerOpen, setIsAuthDrawerOpen] = useState(false);
  const [authDrawerMode, setAuthDrawerMode] =
    useState<AuthDrawerMode>("sign-in");
  const [verificationEmail, setVerificationEmail] = useState("");
  const [pendingLogin, setPendingLogin] = useState<LoginRequest | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimeoutId = useRef<number | null>(null);

  async function loadAuthenticatedUser() {
    try {
      return await getCurrentUser();
    } catch {
      await refreshAuth();
      return getCurrentUser();
    }
  }

  function handleAuthenticatedUser(user: AuthUser, isGoogleSuccess: boolean) {
    persistUser(
      user,
      shouldPersistUserInLocalStorage(AUTH_USER_KEY, isGoogleSuccess),
    );
    setCurrentUser(user);

    if (isGoogleSuccess) {
      showToast("You have signed in with Google successfully.");
      clearAuthQueryParams();
    }
  }

  useEffect(() => {
    return () => {
      if (toastTimeoutId.current) {
        window.clearTimeout(toastTimeoutId.current);
      }
    };
  }, []);

  function showToast(message: string, type: ToastState["type"] = "success") {
    if (toastTimeoutId.current) {
      window.clearTimeout(toastTimeoutId.current);
    }

    setToast({ message, type });

    toastTimeoutId.current = window.setTimeout(() => {
      setToast(null);
      toastTimeoutId.current = null;
    }, TOAST_DURATION_MS);
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      currentUser,
      authDrawerMode,
      isAuthDrawerOpen,
      verificationEmail,
      toast,
      openSignIn: () => {
        setAuthDrawerMode("sign-in");
        setIsAuthDrawerOpen(true);
      },
      openSignUp: () => {
        setAuthDrawerMode("sign-up");
        setIsAuthDrawerOpen(true);
      },
      closeAuthDrawer: () => setIsAuthDrawerOpen(false),
      showToast,
      login: async (request) => {
        try {
          const user = await loginUser(request);

          persistUser(user, request.rememberMe);
          setCurrentUser(user);
          setIsAuthDrawerOpen(false);
          showToast("You have signed in successfully.");
        } catch (error) {
          if (isAccountNotVerifiedError(error)) {
            setPendingLogin(request);
            setVerificationEmail(request.email);
            setAuthDrawerMode("verify");
            showToast("Verification code has been sent to your email.");
            return;
          }

          throw error;
        }
      },
      signup: async (request) => {
        await registerUser(request);

        setPendingLogin({
          email: request.email,
          password: request.password,
          rememberMe: false,
        });
        setVerificationEmail(request.email);
        setAuthDrawerMode("verify");
        showToast("Account created. Verification code has been sent.");
      },
      verify: async (request) => {
        await verifyAccount(request);

        if (pendingLogin) {
          const user = await loginUser(pendingLogin);

          persistUser(user, pendingLogin.rememberMe);
          setCurrentUser(user);
        }

        setIsAuthDrawerOpen(false);
        showToast("Account verified successfully.");
      },
      resendVerificationCode: async () => {
        if (!pendingLogin) {
          return;
        }

        try {
          await loginUser(pendingLogin);
        } catch (error) {
          if (isAccountNotVerifiedError(error)) {
            showToast("Verification code has been resent.");
            return;
          }

          throw error;
        }
      },
      logout: async () => {
        try {
          await logoutUser();
        } finally {
          clearStoredUser();
          setCurrentUser(null);
          showToast("You have signed out successfully.");
        }
      },
    }),
    [
      authDrawerMode,
      currentUser,
      isAuthDrawerOpen,
      pendingLogin,
      toast,
      verificationEmail,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
