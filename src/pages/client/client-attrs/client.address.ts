import { ICustomInput } from "../client.model";

export  const addressMap: Map<string, any> = new Map(
    [
        ['location', {
            fieldName: 'location',
            addressKey: 'location',
            label: 'ლოკაცია',
            type: 'tree',
            icon: 'pi-sitemap',
            propertyID: null,
            isRequired: true,
            isDisabled: false,
        }
        ],
        ['address', {
            fieldName: 'address',
            addressKey: 'address',
            label: 'მისამართი',
            type: 'text',
            icon: 'pi-pencil',
            propertyID: null,
            isRequired: false,
            isDisabled: false,
        }
        ],
        ['zip', {
            fieldName: 'zip',
            addressKey: 'zip',
            label: 'ZIP/საფოსტო კოდი',
            type: 'text',
            icon: 'pi-pencil',
            propertyID: null,
            isRequired: false,
            isDisabled: false,
        }
        ],
        ['previous_address', {
            fieldName: 'previous_address',
            addressKey: 'previous_address',
            label: 'მისამართი გადაადგილებამდე',
            type: 'text',
            icon: 'pi-pencil',
            propertyID: null,
            isRequired: false,
            isDisabled: false,
        }
        ],
    ]
);
export const addressList: ICustomInput[] = Array.from(addressMap.values());
