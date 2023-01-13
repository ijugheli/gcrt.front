import { MAttribute } from "./attribute.model";
import { MPropertyValue } from './property.value.model';

export class MRecord {
    public valueID!: number;
    public attrID!: number;
    public title!: string;
    public attribute!: MAttribute;
    public values!: MPropertyValue[];
    public map: Map<number, MPropertyValue> = new Map();
    public propValueMap: {[index:number]:string|string[]} = {};

    constructor(valueID?: number, attrID?: number) {
        if (valueID) this.valueID = valueID;
        if (attrID) this.attrID = attrID;
    }

    public append(value: MPropertyValue | MPropertyValue[]) {
        if (Array.isArray(value)) {
            value.forEach((value: MPropertyValue) => this.append(value));
            return this;
        }

        if (this.map.has(value.id)) {
            return this;
        }

        if (!this.values || this.values.length <= 0) {
            this.values = [];
        }

        this.values.push(value);
        this.map.set(value.property_id, value);

        if (!this.valueID)
            this.valueID = value.value_id;

        if (!this.title)
            this.title = this.getTitle();

        if (!this.attrID)
            this.attrID = value.attr_id;

        this.generatePropValueMap();

        return this;
    }

    private generatePropValueMap() {
        this.map.forEach((v, k) => {
            this.propValueMap[k] = v.value;
        });
    }

    public getTitle() {
        let value = this.values.find((item: MPropertyValue) => item.property?.is_primary);
        value = value == null ? this.values[0] : value;

        return value?.value;
    }

    public valueOf(propertyID: number) {
        if (!this.map.has(propertyID)) {
            return undefined;
        }
        const value = this.map.get(propertyID);

        return value ? value.value : undefined;
    }
}