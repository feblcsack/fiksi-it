import { Home, Briefcase, DollarSign, User, Settings, HelpCircle, FileText } from "lucide-react";

export interface NavLink {
  href: string;
  label: string;
  icon?: any;
}

export interface NavDropdown {
  label: string;
  icon?: any;
  items: NavLink[];
}

export type NavItem = NavLink | NavDropdown;

export function isDropdown(item: NavItem): item is NavDropdown {
  return 'items' in item;
}

export const mainNavigation: NavItem[] = [
  {
    href: "/dashboard/homeMuc",
    label: "Home",
    icon: Home,
  },
  {
    href: "/dashboard/musisi",
    label: "Gigs",
    icon: Briefcase,
  },
  {
    label: "Resources",
    icon: FileText,
    items: [
      { href: "/dashboard/musisi/upload", label: "Upload" },
      { href: "/dashboard/user", label: "Live Gigs" },
      { href: "/resources/faq", label: "FAQ" },
    ],
  },
  {
    href: "/pricing",
    label: "Pricing",
    icon: DollarSign,
  },
];

export const userNavigation: NavLink[] = [
  {
    href: "/profile",
    label: "Profile",
    icon: User,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
  },
  {
    href: "/help",
    label: "Help",
    icon: HelpCircle,
  },
];

export const mobileNavigation: NavItem[] = [
  ...mainNavigation,
  {
    label: "Account",
    icon: User,
    items: userNavigation,
  },
];