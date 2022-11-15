import { HttpHeaders } from "@angular/common/http";

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

    public insert_date: string | null = null;
    public update_date: string | null = null;

    public order_id: number | null = null;
    public source: any = null;

}

export class Attribute {
    public id: number | null = null;
    public p_id: number | null = null;
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
    public name!: string;
    public lastname!: string;
    public phone!: string;
    public address!: string;
    public email!: string;
}

export class GuardedService {
    public headers: HttpHeaders;

    constructor(token: string) {
        this.headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': 'Bearer ' + token
        });
    }
}