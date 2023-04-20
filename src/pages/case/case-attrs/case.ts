import { ICustomInput, ICaseCol } from "src/app/app.interfaces";

export const caseMap: Map<string, any> = new Map(
    [
        [
            'project_id',
            {
                fieldName: 'project_id',
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
                label: 'ქეისის მენეჯერი',
                type: 'dropdown',
                icon: 'pi-list',
                propertyID: 199, // TODO 
                isRequired: true,
                isDisabled: false,
            }
        ],
        [
            'client_id',
            {
                fieldName: 'client_id',
                label: 'კლიენტი',
                type: 'dropdown',
                icon: 'pi-list',
                propertyID: 199, // TODO
                isRequired: true,
                isDisabled: false,
            }
        ],
        [
            'branch',
            {
                fieldName: 'branch',
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
                label: 'ინციდენტი',
                type: 'dropdown',
                icon: 'pi-list',
                propertyID: 118,
                isRequired: true,
                isDisabled: false,
            }
        ],
        [
            'incident_text',
            {
                fieldName: 'incident_text',
                label: 'ინციდენტის აღწერა',
                type: 'textarea',
                icon: 'pi-pencil',
                propertyID: null,
                isRequired: true,
                isDisabled: false,
            }
        ],
        [
            'social_status',
            {
                fieldName: 'social_status',
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
