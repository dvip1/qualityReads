"use client"
import LandingPage from '@/components/pages/landing-page';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ReactNode, useEffect, useState } from 'react';
import { Progress } from "@nextui-org/progress";

export default function Login() {
    const [progress, setProgress] = useState<number>(0);
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "loading") {
            setProgress(status.length * 6);
        } else {
            setProgress(100); // Set the progress bar to 100% when not in the loading state
        }

        if (status !== 'loading' && session) {
            router.push('/');
        }
    }, [status, session, router]);

    if (status !== 'loading' && !session) {
        return <LandingPage />;
    }

    return (
        <div className="flex items-center justify-center h-screen px-4">
            <Progress
                label="Loading..."
                size="lg"
                value={progress || 0}
                showValueLabel={true}
                className="max-w-lg"
            />
        </div>
    );
};