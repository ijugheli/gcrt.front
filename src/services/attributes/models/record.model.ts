import { MAttribute } from "./attribute.model";
import { MOption } from "./option.model";
import { MPropertyValue } from './property.value.model';

export class MRecord {
    public valueID!: number;
    public attrID!: number;
    public title!: string;
    public attribute!: MAttribute;
    public values!: MPropertyValue[];
    public map: Map<number, MPropertyValue> = new Map();
    public propValueMap: { [index: number]: string | string[] } = {};
    public formValueMap: { [index: number]: any } = {};

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
        this.generateFormValueMap();

        return this;
    }

    private generatePropValueMap() {
        this.map.forEach((v, k) => {
            this.propValueMap[k] = v.value;
        });
    }

    private generateFormValueMap() {
        this.map.forEach((v, k) => {
            this.formValueMap[k] = this.loadInitialValue(v);
        });
    }

    private loadInitialValue(propertyValue: MPropertyValue) {
        if (propertyValue.value == null) {
            return undefined;
        }

        // if (this.isTree()) {
        //   this.selected = JSON.parse(this.initialValue);
        //   this.onUpdate(this.selected);
        //   return;
        // }


        if (propertyValue.property?.isSelect() || propertyValue.property?.isMultiselect()) {
            let selected = JSON.parse(propertyValue.value_json as string);
            selected = propertyValue.property.isMultiselect()
                ? Array.from(selected) as MOption[]
                : selected as MOption;

            return selected;
        }

        if (propertyValue.property?.isDate()) {
            return new Date(propertyValue.value);
        }

        if (propertyValue.property?.isBoolean()) {
            return propertyValue.value != null && propertyValue.value == 1 ? true : false;
            return;
        }

        return propertyValue.value;

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