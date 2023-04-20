import { ICustomInput } from "src/app/app.interfaces";

export const additionalMap: Map<string, any> = new Map(
    [
        [
            'nationality',
            {
                fieldName: 'nationality',
                label: 'ეროვნება',
                type: 'dropdown',
                icon: 'pi-list',
                propertyID: 168,
                isRequired: false,
                isDisabled: false,
            }
        ],
        [
            'education',
            {
                fieldName: 'education',
                label: 'განათლება',
                type: 'dropdown',
                icon: 'pi-list',
                propertyID: 195,
                isRequired: false,
                isDisabled: false,
            }
        ],
        [
            'marital_status',
            {
                fieldName: 'marital_status',
                label: 'ოჯახური მდგომარეობა',
                type: 'dropdown',
                icon: 'pi-list',
                propertyID: 169,
                isRequired: false,
                isDisabled: false,
            }
        ],
        [
            'family_members',
            {
                fieldName: 'family_members',
                label: 'ოჯახის წევრები',
                type: 'dropdown',
                icon: 'pi-list',
                propertyID: null,
                isRequired: false,
                isDisabled: false,
            }
        ],
        [
            'has_social_support', {
                fieldName: 'has_social_support',
                label: 'სოც. დახმარების დასახელება',
                type: 'text',
                icon: 'pi-pencil',
                propertyID: null,
                isRequired: false,
                isDisabled: false,
            }
        ],
        [
            'has_insurance', {
                fieldName: 'has_insurance',
                label: 'სადაზღვეო კომპანიის დასახელება',
                type: 'text',
                icon: 'pi-pencil',
                propertyID: null,
                isRequired: false,
                isDisabled: false,
            }
        ],
        [
            'work_address', {
                fieldName: 'work_address',
                label: 'სამუშაო ადგილი',
                type: 'text',
                icon: 'pi-pencil',
                propertyID: null,
                isRequired: false,
                isDisabled: false,
            }
        ],
        [
            'profession', {
                fieldName: 'profession',
                label: 'პროფესია',
                type: 'text',
                icon: 'pi-pencil',
                propertyID: null,
                isRequired: false,
                isDisabled: false,
            }
        ],
    ]
);

export const additionalList: ICustomInput[] = Array.from(additionalMap.values());