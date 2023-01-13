import { MProperty } from "../models/property.model";
import { IProperty } from './property.interface';
import { IPropertyValue } from "./property.value.interface";

export interface IAttribute {
    id: number;
    p_id: number | null;
    count: number;
    type: number;
    lazy: boolean;
    status_id: number;
    title: string;
    properties: IProperty[];
    values: IPropertyValue[];
    options : IPropertyValue[];
}