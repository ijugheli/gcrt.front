import { reverseMap } from "./app.func";
import { IActionItem, IMenuItem } from "./app.interfaces";

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
  ['csv', {
    name: 'csv',
    title: 'Export CSV',
    icon: 'pi pi-file',
    align: 'right',
    activeOnMulti: true,
    activeOnSingle: true,
    activeDefault: true,
  } as IActionItem],
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

export const MENU_ITEMS: IMenuItem[] = [
  {
    id : 1,
    title: 'მომხმარებლები',
    img: 'client',
    action: '',
  },
  {
    id : 2,
    title: 'კლიენტი',
    img: 'client',
    action: '',
  },
  {
    id : 3,
    title: 'ქეისი',
    img: 'case',
    action: '',
  },
  {
    id  : 4,
    title: 'ადმინისტრირება',
    img: 'setting',
    action: '',
    children: [
      {
        id : 1,
        title: 'პროექტები',
        img: '',
        action: '',
      },
      {
        id : 2,
        title: 'რეგიონები',
        img: '',
        action: '',
      },
      {
        id : 3,
        title: 'ფილიალები',
        img: '',
        action: '',
      },
    ],
  },
  {
    id : 5,
    title: 'რეპორტები',
    img: 'reports',
    action: '',
  },
  {
    id : 6,
    title: 'პაროლის ცვლილება',
    img: 'setting',
    action: '',
  },
  {
    id : 7,
    title: 'გასვლა',
    img: 'logout',
    action: '',
  },
];


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