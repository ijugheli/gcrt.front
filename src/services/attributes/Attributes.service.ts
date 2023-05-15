import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Attribute, GuardedService } from 'src/app/app.models';
import { API_URL, DISABLED_ATTRS, VIEW_TYPE_ID } from 'src/app/app.config';
import { AuthService } from '../AuthService.service';
import { IAttribute } from './interfaces/attribute.interface';
import { AsyncSubject, BehaviorSubject, Observable, map, mergeMap, toArray } from 'rxjs';
import { MAttribute } from './models/attribute.model';
import { IProperty } from './interfaces/property.interface';
import { MProperty } from './models/property.model';
import { flattenTree, parseTree } from '../../app/app.func';
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
export class AttributesService {
    private cacheKey = 'props';
    private attributes$: BehaviorSubject<Map<number, MAttribute>> = new BehaviorSubject<Map<number, MAttribute>>(new Map());
    private attributes: Map<number, MAttribute> = new Map();
    private properties$: BehaviorSubject<Map<number, MProperty>> = new BehaviorSubject<Map<number, MProperty>>(new Map());
    private properties: Map<number, MProperty> = new Map();
    public dropdownOptions: Map<number, MOption> = new Map();
    public values: Map<number, MPropertyValue> = new Map();
    public flatTreeMap: Map<number, TreeNode> = new Map();
    public treeMap: Map<number, TreeNode[]> = new Map();

    public treeMap$: AsyncSubject<Map<number, TreeNode[]>> = new AsyncSubject<Map<number, TreeNode[]>>();
    public dropdownOptions$: AsyncSubject<Map<number, MOption>> = new AsyncSubject<Map<number, MOption>>();

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

    constructor(private http: HttpClient, private cacheService: CacheService) {

    }


    public getMap(): Observable<Map<number, MAttribute>> {
        return this.attributes$;
    }

    public getList(): Observable<MAttribute[]> {
        return this.attributes$.pipe((map((attrs: Map<number, MAttribute>) => Array.from(attrs.values()))));
    }

    // Disabled attrs for dropdowns
    public getStructureList(): Observable<MAttribute[]> {
        return this.attributes$.pipe((map((attrs: Map<number, MAttribute>) => {
            return Array.from(attrs.values()).filter((e) => {
                return !DISABLED_ATTRS.includes(e.id);
            });
        }
        )));
    }

    public getPropertyMap(): Observable<Map<number, MProperty>> {
        return this.properties$;
    }

    public getPropertyList(): Observable<MProperty[]> {
        return this.properties$.pipe((map((properties: Map<number, MProperty>) => Array.from(properties.values()))));
    }

    //Loader/Parser Methods
    private saveCache(data: IAttribute[]) {
        this.cacheService.set(this.cacheKey, data);
    }

    public load(shouldRefresh?: boolean) {
        const cache = this.cacheService.get(this.cacheKey);

        if (cache != null && !shouldRefresh) {
            this.parseStaticAttrs(cache);
            return;
        }

        this.getStatic().subscribe((response) => {
            this.parseStaticAttrs(response.data!);
        });
    }

    public parseStaticAttrs(data: IAttribute[]): void {
        this.attributes = new Map();
        this.properties = new Map();
        this.saveCache(data);
        this.parse(data);
        this.properties$.next(this.properties);
        this.attributes$.next(this.attributes);
    }

