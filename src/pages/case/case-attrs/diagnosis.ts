import { ICaseCol, ICustomInput } from "src/app/app.interfaces";

export const diagnosisMap: Map<string, any> = new Map(
    [
        ['status', {
            fieldName: 'status',
            label: 'დიაგნოზის სტატუსი',
            type: 'dropdown',
            icon: 'pi-list',
            propertyID: 126,
            isRequired: false,
            isDisabled: false,
        }
        ],
        ['type', {
            fieldName: 'type',
            label: 'დიაგნოზის ტიპი',
            type: 'dropdown',
            icon: 'pi-list',
            propertyID: 127,
            isRequired: false,
            isDisabled: false,
        }
        ],
        ['icd', {
            fieldName: 'icd',
            label: 'ICD10 სარჩევი',
            type: 'tree',
            icon: 'pi-sitemap',
            propertyID: 43, // //attrID source for tree
            isRequired: false,
            isDisabled: false,
        }
        ],
        ['diagnosis_dsmiv', {
            fieldName: 'diagnosis_dsmiv',
            label: 'DSMIV',
            type: 'dropdown',
            icon: 'pi-list',
            propertyID: 125,
            isRequired: false,
            isDisabled: false,
        }
        ],
        ['diagnosis_icd10', {
            fieldName: 'diagnosis_icd10',
            label: 'დიაგნოზის ICD10',
            type: 'dropdown',
            icon: 'pi-list',
            propertyID: null,
            isRequired: false,
            isDisabled: false,
        }
        ],
        ['diagnosis_date', {
            fieldName: 'diagnosis_date',
            label: 'დიაგნოზის დასმის თარიღი',
            type: 'date',
            icon: 'pi-calendar',
            propertyID: null,
            isRequired: false,
            isDisabled: false,
        }
        ],
        ['links_with_trauma', {
            fieldName: 'links_with_trauma',
            label: 'ტრამვასთან კავშირი',
            type: 'dropdown',
            icon: 'pi-list',
            propertyID: 205,
            isRequired: false,
            isDisabled: false,
        }
        ],
        ['comment', {
            fieldName: 'comment',
            label: 'კომენტარი',
            type: 'textarea',
            icon: 'pi-pencil',
            propertyID: null,
            isRequired: false,
            isDisabled: false,
        }
        ],
    ]
);
export const diagnosisList: ICustomInput[] = Array.from(diagnosisMap.values());
export const diagnosisCols: ICaseCol[] = diagnosisList.map(e => new ICaseCol(e));
