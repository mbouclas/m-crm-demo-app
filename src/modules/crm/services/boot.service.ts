import {BaseRequestService} from "../../../services/base-request.service";
import {BusinessTypeModel} from "../models/business.model";


export interface ICrmModuleBootResponse {
    businessCategoryTree: BusinessTypeModel[];
    displayedFieldsOnListTable: string[];
}

export class CrmBootService extends BaseRequestService {
    async boot() {
        return await this.get<ICrmModuleBootResponse>('crm/admin/boot')
    }
}
