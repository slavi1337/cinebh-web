import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import BookingIntentRedirect from "@/components/booking/BookingIntentRedirect";
import MainLayout from "@/components/layout/MainLayout";
import AboutUsPage from "@/pages/AboutUsPage";
import CheckoutSuccessPage from "@/pages/CheckoutSuccessPage";
import CurrentlyShowingPage from "@/pages/CurrentlyShowingPage";
import HomePage from "@/pages/HomePage";
import ProfilePasswordPage from "@/pages/ProfilePasswordPage";
import ProfilePersonalInformationPage from "@/pages/ProfilePersonalInformationPage";
import ProfileProjectionsPage from "@/pages/ProfileProjectionsPage";
import ProfileReservationsPage from "@/pages/ProfileReservationsPage";
import PricingPage from "@/pages/PricingPage";
import UpcomingMoviesPage from "@/pages/UpcomingMoviesPage";
import MovieDetailsPage from "@/pages/MovieDetailsPage";
import SeatSelectionPage from "@/pages/SeatSelectionPage";
import TicketConfirmationPage from "@/pages/TicketConfirmationPage";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { ROUTE_PATHS } from "@/constants/routes";

const VenuesPage = () => <div>Venues</div>;

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <BookingIntentRedirect />
        <Routes>
          <Route element={<MainLayout />}>
            <Route path={ROUTE_PATHS.home} element={<HomePage />} />

            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/pricing" element={<PricingPage />} />

            <Route
              path={ROUTE_PATHS.currentlyShowing}
              element={<CurrentlyShowingPage />}
            />
            <Route path="/upcoming" element={<UpcomingMoviesPage />} />
            <Route
              path={ROUTE_PATHS.movieDetails}
              element={<MovieDetailsPage />}
            />
            <Route
              path={ROUTE_PATHS.seatSelection}
              element={<SeatSelectionPage />}
            />
            <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
            <Route
              path="/tickets/confirmation"
              element={<TicketConfirmationPage />}
            />
            <Route
              path="/profile"
              element={<Navigate to="/profile/personal-information" replace />}
            />
            <Route
              path="/profile/personal-information"
              element={<ProfilePersonalInformationPage />}
            />
            <Route path="/profile/password" element={<ProfilePasswordPage />} />
            <Route
              path="/profile/reservations"
              element={<ProfileReservationsPage />}
            />
            <Route
              path="/profile/projections"
              element={<ProfileProjectionsPage />}
            />
            <Route path="/venues" element={<VenuesPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
