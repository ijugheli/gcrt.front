import { MPropertyValue } from "./property.value.model";

export class MOption {

    public name!: string;
    public id!: number;
    public value?: MPropertyValue;


    constructor(value?: MPropertyValue) {
        if (!value) {
            return;
        }

        this.value = value;
        this.name = this.value.value;
        this.id = this.value.id;
    }

    public static from(id: number, name: string) {
        let option = new MOption();
        option.name = name;
        option.id = id;
        return option;
    }

}