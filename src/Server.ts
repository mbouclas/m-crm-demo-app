import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';

import express, { NextFunction, Request, Response } from 'express';
import StatusCodes from 'http-status-codes';
import 'express-async-errors';
const compression = require('compression');
import logger from '@shared/Logger';
import session from "express-session";
import {AppState, Redis} from "./index";
import cors = require('cors');
import bodyParser from "body-parser";
import {useContainer, useExpressServer} from "routing-controllers";
import {Container} from "typedi";
import {Liquid} from "liquidjs";
import {readDirFiles} from "./helpers/readDirFiles";
import {NamedRoutes} from "./helpers/named-routes";
const RedisStore = require('connect-redis')(session);
const app = express();
const { BAD_REQUEST } = StatusCodes;



/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security
if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}
const tokenExpiry  = (process.env.OAUTH_TOKEN_EXPIRY) ? parseInt(process.env.OAUTH_TOKEN_EXPIRY) : 60*60*23;

const sess = session({
    store: new RedisStore({client: Redis, ttl: tokenExpiry}),
    saveUninitialized: false,
    secret: 'keyboard cat',
    cookie: {
        secure: false,
        maxAge: tokenExpiry * 1000, //Needs to be in milliseconds
        httpOnly: false,
    },
    name: 'app.sess.id',
    rolling: true,
    resave: true,
});
app.use(sess);
app.use(compression());

const corsConfig = {
    credentials: true,
    origin: true,
    exposedHeaders: ["set-cookie"],
};
app.use(cors(corsConfig));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
useContainer(Container);
const controllers = [ __dirname + "/controllers/**/*.*s",];

// Add APIs
useExpressServer(app, {
    // routePrefix: "/",
    controllers,
    defaults: {
        paramOptions: {
            required: false
        }
    }
});
// Print API errors
// eslint-disable-next-line @typescript-eslint/no-unused-vars
/*app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.err(err, true);
    return res.status(BAD_REQUEST).json({
        error: err.message,
    });
});*/



/************************************************************************************
 *                              Serve front-end content
 ***********************************************************************************/
const viewsDir = path.resolve(__dirname, 'views/');

export let ViewEngine = new Liquid({
    cache: process.env.NODE_ENV === 'production',
    root: viewsDir,
});
(async () => {
    const files = await readDirFiles(path.resolve(__dirname, 'liquidjs'), ['.js', '.ts']);
    files.forEach(file => {
        ViewEngine.plugin(require(file.fullFileName));
    });
})();


app.engine('liquid', ViewEngine.express());
app.set('view engine', 'liquid');
app.set('views', viewsDir);
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));


// Export express instance
export default app;
