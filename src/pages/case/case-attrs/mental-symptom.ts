import { ICaseCol } from "src/app/app.interfaces";

export const mentalSymptomMap: Map<string, any> = new Map(
    [
        ['symptom_id', {
            fieldName: 'symptom_id',
            label: 'მენტალური სიმპტომები',
            type: 'dropdown',
            icon: 'pi-list',
            propertyID: 211,
            isRequired: false,
            isDisabled: false,
        }],
        ['symptom_severity', {
            fieldName: 'symptom_severity',
            label: 'აირჩიეთ დონე',
            type: 'dropdown',
            icon: 'pi-list',
            propertyID: 209,
            isRequired: true,
            isDisabled: false,
        }],
        ['record_date', {
            fieldName: 'record_date',
            label: 'რეგისტრაციის თარიღი',
            type: 'date',
            icon: 'pi-calendar',
            propertyID: null,
            isRequired: true,
            isDisabled: false,
        }
        ],
    ]
);

export const mentalSymptomCols =[
    {fieldName: 'record_date', label : 'რეგისტრაციის თარიღი'},
    {fieldName: 'symptom_id', label : 'სიმპტომი'},
    {fieldName: 'symptom_severity', label : 'დონე'},
];