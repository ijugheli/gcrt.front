import { DATA_TYPE_ID, VIEW_TYPE_ID } from "src/app/app.config";
import { IPropertyValue } from "../interfaces/property.value.interface";
import { MProperty } from './property.model';

export class MPropertyValue {
    public id!: number;
    public value_id!: number;
    public p_value_id: number | null = null;
    public attr_id!: number;
    public property_id!: number;
    public related_value_id: number | null = null;
    public value_text: string | null = null;
    public value_integer: number | null = null;
    public value_boolean: number | null = null;
    public value_decimal: number | null = null;
    public value_string: string | null = null;
    public value_json: string | null = null;
    public value_date: string | null = null;
    public value: any;
    public insert_date: string | null = null;
    public update_date: string | null = null;
    public order_id!: number;

    public original!: IPropertyValue;

    public property?: MProperty;


    public constructor(value?: IPropertyValue) {
        if (value == null) {
            return;
        }

        this.original = value;
        this.id = value.id;
        this.value_id = value.value_id;
        this.p_value_id = value.p_value_id;
        this.attr_id = value.attr_id;
        this.property_id = value.property_id;
        this.related_value_id = value.related_value_id;
        this.value_text = value.value_text;
        this.value_integer = value.value_integer;
        this.value_boolean = value.value_boolean;
        this.value_decimal = value.value_decimal;
        this.value_string = value.value_string;
        this.value_json = value.value_json;
        this.value_date = value.value_date;
        this.value = value.value;
        this.insert_date = value.insert_date;
        this.update_date = value.update_date;
        this.order_id = value.order_id;
    }

    public setProperty(property?: MProperty) {
        if (property == null || property === undefined) {
            return this;
        }

        this.property = property;
        return this;
    }


    public static from(property: MProperty, value: any) { //: MPropertyValue
        let viewTypeID = property.input_view_type;
        let dataTypeID = property.input_data_type;
        let o = new MPropertyValue();
        o.attr_id = property.attr_id;
        o.property_id = property.id;
        o.order_id = property.order_id;
        o.related_value_id = null;


        //Value Related
        o.value_integer = null;
        o.value_decimal = null;
        o.value_date = null;
        o.value_json = null;
        o.insert_date = null;
        o.update_date = null;


        //Normal input related -> string|integer|decimal
        if (viewTypeID == VIEW_TYPE_ID('input')) {
            if (dataTypeID == DATA_TYPE_ID('string')) o.value_string = value;
            if (dataTypeID == DATA_TYPE_ID('int')) o.value_integer = value;
            if (dataTypeID == DATA_TYPE_ID('double')) o.value_decimal = value;
        }
        //Checkbox Related.
        if (viewTypeID == VIEW_TYPE_ID('checkbox') ||
            viewTypeID == VIEW_TYPE_ID('toggle')) {
            if (dataTypeID == DATA_TYPE_ID('boolean')) o.value_boolean = value;
        }
        //Dates Related -> date
        else if (viewTypeID == VIEW_TYPE_ID('datepicker') ||
            viewTypeID == VIEW_TYPE_ID('datetimepicker')) {
            if (dataTypeID == DATA_TYPE_ID('date')) o.value_date = value;
            if (dataTypeID == DATA_TYPE_ID('datetime')) o.value_date = value;
        }
        //Textarea related -> text
        else if (viewTypeID == VIEW_TYPE_ID('textarea') ||
            viewTypeID == VIEW_TYPE_ID('editable-textarea')) {
            o.value_text = value;
        }
        //Selects Related -> JSON
        else if (viewTypeID == VIEW_TYPE_ID('select') ||
            viewTypeID == VIEW_TYPE_ID('multiselect') ||
            viewTypeID == VIEW_TYPE_ID('tableselect')) {

            o.value_json = JSON.stringify(value);
        } else if (viewTypeID == VIEW_TYPE_ID('treeselect')) {
            const sanitizedJSON = Object.assign({}, value);

            if (sanitizedJSON.parent) {
                if (sanitizedJSON.parent.children) {
                    for (let i = 0; i < sanitizedJSON.parent.children.length; i++) {
                        sanitizedJSON.parent.children[i]['parent'] = null;
                    }
                }
            }

            o.value_json = JSON.stringify(sanitizedJSON);
        }

        return o;
    }



}