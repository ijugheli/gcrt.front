import { DATA_TYPE_ID, VIEW_TYPE_ID } from "src/app/app.config";
import { IPropertyValue } from "../interfaces/property.value.interface";
import { MOption } from "./option.model";
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
        let propertyValue = new MPropertyValue();
        propertyValue.attr_id = property.attr_id;
        propertyValue.property_id = property.id;
        propertyValue.order_id = property.order_id;
        propertyValue.related_value_id = null;


        //Value Related
        propertyValue.value_integer = null;
        propertyValue.value_decimal = null;
        propertyValue.value_date = null;
        propertyValue.value_json = null;
        propertyValue.insert_date = null;
        propertyValue.update_date = null;

        //Normal input related -> string|integer|decimal
        if (property.isInput()) {
            if (property.isString()) propertyValue.value_string = value;
            if (property.isInteger()) propertyValue.value_integer = value;
            if (property.isDouble()) propertyValue.value_decimal = value;

            return propertyValue;
        }

        console.log('Transforming Property');
        console.log(property);
        console.log('Transforming Property');

        if (property.isCheckbox() && property.isBoolean()) {
            propertyValue.value_boolean = value;

            return propertyValue;
        }

        if (property.isDatepicker() && property.isDate()) {
            propertyValue.value_date = value;
            return propertyValue;
        }

        if (property.isTextarea()) {
            propertyValue.value_text = value;

            return propertyValue;
        }

        if (property.isSelect() || property.isMultiselect()) {
            delete value.value;
            if(Array.isArray(value)) {
                value.map((item : MOption) => {
                    delete item.value;
                    return item;
                })
            }
            propertyValue.value_json = JSON.stringify(value);

            return propertyValue;
        }

        if (property.isTreeselect()) {
            const sanitizedJSON = MPropertyValue.normalizeTreeParents(Object.assign({}, value));

            propertyValue.value_json = JSON.stringify(sanitizedJSON);

            return propertyValue;
        }

        return propertyValue;
    }

    private static normalizeTreeParents(tree: any) {
        if (tree.parent) {
            if (tree.parent.children) {
                for (let i = 0; i < tree.parent.children.length; i++) {
                    tree.parent.children[i]['parent'] = null;
                }
            }
        }

        return tree;
    }



}