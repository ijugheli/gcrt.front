import { reverseMap } from "./app.func";
import { IActionItem, IMenuItem } from "./app.interfaces";

export const API_URL = 'http://localhost:8000';
// export const API_URL = 'https://gcrt.live/api';

export const VIEW_TYPES: Map<number, string> = new Map([
  [1, 'input'],
  [2, 'textarea'],
  [3, 'editable-textarea'],
  [4, 'checkbox'],
  [5, 'toggle'],
  [6, 'select'],
  [7, 'searchable-select'],
  [8, 'multiselect'],
  [9, 'searchable-multiselect'],
  [10, 'datepicker'],
  [11, 'timepicker'],
  [12, 'datetimepicker'],
  [13, 'treeselect'],
  [14, 'tableselect'],
]);

export const VIEW_TYPE_TITLES = reverseMap(VIEW_TYPES);

export const VIEW_TYPE_ID = (type: string) => VIEW_TYPE_TITLES.get(type);

export const DATA_TYPES: Map<number, string> = new Map([
  [1, 'string'],
  [2, 'int'],
  [3, 'double'],
  [4, 'date'],
  [5, 'datetime'],
  [6, 'boolean'],
]);

export const DATA_TYPE_TITLES = reverseMap(DATA_TYPES);

export const DATA_TYPE_ID = (type: string) => DATA_TYPE_TITLES.get(type);

export const ATTR_TYPES: Map<string, number> = new Map([
  ['standard', 1],
  ['tree', 2],
  ['entity', 3],
]);

export const ATTR_TYPES_NAMES: Map<string, string> = new Map([
  ['standard', 'სტანდარტული ატრიბუტები'],
  ['tree', 'ხისებრი ატრიბუტები'],
  ['entity', 'ობიექტი'],
]);

export const ATTR_TYPES_IDS_NAME: Map<number, string> = new Map([
  [1, 'სტანდარტული ატრიბუტები'],
  [2, 'ხისებრი ატრიბუტები'],
  [3, 'ობიექტი'],
]);


export const ATTR_TYPE_ID = (type: string) => ATTR_TYPES.get(type);
export const ATTR_TYPE_NAME = (type: string | number) => typeof type === "string" ? ATTR_TYPES_NAMES.get(type) : ATTR_TYPES_IDS_NAME.get(type);


export const PROPERTY_TYPES: Map<string, number> = new Map([
  ['input', 1],
  ['section', 2],
  ['entity', 3],
]);

export const PROPERTY_TYPE_ID = (type: string) => PROPERTY_TYPES.get(type);



export const ACTION_SETTINGS = {
  'string': [
    { label: 'შეიცავს', value: 'custom-contains' },
    { label: 'არ შეიცავს', value: 'custom-notContains' },
    { label: 'უდრის', value: 'custom-equals' },
    { label: 'არ უდრის', value: 'custom-notEquals' },
    { label: 'იწყება', value: 'custom-startsWith' },
    { label: 'მთავრდება', value: 'custom-endsWith' },
  ],
  'integer': [
    { label: 'უდრის', value: 'custom-equals' },
    { label: 'არ უდრის', value: 'custom-notEquals' },
    { label: 'მეტია', value: 'custom-greaterThen' },
    { label: 'ნაკლებია', value: 'custom-lessThen' },
  ],
  'date': [
    { label: 'თარიღი უდრის', value: 'custom-dateIs' },
    { label: 'თარიღი არ უდრის', value: 'custom-dateIsNot' },
    { label: 'თარიღი მეტია', value: 'custom-dateAfter' },
    { label: 'თარიღი ნაკლებია', value: 'custom-dateBefore' },
  ]
}

export enum AttrPermissionTypes {
  CAN_VIEW = 1,
  CAN_UPDATE = 2,
  CAN_DELETE = 3,
  CAN_EDIT_STRUCTURE = 4,
}

//DEPRECATED
export const TABLE_SETTINGS: Map<String, IActionItem> = new Map(
  [['edit', {
    name: 'edit',
    title: 'რედაქტირება',
    icon: 'pi pi-pencil',
    align: 'left',
    activeOnMulti: false,
    activeOnSingle: true,
    activeDefault: false,
  } as IActionItem],
  ['add', {
    name: 'add',
    title: 'დამატება',
    icon: 'pi pi-plus-circle',
    align: 'left',
    activeOnMulti: false,
    activeOnSingle: true,
    activeDefault: true,
  } as IActionItem],
  ['delete', {
    name: 'delete',
    title: 'წაშლა',
    icon: 'pi pi-trash',
    align: 'left',
    activeOnMulti: true,
    activeOnSingle: true,
    activeDefault: false,
  } as IActionItem],
  // ['csv', {
  //   name: 'csv',
  //   title: 'Export CSV',
  //   icon: 'pi pi-file',
  //   align: 'right',
  //   activeOnMulti: true,
  //   activeOnSingle: true,
  //   activeDefault: true,
  // } as IActionItem],
  ['pdf', {
    name: 'pdf',
    title: 'Export PDF',
    icon: 'pi pi-file-pdf',
    align: 'right',
    activeOnMulti: true,
    activeOnSingle: true,
    activeDefault: true,
  } as IActionItem],
  ['xls', {
    name: 'xls',
    title: 'Export XLS',
    icon: 'pi pi-file-excel',
    align: 'right',
    activeOnMulti: true,
    activeOnSingle: true,
    activeDefault: true,
  } as IActionItem],
  ['reload', {
    name: 'reload',
    title: 'Reload',
    icon: 'pi pi-refresh',
    align: 'right',
    activeOnMulti: true,
    activeOnSingle: true,
    activeDefault: true,
  } as IActionItem],
  ],
);