import {Controller, Get, Param} from "routing-controllers";
import {ViewEngine} from "@server";
import {NamedRoute} from "../helpers/named-routes";



@Controller('/')
export class HomeController {

    @Get('/')
    @NamedRoute('index')
    async index() {
        return await ViewEngine.renderFile('home/main.liquid');
    }

    @Get('demo/:uuid/:slug')
    @NamedRoute('demo')
    async demo(@Param('uuid') uuid: string, @Param('slug') slug: string) {
        console.log(uuid, slug)
        return await ViewEngine.renderFile('home/main.liquid');
    }
}
