import ProtectedRoute from "@/utils/protectedRoute";
import NavBar from "@/components/ui/navbar";
export default function Page({ params }: { params: { slug: string } }) {
    return (
        <ProtectedRoute>
            <div className="min-h-screen">
                <NavBar />
                <div>My Post: {params.slug}</div>
            </div>
        </ProtectedRoute>
    )
}