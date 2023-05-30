import { ICaseCol, ICustomInput } from "src/app/app.interfaces";

export const mainMap: Map<string, any> = new Map(
    [
        [
            'branch',
            {
                fieldName: 'branch',
                label: 'ფილიალი',
                type: 'dropdown',
                icon: 'pi-list',
                propertyID: 202,
                isRequired: true,
                isDisabled: false,
            }
        ],
        [
            'registration_date',
            {
                fieldName: 'registration_date',
                label: 'რეგისტრაციის თარიღი',
                type: 'date',
                icon: 'pi-calendar',
                propertyID: null,
                isRequired: true,
                isDisabled: false,
            }
        ],
        [
            'client_code', {
                fieldName: 'client_code',
                label: 'კლიენტის კოდი',
                type: 'text',
                icon: 'pi-pencil',
                propertyID: null,
                isRequired: true,
                isDisabled: true,

            }
        ],
        [
            'client_group', {
                fieldName: 'client_group',
                label: 'კლიენტის ჯგუფი',
                type: 'dropdown',
                icon: 'pi-list',
                propertyID: 226, //attrID source for tree
                isRequired: true,
                isDisabled: false,
            }
        ],
        [
            'client_subgroup', {
                fieldName: 'client_subgroup',
                label: 'კლიენტის ქვეჯგუფი',
                type: 'dropdown',
                icon: 'pi-list',
                propertyID: 227, //attrID source for tree
                isRequired: true,
                isDisabled: false,
            }
        ],
        [
            'sex', {
                fieldName: 'sex',
                label: 'სქესი',
                type: 'dropdown',
                icon: 'pi-list',
                propertyID: 167,
                isRequired: true,
                isDisabled: false,
            }
        ],
        [
            'gender', {
                fieldName: 'gender',
                label: 'გენდერი',
                type: 'dropdown',
                icon: 'pi-list',
                propertyID: 220,
                isRequired: true,
                isDisabled: false,
            }
        ],
        [
            'gender_field', {
                fieldName: 'gender_field',
                label: 'გენდერი',
                type: 'text',
                icon: 'pi-users',
                propertyID: null,
                isRequired: true,
                isDisabled: false,
            }
        ],
        [
            'name', {
                fieldName: 'name',
                label: 'სახელი',
                type: 'text',
                icon: 'pi-pencil',
                propertyID: null,
                isRequired: true,
                isDisabled: false,
            }
        ],
        [
            'surname', {
                fieldName: 'surname',
                label: 'გვარი',
                type: 'text',
                icon: 'pi-pencil',
                propertyID: null,
                isRequired: true,
                isDisabled: false,
            }
        ],
        [
            'surname', {
                fieldName: 'surname',
                label: 'გვარი',
                type: 'text',
                icon: 'pi-pencil',
                propertyID: null,
                isRequired: true,
                isDisabled: false,
            }
        ],
        [
            'client_type', {
                fieldName: 'client_type',
                label: 'კლიენტის ტიპი',
                type: 'dropdown',
                icon: 'pi-list',
                propertyID: 221,
                isRequired: true,
                isDisabled: false,
            }
        ],
        [
            'birth_date', {
                fieldName: 'birth_date',
                label: 'დაბადების თარიღი',
                type: 'date',
                icon: 'pi-calendar',
                propertyID: null,
                isRequired: true,
                isDisabled: false,
            }
        ],
        [
            'age', {
                fieldName: 'age',
                label: 'ასაკი',
                type: 'text',
                icon: 'pi-pencil',
                propertyID: null,
                isRequired: true,
                isDisabled: true,
            }
        ],
        [
            'age_group', {
                fieldName: 'age_group',
                label: 'ასაკობრივი ჯგუფი',
                type: 'dropdown',
                icon: 'pi-list',
                propertyID: 196,
                isRequired: true,
                isDisabled: true,
            }
        ],
        [
            'personal_id', {
                fieldName: 'personal_id',
                label: 'პირადი ნომერი',
                type: 'text',
                icon: 'pi-pencil',
                propertyID: null,
                isRequired: false,
                isDisabled: false,
            }
        ],
        [
            'repeating_client', {
                fieldName: 'repeating_client',
                label: 'განმეორებადი კლიენტი',
                type: 'switch',
                icon: 'pi-list',
                propertyID: null,
                isRequired: false,
                isDisabled: false,
            }
        ],
    ]
);
export const mainList: ICustomInput[] = Array.from(mainMap.values());

const hiddenCols = ['birth_date', 'repeating_client', 'client_group', 'client_group','gender', 'sex', 'gender_field'];
export const half: number = Math.ceil(mainList.length / 2);
export const mainFirstCol: ICustomInput[] = mainList.slice(0, half);
export const mainSecondCol: ICustomInput[] = mainList.slice(half);
export const mainCols: ICaseCol[] = mainList.map((e) => new ICaseCol(e)).filter((e) => !hiddenCols.includes(e.fieldName));