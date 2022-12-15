import { MProperty } from './property.model';
export class MAttributeSection {
    public title!: string;
    public propertyID?: number;
    public property?: MProperty;
    public children!: MProperty[]; // It might not be needed
    public properties!: MProperty[];


    public set(data: { title: string, propertyID?: number, property?: MProperty }) {
        this.title = data.title;
        this.propertyID = data.propertyID;
        this.property = data.property;
        return this;
    }

    constructor(property?: MProperty) {
        if (!property) {
            return;
        }

        this.title = property.title;
        this.propertyID = property.id;
        this.property = property;
    }

    public appendChild(property: MProperty) {
        this.children.push(property);
        return this;
    }

    public setProps(props: MProperty[]) {
        this.properties = props;
        return this;
    }




}