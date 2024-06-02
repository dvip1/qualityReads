"use client";
import Image from "next/image"
import { useSession } from "next-auth/react"
import DefaultUserProfile from "@/public/user.png"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenuItem, NavbarMenu, Link, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar } from "@nextui-org/react";
import { signOut } from "next-auth/react"
import { FaLeaf } from "react-icons/fa";
import { usePathname } from "next/navigation";
export default function NavBar() {
    const router = useRouter();
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleSignOut = async () => {
        await signOut();
        console.log('Sign out');
    };
    console.log(`Current Path name: ${pathname}`);
    const handleProfileClick = () => {
        router.push("/profile");
    }
    return (
        <Navbar onMenuOpenChange={setIsMenuOpen}>
            <NavbarContent className="sm:hidden" justify="start">
                <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
            </NavbarContent>
            <NavbarBrand>
                <FaLeaf />
                <Link href="/">
                    <p className="font-bold text-inherit pl-1 dark:text-white text-black"> QualityReads</p>
                </Link>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4 " justify="center">
                <NavbarItem>
                    <Link color="foreground" href="#">
                        Features
                    </Link>
                </NavbarItem>
                <NavbarItem isActive>
                    <Link href="/" aria-current="page" color="secondary">
                        Home
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" href="/genre">
                        Genre
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
                        <DropdownItem key="profile" className="h-14 gap-2" onClick={handleProfileClick}>
                            <p className="font-semibold">Signed in as</p>
                            <p className="font-semibold">{session?.user?.email}</p>
                        </DropdownItem>
                        <DropdownItem key="logout" color="danger" onClick={handleSignOut}>
                            Log Out
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </NavbarContent>
            <NavbarMenu>
                <NavbarMenuItem >
                    <Link className="w-full" href="#" size="lg">
                        Home
                    </Link>
                </NavbarMenuItem>
                <NavbarMenuItem >
                    <Link className="w-full" href="#" size="lg">
                        Trending
                    </Link>
                </NavbarMenuItem>
                <NavbarMenuItem >
                    <Link className="w-full" href="#" size="lg">
                        About
                    </Link>
                </NavbarMenuItem>
            </NavbarMenu>
        </Navbar >
    )
}