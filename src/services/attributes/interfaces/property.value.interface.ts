export interface IPropertyValue {
    id: number;
    value_id: number;
    p_value_id: number | null;
    attr_id: number;
    property_id: number;
    related_value_id: number | null;
    value_text: string | null;
    value_integer: number | null;
    value_boolean: number | null;
    value_decimal: number | null;
    value_string: string | null;
    value_json: string | null;
    value_date: string | null;
    value: any;
    insert_date: string;
    update_date: string;
    order_id: number;
}