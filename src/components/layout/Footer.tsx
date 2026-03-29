import { Link } from "react-router-dom";
import logo from "../../assets/logo_white.png";

export default function Footer() {
  return (
    <footer className="relative flex h-53 w-full flex-col items-center justify-center overflow-hidden bg-brand-red">
      <div
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{
          background:
            "linear-gradient(267.88deg, rgba(178, 34, 34, 0.8) 0%, rgba(26, 26, 26, 0.8) 100%)",
        }}
      />

      <div className="relative flex flex-col items-center gap-2.5 text-footer-text-light">
        <Link to="/">
          <img src={logo} alt="cinebh Logo" className="h-8 w-auto" />
        </Link>

        <div className="flex items-center gap-4 text-[12px] leading-4 tracking-[0.05em] uppercase pt-1">
          <Link to="/about" className="hover:underline font-semibold">
            About Us
          </Link>
          <span aria-hidden="true" className="h-4 w-px bg-footer-text-light" />
          <Link to="/pricing" className="hover:underline font-semibold">
            Tickets
          </Link>
        </div>

        <p className="px-4 pt-2 text-center text-[14px] leading-5 font-normal">
          Copyright @cinebh. Built with love in Sarajevo. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
