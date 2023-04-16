import { ICustomInput, } from "src/app/app.interfaces";
import { carePlanMap } from "./case-attrs/care-plan";
import { caseList, caseMap } from "./case-attrs/case";
import { consultationList } from "./case-attrs/consultation";
import { diagnosisList } from "./case-attrs/diagnosis";
import { formsOfViolenceMap } from "./case-attrs/forms-of-violence";
import { referralList } from "./case-attrs/referral";

export class ICase {
    public case!: Case;
    public forms_of_violence: IFormOfViolence[] = [];
    public care_plans: ICarePlan[] = [];
    public diagnosis: IDiagnosis[] = [];
    public referral: IReferral[] = [];
    public consultation: IConsultation[] = [];
    public psychodiagnosis!: IPsychodiagnosis;

    constructor() {
        this.case = new Case();
    }

}

export class Case {
    public project_id!: number | null; // 199
    public case_manager_id!: number | null;
    public client_id!: number | null;
    public branch!: number | null;
    public registration_date!: Date | null;
    public referral_body!: number | null;
    public recommender!: string | null;
    public incident!: number | null;
    public incident_text!: string | null;
    public social_status!: string | null;
    public legal_status!: string | null;
    [key: string]: any;
    public setNodeID: any = (node: any, key: 'referral_body') => {
        this[key] = node.data.id;
    };
}

export abstract class CaseSharedInterface {
    public case_id?: number | null;
    public category!: number | null; // treeselect
    public comment!: string | null;
    [key: string]: any;

}

export class ICarePlan implements CaseSharedInterface {
    public case_id?: number | null;
    public category!: number | null;
    public comment!: string | null;
    [key: string]: any;

}

export class IFormOfViolence implements CaseSharedInterface {
    public case_id?: number | null;
    public category!: number | null;
    public comment!: string | null;
    [key: string]: any;

}

export class MCheckboxTableItem {
    public case_id!: number | null;
    public category!: number | null;
    public p_value_id!: number | null; // treeselect
    public title!: string | null; // treeselect
    public isSelected?: boolean = false;
    public p_title!: string | null; // treeselect
    public value_id!: number | null; // treeselect
    public comment!: string | null;

}

export class IDiagnosis {
    public generated_id?: number;
    public id!: number | null;
    public case_id!: number | null;
    public status!: number | null;
    public type!: number | null;
    public icd!: number | null; // treeselect
    public diagnosis_icd10!: number | null; // treeselect combined
    public diagnosis_dsmiv!: number | null;
    public diagnosis_date!: Date | null;
    public links_with_trauma!: number | null;
    public comment!: string | null;
    [key: string]: any;
    public setNodeID?: any = (node: any, key: 'icd') => {
        this[key] = node.data.id;
    };

    constructor() {
        if (this.id == null) {
            this.generated_id = Date.now();
        }
    }
}

export class IReferral {
    public case_id!: number | null;
    public service_date!: Date | null;
    public type!: number | null;
    public provider!: number | null;
    public service_type!: number | null; // treeselect
    public price!: number | null;
    public result!: string | null;
    [key: string]: any;

    public setNodeID: any = (node: any, key: 'service_type') => {
        this[key] = node.data.id;
    };
}

export class IConsultation {
    public case_id!: number | null;
    public consultant!: number | null;
    public date!: Date | null;
    public type!: number | null;
    public duration!: number | null;
    public consultant_record!: string | null;
    public consultant_prescription!: string | null;
    [key: string]: any;
}

export class IPsychodiagnosis {
    public case_id!: number | null;
    [key: string]: any;

}

export class CaseAttrs {
    public caseMap: Map<string, any> = caseMap;
    public caseList: ICustomInput[] = caseList;
    public caseFirstCol: ICustomInput[] = caseList.slice(0, 7);
    public caseSecondCol: ICustomInput[] = caseList.slice(9);
    public diagnosisList: ICustomInput[] = diagnosisList;
    public formsOfViolenceMap: Map<string, any> = formsOfViolenceMap;
    public carePlanMap: Map<string, any> = carePlanMap;
    public consultationList: ICustomInput[] = consultationList;
    public referralList: ICustomInput[] = referralList;
    // public mainMap: Map<string, any> = mainMap;
    // public mainFirstCol: ICustomInput[] = mainFirstCol;
    // public mainSecondCol: ICustomInput[] = mainSecondCol;
    // public addressMap: Map<string, any> = addressMap;
    // public addressList: ICustomInput[] = addressList;
    // public additionalMap: Map<string, any> = additionalMap;
    // public contactMap: Map<string, any> = contactMap;
    // public contactList: ICustomInput[] = contactList;

}