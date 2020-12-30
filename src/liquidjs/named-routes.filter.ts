import {Liquid as l} from "liquidjs";
import {IGenericObject} from "../models/general";

import {NamedRoutes} from "../helpers/named-routes";

module.exports = function (Liquid: l) {
    // @ts-ignore
    this.registerFilter('url', (name: string, ...params?: IGenericObject) => {
        if (!params) {
            return NamedRoutes.url(name);
        }

        if (Array.isArray(params) && params.length === 1 && !Array.isArray(params[0])) {
            return NamedRoutes.url(name, params[0]);
        }

        const obj: IGenericObject = {};
        params.forEach((param: any) => {
            // Key/value pair
            if (Array.isArray(param) && param.length === 2) {
                obj[param[0]] = param[1];
            }
        });

        return NamedRoutes.url(name, obj);
    });
}
