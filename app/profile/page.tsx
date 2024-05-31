import { auth } from "@/auth";
import ProtectedRoute from "@/utils/protectedRoute"
import clientPromise from '@/lib/db'
import { Avatar, AvatarGroup, AvatarIcon } from "@nextui-org/avatar";
import Loading from "@/app/loading";
import { ObjectId } from 'mongodb';
import NavBar from "@/components/ui/navbar";
interface ProfileHeaderType {
    url: string
}


export interface UserTypes {
    _id: ObjectId;
    name: string;
    email: string;
    image: string;
    emailVerified: Date | null;
}
async function getData(email: string | undefined | null) {
    try {
        if (!email) return null;
        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection('users');
        const user = await collection.findOne({ email: email }) as UserTypes;
        return user;
    } catch (err) {
        console.error('Error:', err)
    }
}
const Profile = async () => {
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!session) return <Loading />;

    try {
        const res = await getData(userEmail);
        console.log(res);
        return (
            <ProtectedRoute>
                <div className="min-h-screen ">
                    <NavBar />
                    <div>
                        {session?.user?.image && <ProfileHeader url={session?.user?.image} />}
                    </div>
                    <div className="flex flex-col items-center  bg-red-500">
                        <h2>Info</h2>
                        <p>Signed in with Google</p>
                        <p>{res?.name}</p>
                        <p>{res?.email}</p>
                    </div>
                </div>
            </ProtectedRoute>
        );
    } catch (err) {
        console.error('Error:', err);
        return <div>Error fetching data</div>;
    }
};
const ProfileHeader: React.FC<ProfileHeaderType> = (props) => {
    return (
        <>
            <div className=" flex justify-center items-center md:pt-10 md:mb-6 pt-4 mb-2">

                <Avatar isBordered showFallback name="CN" color="default" src={props.url} size="lg" />
            </div>
        </>
    )
}

export default Profile;