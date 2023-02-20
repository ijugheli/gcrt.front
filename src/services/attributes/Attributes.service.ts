import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Attribute, GuardedService } from 'src/app/app.models';
import { ThisReceiver } from '@angular/compiler';
import { API_URL } from 'src/app/app.config';
import { AuthService } from '../AuthService.service';
import { IAttribute } from './interfaces/attribute.interface';
import { first } from 'rxjs';
import { MAttribute } from './models/attribute.model';
import { IProperty } from './interfaces/property.interface';
import { MProperty } from './models/property.model';
import { storageItemExists } from '../../app/app.func';
import { MAttributeSection } from './models/section.model';
import { MAttributeTab } from './models/tab.model';
import { MPropertyValue } from './models/property.value.model';
import { APIResponse } from 'src/app/app.interfaces';
import { of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AttributesService extends GuardedService {

    private cacheKey = 'props';
    public attributes: Map<number, MAttribute> = new Map();
    public properties: Map<number, MProperty> = new Map();
    public values: Map<number, MPropertyValue> = new Map();

    public urls: any = {
        'static': API_URL + '/attrs/static',
        'list': API_URL + '/attrs/',
        'withProperties': API_URL + '/attrs/{attr_id}',
        'reorderProperties': API_URL + '/attrs/{attr_id}/properties/reorder',
        'withValue': API_URL + '/attrs/{attr_id}/values/{value_id}',
        'full': API_URL + '/attrs/{attr_id}/values',
        'related': API_URL + '/attrs/{attr_id}/related/{value_id}',
        'tree': API_URL + '/attrs/{attr_id}/values/tree/{value_id}',
        'title': API_URL + '/attrs/{attr_id}/title',
        'addValueCollection': API_URL + '/attrs/{attr_id}/values/add',
        'editValueCollection': API_URL + '/attrs/{attr_id}/values/{value_id}/edit',
        'delete': API_URL + '/attrs/{attr_id}/values/remove',
        'editValueItem': API_URL + '/attrs/values/edit',
        'updateAttr': API_URL + '/attrs/{attr_id}/update',
        'updateProperty': API_URL + '/attrs/properties/{property_id}/update',
        'addAttr': API_URL + '/attrs/add',
        'addSection': API_URL + '/attrs/add-section',
        'addSectionProperty': API_URL + '/attrs/add-section-property',
        'addProperty': API_URL + '/attrs/{attr_id}/properties/add',
    };

    constructor(private http: HttpClient, private auth: AuthService) {
        super(auth.getToken());
        setTimeout(() => this.load(), 0);
    }

    //Loader/Parser Methods
    private saveCache(data: IAttribute[]) {
        localStorage.setItem(this.cacheKey, JSON.stringify(data));
    }

    private loadCache(): void {
        if (!this.hasCache()) {
            return;
        }

        let data: IAttribute[] = JSON.parse(localStorage.getItem(this.cacheKey) as string) as IAttribute[];

        this.parse(data);
    }

    private hasCache(): boolean {
        return storageItemExists(this.cacheKey);
    }

    public load(onLoad?: Function) {
        if (this.hasCache()) {
            this.loadCache();
            return this.asList();
        }

        this.request((response: APIResponse<IAttribute[]>) => {
            const attributes: IAttribute[] = response.data!;

            this.saveCache(attributes);
            this.parse(attributes);
            if (onLoad) onLoad();
        });

        return this.asList();
    }

    public async reload() {
        return new Promise<MAttribute[]>((resolve, reject) => {
            this.request((response: APIResponse<IAttribute[]>) => {
                const attributes: IAttribute[] = response.data!;

                this.saveCache(attributes);
                this.parse(attributes);
                resolve(this.asList());
            });
        });
    }

    private async request(f?: Function) {
        this.http.get<APIResponse[]>(this.urls['static'], { headers: this.headers }).pipe(first()).subscribe((data) => {
            if (f) f(data)
        }, (e) => {

        });
    }

    private parse(data: IAttribute[]) {
        this.parseProperties(data);
        this.parseAttributes(data);
        this.appendChildren();
        this.appendSections();
        this.appendTabs();
        this.appendValues();
        this.appendSources();
    }







    //ORM Method
    public find(attrID: number): MAttribute | undefined {
        return this.get(attrID);
    }

    public get(attrID: number): MAttribute | undefined {
        if (!this.attributes.has(attrID)) {
            return undefined;
        }

        let attribute = this.attributes.get(attrID);

        return attribute ? attribute : undefined;
    }

    public property(propertyID: number) {
        if (!this.properties.has(propertyID)) {
            return false;
        }

        return this.properties.get(propertyID);
    }

    public asList(): MAttribute[] {
        return Array.from(this.attributes.values());
    }




    // Individual Requests
    public add(data: any) {
        return this.http.post<APIResponse>(this.urls['addAttr'], data, { headers: this.headers });
    }

    public addSection(data: any) {
        return this.http.post<APIResponse>(this.urls['addSection'], data, { headers: this.headers });
    }

    public addSectionProperty(data: any) {
        return this.http.post<APIResponse>(this.urls['addSectionProperty'], data, { headers: this.headers });
    }

    public list() {
        return this.http.get<Attribute[]>(this.urls['list'], { headers: this.headers });
    }

    public delete(attrID: number, values: any) {
        return this.http.post<APIResponse>(this.urls['delete'].replace('{attr_id}', attrID.toString()), values, { headers: this.headers });
    }

    public related(attrID: number, valueID: number) {
        return this.http.get<APIResponse<Attribute[]>>(this.urls['related'].replace('{attr_id}', attrID.toString()).replace('{value_id}', valueID.toString()), { headers: this.headers });
    }

    public full(attrID: number) {
        return this.http.get<APIResponse<Attribute[]>>(this.urls['full'].replace('{attr_id}', attrID.toString()), { headers: this.headers });
    }

    public attribute(attrID: number) {
        return this.http.get<Attribute>(this.urls['withProperties'].replace('{attr_id}', attrID.toString()), { headers: this.headers });
    }

    public attributeWithValue(attrID: number, valueID: number) {
        return this.http.get<Attribute>(this.urls['withValue']
            .replace('{attr_id}', attrID.toString())
            .replace('{value_id}', valueID), { headers: this.headers }
        );
    }

    public treeNodes(attrID: number, valueID: number) {
        return this.http.get<Attribute>(this.urls['tree']
            .replace('{attr_id}', attrID.toString())
            .replace('{value_id}', valueID.toString()), { headers: this.headers }
        );
    }

    public setTitle(attrID: number, values: any) {
        return this.http.post(this.urls['title'].replace('{attr_id}', attrID.toString()), values, { headers: this.headers });
    }

    public addValueCollection(attrID: number, values: any) {
        return this.http.post(this.urls['addValueCollection'].replace('{attr_id}', attrID.toString()), values, { headers: this.headers });
    }

    public editValueCollection(attrID: number, valueID: number, values: any) {
        return this.http.post(this.urls['editValueCollection']
            .replace('{attr_id}', attrID.toString())
            .replace('{value_id}', valueID.toString()), values, { headers: this.headers });
    }

    public editValueItem(values: any) {
        return this.http.post(this.urls['editValueItem'], values, { headers: this.headers });
    }

    public addProperty(attrID: number, values: any, func?: Function) {
        this.http.post(
            this.urls['addProperty'].replace('{attr_id}', attrID.toString()
            ), values, { headers: this.headers }).subscribe((response) => {

                this.request();
                if (func)
                    func(response);
            });
    }

    public reorderProperties(attrID: number, values: any, func?: Function) {
        this.http.post(
            this.urls['reorderProperties'].replace('{attr_id}', attrID.toString()
            ), values, { headers: this.headers }).subscribe((response) => {

                this.request();
                if (func)
                    func(response);
            });
    }

    public updateAttr(attrID: number, values: any) {
        return this.http.post<APIResponse>(
            this.urls['updateAttr'].replace('{attr_id}', attrID.toString()
            ), values, { headers: this.headers });
    }

    public updateProperty(propertyID: number, property: MProperty) {
        return this.http.post<APIResponse>(
            this.urls['updateProperty'].replace('{property_id}', propertyID.toString()
            ), { 'data': property }, { headers: this.headers });
    }

    //Parsers
    private parseProperties(data: IAttribute[]) {
        data.map((item) => {
            if (!item.properties || item.properties.length <= 0) {
                return;
            }

            item.properties.map((property: IProperty) => {
                this.properties.set(property.id, new MProperty(property));
            });
        });
    }

    private parseAttributes(data: IAttribute[]) {
        data.forEach((source: IAttribute) => {
            let properties: MProperty[] = [];
            let columns: MProperty[] = [];
            //assigns created property objects to properties column; 
            source.properties.forEach((source: IProperty) => {
                let property = this.properties.get(source.id);
                if (!property || property == null || property === undefined) {
                    return;
                }

                properties.push(property);
            });

            properties = properties.sort((a, b) => a.order_id - b.order_id);
            columns = properties.filter((prop) => !prop.isSection());

            const attribute: MAttribute = new MAttribute(source, properties);
            // attribute.withProps(properties);
            attribute.withColumns(columns);

            this.attributes.set(attribute.id, attribute);
        });

        console.log('----------Attributes----------');
        console.log(this.attributes);
        console.log('----------Attributes----------');
    }

    private appendChildren() {
        this.attributes.forEach((attribute: MAttribute) => {
            if (!attribute.hasParent()) {
                return;
            }

            this.attributes.get(attribute.parentID())?.appendChild(attribute);
        });
    }

    private appendValues() {
        this.attributes.forEach((attribute: MAttribute) => {
            if (!attribute.hasValues()) {
                return;
            }

            attribute.values.forEach((value: MPropertyValue) => {
                this.values.set(value.id, value.setProperty(this.properties.get(value.id)));
            });
        });
    }

    public appendSources() {
        this.properties.forEach((property: MProperty) => {
            if (!property.hasSource() || !property.source_attr_id) {
                return;
            }

            let attribute = this.find(property.source_attr_id);
            if (attribute)
                property = property.withSource(attribute);
        });
    }

    private appendTabs() {
        this.attributes.forEach((attribute: MAttribute) => {
            let initial = (new MAttributeTab()).set({
                title: 'მონაცემები',
                id: attribute.id
            });

            if (attribute.hasChildren()) {
                attribute.tabs = [
                    initial,
                    ...attribute.children.map((child: MAttribute) => new MAttributeTab(child))
                ]
                return;
            }
        });
    }

    private appendSections() {
        this.attributes.forEach(this.appendSection);
    }

    // update section properties
    public updateSectionProperties(properties: IProperty[], attrID: number): MAttribute {
        const attribute = this.attributes.get(attrID) as MAttribute;
        const newProperties: MProperty[] = [];

        properties.forEach((e) => {
            newProperties.push(new MProperty(e));
            return e;
        });

        properties.map((property: IProperty) => {
            this.properties.set(property.id, new MProperty(property));
        });

        attribute.properties = newProperties as MProperty[];

        attribute.sections = [];

        this.appendSection(attribute);

        return attribute;
    }

    private appendSection = (attribute: MAttribute) => {
        attribute.properties.map((property: MProperty, propertyID: number) => {
            if (!property.isSection()) {
                return;
            }
            let props: MProperty[] =
                attribute.properties
                    .filter((prop: MProperty) => {
                        return !prop.isSection() && prop.parentID() == property.id;
                    })
                    .sort((a: MProperty, b: MProperty) => {
                        return a.order_id > b.order_id ? 1 : -1;
                    });

            attribute.appendSection((new MAttributeSection(property)).setProps(props));
        });

        if (!attribute.hasSections()) {
            attribute.appendSection((new MAttributeSection()).set({
                title: 'მახასიათებლები',
            }).setProps(attribute.properties));
        }

        attribute.sections = attribute.sections.sort((a: MAttributeSection, b: MAttributeSection) => {
            return !(!a.property || !b.property)
                ? (a.property?.order_id > b.property?.order_id ? 1 : -1)
                : 1;
        });

    }

}
