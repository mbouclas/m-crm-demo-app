import { Event} from "../../../index";
import {ViewEngine} from "@server";
import {CrmBootService} from "../services/boot.service";

let registered = false;

module.exports = () => {
    if (registered) {return;}
    Event.on('pre-boot.done', async () => {
        const crmBootResponse = await (new CrmBootService).boot();
        ViewEngine.options.globals = {...ViewEngine.options.globals, ...{
                businessCategoryTree: crmBootResponse.businessCategoryTree
            }};
    });

    registered = true;
}
