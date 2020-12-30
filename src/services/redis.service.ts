import {Service} from "typedi";
const redisService = require('promise-redis')();
import {ClientOpts, RedisClient} from "redis";

@Service()
export class RedisService {
    public client: RedisClient;

    constructor() {
        const options: ClientOpts = {};

        if (typeof process.env.REDIS_URL !== 'undefined') {
            options.url = process.env.REDIS_URL;
        } else {
            options.host = process.env.REDIS_HOST;
            options.auth_pass = process.env.REDIS_AUTH;
            options.port = parseInt(process.env.REDIS_PORT as any);
        }


        this.client = redisService.createClient(options);
    }
}
