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
};


function createRankingPipeline(): any[] {
    return [
        {
            $addFields: {
                t: {
                    $divide: [
                        { $subtract: ["$created_at", new Date("2005-12-08T00:00:00Z")] },
                        1000 
                    ]
                },
                x: { $subtract: ["$likes", "$dislikes"] }
            }
        },
        {
            $addFields: {
                y: {
                    $cond: {
                        if: { $gt: ["$x", 0] },
                        then: 1,
                        else: {
                            $cond: {
                                if: { $lt: ["$x", 0] },
                                then: -1,
                                else: 0
                            }
                        }
                    }
                },
                z: {
                    $cond: {
                        if: { $lt: ["$x", 1] },
                        then: 1,
                        else: "$x"
                    }
                }
            }
        },
        {
            $addFields: {
                rank: {
                    $add: [
                        { $log10: "$z" },
                        { $divide: [{ $multiply: ["$y", "$t"] }, 45000] }
                    ]
                }
            }
        },
        {
            $sort: { rank: -1 }
        }
    ];
}


export {
    createGivenPostPipeline,
    createRankingPipeline
}