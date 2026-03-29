import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import SignInButton from "../ui/buttons/SignInButton";
import logo from "../../assets/logo.png";
import CloseIcon from "../ui/icons/CloseMenuIcon";
import MenuIcon from "../ui/icons/MenuIcon";

const navItems = [
  { label: "Currently Showing", href: "/currently-showing" },
  { label: "Upcoming Movies", href: "/upcoming" },
  { label: "Venues", href: "/venues" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getLinkClassName = ({ isActive }: { isActive: boolean }) => {
    const base =
      "py-2 text-center text-[16px] leading-[24px] tracking-[0.005em] text-white transition-all";
    const activeState =
      "font-semibold underline decoration-white decoration-1 underline-offset-[1px]";
    const inactiveState = "font-normal hover:text-white";

    return `${base} ${isActive ? activeState : inactiveState}`;
  };

  return (
    <header className="relative z-50 w-full border-b border-navbar-border bg-navbar-background">
      <div className="relative mx-auto flex h-20 max-w-360 items-center justify-between px-4 md:px-6 lg:px-23">
        <Link to="/" className="z-20 flex shrink-0 items-center">
          <img src={logo} alt="Cinebh Logo" className="h-8 w-auto" />
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-5 md:flex lg:gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={getLinkClassName}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="z-20 hidden shrink-0 items-center justify-end md:flex">
          <SignInButton />
        </div>

        <button
          className="z-20 p-2 text-white md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="animate-in slide-in-from-top-4 absolute top-20 left-0 z-40 flex w-full flex-col items-center gap-8 border-b border-navbar-border bg-navbar-background py-8 shadow-2xl fade-in duration-300 md:hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={getLinkClassName}
            >
              {item.label}
            </NavLink>
          ))}
          <div className="pt-4" onClick={() => setIsMobileMenuOpen(false)}>
            <SignInButton />
          </div>
        </div>
      )}
    </header>
  );
}
