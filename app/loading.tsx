import { Progress } from "@nextui-org/progress";
export default function Loading() {
    return (
        <div className="flex items-center justify-center h-screen px-4">
            <Progress
                label="Loading..."
                size="lg"
                value={50}
                className="max-w-lg"
            />
        </div>
    )
}