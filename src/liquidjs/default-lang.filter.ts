import {Liquid as l} from 'liquidjs'
/**
 * Inside the plugin function, `this` refers to the Liquid instance.
 *
 * @param Liquid: provides facilities to implement tags and filters.
 */
import {AppState} from "../index";
import {ITranslatableField} from "../models/general";

module.exports = function (Liquid: l) {
    // @ts-ignore
    this.registerFilter('defaultLang', (obj: ITranslatableField) => {
        return obj[AppState.defaultLanguageCode];
    });
}
