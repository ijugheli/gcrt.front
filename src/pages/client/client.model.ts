import { DatePipe } from "@angular/common";
import { Case, IConsultation, IDiagnosis, IPsychodiagnosis, IReferral } from "../case/case.model";
import { additionalMap } from "./client-attrs/client.additional";
import { addressList, addressMap } from "./client-attrs/client.address";
import { contactList, contactMap } from "./client-attrs/client.contact";
import { mainFirstCol, mainMap, mainSecondCol } from "./client-attrs/client.main";
import { formatDate } from "src/app/app.func";
import { ageGroups } from "./client.config";



export class Client {
    public main!: ClientMain;
    public additional!: ClientAdditional;
    public contact!: ClientContact;
    public address!: ClientAddress;

    constructor(data?: any) {
        this.main = new ClientMain();
        this.additional = new ClientAdditional();
        this.contact = new ClientContact();
        this.address = new ClientAddress();
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


export class ClientMain {
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
}

export class ClientAdditional {
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
}

export class ClientContact {
    public id!: number | null;
    public client_id!: number | null;
    public phone_number!: string | null;
    public home_number!: string | null;
    public personal_email!: string | null;
    public work_phone_number!: string | null;
    public work_internal_phone_number!: string | null;
    public work_email!: string | null;
    public fax!: string | null;
}

export class ClientAddress {
    public id!: number | null;
    public client_id!: number | null;
    public address!: string | null;
    public zip_code!: string | null;
    public previous_address!: string | null;
    public location_id!: number | null;
}

export class ICustomInput {
    fieldName!: string;
    mainKey!: keyof ClientMain;
    addressKey!: keyof ClientAddress;
    contactKey!: keyof ClientContact;
    additionalKey!: keyof ClientAdditional;
    caseKey!: keyof Case;
    diagnosisKey!: keyof IDiagnosis;
    referralKey!: keyof IReferral;
    consultationKey!: keyof IConsultation;
    psychodiagnosisKey!: keyof IPsychodiagnosis;
    label!: string;
    type!: string;
    icon!: string;
    propertyID!: number | null;
    isRequired!: boolean;
    isDisabled!: boolean;
}

export class ICaseCol {
    fieldName!: string;
    label!: string;
    constructor(data: any) {
        this.fieldName = data.fieldName;
        this.label = data.label;
    }
}

export class ClientAttrs {
    public mainMap: Map<string, any> = mainMap;
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


