import {AppState, Event} from "../index";
import {ViewEngine} from "@server";
let registered = false;

module.exports = () => {
    if (registered) {return;}

    Event.on('pre-boot.done', () => {

        AppState.defaultLanguageCode = 'en';
        ViewEngine.options.globals = {...ViewEngine.options.globals, ...{
                AppState
            }};
    });

    registered = true;
}