    private getStatic(f?: Function): Observable<APIResponse<IAttribute[]>> {
        return this.http.get<APIResponse<IAttribute[]>>(this.urls['static'],);
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
    private find(attrID: number): MAttribute | undefined {
        return this.get(attrID);
    }

    private get(attrID: number): MAttribute | undefined {
        if (!this.attributes.has(attrID)) {
            return undefined;
        }

        let attribute = this.attributes.get(attrID);

        return attribute ? attribute : undefined;
    }

    // public property(propertyID: number) {
    //     if (!this.properties.has(propertyID)) {
    //         return false;
    //     }

    //     return this.properties.get(propertyID);
    // }

    // Individual Requests
    public add(data: any) {
        return this.http.post<APIResponse>(this.urls['addAttr'], data,);
    }

    public addSection(data: any) {
        return this.http.post<APIResponse>(this.urls['addSection'], data,);
    }

    public addProperty(data: any) {
        return this.http.post<APIResponse>(this.urls['addProperty'], data,);
    }

    public removeAttribute(attrID: number) {
        return this.http.delete<APIResponse>(this.urls['removeAttr'].replace('{attr_id}', attrID),);
    }

    public removeProperty(propertyID: number) {
        return this.http.delete<APIResponse>(this.urls['removeProperty'].replace('{property_id}', propertyID),);
    }

    public list() {
        return this.http.get<Attribute[]>(this.urls['list'],);
    }

    public getTreeselectOptions(): Observable<APIResponse<any>> {
        return this.http.get<APIResponse<any>>(this.urls['treeselectOptions'],);
    }

    public delete(attrID: number, values: any) {
        return this.http.post<APIResponse>(this.urls['delete'].replace('{attr_id}', attrID.toString()), values,);
    }

    public related(attrID: number, valueID: number) {
        return this.http.get<APIResponse<Attribute[]>>(this.urls['related'].replace('{attr_id}', attrID.toString()).replace('{value_id}', valueID.toString()),);
    }

    public full(attrID: number, isTreeSelect: boolean = false) {
        const url = isTreeSelect ? 'fullWithSelect' : 'full';
        return this.http.get<APIResponse<Attribute[]>>(this.urls[url].replace('{attr_id}', attrID.toString()),);
    }

    public attribute(attrID: number) {
        return this.http.get<Attribute>(this.urls['withProperties'].replace('{attr_id}', attrID.toString()),);
    }

    public attributeWithValue(attrID: number, valueID: number) {
        return this.http.get<Attribute>(this.urls['withValue']
            .replace('{attr_id}', attrID.toString())
            .replace('{value_id}', valueID),
        );
    }

    public treeNodes(attrID: number, valueID: number, isTreeSelect: boolean = false) {
        const url = isTreeSelect ? 'treeSelect' : 'tree';
        return this.http.get<Attribute>(this.urls[url]
            .replace('{attr_id}', attrID.toString())
            .replace('{value_id}', valueID.toString()),
        );
    }

    public setTitle(attrID: number, values: any) {
        return this.http.post(this.urls['title'].replace('{attr_id}', attrID.toString()), values,);
    }

    public addValueCollection(attrID: number, values: any) {
        return this.http.post(this.urls['addValueCollection'].replace('{attr_id}', attrID.toString()), values,);
    }

    public editValueCollection(attrID: number, valueID: number, values: any) {
        return this.http.post(this.urls['editValueCollection']
            .replace('{attr_id}', attrID.toString())
            .replace('{value_id}', valueID.toString()), values,);
    }

    public editValueItem(values: any) {
        return this.http.post(this.urls['editValueItem'], values,);
    }

    public reorderProperties(attrID: number, values: any) {
        this.http.post(
            this.urls['reorderProperties'].replace('{attr_id}', attrID.toString()
            ), values,).subscribe((response) => {
                this.load();
            });
    }

    public updateAttr(attrID: number, values: any) {
        return this.http.post<APIResponse>(
            this.urls['updateAttr'].replace('{attr_id}', attrID.toString()
            ), values,);
    }

    public updateProperty(propertyID: number, property: MProperty) {
        return this.http.post<APIResponse>(
            this.urls['updateProperty'].replace('{property_id}', propertyID.toString()
            ), { 'data': property },);
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

        this.properties$.subscribe((properties) => {
            const tempOptions: MProperty[] = Array.from(properties.values()).filter(e => e.source_attr_id !== null && VIEW_TYPE_ID('select') && e.source?.options.length > 0).flatMap(e => e.source.options);
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
        this.treeMap$.next(this.treeMap);
        this.treeMap$.complete();
    }

    private parseDropdownOptions(options: any) {
        this.dropdownOptions = new Map(options);
        this.dropdownOptions$.next(this.dropdownOptions);
        this.dropdownOptions$.complete();
    }
}
