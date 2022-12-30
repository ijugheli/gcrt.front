import { MAttribute } from "./attribute.model";
import { MPropertyValue } from './property.value.model';

export class MValue {
    public valueID!: number;
    public title!: string;
    public attribute!: MAttribute;
    public values!: MPropertyValue[];
    public map: Map<number, MPropertyValue> = new Map();

    constructor(value?: MPropertyValue) {
        if (!value) return;

        this.valueID = value.value_id;
        this.values = [value];
        this.map.set(value.id, value);
    }

    public append(value: MPropertyValue) {
        if (this.map.has(value.id)) {
            return;
        }

        this.values.push(value);
        this.title = this.getTitle();
        this.map.set(value.id, value);
    }

    public getTitle() {
        let value = this.values.find((item: MPropertyValue) => item.property?.is_primary);
        value = value == null ? this.values[0] : value;

        return value?.value;
    }


}