"use client";
import { useSession } from "next-auth/react"
import DefaultUserProfile from "@/public/user.png"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenuItem, NavbarMenu, Link, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar } from "@nextui-org/react";
import { signOut } from "next-auth/react"
import { FaLeaf } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { FaSignOutAlt } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { FaBook } from "react-icons/fa";
import { Badge } from "@nextui-org/badge";
import fetchUserData from "@/utils/fetchUserData";
import { getNotificationCount } from "@/app/notification/service";
import { IoNotifications } from "react-icons/io5";

export default function NavBar() {
    const iconClass = "text-xl text-default-500 pointer-events-none flex-shrink-0"
    const router = useRouter();
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isActive, setIsActive] = useState(0);
    const [count, setCount] = useState(0);
    const handleSignOut = async () => {
        await signOut();
        console.log('Sign out');
    };
    const handleProfileClick = () => {
        router.push("/profile");
    }
    const handleListClick = () => {
        router.push("/reading-list")
    }
    const handleBellClick = () => {
        router.push("/notification")
    };
    useEffect(() => {
        console.log(`Current Path name: ${pathname}`);

        const temp = () => {
            if (pathname.startsWith("/genre")) return 1;
            else if (pathname === "/explore") return 2;
            else if (pathname === "/") return 0;
            else return 4;
        }
        setIsActive(temp());
    }, [pathname]);
    useEffect(() => {
        const handleData = async () => {
            const userData = await fetchUserData();
            const req = await getNotificationCount(userData._id.toString());
            setCount(req.data || 0);
        };
        handleData();
    }, []);

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
                    <Link color="foreground" href="/explore">
                        Explore
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
                        <div>
                            <Badge content={count} color="secondary" className="transition-transform">
                                <Avatar
                                    isBordered
                                    as="button"
                                    className="transition-transform"
                                    color="secondary"
                                    name="Jason Hughes"
                                    size="sm"
                                    src={session?.user?.image || DefaultUserProfile.src}
                                />
                            </Badge>
                        </div>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Profile Actions" variant="flat" className="">
                        <DropdownItem key="profile" className="h-14 gap-2" onClick={handleProfileClick}>
                            <p className="font-semibold">Signed in as</p>
                            <p className="font-semibold">{session?.user?.email}</p>
                        </DropdownItem>
                        <DropdownItem key="notification"
                            onClick={handleBellClick}
                            startContent={<IoNotifications className={iconClass} />}
                        >
                            Notifications
                        </DropdownItem>
                        <DropdownItem key="my-list"
                            onClick={handleListClick}
                            startContent={<FaBook className={iconClass} />}
                        >
                            My List
                        </DropdownItem>
                        <DropdownItem key="settings"
                            onClick={handleProfileClick}
                            startContent={<IoSettings className={iconClass} />}
                        >
                            Settings
                        </DropdownItem>
                        
                        <DropdownItem key="logout"
                            color="danger"
                            onClick={handleSignOut}
                            startContent={<FaSignOutAlt className={iconClass} />}
                        >
                            Log Out
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </NavbarContent>
            <NavbarMenu>
                <NavbarMenuItem >
                    <Link className="w-full" href="/" size="lg">
                        Home
                    </Link>
                </NavbarMenuItem>
                <NavbarMenuItem >
                    <Link className="w-full" href="/genre" size="lg">
                        Genre
                    </Link>
                </NavbarMenuItem>
                <NavbarMenuItem >
                    <Link className="w-full" href="/explore" size="lg">
                        Explore
                    </Link>
                </NavbarMenuItem>
                <NavbarMenuItem >
                    <Link className="w-full" href="/reading-list" size="lg">
                        My List
                    </Link>
                </NavbarMenuItem>
                <NavbarMenuItem >
                    <Link className="w-full" href="/profile" size="lg">
                        Profile
                    </Link>
                </NavbarMenuItem>
                <NavbarMenuItem >
                    <Link className="w-full" href="/notification" size="lg">
                        Notificaions
                    </Link>
                </NavbarMenuItem>
            </NavbarMenu>
        </Navbar >
    )
}