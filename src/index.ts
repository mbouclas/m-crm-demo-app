import "reflect-metadata";
require('dotenv').config();
import './pre-start'; // Must be the first import
import axios from "axios";
axios.defaults.withCredentials = true;
import {RedisService} from "./services/redis.service";
export let RDS = new RedisService();
import {EventEmitter} from "events";
export let Event: EventEmitter = new EventEmitter();
export let Redis = RDS.client;
import app from '@server';
import logger from '@shared/Logger';
import {authWithMcrm} from "./auth/m-crm";
import {AppStateModel} from "./models/appState.model";
import {bootApp} from "./pre-start/boot-app";
import {AxiosInterceptors} from "./helpers/axios-interceptors";
import {EventLoaderService} from "./services/event-loader.service";
import path from "path";
export let AppState: AppStateModel;
export let Axios = axios;

(async () => {
    const eventLoaderService = new EventLoaderService();
    await eventLoaderService.loadFromDir(path.resolve(__dirname, 'events'));
    await eventLoaderService.loadFromDir(path.resolve(__dirname, 'modules/crm/events'));

    (new AxiosInterceptors());
})();


Event.on('pre-boot.done', async () => {
    // Start the server
    const port = Number(process.env.PORT || 3000);
    app.listen(port, async () => {
        logger.info('Express server started on port: ' + port);
        Event.emit('server.started', app);
    });
});


(async () => {
    await boot();
    Event.emit('pre-boot.done');
})();

export async function boot(bustCache = false) {
    try {
        await authWithMcrm(bustCache);
    }
    catch (e) {
        logger.err(e);
    }

    try {
        AppState = await bootApp();
    }
    catch (e) {
        // console.log(e);
    }
}

