import { Case, ICaseSection, IConsultation, IDiagnosis, IPsychodiagnosis, IReferral } from "../case/case.model";
import { additionalMap } from "./client-attrs/client.additional";
import { addressList, addressMap } from "./client-attrs/client.address";
import { contactList, contactMap } from "./client-attrs/client.contact";
import { mainFirstCol, mainMap, mainSecondCol } from "./client-attrs/client.main";


export class Client {
    public main!: ClientMain;
    public additional!: ClientAdditional;
    public contact!: ClientContact;
    public address!: ClientAddress;

    constructor() {
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

        if (age <= 15) {
            this.main.age_group = 234;
            return;
        } else if (age >= 16 && age <= 35) {
            this.main.age_group = 236;
            return;
        } else if (age >= 36 && age <= 45) {
            this.main.age_group = 238;
            return;
        } else if (age >= 60) {
            this.main.age_group = 240;
            return;
        }
        this.main.age_group = 240;
    }
}

export class ClientMain {
    public branch!: number | null;
    public registration_date!: Date | null;
    public client_code!: string | null;
    public category_group_id!: number | null;
    public gender!: number | null;
    public repeating_client!: number | null;
    public name!: string | null;
    public surname!: string | null;
    public birth_date!: Date | null;
    public age!: number | null;
    public age_group!: number | null;
    public personal_id!: string | null;
}

export class ClientAdditional {
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
    public client_id!: number | null;
    public address!: string | null;
    public zip!: string | null;
    public previous_address!: string | null;
    public location!: number | null;
}

export class ICustomInput {
    fieldName!: string;
    mainKey!: keyof ClientMain;
    addressKey!: keyof ClientAddress;
    contactKey!: keyof ClientContact;
    additionalKey!: keyof ClientAdditional;
    caseKey!: keyof Case;
    diagnosisKey!: keyof IDiagnosis;
    caseSectionKey!: keyof ICaseSection;
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