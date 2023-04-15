import { ICaseCol, ICustomInput } from "src/pages/client/client.model";

export const caseMap: Map<string, any> = new Map(
    [
        [
            'project_id',
            {
                fieldName: 'project_id',
                caseKey: 'project_id',
                label: 'პროექტი',
                type: 'dropdown',
                icon: 'pi-list',
                propertyID: 199,
                isRequired: true,
                isDisabled: false,
            }
        ],
        [
            'case_manager_id',
            {
                fieldName: 'case_manager_id',
                caseKey: 'case_manager_id',
                label: 'ქეისის მენეჯერი',
                type: 'dropdown',
                icon: 'pi-list',
                propertyID: null,
                isRequired: true,
                isDisabled: false,
            }
        ],
        [
            'client_id',
            {
                fieldName: 'client_id',
                caseKey: 'client_id',
                label: 'კლიენტი',
                type: 'dropdown',
                icon: 'pi-list',
                propertyID: null,
                isRequired: true,
                isDisabled: false,
            }
        ],
        [
            'branch',
            {
                fieldName: 'branch',
                caseKey: 'branch',
                label: 'ფილიალი',
                type: 'dropdown',
                icon: 'pi-list',
                propertyID: 202,
                isRequired: true,
                isDisabled: false,
            }
        ],
        [
            'registration_date', {
                fieldName: 'registration_date',
                caseKey: 'registration_date',
                label: 'რეგისტრაციის თარიღი',
                type: 'date',
                icon: 'pi-calendar',
                propertyID: null,
                isRequired: true,
                isDisabled: false,
            }
        ],
        [
            'referral_body',
            {
                fieldName: 'referral_body',
                caseKey: 'referral_body',
                label: 'რეფერალური ორგანო',
                type: 'tree',
                icon: 'pi-sitemap',
                propertyID: 30, //attrID source for tree
                isRequired: true,
                isDisabled: false,
            }
        ],
        [
            'recommender',
            {
                fieldName: 'recommender',
                caseKey: 'recommender',
                label: 'რეკომენდატორი',
                type: 'text',
                icon: 'pi-pencil',
                propertyID: null,
                isRequired: true,
                isDisabled: false,
            }
        ],
        [
            'incident',
            {
                fieldName: 'incident',
                caseKey: 'incident',
                label: 'ინციდენტი',
                type: 'dropdown',
                icon: 'pi-list',
                propertyID: 118,
                isRequired: false,
                isDisabled: false,
            }
        ],
        [
            'incident_text',
            {
                fieldName: 'incident_text',
                caseKey: 'incident_text',
                label: 'ინციდენტის აღწერა',
                type: 'textarea',
                icon: 'pi-pencil',
                propertyID: null,
                isRequired: false,
                isDisabled: false,
            }
        ],
        [
            'social_status',
            {
                fieldName: 'social_status',
                caseKey: 'social_status',
                label: 'სოციალური მდგომარეობა',
                type: 'textarea',
                icon: 'pi-pencil',
                propertyID: null,
                isRequired: false,
                isDisabled: false,
            }
        ],
        [
            'legal_status',
            {
                fieldName: 'legal_status',
                caseKey: 'legal_status',
                label: 'სამართლებრივი მდგომარეობა',
                type: 'textarea',
                icon: 'pi-pencil',
                propertyID: null,
                isRequired: false,
                isDisabled: false,
            }
        ],
    ]
);

export const caseList: ICustomInput[] = Array.from(caseMap.values());
export const caseCols: ICaseCol[] = caseList.map(e => new ICaseCol(e));
