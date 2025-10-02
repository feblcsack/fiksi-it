import { NavLink } from "../atoms/NavLink";

export function NavLinks() {
  return (
    <nav className="flex items-center gap-8">
      <NavLink href="/home">Home</NavLink>
      <NavLink href="/profile">Profile</NavLink>
      <NavLink href="/pricing">Pricing</NavLink>
    </nav>
  );
}
