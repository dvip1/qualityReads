"use client";
import Image from "next/image"
import { useSession } from "next-auth/react"
import DefaultUserProfile from "@/public/user.png"
import { useEffect, useState } from "react";
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
    const [isActive, setIsActive] = useState(0);
    const handleSignOut = async () => {
        await signOut();
        console.log('Sign out');
    };
    const handleProfileClick = () => {
        router.push("/profile");
    }
    useEffect(() => {
        console.log(`Current Path name: ${pathname}`);

        const temp = () => {
            if (pathname.startsWith("/genre")) return 1;
            else if (pathname === "/reading-list") return 2;
            else return 0;
        }

        setIsActive(temp());
    }, [pathname]);
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
                <NavbarItem isActive={2 === isActive}>
                    <Link color="foreground" href="/reading-list">
                        My List
                    </Link>
                </NavbarItem>
                <NavbarItem isActive={0 === isActive} >
                    <Link href="/" aria-current="page" color="foreground" >
                        Home
                    </Link>
                </NavbarItem>
                <NavbarItem isActive={1 === isActive}>
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
                        Reading List
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