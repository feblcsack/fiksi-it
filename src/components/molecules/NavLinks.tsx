import { NavLink } from "../atoms/NavLink";

export function NavLinks() {
  return (
    <nav className="flex items-center gap-8">
      <NavLink href="/dashboard/homeMuc">Home</NavLink>
      <NavLink href="/dashboard/musisi">Gigs</NavLink>
      <NavLink href="/pricing">Pricing</NavLink>
    </nav>
  );
}
