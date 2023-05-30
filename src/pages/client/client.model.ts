import { additionalMap } from "./client-attrs/client.additional";
import { addressList, addressMap } from "./client-attrs/client.address";
import { contactList, contactMap } from "./client-attrs/client.contact";
import { mainFirstCol, mainList, mainMap, mainSecondCol } from "./client-attrs/client.main";
import { ageGroups } from "./client.config";
import { ICustomInput } from "src/app/app.interfaces";

export type ParsedClients = { clients: IClient[], parsedClients: MClient[] };

export class IClient {
    public main!: IClientMain;
    public additional!: IClientAdditional;
    public contact!: IClientContact;
    public address!: IClientAddress;
    [key: string]: any;


    constructor(data?: any) {
        this.main = data?.main ?? new IClientMain();
        this.additional = data?.additional ?? new IClientAdditional();
        this.contact = data?.contact ?? new IClientContact();
        this.address = data?.address ?? new IClientAddress();
    }

    public setCategory(node: any) {
        this.main.category_group_id = node.data.id;
    }

    public setAgeGroupID() {
        const age: number = this.main.age!;

        for (let group of ageGroups) {
            if (age >= group['from'] && age <= group['to']) {
                this.main.age_group = group['id'];
                return;
            }
        }
    }
}
export class MClient {
    public main!: MClientMain;
    public additional!: MClientAdditional;
    public contact!: MClientContact;
    public address!: MClientAddress;
    [key: string]: any;

}

export class IClientMain {
    public id!: number | null;
    public branch!: number | null;
    public registration_date!: Date | null;
    public client_code!: string | null;
    public category_group_id!: number | null;
    public gender!: number | null;
    public repeating_client: boolean | null = false;
    public name!: string | null;
    public surname!: string | null;
    public birth_date!: Date | null;
    public age!: number | null;
    public age_group!: number | null;
    public personal_id!: string | null;
    [key: string]: any;

}

export class MClientMain {
    public id!: number | null;
    public branch!: number | null;
    public registration_date!: Date | null;
    public client_code!: string | null;
    public category_group_id!: string | null;
    public gender!: string | null;
    public repeating_client: boolean | null = false;
    public name!: string | null;
    public surname!: string | null;
    public birth_date!: Date | null;
    public age!: string | null;
    public age_group!: string | null;
    public personal_id!: string | null;
    [key: string]: any;

}

export class IClientAdditional {
    public id!: number | null;
    public client_id!: number | null;
    public nationality!: number | null;
    public education!: number | null;
    public marital_status!: number | null;
    public family_members!: number | null;
    public has_social_support!: string | null;
    public has_insurance!: string | null;
    public work_address!: string | null;
    public profession!: string | null;
    [key: string]: any;

}

export class MClientAdditional {
    public id!: number | null;
    public client_id!: number | null;
    public nationality!: string | null;
    public education!: string | null;
    public marital_status!: string | null;
    public family_members!: string | null;
    public has_social_support!: string | null;
    public has_insurance!: string | null;
    public work_address!: string | null;
    public profession!: string | null;
    [key: string]: any;

}

export class IClientContact {
    public id!: number | null;
    public client_id!: number | null;
    public phone_number!: string | null;
    public home_number!: string | null;
    public personal_email!: string | null;
    public work_phone_number!: string | null;
    public work_internal_phone_number!: string | null;
    public work_email!: string | null;
    public fax!: string | null;
    [key: string]: any;

}

export class MClientContact {
    public id!: number | null;
    public client_id!: number | null;
    public phone_number!: string | null;
    public home_number!: string | null;
    public personal_email!: string | null;
    public work_phone_number!: string | null;
    public work_internal_phone_number!: string | null;
    public work_email!: string | null;
    public fax!: string | null;
    [key: string]: any;

}

export class IClientAddress {
    public id!: number | null;
    public client_id!: number | null;
    public address!: string | null;
    public zip_code!: string | null;
    public previous_address!: string | null;
    public location_id!: number | null;
    [key: string]: any;

}
export class MClientAddress {
    public id!: number | null;
    public client_id!: number | null;
    public address!: string | null;
    public zip_code!: string | null;
    public previous_address!: string | null;
    public location_id!: string | null;
    [key: string]: any;

}

export class IClientAttrs {
    public mainMap: Map<string, any> = mainMap;
    public mainList: ICustomInput[] = mainList;
    public mainFirstCol: ICustomInput[] = mainFirstCol;
    public mainSecondCol: ICustomInput[] = mainSecondCol;
    public addressMap: Map<string, any> = addressMap;
    public addressList: ICustomInput[] = addressList;
    public additionalMap: Map<string, any> = additionalMap;
    public contactMap: Map<string, any> = contactMap;
    public contactList: ICustomInput[] = contactList;

}
const clientKeys = [
    'id',
    'branch',
    'registration_date',
    'client_code',
    'category_group_id',
    'gender',
    'gender_field',
    'client_type',
    'sex',
    'client_group',
    'client_subgroup',
    'repeating_client',
    'name',
    'surname',
    'birth_date',
    'age',
    'age_group',
    'personal_id',
    'client_id',
    'nationality',
    'education',
    'marital_status',
    'family_members',
    'has_social_support',
    'has_insurance',
    'work_address',
    'profession',
    'phone_number',
    'home_phone_number',
    'personal_email',
    'work_phone_number',
    'work_internal_phone_number',
    'work_email',
    'fax',
    'address',
    'zip_code',
    'previous_address',
    'location_id',
];

export const isClientKey = (key: string) => {
    return clientKeys.includes(key);
}


const clientINTKeys: string[] = [
    'id',
    'status_id', 'client_id'
];


export const checkClientKeys = (key: string) => !clientINTKeys.includes(key);


