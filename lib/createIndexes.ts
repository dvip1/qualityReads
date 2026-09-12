import { getMongoClient } from './db';

async function createOptimizedIndexes() {
    try {
        const client = await getMongoClient();
        const db = client.db();

        // Create compound index for tags and category
        await db.collection('posts').createIndex(
            {
                tags: 1,
                category: 1
            },
            {
                name: 'tags_category_index',
            }
        );

        // Create compound index for user_id and created_at
        await db.collection('posts').createIndex(
            {
                user_id: 1,
                created_at: -1
            },
            {
                name: 'user_created_at_index',
            }
        );

        // Create index for likes
        await db.collection('posts').createIndex(
            {
                likes: -1
            },
            {
                name: 'likes_index',
            }
        );

        // Create index for dislikes
        await db.collection('posts').createIndex(
            {
                dislikes: 1
            },
            {
                name: 'dislikes_index',
            }
        );

        console.log('Optimized indexes created successfully.');
    } catch (error) {
        console.error('Error creating indexes:', error);
    }
}

export { createOptimizedIndexes };
