import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="grow bg-page-background">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
