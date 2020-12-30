import { Service } from "typedi";
import {IGenericObject} from "../models/general";
import {UserAuth} from "../auth/m-crm";
import {AxiosRequestFailedException} from "../exceptions/AxiosRequestFailed.exception";
import {createFilterUrl} from "../helpers/serializers";
import {AxiosResponse} from "axios";
import {Axios} from "../index";


@Service()
export class BaseRequestService {
    async post<T>(url: string, data: IGenericObject) {
        let res: AxiosResponse<T>;
        try {
            res = await Axios.post<T>(`${process.env.MCRM_API}${url}`, data, {
                withCredentials: true,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    Authorization: `Bearer ${UserAuth.accessToken}`,
                    Cookie: UserAuth.cookie,
                }
            });
        }
        catch (e) {
            throw new AxiosRequestFailedException(e);
        }

        return res.data;
    }

    async get<T>(url: string, queryParams: IGenericObject = {}) {
        let res: AxiosResponse<T>;

        try {
            const endpoint = `${process.env.MCRM_API}${url}`;
            const q = (Object.keys(queryParams).length > 0) ? createFilterUrl(endpoint, queryParams) : endpoint;

            res = await Axios.get<T>(q, {
                withCredentials: true,

                headers: {
                    'Access-Control-Allow-Origin': '*',
                    Authorization: `Bearer ${UserAuth.accessToken}`,
                    Cookie: UserAuth.cookie,
                }
            });
        }
        catch (e) {
            throw new AxiosRequestFailedException(e);
        }

        return res.data;
    }
}
