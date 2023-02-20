import { HttpHeaders } from "@angular/common/http";
import { MAttribute } from "src/services/attributes/models/attribute.model";
import { DATA_TYPE_ID, VIEW_TYPE_ID } from "./app.config";
import { IUserPermission } from "./app.interfaces";



export class AttrProperty {
    public id: number | null = null;
    public p_id: number | null = null;
    public attr_id: number | null = null;
    public source_attr_id: number | null = null;
    public type: number | null = null;
    public title: string | null = null;
    public input_data_type: number | null = null;
    public input_view_type: number | null = null;
    public is_mandatory: boolean = false;
    public has_filter: boolean = false;

    public insert_date: string | null = null;
    public update_date: string | null = null;

    public order_id: number | null = null;
    public source: any = null;
    public tree: any = null;
    public sourceAttribute: any = null;
}
export class Property {
    public id: number | null = null;
    public p_id: number | null = null;
    public attr_id: number | null = null;
    public source_attr_id: number | null = null;
    public type: number | null = null;
    public title: string | null = null;
    public input_data_type: number | null = null;
    public input_view_type: number | null = null;
    public is_mandatory: boolean = false;

    public insert_date: string | null = null;
    public update_date: string | null = null;

    public order_id: number | null = null;
    public source: any = null;
    public has_filter: any = false;

    public options: any[] = [];
    public selectedOptions: any[] = [];
    public tree: any = null;
    public sourceAttribute: any = null;

    public constructor(o: AttrProperty) {
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

        if (this.tree != null) {

            this.options = this.tree;
            this.selectedOptions = [];
            return;
        }

        if (!this.source)
            return;

        for (let i = 0; i < this.source.length; i++) {
            let item = this.source[i];
            this.options.push(item.value);
        }

        this.selectedOptions = [];
    }

    public isDate() {
        return this.input_data_type == DATA_TYPE_ID('date');
    }

    public isNumber() {
        return this.input_data_type == DATA_TYPE_ID('int') || this.input_data_type == DATA_TYPE_ID('double');
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
}


export class Attribute {
    public id: number | null = null;
    public p_id: number | null = null;
    public count: number | null = null;
    public type: number | null = null;
    public status_id: number | null = null;
    public title: string | null = null;

    public properties: AttrProperty[] = [];

    public test() {
        console.log('Test');
    }
}

export class AttrValue {
    public id: number | null = null;
    public value_id: number | null = null;
    public p_value_id: number | null = null;
    public attr_id: number | null = null;
    public property_id: number | null = null;
    public related_value_id: number | null = null;
    public value_text: string | null = null;
    public value_integer: number | null = null;
    public value_boolean: number | null = null;
    public value_decimal: number | null = null;
    public value_string: string | null = null;
    public value_json: string | null = null;
    public value_date: string | null = null;
    public insert_date: string | null = null;
    public update_date: string | null = null;
    public order_id: number | null = null;
}

export class User {
    public id!: number;
    public status_id: boolean = true;
    public otp_enabled: boolean = true;
    public name!: string;
    public lastname!: string;
    public phone!: string;
    public address!: string;
    public email!: string;
    public permissions: IUserPermission[] = [];
}

export class MUserPermission {
    public attr_id!: number;
    public attr_title!: string | null;
    public attributeType!: number | null;
    public can_view: boolean | null = false;
    public can_update: boolean | null = false;
    public can_delete: boolean | null = false;
    public can_edit_structure: boolean | null = false;

    public static from(attribute: MAttribute, userAttrPermission: IUserPermission | null) {
        let permission = new MUserPermission();

        permission.attr_id = attribute.id;
        permission.attr_title = attribute.title;
        permission.attributeType = attribute.type;
        permission.can_view = userAttrPermission?.can_view || false;
        permission.can_update = userAttrPermission?.can_update || false;
        permission.can_delete = userAttrPermission?.can_delete || false;
        permission.can_edit_structure = userAttrPermission?.can_edit_structure || false;

        return permission;
    }
}



export class GuardedService {
    public headers!: HttpHeaders;

    constructor(token: string) {
        this.refreshToken(token);
    }

    // Set new Token for requests
    public refreshToken(token: string) {
        this.headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': 'Bearer ' + token
        });
    }
}