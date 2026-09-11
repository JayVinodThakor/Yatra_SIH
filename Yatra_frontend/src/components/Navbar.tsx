import { useEffect, useState, type MouseEvent } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, UserRound, X } from "lucide-react";

const links = [
  { name: "Home", to: "/" },
  { name: "Plan Journey", to: "/plan" },
  { name: "My Trips", to: "/saved" },
  { name: "Compare", to: "/compare" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const mouseX = useSpring(useMotionValue(0), {
    stiffness: 120,
    damping: 25,
  });

  const mouseY = useSpring(useMotionValue(0), {
    stiffness: 120,
    damping: 25,
  });

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <motion.header
      onMouseMove={handleMouseMove}
      animate={{
        y: scrolled ? 4 : 0,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="fixed inset-x-0 top-0 z-100 px-3 pt-3 md:px-5 md:pt-4"
    >
      <motion.div
        animate={{
          boxShadow: scrolled
            ? "0 14px 40px rgba(22,41,74,.14)"
            : "0 8px 28px rgba(22,41,74,.07)",
        }}
        className="relative mx-auto max-w-7xl overflow-hidden rounded-[20px] border border-[#16294a]/10 bg-[#fffdf7]/95 backdrop-blur-xl"
      >
        {/* Cursor glow */}
        <motion.div
          style={{ left: mouseX, top: mouseY }}
          className="pointer-events-none absolute h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3678a6]/10 blur-3xl"
        />

        <nav className="relative z-10 flex h-16.5 items-center justify-between px-3 sm:px-4 md:h-18 md:px-5">
          {/* Logo */}
          <Link to="/" className="shrink-0">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-10 items-center rounded-xl border border-[#16294a]/10 px-2.5 shadow-sm sm:h-11 sm:px-3"
            >
              <img
                src="/logo.jpeg"
                alt="YATRA"
                className="h-7 w-auto object-contain sm:h-8"
              />
            </motion.div>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center rounded-full border border-[#16294a]/10 bg-white/70 p-1 lg:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
              >
                {({ isActive }) => (
                  <motion.div
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.96 }}
                    className="relative px-4 py-2.5 xl:px-5"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-active"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                        className="absolute inset-0 rounded-full bg-[#16294a]"
                      />
                    )}

                    <span
                      className={`relative z-10 text-[12px] font-semibold tracking-wide ${
                        isActive
                          ? "text-white"
                          : "text-[#16294a]/55 hover:text-[#16294a]"
                      }`}
                    >
                      {link.name}
                    </span>

                    {isActive && (
                      <motion.span
                        layoutId="nav-dot"
                        className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#e49a32]"
                      />
                    )}
                  </motion.div>
                )}
              </NavLink>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden items-center gap-2 rounded-full border border-[#4d8b72]/15 bg-[#4d8b72]/5 px-3 py-2 xl:flex"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#4d8b72]" />
              <span className="text-[9px] font-semibold uppercase tracking-[.14em] text-[#16294a]/50">
                Journey ready
              </span>
            </motion.div> */}

            {/* <Link to="/profile">
              <motion.div
                whileHover={{ scale: 1.06, y: -1 }}
                whileTap={{ scale: 0.9 }}
                className="hidden h-10 w-10 items-center justify-center rounded-full border border-[#16294a]/10 bg-white shadow-sm md:flex"
              >
                <UserRound className="h-4.25 w-4.25 text-[#16294a]" />
              </motion.div>
            </Link> */}

            {/* Mobile menu */}
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#16294a]/10 bg-white lg:hidden"
              aria-label="Toggle navigation"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={menuOpen ? "close" : "menu"}
                  initial={{ opacity: 0, rotate: -90, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.7 }}
                >
                  {menuOpen ? (
                    <X className="h-5 w-5 text-[#16294a]" />
                  ) : (
                    <Menu className="h-5 w-5 text-[#16294a]" />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </nav>

        {/* Mobile navigation */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="border-t border-[#16294a]/10 bg-[#f7f5ef]"
            >
              <div className="space-y-1 p-3">
                {links.map((link, index) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <NavLink
                      to={link.to}
                      end={link.to === "/"}
                      onClick={() => setMenuOpen(false)}
                    >
                      {({ isActive }) => (
                        <motion.div
                          whileTap={{ scale: 0.97 }}
                          className={`flex items-center justify-between rounded-xl px-4 py-3.5 ${
                            isActive
                              ? "bg-[#16294a] text-white"
                              : "bg-white/60 text-[#16294a]/65"
                          }`}
                        >
                          <span className="text-sm font-semibold">
                            {link.name}
                          </span>

                          {isActive && (
                            <span className="h-2 w-2 rounded-full bg-[#e49a32]" />
                          )}
                        </motion.div>
                      )}
                    </NavLink>
                  </motion.div>
                ))}

                <NavLink
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                >
                  <motion.div
                    whileTap={{ scale: 0.97 }}
                    className="mt-2 flex items-center gap-3 rounded-xl border border-[#16294a]/10 bg-white px-4 py-3.5"
                  >
                    <UserRound className="h-4 w-4" />
                    <span className="text-sm font-semibold">
                      Profile
                    </span>
                  </motion.div>
                </NavLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.header>
  );
};

export default Navbar;