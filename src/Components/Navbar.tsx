
import {
    Navbar as FlowbiteNavbar,
    NavbarBrand,
    NavbarCollapse,
    NavbarLink,
    NavbarToggle,
} from "flowbite-react";
import { Link, useLocation } from "react-router-dom";

const routerLinkProps = (to: string) => ({ to } as { to: string });

export function Navbar() {
    const { pathname } = useLocation();

    return (
        <FlowbiteNavbar fluid rounded>
            <NavbarBrand as={Link} {...routerLinkProps("/")}>
                <img src="/favicon.svg" className="mr-3 h-6 sm:h-9" alt="Social App logo" />
                <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Social App</span>
            </NavbarBrand>
            <div className="flex md:order-2">
                <NavbarToggle />
            </div>
            <NavbarCollapse className="ms-5">
                <NavbarLink as={Link} {...routerLinkProps("/")} active={pathname === "/"}>
                    Register
                </NavbarLink>
                <NavbarLink as={Link} {...routerLinkProps("/login")} active={pathname === "/login"}>
                    Login
                </NavbarLink>
                <NavbarLink as={Link} {...routerLinkProps("/profile")} active={pathname === "/profile"}>
                    Profile
                </NavbarLink>
            </NavbarCollapse>
        </FlowbiteNavbar>
    );
}
