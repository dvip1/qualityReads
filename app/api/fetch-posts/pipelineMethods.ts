import { ObjectId } from "mongodb";

function createGivenPostPipeline(givenPost: any): any[] {
    return [
        {
            $facet: {
                mainPost: [
                    { $match: { _id: new ObjectId(givenPost._id) } },
                    { $limit: 1 }
                ],
                relatedPosts: [
                    {
                        $match: {
                            user_id: givenPost.user_id,
                            _id: { $ne: new ObjectId(givenPost._id) }
                        }
                    },
                    { $limit: 5 }
                ]
            }
        },
        {
            $project: {
                allPosts: {
                    $concatArrays: ["$mainPost", "$relatedPosts"]
                }
            }
        },
        { $unwind: "$allPosts" },
        { $replaceRoot: { newRoot: "$allPosts" } }
    ];
}

export {
    createGivenPostPipeline
}