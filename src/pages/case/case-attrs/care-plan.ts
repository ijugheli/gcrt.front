export const carePlanMap: Map<string, any> = new Map(
    [
        ['category', {
            fieldName: 'category',
            additionalKey: 'category',
            label: 'აირჩიეთ ჩარევის სახეობა',
            type: 'tree',
            icon: 'pi-sitemap',
            propertyID: 45, //45 //attrID source for tree
            isRequired: true,
            isDisabled: false,
        }]
    ]
);