import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import AboutUsPage from "@/pages/AboutUsPage";
import CurrentlyShowingPage from "@/pages/CurrentlyShowingPage";
import HomePage from "@/pages/HomePage";
import PricingPage from "@/pages/PricingPage";
import UpcomingMoviesPage from "@/pages/UpcomingMoviesPage";

const VenuesPage = () => <div>Venues</div>;

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />

          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/pricing" element={<PricingPage />} />

          <Route path="/currently-showing" element={<CurrentlyShowingPage />} />
          <Route path="/upcoming" element={<UpcomingMoviesPage />} />
          <Route path="/venues" element={<VenuesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
