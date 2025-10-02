import PillNav from "../components/PilNav";
import logo from "/iron.webp";

export default function Navbar() {
  return (
    <PillNav
      logo="/iron.webp"
      logoAlt="Company Logo"
      items={[
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Services", href: "/services" },
        { label: "Contact", href: "/contact" },
      ]}
      activeHref="/"
      className="custom-nav"
      baseColor="#E5E5E5" // abu terang
      pillColor="#D4A373" // coklat hangat
      hoveredPillTextColor="#000000" // teks hover hitam
      pillTextColor="#000000"
    />
  );
}
