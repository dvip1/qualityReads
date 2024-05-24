"use client";
import Image from "next/image"
import { useSession } from "next-auth/react"
import DefaultUserProfile from "@/public/user.png"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar } from "@nextui-org/react";

import { signOut } from "next-auth/react"
import { FaLeaf } from "react-icons/fa";

export default function NavBar() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }
    const handleSignOut = async () => {

        await signOut();
        console.log('Sign out');
    };

    const handleProfileClick = () => {
        router.push("/profile");
    }
    return (
        <Navbar className="bg-transparent ">
            <NavbarBrand>
                <FaLeaf />
                <p className="font-bold text-inherit pl-1"> QualityReads</p>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4 " justify="center">
                <NavbarItem>
                    <Link color="foreground" href="#">
                        Features
                    </Link>
                </NavbarItem>
                <NavbarItem isActive>
                    <Link href="#" aria-current="page" color="secondary">
                        Customers
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" href="#">
                        Integrations
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent as="div" justify="end">
                <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                        <Avatar
                            isBordered
                            as="button"
                            className="transition-transform"
                            color="secondary"
                            name="Jason Hughes"
                            size="sm"
                            src={session?.user?.image || DefaultUserProfile.src}
                        />
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Profile Actions" variant="flat" className="">
                        <DropdownItem key="profile" className="h-14 gap-2">
                            <p className="font-semibold">Signed in as</p>
                            <p className="font-semibold">{session?.user?.email}</p>
                        </DropdownItem>
                        <DropdownItem key="settings" onClick={handleProfileClick}>My Profile</DropdownItem>
                        <DropdownItem key="logout" color="danger" onClick={handleSignOut}>
                            Log Out
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </NavbarContent>
        </Navbar >
    )
}