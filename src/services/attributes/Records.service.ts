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
import { MRecord } from './models/record.model';
import { AttributesService } from './Attributes.service';
import { IPropertyValue } from './interfaces/property.value.interface';
import { IRecord } from './interfaces/record.interface';


class APIResponse<T> {
    public status?: string;
    public code?: number;
    public data?: T;
}


@Injectable({
    providedIn: 'root'
})
export class RecordsService extends GuardedService {

    private cacheKey = 'records';
    /**
     * RecordID => MRecord
     */
    public records: Map<number, MRecord> = new Map();

    public attrs: Map<number, number[]> = new Map();

    public attrID?: number;



    public urls: any = {
        'title': API_URL + '/attrs/{attr_id}/title',
        'add': API_URL + '/attrs/{attr_id}/values/add',
        'edit': API_URL + '/attrs/{attr_id}/values/{value_id}/edit',
        'delete': API_URL + '/attrs/{attr_id}/values/remove',
        'editValueItem': API_URL + '/attrs/values/edit',
        'records': API_URL + '/attrs/{attr_id}/records'
    };

    constructor(
        private http: HttpClient,
        private attributes: AttributesService,
        private auth: AuthService) {
        super(auth.getToken());
    }

    private log() {
        console.log('Current Records');
        console.log(this.records);
        console.log('Current Records');
    }

    private save(response: any) {
        console.log("Trying To save", response);
        if (!response || !response.hasOwnProperty('record') || !response.record) {
            return;
        }

        const record: MRecord = (new MRecord()).append(this.generateRecord(response.record));

        this.records.set(record.valueID, record);

        return this;
    }

    private generateRecord(record: IPropertyValue[]) {
        return record.map((value: IPropertyValue) => {
            const propValue = new MPropertyValue(value);
            const prop = this.attributes.property(propValue.property_id)
            if (prop) propValue.setProperty(prop);
            return propValue;
        });
    }

    // public set(recordID : number, values : MPropertyValue[]) {
    //     this.save();
    // }

    public async get(attrID: number, func?: Function) {
        const records: MRecord[] = [];
        await this.http.get<APIResponse<MRecord[]>>(
            this.urls['records'].replace('{attr_id}', attrID.toString()
            ), { headers: this.headers }).pipe(first()).toPromise().then((response) => {
                if (!response || !response.hasOwnProperty('data') || !response.data) {
                    return;
                }

                console.log('Records for ' + attrID + '-----');

                for (let record of response.data as IRecord[]) {
                    const generated = this.generateRecord(record.values as IPropertyValue[]);
                    const recordModel = (new MRecord(record.valueID, record.attrID)).append(generated);
                    records.push(recordModel);
                }

                console.log('Records for ' + attrID + '-----');
                console.log(records);
                console.log('Records for ' + attrID + '-----');


            }
            ).catch((error) => {
                console.error(error);
            });
        return records;

        // .subscribe((response) => {
        //     const records: MRecord[] = [];
        //     if (!response || !response.hasOwnProperty('records') || !response.records) {
        //         return;
        //     }
        //     for (let record of response) {
        //         records.push((new MRecord(record.valueID, record.attrID)).append(record.values as MPropertyValue[]));
        //     }
        //     console.log('Records for ' + attrID + '-----');
        //     console.log(response as MRecord[]);
        //     console.log('Records for ' + attrID + '-----');
        // });
    }




    private record(recordID: number) {
        if (!this.records.has(recordID)) {
            return null;
        }

        return this.records.get(recordID);
    }

    public async add(attrID: number, values: any, func?: Function) {
        this.http.post(
            this.urls['add'].replace('{attr_id}', attrID.toString()
            ), values, { headers: this.headers }).subscribe((response) => {
                if (response && response.hasOwnProperty('record')) {
                    this.save(response);
                }

                if (func)
                    func(response);
            });
    }

    public async edit(attrID: number, valueID: number, values: any, func?: Function) {
        this.http.post(this.urls['edit']
            .replace('{attr_id}', attrID.toString())
            .replace('{value_id}', valueID.toString()), values, { headers: this.headers }).subscribe((response) => {
                if (response && response.hasOwnProperty('record')) {
                    this.save(response);
                }

                if (func)
                    func(response);
            });
    }

    //Should be updating concrete
    public editValueItem(values: any) {
        return this.http.post(this.urls['editValueItem'], values, { headers: this.headers });
    }




}
