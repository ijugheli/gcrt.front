import { MAttribute } from "./attribute.model";

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
