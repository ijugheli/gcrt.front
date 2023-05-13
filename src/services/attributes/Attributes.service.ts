import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Attribute, GuardedService } from 'src/app/app.models';
import { API_URL, VIEW_TYPE_ID } from 'src/app/app.config';
import { AuthService } from '../AuthService.service';
import { IAttribute } from './interfaces/attribute.interface';
import { AsyncSubject, Observable, first } from 'rxjs';
import { MAttribute } from './models/attribute.model';
import { IProperty } from './interfaces/property.interface';
import { MProperty } from './models/property.model';
import { flattenTree, parseTree, storageItemExists } from '../../app/app.func';
import { MAttributeSection } from './models/section.model';
import { MAttributeTab } from './models/tab.model';
import { MPropertyValue } from './models/property.value.model';
import { APIResponse } from 'src/app/app.interfaces';
import { TreeNode } from 'primeng/api';
import { MOption } from './models/option.model';
import { CacheService } from '../cache.service';

@Injectable({
    providedIn: 'root'
})
export class AttributesService extends GuardedService {

    private cacheKey = 'props';
    public attributes: Map<number, MAttribute> = new Map();
    public properties: Map<number, MProperty> = new Map();
    public dropdownOptions: Map<number, MOption> = new Map();
    public values: Map<number, MPropertyValue> = new Map();
    public flatTreeMap: Map<number, TreeNode> = new Map();
    public treeMap: Map<number, TreeNode[]> = new Map();

    treeMapChange: AsyncSubject<Map<number, TreeNode[]>> = new AsyncSubject<Map<number, TreeNode[]>>();
    dropdownOptionChange: AsyncSubject<Map<number, MOption>> = new AsyncSubject<Map<number, MOption>>();
    propertyChange: AsyncSubject<number> = new AsyncSubject<number>();

    public urls: any = {
        'static': API_URL + '/attrs/static',
        'list': API_URL + '/attrs/',
        'withProperties': API_URL + '/attrs/{attr_id}',
        'reorderProperties': API_URL + '/attrs/{attr_id}/properties/reorder',
        'withValue': API_URL + '/attrs/{attr_id}/values/{value_id}',
        'full': API_URL + '/attrs/{attr_id}/values',
        'fullWithSelect': API_URL + '/attrs/tree-select/{attr_id}/values',
        'treeselectOptions': API_URL + '/attrs/tree-select-options',
        'related': API_URL + '/attrs/{attr_id}/related/{value_id}',
        'tree': API_URL + '/attrs/{attr_id}/values/tree/{value_id}',
        'treeSelect': API_URL + '/attrs/{attr_id}/values/tree-select/{value_id}',
        'title': API_URL + '/attrs/{attr_id}/title',
        'addValueCollection': API_URL + '/attrs/{attr_id}/values/add',
        'editValueCollection': API_URL + '/attrs/{attr_id}/values/{value_id}/edit',
        'delete': API_URL + '/attrs/{attr_id}/values/remove',
        'editValueItem': API_URL + '/attrs/values/edit',
        'updateAttr': API_URL + '/attrs/{attr_id}/update',
        'updateProperty': API_URL + '/attrs/properties/{property_id}/update',
        'addAttr': API_URL + '/attrs/add',
        'removeAttr': API_URL + '/attrs/{attr_id}',
        'addSection': API_URL + '/attrs/properties/add-section',
        'addProperty': API_URL + '/attrs/properties/add-property',
        'removeProperty': API_URL + '/attrs/properties/{property_id}',
    };

