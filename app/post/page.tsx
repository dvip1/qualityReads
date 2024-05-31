import NavBar from "@/components/ui/navbar";
import ProtectedRoute from "@/utils/protectedRoute";
const Post = async () => {
    return (
        <ProtectedRoute >
            <NavBar />
            <div className="min-h-screen flex md:justify-center items-center ">
                Post
            </div>
        </ProtectedRoute>
    )
}
export default Post;