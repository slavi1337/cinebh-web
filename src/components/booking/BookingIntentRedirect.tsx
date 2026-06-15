import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  clearBookingIntent,
  readBookingIntent,
} from "@/utils/bookingIntent";

export default function BookingIntentRedirect() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const intent = readBookingIntent();

    if (!intent) {
      return;
    }

    const targetPath = `/movies/${intent.movieId}/seats`;
    const targetSearch = `?projectionId=${intent.projectionId}&mode=${intent.mode}`;

    clearBookingIntent();

    if (location.pathname === targetPath && location.search === targetSearch) {
      return;
    }

    navigate(`${targetPath}${targetSearch}`);
  }, [currentUser, location.pathname, location.search, navigate]);

  return null;
}
