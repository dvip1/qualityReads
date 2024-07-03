import ProtectedRoute from "@/utils/protectedRoute"
import NavBar from "@/components/ui/navbar"
import { MdOutlineTravelExplore } from "react-icons/md";
import SearchBar from "@/components/ui/search-bar";
import { FaArrowTrendUp } from "react-icons/fa6";

export default function Page() {
    return (
        <>
            <ProtectedRoute>
                <div className="flex flex-col items-center w-full min-h-screen pb-10">

                    <NavBar />
                    <div className="max-w-full flex justify-center">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h1 className="mt-6 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl flex items-center">
                                <MdOutlineTravelExplore className="mr-2" /> Explore
                            </h1>

                            <div className="xl:max-w-none">
                                <div className="p-6">
                                    <div className="bg-gray-100/80 dark:bg-[#393646] rounded-2xl shadow-lg p-4">
                                        <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-200">
                                            Today's Trending Hashtags
                                        </h2>
                                        <div className="bg-white/70 dark:bg-[#4F4557] rounded-xl p-3">
                                            <div className="flex flex-wrap gap-2">
                                                {['TechNews', 'AI', 'Sustainability', 'HealthCare', 'Finance'].map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-blue-100/80 dark:bg-[#6D5D6E] text-blue-800 dark:text-[#F4EEE0] rounded-full text-sm font-medium backdrop-blur-sm"
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <h2 className="flex items-center mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                                    Trending <FaArrowTrendUp className="ml-2" />
                                </h2>
                                {/* {mainData?.map((data, index) => (
                                    <SmallCards
                                        key={index}
                                        _id={data.postId}
                                        url={data.url}
                                        title={data.title}
                                        tags={data.tags}
                                        likes={data.likes}
                                        dislikes={data.dislikes}
                                        content={data.content}
                                        name={data.user.name}
                                        image={data.user.image}
                                        userLiked={data.userLiked}
                                        userDisliked={data.userDisliked}
                                        isPostInList={data.isPostInList}
                                    />
                                ))} */}
                            </div>
                        </div>
                    </div>
                </div>

            </ProtectedRoute>
        </>
    )
}