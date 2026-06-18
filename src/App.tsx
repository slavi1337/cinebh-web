import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import BookingIntentRedirect from "@/components/booking/BookingIntentRedirect";
import MainLayout from "@/components/layout/MainLayout";
import AboutUsPage from "@/pages/AboutUsPage";
import CheckoutSuccessPage from "@/pages/CheckoutSuccessPage";
import CurrentlyShowingPage from "@/pages/CurrentlyShowingPage";
import HomePage from "@/pages/HomePage";
import ProfileReservationsPage from "@/pages/ProfileReservationsPage";
import PricingPage from "@/pages/PricingPage";
import UpcomingMoviesPage from "@/pages/UpcomingMoviesPage";
import MovieDetailsPage from "@/pages/MovieDetailsPage";
import SeatSelectionPage from "@/pages/SeatSelectionPage";
import TicketConfirmationPage from "@/pages/TicketConfirmationPage";
import ScrollToTop from "@/components/layout/ScrollToTop";

const VenuesPage = () => <div>Venues</div>;

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <BookingIntentRedirect />
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />

            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/pricing" element={<PricingPage />} />

            <Route
              path="/currently-showing"
              element={<CurrentlyShowingPage />}
            />
            <Route path="/upcoming" element={<UpcomingMoviesPage />} />
            <Route path="/movies/:movieId" element={<MovieDetailsPage />} />
            <Route
              path="/movies/:movieId/seats"
              element={<SeatSelectionPage />}
            />
            <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
            <Route
              path="/tickets/confirmation"
              element={<TicketConfirmationPage />}
            />
            <Route
              path="/profile/reservations"
              element={<ProfileReservationsPage />}
            />
            <Route path="/venues" element={<VenuesPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