    constructor(private http: HttpClient, private auth: AuthService, private cacheService: CacheService) {
        super(auth.getToken());
        this.load();
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
        console.log('data');
        console.log(data);
        this.parseProperties(data);
        console.log('this.parseProperties(data)');
        console.log(data);
        this.parseAttributes(data);
        console.log('this.parseAttributes');
        console.log(data);
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

    public addProperty(data: any) {
        return this.http.post<APIResponse>(this.urls['addProperty'], data, { headers: this.headers });
    }

    public removeAttribute(attrID: number) {
        return this.http.delete<APIResponse>(this.urls['removeAttr'].replace('{attr_id}', attrID), { headers: this.headers });
    }

    public removeProperty(propertyID: number) {
        return this.http.delete<APIResponse>(this.urls['removeProperty'].replace('{property_id}', propertyID), { headers: this.headers });
    }

    public list() {
        return this.http.get<Attribute[]>(this.urls['list'], { headers: this.headers });
    }

    public getTreeselectOptions(): Observable<APIResponse<any>> {
        return this.http.get<APIResponse<any>>(this.urls['treeselectOptions'], { headers: this.headers });
    }

    public delete(attrID: number, values: any) {
        return this.http.post<APIResponse>(this.urls['delete'].replace('{attr_id}', attrID.toString()), values, { headers: this.headers });
    }

    public related(attrID: number, valueID: number) {
        return this.http.get<APIResponse<Attribute[]>>(this.urls['related'].replace('{attr_id}', attrID.toString()).replace('{value_id}', valueID.toString()), { headers: this.headers });
    }

    public full(attrID: number, isTreeSelect: boolean = false) {
        const url = isTreeSelect ? 'fullWithSelect' : 'full';
        return this.http.get<APIResponse<Attribute[]>>(this.urls[url].replace('{attr_id}', attrID.toString()), { headers: this.headers });
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

    public treeNodes(attrID: number, valueID: number, isTreeSelect: boolean = false) {
        const url = isTreeSelect ? 'treeSelect' : 'tree';
        return this.http.get<Attribute>(this.urls[url]
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

        this.propertyChange.next(this.properties.size);
        this.propertyChange.complete();
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

        const regularProperties = attribute.properties.filter((property) => !property.isSection() && property.p_id == 0);

        if (!attribute.hasSections() || regularProperties.length > 0) {
            attribute.appendSection((new MAttributeSection()).set({
                title: 'მახასიათებლები',
            }).setProps(regularProperties));
        }

        attribute.sections = attribute.sections.sort((a: MAttributeSection, b: MAttributeSection) => {
            return !(!a.property || !b.property)
                ? (a.property?.order_id > b.property?.order_id ? 1 : -1)
                : 1;
        });
    }

    /* For Case and Client  
        AsyncSubjects for updating inputs(treeselect,dropdown) on data (options)
        FlatTreeMap for getting title for Treeselect Columns
        Treemap for getting options for Treeselect
        dropdownOptions for getting options for Dropdowns
     */

    // For Tables
    public getOptionTitle(data: number | string): string {
        if (typeof data == 'number') {
            return this.flatTreeMap.get(data)?.label || this.dropdownOptions.get(data)?.name || data.toString();
        }
        return data;
    }

    public async initSelectOptions(): Promise<void> {
        const cache = this.cacheService.get('dropdown_options');

        if (cache != null) {
            this.parseDropdownOptions(cache);
            return;
        }

        this.propertyChange.subscribe((propertyMapSize) => {
            const tempOptions: MProperty[] = Array.from(this.properties.values()).filter(e => e.source_attr_id !== null && VIEW_TYPE_ID('select') && e.source?.options.length > 0).flatMap(e => e.source.options);
            this.parseDropdownOptions(tempOptions.map(element => [element.id, element]));
            this.cacheService.set('dropdown_options', Array.from(this.dropdownOptions.entries()));
        })
    }

    public async initTreeSelect(): Promise<void> {
        const cache = this.cacheService.get('tree_options');
        if (cache != null) {
            this.parseTrees(cache);
            return;
        }

        this.getTreeselectOptions().subscribe((data) => {
            const parsedTrees = Object.entries(data.data).map(([key, value]) => {
                return [parseInt(key), parseTree(value as any[])];
            });
            this.parseTrees(parsedTrees);

            this.cacheService.set('tree_options', Array.from(this.treeMap.entries()));
        });
    }

    private parseTrees(parsedTrees: any): void {
        this.treeMap = new Map(parsedTrees);

        const trees = Array.from(this.treeMap.values()).flat();

        for (let tree of flattenTree(trees)) {
            if (!this.flatTreeMap.has(tree.data.id)) {
                this.flatTreeMap.set(tree.data.id, tree);
            }
        }
        this.treeMapChange.next(this.treeMap);
        this.treeMapChange.complete();
    }

    private parseDropdownOptions(options: any) {
        this.dropdownOptions = new Map(options);
        this.dropdownOptionChange.next(this.dropdownOptions);
        this.dropdownOptionChange.complete();
    }
}
