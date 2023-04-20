import { ICustomInput } from "src/app/app.interfaces";

export const addressMap: Map<string, any> = new Map(
    [
        ['location_id', {
            fieldName: 'location_id',
            label: 'ლოკაცია',
            type: 'tree',
            icon: 'pi-sitemap',
            propertyID: 27, //temporarysol
            isRequired: true,
            isDisabled: false,
        }
        ],
        ['address', {
            fieldName: 'address',
            label: 'მისამართი',
            type: 'text',
            icon: 'pi-pencil',
            propertyID: null,
            isRequired: false,
            isDisabled: false,
        }
        ],
        ['zip_code', {
            fieldName: 'zip_code',
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
