
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
    id : number;
    title: string;
    img: string;
    action: string;
    children?: IMenuItem[];
}
