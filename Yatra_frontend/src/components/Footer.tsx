import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#0b1224]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <NavLink to="/" className="shrink-0">
          <img
            src="/logo.jpeg"
            alt="YATRA"
            className="h-9 w-auto object-contain"
          />
        </NavLink>

        <p className="text-center text-xs text-white/45 md:text-right md:text-sm">
          Door-to-door multimodal travel planner
          <span className="mx-2 text-white/20">·</span>
          © 2026 YATRA
        </p>
      </div>
    </footer>
  );
};

export default Footer;