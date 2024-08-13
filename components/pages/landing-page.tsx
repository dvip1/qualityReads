"use client"
import { signIn } from 'next-auth/react'
import { Button, ButtonGroup } from "@nextui-org/button";
import Image from 'next/image';

export default function LandingPage() {
    const handleClick = async () => {
        console.log("Do something")
        await signIn('google', { callbackUrl: '/about' });
    }

    return (
        <>
            <div className="h-screen flex justify-center items-center ">
                <div className="flex-col">
                    <Image
                        src='./write.svg'
                        alt='write svg'
                        height={180}
                        width={120}
                    />
                    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                        Curated Websites
                    </h1>
                    <p className="leading-7 text-xl ">
                        Just for you..
                    </p>
                    <div className="buttons leading-7 [&:not(:first-child)]:mt-6 flex space-x-4" >
                        <Button onClick={handleClick} color='primary'>
                            Get Started
                        </Button>
                        <Button onClick={handleClick} color='primary' variant="ghost">
                            Login
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}