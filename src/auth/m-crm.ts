export let UserAuth: IOauthToken = {} as IOauthToken;
const querystring = require('querystring');
import {IOauthToken} from "../models/auth";
import {Axios, Event} from '../index';
import {Cache} from '../services/cache.service'
import moment from "moment";

export async function authWithMcrm(bustCache = false) {
    const cache = new Cache();
    const cacheKey = `auth-${process.env.CLIENT_ID}`;

    if (!bustCache && await cache.exists(cacheKey)) {
        UserAuth = await cache.get(cacheKey);
        Event.emit('boot.m-crm.auth.done', UserAuth);
        return;
    }

    // Connect to mcrm
    const base64 = Buffer.from(`${process.env.MCRM_CLIENT_ID}:${process.env.MCRM_CLIENT_SECRET}`).toString('base64');
    try {
        const res = await Axios.post(`${process.env.MCRM_HOST}oauth/token`, querystring.stringify({
            grant_type: 'client_credentials'
        }), {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Access-Control-Allow-Origin': '*',
                Authorization: `Basic ${base64}`,
                client_id: process.env.MCRM_CLIENT_ID
            }
        });

        UserAuth = res.data;
        UserAuth.cookie = res.headers['set-cookie'];

        await cache.put(cacheKey, UserAuth, Math.trunc(calculateExpiry(UserAuth.accessTokenExpiresAt as Date).asSeconds()));

        // Lets cache it
        Event.emit('boot.m-crm.auth.done', UserAuth);
    }
    catch (e) {
        console.log('----------',e.message,'------------')
    }

}


export function calculateExpiry(expiryDate: Date) {
    const end = moment(expiryDate);
    const startTime = moment();
    return  moment.duration(end.diff(startTime));
}
