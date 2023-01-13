import { IPropertyValue } from "./property.value.interface";

export interface IRecord {
    valueID: number;
    attrID: number; 
    values: IPropertyValue[];
}