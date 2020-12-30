export interface IGenericObject<T = any> {
    [key: string]: T;
}

export interface ITranslatableField {
    [key: string]: string|number|boolean;
}

export interface IBaseModel {
    uuid: string;
}
export interface IBaseTree extends IBaseModel {
    name: ITranslatableField;
    slug: string;
    description?: ITranslatableField;
    children?: IBaseTree[];
    code?: string;
}
