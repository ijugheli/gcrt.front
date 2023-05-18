
export const otherSymptomMap: Map<string, any> = new Map(
    [
        ['mental_symptom_comment', {
            fieldName: 'mental_symptom_comment',
            label: 'სხვა მენტალური სიმპტომების აღწერა',
            type: 'textarea',
            icon: 'pi-pencil',
            propertyID: null,
            isRequired: false,
            isDisabled: false,
        }],
        ['somatic_symptom_comment', {
            fieldName: 'somatic_symptom_comment',
            label: 'სხვა სომატური სიმპტომების აღწერა',
            type: 'textarea',
            icon: 'pi-pencil',
            propertyID: null,
            isRequired: false,
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