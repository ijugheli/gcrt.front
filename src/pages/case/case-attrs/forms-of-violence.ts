export const formsOfViolenceMap: Map<string, any> = new Map(
    [
        ['category', {
            fieldName: 'category',
            label: 'აირჩიეთ ძალადობის ფორმა',
            type: 'tree',
            icon: 'pi-sitemap',
            propertyID: 44, //44 //attrID source for tree
            isRequired: true,
            isDisabled: false,
        }]
    ]
);

export const formsOfViolenceTreeID = 44; 