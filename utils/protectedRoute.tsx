"use client"
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ReactNode, useEffect, useState } from 'react';
import { Progress } from "@nextui-org/progress";

interface ProtectedChildProps {
    children: ReactNode
};
const ProtectedRoute: React.FC<ProtectedChildProps> = ({ children }) => {
    const [progress, setProgress] = useState<number>(0);
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "loading") {
            setProgress(status.length * 6);
        } else {
            setProgress(100); // Set the progress bar to 100% when not in the loading state
        }

        if (status !== 'loading' && !session) {
            router.push('/login');
        }
    }, [status, session, router]);

    if (session)
        return children;

    return (
        <div className="flex items-center justify-center h-screen px-4">
            <Progress
                label="Loading..."
                size="lg"
                value={progress || 0}
                className="max-w-lg"
            />
        </div>
    );

};

export default ProtectedRoute;