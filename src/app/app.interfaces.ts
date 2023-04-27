import { Case, IDiagnosis, IReferral, IConsultation, IPsychodiagnosis } from "src/pages/case/case.model";
import { ClientAdditional, ClientAddress, ClientContact, ClientMain } from "src/pages/client/client.model";

export interface City {
    name: string,
    code: string
}

/**
 * for dynamic-table
 */
export interface RowItem {
    id: number;
    title: string;
    description: string;
    date: string;
}
/**
 * For Dinamyc table action options
 */
export interface IActionSettings {
    edit: IActionItem;
    add: IActionItem;
    delete: IActionItem;
    csv: IActionItem;
    pdf: IActionItem;
    xls: IActionItem;
    reload: IActionItem;
}

export interface IActionItem {
    name: string;
    title: string;
    icon: string;
    activeOnMulti: boolean;
    activeOnSingle: boolean;
    activeDefault: boolean;
    align: string;
}

export interface IMenuItem {
    id: number;
    title: string;
    img: string;
    active?: boolean;
    onClick?: any;
    children?: IMenuItem[];
}


export class IUserPermission {
    public id!: number;
    public user_id!: number | null;
    public attr_id!: number | null;
    public can_view: boolean | null = false;
    public can_update: boolean | null = false;
    public can_delete: boolean | null = false;
    public can_edit_structure: boolean | null = false;
}

export class APIResponse<T = undefined> {
    public code!: number;
    public message!: string;
    public data?: T;
    public elements?: Object;
    public refreshToken!: string;
}
export class ISurveyResult {
    public group_id!: string | number | undefined | null;
    public values!: any[];
    public result!: number | boolean;
    public resultLevel!: number;
    public group_title!: string | undefined | null;
    public sum!: number | undefined | null;
}

export class ICustomInput {
    fieldName!: string;
    label!: string;
    type!: string;
    icon!: string;
    propertyID!: number | null;
    isRequired!: boolean;
    isDisabled!: boolean;
}

export class ICaseCol {
    fieldName!: string;
    label!: string;
    constructor(data: any) {
        this.fieldName = data.fieldName;
        this.label = data.label;
    }
}

export interface IObjectKeys {
    [key: string]: any;
}
export class IFormMenuOption {
    public label!: string;
    public anchor!: string;
    public value!: number;
    public icon!: string;
}





