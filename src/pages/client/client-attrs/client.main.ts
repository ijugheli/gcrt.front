import { ICustomInput } from "../client.model";

export const mainMap: Map<string, any> = new Map(
    [
        [
            'branch',
            {
                fieldName: 'branch',
                mainKey: 'branch',
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
                mainKey: 'registration_date',
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
                mainKey: 'client_code',
                label: 'კლიენტის კოდი',
                type: 'text',
                icon: 'pi-pencil',
                propertyID: null,
                isRequired: true,
                isDisabled: true,

            }
        ],
        [
            'category_group_id', {
                fieldName: 'category_group_id',
                mainKey: 'category_group_id',
                label: 'კატეგორია',
                type: 'tree',
                icon: 'pi-sitemap',
                propertyID: 27, //attrID source for tree
                isRequired: true,
                isDisabled: false,
            }
        ],
        [
            'gender', {
                fieldName: 'gender',
                mainKey: 'gender',
                label: 'სქესი',
                type: 'dropdown',
                icon: 'pi-list',
                propertyID: 167,
                isRequired: true,
                isDisabled: false,
            }
        ],
        [
            'repeating_client', {
                fieldName: 'repeating_client',
                mainKey: 'repeating_client',
                label: 'განმეორებადი კლიენტი',
                type: 'switch',
                icon: 'pi-list',
                propertyID: null,
                isRequired: false,
                isDisabled: false,
            }
        ],
        [
            'name', {
                fieldName: 'name',
                mainKey: 'name',
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
                mainKey: 'surname',
                label: 'გვარი',
                type: 'text',
                icon: 'pi-pencil',
                propertyID: null,
                isRequired: true,
                isDisabled: false,
            }
        ],
        [
            'birth_date', {
                fieldName: 'birth_date',
                mainKey: 'birth_date',
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
                mainKey: 'age',
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
                mainKey: 'age_group',
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
                mainKey: 'personal_id',
                label: 'პირადი ნომერი',
                type: 'text',
                icon: 'pi-pencil',
                propertyID: null,
                isRequired: true,
                isDisabled: false,
            }
        ],
    ]
);
export const mainList: ICustomInput[] = Array.from(mainMap.values());


export const half: number = Math.ceil(mainList.length / 2);
export const mainFirstCol: ICustomInput[] = mainList.slice(0, half);
export const mainSecondCol: ICustomInput[] = mainList.slice(half);
