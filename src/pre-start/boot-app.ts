import {BaseRequestService} from "../services/base-request.service";
import {AppStateModel} from "../models/appState.model";
import {AxiosRequestFailedException} from "../exceptions/AxiosRequestFailed.exception";


export async function bootApp() {
    try {
        return  await (new BaseRequestService()).get<AppStateModel>('admin/boot');
    }
    catch (e) {
        throw new AxiosRequestFailedException(e);
    }
}
