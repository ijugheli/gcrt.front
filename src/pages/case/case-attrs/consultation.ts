import { ICustomInput, ICaseCol } from "src/app/app.interfaces";

export const consultationMap: Map<string, any> = new Map(
    [
        ['consultant', {
            fieldName: 'consultant',
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
            label: 'კონსულტანტის დანიშნულება',
            type: 'textarea',
            icon: 'pi-pencil',
            propertyID: null,
            isRequired: false,
            isDisabled: false,
        }
        ],
        ['client_status', {
            fieldName: 'client_status',
            label: 'კლიენტის მდგომარეობა',
            type: 'dropdown',
            icon: 'pi-pencil',
            propertyID: 223,
            isRequired: true,
            isDisabled: false,
        }
        ],
    ]
);
export const consultationList: ICustomInput[] = Array.from(consultationMap.values());
export const consultationCols: ICaseCol[] = consultationList.map(e => new ICaseCol(e));