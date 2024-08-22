import { Collection, ObjectId } from "mongodb";
import { createGivenPostPipeline, createRankingPipeline } from "./pipelineMethods";
async function getGivenPost(PostCollection: Collection, givenPostId: string) {
    const givenPost = await PostCollection.findOne({
        _id: new ObjectId(givenPostId),
    });
    if (!givenPost) {
        throw new Error(`Post Not Found`);
    }
    return givenPost;
};


function createDefaultPipeline(query: any): any[] {
    return [{ $match: query }];
}


function addCommonStages(pipeline: any[], UserData: any): any[] {
    const userIdObjectId = new ObjectId(UserData._id);

    return pipeline.concat([
        {
            $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "_id",
                as: "user_info",
            },
        },
        { $unwind: "$user_info" },
        {
            $addFields: {
                userLiked: {
                    $in: [
                        userIdObjectId,
                        {
                            $map: {
                                input: { $ifNull: ["$liked_by", []] },
                                as: "id",
                                in: { $convert: { input: "$$id", to: "objectId", onError: null, onNull: null } }
                            }
                        }
                    ]
                },
                userDisliked: {
                    $in: [
                        userIdObjectId,
                        {
                            $map: {
                                input: { $ifNull: ["$disliked_by", []] },
                                as: "id",
                                in: { $convert: { input: "$$id", to: "objectId", onError: null, onNull: null } }
                            }
                        }
                    ]
                },
                isPostInList: {
                    $in: [
                        "$_id",
                        {
                            $map: {
                                input: { $ifNull: [UserData.myList, []] },
                                as: "id",
                                in: { $convert: { input: "$$id", to: "objectId", onError: null, onNull: null } }
                            }
                        }
                    ]
                }
            }
        },
        {
            $project: {
                url: 1,
                title: 1,
                tags: 1,
                likes: 1,
                dislikes: 1,
                content: 1,
                postId: "$_id",
                user: { name: "$user_info.name", image: "$user_info.image" },
                userLiked: 1,
                userDisliked: 1,
                isPostInList: 1,
                userId: "$user_id",
            },
        },
    ]);
}
function addPaginationStages(pipeline: any[], filters: any): any[] {
    if (filters.postIdInArray && filters.postIdInArray.length > 0) {
        pipeline.push({ $sort: { _id: 1 } });
    } else {
        pipeline.push({ $skip: filters.limit * (filters.page - 1) });
        pipeline.push({ $limit: filters.limit });
    }
    return pipeline;
}

async function buildPipeline(filters: any, query: any, UserData: any, PostCollection: Collection): Promise<any[]> {
    let pipeline: any[] = [];
    if (filters.givenPostId) {
        const givenPost = await getGivenPost(PostCollection, filters.givenPostId);
        pipeline = createGivenPostPipeline(givenPost);
    }
    else if (filters.defaultRanking) {
        pipeline = createRankingPipeline();
    }
    else {
        pipeline = createDefaultPipeline(query);
    }

    pipeline = addCommonStages(pipeline, UserData);
    pipeline = addPaginationStages(pipeline, filters);

    return pipeline;
}

export {
    buildPipeline
}