"use client";
import Image from "next/image"
import { useSession } from "next-auth/react"
import DefaultUserProfile from "@/public/user.png"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem } from "@nextui-org/dropdown";
import { signOut } from "next-auth/react"
import { FaLeaf } from "react-icons/fa";
import { Avatar, AvatarGroup, AvatarIcon } from "@nextui-org/avatar";
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
        <nav className="bg-transparent border-gray-200 sticky top-0 w-full  ">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <span className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer">
                    <span className="self-center text-2xl font-semibold whitespace-nowrap flex">
                        <FaLeaf />  <span className="ml-1">QualityReads</span>
                    </span>
                </span>
                <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse ">
                    <Dropdown>
                        <DropdownTrigger >
                            <Avatar className="cursor-pointer" src={session?.user?.image || DefaultUserProfile.src} />
                        </DropdownTrigger>
                        <DropdownMenu variant="faded" aria-label="Static Actions">
                            <DropdownItem key="profile" onClick={handleProfileClick}>Profile</DropdownItem>
                            <DropdownItem key="sign out" onClick={handleSignOut}>Sign out</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <button
                        onClick={toggleMenu}
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        aria-controls="navbar-user"
                        aria-expanded="false"
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                </div>
                <div className={`items-center justify-center ${isMenuOpen ? 'flex' : 'hidden'} w-full md:flex md:w-auto md:order-1`} id="navbar-user">
                    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4  rounded-lg  md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0    ">
                        <li>
                            <a href="#" className="block py-2 px-3  hover:bg-gray-100 md:hover:bg-transparent md:hover:text-slate-700 rounded md:bg-transparent md:text-slate-700 md:p-0 " >Home</a>
                        </li>
                        <li>
                            <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-slate-700 md:p-0 ">About</a>
                        </li>
                        <li>
                            <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-slate-700 md:p-0">Services</a>
                        </li>
                        <li>
                            <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-slate-700 md:p-0" >Pricing</a>
                        </li>
                        <li>
                            <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-slate-700 md:p-0">Contact</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}