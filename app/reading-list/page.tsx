import NavBar from "@/components/ui/navbar"
import ProtectedRoute from "@/utils/protectedRoute"
export default function Page() {
    return (
        <ProtectedRoute>
            <div className="min-h-screen pb-10">
                <NavBar />
                <div className="max-w-full flex justify-center">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="mt-10 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl flex items-center">
                            My List
                        </h1>
                        <div className="mt-10 grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:max-w-none">
                            <p>It is empty </p>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
}