import MainCards from "@/components/ui/main-cards"
import PostComponent from "@/components/posts/postComponent"
export default function MainBody() {
    return (
        <div className="flex flex-col items-center w-full ">
            <div className=" max-w-2xl h-screen xl:px-6 px-4 my-2 ">
                <PostComponent />
                <MainCards />
            </div>
        </div>
    )
}