import { Outlet } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import AuthDrawer from "@/components/auth/AuthDrawer";
import AppToast from "@/components/common/AppToast";
import Footer from "@/components/layout/Footer";

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <AuthDrawer />
      <AppToast />

      <main className="grow bg-page-background pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
