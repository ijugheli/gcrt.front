import { MPropertyValue } from "./property.value.model";

export class MOption {


    public name!: string;
    public id!: number;
    public value?: MPropertyValue;


    constructor(value: MPropertyValue) {
        this.value = value;
        this.name = this.value.value;
        this.id = this.value.id;
    }

}