import { Link } from "react-router-dom";
import logo from "@/assets/3amg-logo.png";

const FloatingLogo = () => {
  return (
    <Link
      to="/"
      className="fixed left-6 top-1/2 -translate-y-1/2 z-30 hidden md:block cursor-pointer group"
      aria-label="3AMG - Ir para Home"
    >
      <img
        src={logo}
        alt="3AMG Logo"
        className="w-[100px] lg:w-[110px] opacity-90 drop-shadow-[0_0_15px_rgba(139,92,246,0.4)] transition-all duration-300 ease-out group-hover:scale-105 group-hover:opacity-100 group-hover:drop-shadow-[0_0_25px_rgba(139,92,246,0.6)] animate-float-logo"
      />
    </Link>
  );
};

export default FloatingLogo;
