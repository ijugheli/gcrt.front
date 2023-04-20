import { ICustomInput } from "src/app/app.interfaces";

export const contactMap: Map<string, any> = new Map(
    [
        [
            'phone_number', {
                fieldName: 'phone_number',
                label: 'ტელეფონის ნომერი',
                type: 'text',
                icon: 'pi-pencil',
                propertyID: null,
                isRequired: false,
                isDisabled: false,
            }
        ],
        [
            'home_phone_number', {
                fieldName: 'home_phone_number',
                label: 'სახლის ტელეფონი',
                type: 'text',
                icon: 'pi-pencil',
                propertyID: null,
                isRequired: false,
                isDisabled: false,
            }
        ],
        [
            'personal_email', {
                fieldName: 'personal_email',
                label: 'პირადი ელ. ფოსტა',
                type: 'text',
                icon: 'pi-pencil',
                propertyID: null,
                isRequired: false,
                isDisabled: false,
            }
        ],
        [
            'work_phone_number', {
                fieldName: 'work_phone_number',
                label: 'სამსახურის ტელეფონი',
                type: 'text',
                icon: 'pi-pencil',
                propertyID: null,
                isRequired: false,
                isDisabled: false,
            }
        ],
        [
            'work_internal_phone_number', {
                fieldName: 'work_internal_phone_number',
                label: 'სამსახურის შიდა ნომერი',
                type: 'text',
                icon: 'pi-pencil',
                propertyID: null,
                isRequired: false,
                isDisabled: false,
            }
        ],
        [
            'fax', {
                fieldName: 'fax',
                label: 'ფაქსი',
                type: 'text',
                icon: 'pi-pencil',
                propertyID: null,
                isRequired: false,
                isDisabled: false,
            }
        ],
        [
            'work_email', {
                fieldName: 'work_email',
                label: 'სამსახურის ელ. ფოსტა',
                type: 'text',
                icon: 'pi-pencil',
                propertyID: null,
                isRequired: false,
                isDisabled: false,
            }
        ],

    ]
);
export const contactList: ICustomInput[] = Array.from(contactMap.values());