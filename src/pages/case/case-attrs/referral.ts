import { ICustomInput, ICaseCol } from "src/app/app.interfaces";

export const referralMap: Map<string, any> = new Map(
    [
        [
            'service_date',
            {
                fieldName: 'service_date',
                label: 'მომსახურების თარიღი',
                type: 'date',
                icon: 'pi-calendar',
                propertyID: null,
                isRequired: false,
                isDisabled: false,
            }
        ],
        [
            'type',
            {
                fieldName: 'type',
                label: 'რეფერალის ტიპი',
                type: 'dropdown',
                icon: 'pi-list',
                propertyID: 132,
                isRequired: false,
                isDisabled: false,
            }
        ],
        [
            'provider',
            {
                fieldName: 'provider',
                label: 'პროვაიდერი',
                type: 'dropdown',
                icon: 'pi-list',
                propertyID: 133,
                isRequired: false,
                isDisabled: false,
            }
        ],
        [
            'service_type',
            {
                fieldName: 'service_type',
                label: 'მომსახურების ტიპი',
                type: 'tree',
                icon: 'pi-sitemap',
                propertyID: 42, // 42 //attrID source for tree
                isRequired: false,
                isDisabled: false,
            }
        ],
        [
            'price', {
                fieldName: 'price',
                label: 'მომსახურების ღირებულება',
                type: 'double',
                icon: 'pi-money-bill',
                propertyID: null,
                isRequired: false,
                isDisabled: false,
            }
        ],
        [
            'result',
            {
                fieldName: 'result',
                label: 'მომსახურების შედეგი',
                type: 'textarea',
                icon: 'pi-sitemap',
                propertyID: null,
                isRequired: false,
                isDisabled: false,
            }
        ],

    ]
);
export const referralList: ICustomInput[] = Array.from(referralMap.values());
export const referralCols: ICaseCol[] = referralList.map(e => new ICaseCol(e));
