import { IAttribute } from '../interfaces/attribute.interface';
import { MProperty } from './property.model';
import { MAttributeSection } from './section.model';

export class MAttributeTab {
    public id!: number;
    public title!: string;
    public attribute!: MAttribute;

    public set(data: { id: number, title: string }) {
        this.id = data.id;
        this.title = data.title;
        return this;
    }

    constructor(attribute?: MAttribute) {
        if (!attribute) {
            return;
        }

        this.id = attribute.id;
        this.title = attribute.title || '';
        this.attribute = attribute;
    }
}

export class MAttribute {
    public id: number;
    public p_id: number | null;
    public count: number;
    public type: number;
    public status_id: number | null = null;
    public title: string | null = null;
    public children: MAttribute[] = [];
    public properties: MProperty[] = [];
    public tabs: MAttributeTab[] = [];
    public sections: MAttributeSection[] = [];

    public constructor(o: IAttribute) {
        this.id = o.id;
        this.p_id = o.p_id;
        this.count = o.count;
        this.type = o.type;
        this.status_id = o.status_id;
        this.title = o.title;
    }

    public extractProps(o: IAttribute) {
        if (!o.properties || o.properties.length <= 0) {
            return;
        }

        this.withProps(o.properties.map((item) => new MProperty(item)));
    }

    public props() {
        return this.properties;
    }

    public withProps(properties: MProperty[]) {
        this.properties = properties;
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
        return this.sections.length > 0; 
    }

}