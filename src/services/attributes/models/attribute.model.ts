import { IAttribute } from '../interfaces/attribute.interface';
import { MProperty } from './property.model';
import { MPropertyValue } from './property.value.model';
import { MAttributeSection } from './section.model';
import { MAttributeTab } from './tab.model';
import { IPropertyValue } from '../interfaces/property.value.interface';
import { MRecord } from './record.model';
import { MOption } from './option.model';
import { ATTR_TYPE_ID } from '../../../app/app.config';


export class MAttribute {
    public id: number;
    public p_id: number | null;
    public count: number;
    public type: number;
    public lazy: boolean = false;
    public status_id: number | null = null;
    public title: string | null = null;
    public children: MAttribute[] = [];
    public properties: MProperty[] = [];
    public columns : MProperty[] = []; //Filtered and ordered properties
    public tabs: MAttributeTab[] = [];
    public sections: MAttributeSection[] = [];
    public values: MPropertyValue[] = [];
    public rows: Map<number, MRecord> = new Map();

    public options: MOption[] = [];

    public constructor(o: IAttribute) {
        this.id = o.id;
        this.p_id = o.p_id;
        this.count = o.count;
        this.type = o.type;
        this.status_id = o.status_id;
        this.title = o.title;
        this.lazy = o.lazy;
        if (o.values && o.values.length > 0) {
            this.withValues(o.values.map(
                (item: IPropertyValue) => new MPropertyValue(item)
            ));
        }

        if (o.options && o.options.length > 0) {
            this.withOptions(o.options.map(
                (item: IPropertyValue) => new MPropertyValue(item)
            ));
        }
    }

    public withValues(values: MPropertyValue[]) {
        this.values = values;
        this.values.forEach((value) => {
            if (!this.rows.has(value.value_id)) {
                this.rows.set(value.value_id, (new MRecord()).append(value));
            }

            this.rows.get(value.value_id)?.append(value);
        });

        this.withOptions(this.values);
    }


    public withOptions(values: MPropertyValue[]) {
        this.options = values.map((value: MPropertyValue) => new MOption(value));
    }

    public extractProps(o: IAttribute) {
        if (!o.properties || o.properties.length <= 0) {
            return;
        }

        this.withProps(o.properties.map((item) => new MProperty(item)));
    }

    public withProps(properties: MProperty[]) {
        this.properties = properties;
    }

    public withColumns(columns : MProperty[]) {
        this.columns = columns;
    }

    public appendChild(attibute: MAttribute) {
        this.children.push(attibute);
    }

    public appendSection(section: MAttributeSection) {
        this.sections.push(section);
    }

    public hasParent() {
        return this.p_id != null && this.p_id > 0;
    }

    public parentID(): number {
        if (!this.hasParent() || this.p_id == null) {
            return 0;
        }

        return this.p_id;
    }

    public hasChildren() {
        return this.children.length > 0;
    }

    public hasSections() {
        return this.sections.length > 0; ``
    }

    public hasValues() {
        return this.values.length > 0;
    }

    public isEntity() {
        return this.type === ATTR_TYPE_ID('entity')
    }

}