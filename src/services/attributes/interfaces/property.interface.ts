export interface IProperty {
    id: number;
    p_id: number | null;
    attr_id: number;
    source_attr_id: number | null;
    type: number;
    title: string;
    input_data_type: number;
    input_view_type: number;
    is_mandatory: boolean;
    has_filter: boolean;
    is_primary: boolean;

    insert_date: string;
    update_date: string | null;

    order_id: number;
    source: any;
    tree: any;
    sourceAttribute: any;
}