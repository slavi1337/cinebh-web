import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getSeatSelectionPath } from "@/constants/routes";
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

    const targetLocation = getSeatSelectionPath(
      intent.movieId,
      intent.projectionId,
      intent.mode,
    );

    clearBookingIntent();

    if (`${location.pathname}${location.search}` === targetLocation) {
      return;
    }

    navigate(targetLocation);
  }, [currentUser, location.pathname, location.search, navigate]);

  return null;
}
