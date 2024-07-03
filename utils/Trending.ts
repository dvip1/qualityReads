import { Redis } from "ioredis";
class Trending {
    private client: Redis
    private rateHourly: number
    private rateDaily: number

    constructor(client: Redis) {
        this.client = client;
        this.rateHourly = Math.log(2) / 3.6e6; // Decay by half every hour
        this.rateDaily = Math.log(2) / 86400000; // Decay by half every day
    };

    public async addNewPost(id: string, creationTime: Date): Promise<void> {
        try {
            const initialScore = await this._updateScoreForTimeSpan("trending_daily", id);
            await this.client.zadd('trending_daily', initialScore.toString(), id);
        } catch (error) {
            console.error(`Something wrong in addNewPost ${error}`);
        }
    };


    public async updatePostScore(key: string, id: string): Promise<void> {
        try {
            const newScore = await this._updateScoreForTimeSpan(key, id);
            console.log('here', newScore);
            await this.client.zadd(key, newScore.toString(), id);
            console.log('here as well')
        } catch (error) {
            console.error(`Something occured while updating the scores ${error}`);
        }

    };
    public async updateTag(tags: string[]): Promise<void> {
        try {
            console.log(`We are in here! ${JSON.stringify(tags)}`);
            for (const tag of tags) {
                const newScore = await this._updateScoreForTimeSpan('tags', tag);
                console.log(newScore, tag);
                await this.client.zadd('tags', newScore.toString(), tag);
            }
        } catch (error) {
            console.error(`Something went wrong in updateTag: ${error}`);
        }
    }
    private async _updateScoreForTimeSpan(key: string, id: string, timeSpan: 'hourly' | 'daily' = 'daily'): Promise<Number> {
        const currentScore = parseFloat(await this.client.zscore(key, id) || '1');
        console.log("I'm in update static", currentScore, id)
        const u = Math.max(currentScore, new Date().getTime() * this.rateDaily);
        const v = Math.min(currentScore, new Date().getTime() * this.rateDaily);
        const newScore = u + Math.log1p(Math.exp(v - u));
        console.log('newScore', newScore, id);
        return newScore;
    };

    public async getTrendingItems(timeSpan: 'hourly' | 'daily' = 'daily', n: number = 10): Promise<Array<string | number>> {
        const key = timeSpan === 'hourly' ? 'trending_hourly' : 'trending_daily';
        return await this.client.zrange(key, '-' + n, -1, 'REV', 'WITHSCORES');
    }

}
export default Trending;