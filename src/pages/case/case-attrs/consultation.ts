import { ICaseCol, ICustomInput } from "src/pages/client/client.model";

export const consultationMap: Map<string, any> = new Map(
    [
        ['consultant', {
            fieldName: 'consultant',
            consultationKey: 'consultant',
            label: 'კონსულტანტი',
            type: 'dropdown',
            icon: 'pi-list',
            propertyID: 138,
            isRequired: true,
            isDisabled: false,
        }
        ],
        ['date', {
            fieldName: 'date',
            consultationKey: 'date',
            label: 'კონსულტაციის თარიღი',
            type: 'date',
            icon: 'pi-calendar',
            propertyID: null,
            isRequired: true,
            isDisabled: false,
        }
        ],
        ['type', {
            fieldName: 'type',
            consultationKey: 'type',
            label: 'კონსულტაციის ტიპი',
            type: 'dropdown',
            icon: 'pi-list',
            propertyID: 140,
            isRequired: true,
            isDisabled: false,
        }
        ],
        ['duration', {
            fieldName: 'duration',
            consultationKey: 'duration',
            label: 'კონსულტაციის ხანგრძლივობა',
            type: 'dropdown',
            icon: 'pi-list',
            propertyID: 141,
            isRequired: false,
            isDisabled: false,
        }
        ],
        ['consultant_record', {
            fieldName: 'consultant_record',
            consultationKey: 'consultant_record',
            label: 'კონსულტანტის ჩანაწერი',
            type: 'textarea',
            icon: 'pi-pencil',
            propertyID: null,
            isRequired: false,
            isDisabled: false,
        }
        ],
        ['consultant_prescription', {
            fieldName: 'consultant_prescription',
            consultationKey: 'consultant_prescription',
            label: 'კონსულტანტის დანიშნულება',
            type: 'textarea',
            icon: 'pi-pencil',
            propertyID: null,
            isRequired: false,
            isDisabled: false,
        }
        ],
    ]
);
export const consultationList: ICustomInput[] = Array.from(consultationMap.values());
export const consultationCols: ICaseCol[] = consultationList.map(e => new ICaseCol(e));