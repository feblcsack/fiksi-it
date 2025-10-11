"use client";

import { usePathname } from "next/navigation";
import { NavLinkItem } from "../atoms/NavLinkItem";
import { NavDropdown } from "./NavDropdown";
import { mainNavigation, isDropdown } from "@/lib/navigation/config";

export function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {mainNavigation.map((item, index) => {
        if (isDropdown(item)) {
          return (
            <NavDropdown
              key={index}
              label={item.label}
              items={item.items}
              icon={item.icon}
            />
          );
        }

        return (
          <NavLinkItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            active={pathname === item.href}
          >
            {item.label}
          </NavLinkItem>
        );
      })}
    </>
  );
}
