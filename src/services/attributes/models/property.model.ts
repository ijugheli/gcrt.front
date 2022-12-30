import { DATA_TYPE_ID, PROPERTY_TYPE_ID, VIEW_TYPE_ID } from "src/app/app.config";
import { IProperty } from "../interfaces/property.interface";
import { MAttribute } from "./attribute.model";


export class MProperty {
    public id: number;
    public p_id: number | null = null;
    public attr_id: number;
    public source_attr_id: number | null = null;
    public type: Number;
    public title: string;
    public input_data_type: number;
    public input_view_type: number;
    public is_mandatory: boolean = false;

    public insert_date: string;
    public update_date: string | null = null;

    public order_id: number;
    public source: any = null;
    public has_filter: any = false;


    public tree: any = null;
    public sourceAttribute: any = null;

    public is_primary: boolean = false;


    public options: any[] = [];
    public selectedOptions: any[] = [];

    public constructor(o: IProperty) {
        this.id = o.id;
        this.p_id = o.p_id;
        this.attr_id = o.attr_id;
        this.source_attr_id = o.source_attr_id;
        this.type = o.type;
        this.title = o.title;
        this.input_data_type = o.input_data_type;
        this.input_view_type = o.input_view_type;
        this.is_mandatory = o.is_mandatory;
        this.insert_date = o.insert_date;
        this.update_date = o.update_date;
        this.order_id = o.order_id;
        this.source = o.source;
        this.tree = o.tree;
        this.sourceAttribute = o.sourceAttribute;
        this.has_filter = o.has_filter;
        this.is_primary = o.is_primary;


        if (this.tree != null) {

            this.options = this.tree;
            this.selectedOptions = [];
            return;
        }
    }

    public withSource(source: MAttribute) {
        this.source = source;
        return this;
        // this.options = source.options;
    }

    public isDate() {
        return this.input_data_type == DATA_TYPE_ID('date');
    }

    public isNumber() {
        return this.isInteger() || this.isDouble();
    }

    public isInteger() {
        return this.input_data_type == DATA_TYPE_ID('int');
    }

    public isDouble() {
        return this.input_data_type == DATA_TYPE_ID('double')
    }

    public isBoolean() {
        return this.input_data_type == DATA_TYPE_ID('boolean');
    }

    public isString() {
        return this.input_data_type == DATA_TYPE_ID('string');
    }

    public isSelect() {
        return this.input_view_type == VIEW_TYPE_ID('select') ||
            this.input_view_type == VIEW_TYPE_ID('multiselect');
    }

    public isTextarea() {
        return this.input_view_type == VIEW_TYPE_ID('textarea');
    }

    public isSection() {
        return this.type == PROPERTY_TYPE_ID('section');
    }

    public hasSelectedOptions() {
        return this.isSelect() && this.selectedOptions != null && this.selectedOptions.length > 0;
    }

    public hasStringFilter(): boolean {
        let viewTypeID = this.input_view_type;
        let dataTypeID = this.input_data_type;

        return (dataTypeID == DATA_TYPE_ID('string')) &&
            viewTypeID != VIEW_TYPE_ID('select') &&
            viewTypeID != VIEW_TYPE_ID('multiselect');
    }

    public hasDateFilter(): boolean {
        let viewTypeID = this.input_view_type;
        let dataTypeID = this.input_data_type;

        return (dataTypeID == DATA_TYPE_ID('date')) ||
            viewTypeID == VIEW_TYPE_ID('datetime');
    }

    public hasSelectFilter(): boolean {
        let viewTypeID = this.input_view_type;

        if (!this.source)
            return false;

        return this.isSelect();
    }

    public hasParent() {
        return this.p_id != null && this.p_id > 0;
    }

    public hasSource() {
        return this.source_attr_id != null && this.source_attr_id > 0;
    }

    public parentID(): number {
        if (!this.hasParent() || this.p_id == null) {
            return 0;
        }

        return this.p_id;
    }

}

