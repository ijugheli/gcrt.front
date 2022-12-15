import { MProperty } from "../models/property.model";
import { IProperty } from './property.interface';

export interface IAttribute {
    id: number;
    p_id: number | null;
    count: number;
    type: number;
    status_id: number;
    title: string;

    properties: IProperty[];
}