import { ICaseCol, ICustomInput, } from "src/app/app.interfaces";
import { carePlanMap } from "./case-attrs/care-plan";
import { caseCols, caseList, caseMap } from "./case-attrs/case";
import { consultationCols, consultationList } from "./case-attrs/consultation";
import { diagnosisCols, diagnosisList } from "./case-attrs/diagnosis";
import { formsOfViolenceMap } from "./case-attrs/forms-of-violence";
import { referralCols, referralList } from "./case-attrs/referral";
import { generateRandomNumber } from "src/app/app.func";
import * as _ from "lodash";
import { mentalSymptomCols } from "./case-attrs/mental-symptom";
import { otherSymptomCols, otherSymptomList } from "./case-attrs/other-symptom";

export class ICase {
    public case!: ICaseMain;
    public forms_of_violences: IFormOfViolence[] = [];
    public care_plans: ICarePlan[] = [];
    public diagnoses: IDiagnosis[] = [];
    public referrals: IReferral[] = [];
    public consultations: IConsultation[] = [];
    public mental_symptoms: ICaseSharedSymptom[];
    public somatic_symptoms: ICaseSharedSymptom[];
    public other_symptoms: IOtherSymptom[];
    public psychodiagnoses!: IPsychodiagnosis;
    [key: string]: any;

    constructor(data?: any) {
        this.case = data?.case ?? new ICaseMain();
        this.forms_of_violences = data?.forms_of_violences ?? [];
        this.care_plans = data?.care_plans ?? [];
        this.mental_symptoms = data?.mental_symptoms ?? [];
        this.somatic_symptoms = data?.somatic_symptoms ?? [];
        this.other_symptoms = data?.other_symptoms ?? [];

        if (data?.diagnoses.length > 0 && data?.diagnoses !== undefined) {
            this.diagnoses = data.diagnoses.map((item: IDiagnosis) => new IDiagnosis(item));
        }

        if (data?.consultations.length > 0 && data?.consultations !== undefined) {
            this.consultations = data.consultations.map((item: IConsultation) => new IConsultation(item));
        }

        if (data?.referrals.length > 0 && data?.referrals !== undefined) {
            this.referrals = data.referrals.map((item: IReferral) => new IReferral(item));
        }

        if (data?.mental_symptoms.length > 0 && data?.mental_symptoms !== undefined) {
            this.mental_symptoms = data.mental_symptoms.map((item: IMentalSymptom) => new IMentalSymptom(item));
        }

        if (data?.somatic_symptoms.length > 0 && data?.somatic_symptoms !== undefined) {
            this.somatic_symptoms = data.somatic_symptoms.map((item: ISomaticSymptom) => new ISomaticSymptom(item));
        }

        if (data?.other_symptoms.length > 0 && data?.other_symptoms !== undefined) {
            this.other_symptoms = data.other_symptoms.map((item: IOtherSymptom) => new IOtherSymptom(item));
        }

    }

}

export type ParsedCases = { cases: ICase[], parsedCases: MCase[] };
export class MCase {
    public case!: MCaseMain;
    public forms_of_violences: IFormOfViolence[] = [];
    public care_plans: ICarePlan[] = [];
    public diagnoses: MDiagnosis[] = [];
    public referrals: MReferral[] = [];
    public consultations: MConsultation[] = [];
    public mental_symptoms: MSymptom[] = [];
    public somatic_symptoms: MSymptom[] = [];
    public other_symptoms: MSymptom[] = [];
    public psychodiagnoses!: IPsychodiagnosis;
    [key: string]: any;

    constructor(data: any) {
        Object.assign(this, data);
    }
}

export class ICaseMain {
    public id!: number | null;
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
    public health_condition!: string | null;
    [key: string]: any;
    public setNodeID?: any = (node: any, key: 'referral_body') => {
        this[key] = node.data.id;
    };
}

export class MCaseMain {
    public id!: number | null;
    public project_id!: string | null; // 199
    public case_manager_id!: string | null;
    public client_id!: string | null;
    public branch!: string | null;
    public registration_date!: Date | null;
    public referral_body!: string | null;
    public recommender!: string | null;
    public incident!: string | null;
    public incident_text!: string | null;
    public social_status!: string | null;
    public legal_status!: string | null;
    public health_condition!: string | null;
    [key: string]: any;
}

export abstract class CaseSharedInterface {
    public id?: number | null;
    public case_id?: number | null;
    public category!: number | null; // treeselect
    public comment!: string | null;
    [key: string]: any;

}

export abstract class ICaseSharedSymptom {
    public id?: number | null;
    public generated_id?: number | null;
    public case_id?: number | null;
    public symptom_id!: number | null;
    public symptom_severity!: number | null;
    public record_date!: Date | null;
    [key: string]: any;
    constructor(data?: any) {
        Object.assign(this, data);
        this.generated_id = Date.now() + generateRandomNumber();
    }
}

export class IMentalSymptom extends ICaseSharedSymptom {
    public override id?: number | null;
    public override generated_id?: number | null;
    public override case_id?: number | null;
    public override symptom_id!: number | null;
    public override symptom_severity!: number | null;
    public override record_date!: Date | null;
    [key: string]: any;
    constructor(data: any) {
        super(data);
    }
}

export class ISomaticSymptom extends ICaseSharedSymptom {
    public override id?: number | null;
    public override generated_id?: number | null;
    public override case_id?: number | null;
    public override symptom_id!: number | null;
    public override symptom_severity!: number | null;
    public override record_date!: Date | null;
    [key: string]: any;
    constructor(data: any) {
        super(data);
    }
}

export class IOtherSymptom {
    public id?: number | null;
    public generated_id?: number | null;
    public case_id?: number | null;
    public comment!: string | null;
    public record_date!: Date | null;
    [key: string]: any;

    constructor(data?: any) {
        Object.assign(this, data);
        this.generated_id = Date.now() + generateRandomNumber();
    }
}

export class MMentalSymptom {
    public id?: number | null;
    public generated_id?: number | null;
    public case_id?: number | null;
    public symptom_id!: string | null;
    public symptom_severity!: string | null;
    public record_date!: Date | null;
    [key: string]: any;
}

export class MSomaticSymptom {
    public id?: number | null;
    public generated_id?: number | null;
    public case_id?: number | null;
    public symptom_id!: string | null;
    public symptom_severity!: string | null;
    public record_date!: Date | null;
    [key: string]: any;
}

export class MOtherSymptom {
    public id?: number | null;
    public generated_id?: number | null;
    public case_id?: number | null;
    public comment!: string | null;
    public record_date!: Date | null;
    [key: string]: any;
}

export class ISymptom {
    [key: string]: ICaseSharedSymptom[] | IOtherSymptom[];
}
export class MSymptom {
    public record_date: string;
    public records: MSomaticSymptom[] | MMentalSymptom[] | MOtherSymptom[] = [];
    constructor(recordDate: string, records: any[]) {
        this.record_date = recordDate;
        this.records = records;
    }

    public static groupData(data: any) {
        return Object.entries(_.groupBy(data, 'record_date'));
    }
}

export class ICarePlan implements CaseSharedInterface {
    public id?: number | null;
    public case_id?: number | null;
    public category!: number | null;
    public comment!: string | null;
    [key: string]: any;
}

export class IFormOfViolence implements CaseSharedInterface {
    public id?: number | null;
    public case_id?: number | null;
    public category!: number | null;
    public comment!: string | null;
    [key: string]: any;
}

export class MTreeCheckboxTableItem {
    public id!: number | null;
    public case_id!: number | null;
    public category!: number | null;
    public p_value_id!: number | null; // treeselect
    public title!: string | null; // treeselect
    public isSelected?: boolean = false;
    public p_title!: string | null; // treeselect
    public value_id!: number | null; // treeselect
    public comment!: string | null;
}
export class MCheckboxTableItem {
    public id!: number | null;
    public case_id!: number | null;
    public symptom_id!: number | null;
    public title!: string | null; // treeselect
    public isSelected?: boolean = false;
    public symptom_severity!: number | null;
    public record_date!: Date | string | null;
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

    constructor(data?: IDiagnosis) {
        Object.assign(this, data);
        this.generated_id = Date.now() + generateRandomNumber();
    }
}

export class MDiagnosis {
    public generated_id?: number;
    public id!: number | null;
    public case_id!: number | null;
    public status!: string | null;
    public type!: string | null;
    public icd!: string | null; // treeselect
    public diagnosis_icd10!: string | null; // treeselect combined
    public diagnosis_dsmiv!: string | null;
    public diagnosis_date!: Date | null;
    public links_with_trauma!: string | null;
    public comment!: string | null;
    [key: string]: any;
}


export class IReferral {
    public generated_id?: number;
    public id!: number | null;
    public case_id!: number | null;
    public service_date!: Date | null;
    public type!: number | null;
    public provider!: number | null;
    public service_type!: number | null; // treeselect
    public price!: number | null;
    public result!: string | null;
    [key: string]: any;

    constructor(data?: IReferral) {
        Object.assign(this, data);
        this.generated_id = Date.now() + generateRandomNumber();
    }
}

export class MReferral {
    public generated_id?: number;
    public id!: number | null;
    public case_id!: number | null;
    public service_date!: Date | null;
    public type!: string | null;
    public provider!: string | null;
    public service_type!: string | null; // treeselect
    public price!: number | null;
    public result!: string | null;
    [key: string]: any;
}


export class IConsultation {
    public generated_id?: number;
    public id!: number | null;
    public case_id!: number | null;
    public consultant!: number | null;
    public date!: Date | null;
    public type!: number | null;
    public duration!: number | null;
    public consultant_record!: string | null;
    public consultant_prescription!: string | null;
    [key: string]: any;

    public setNodeID?: any = (node: any, key: 'service_type') => {
        this[key] = node.data.id;
    };

    constructor(data?: IConsultation) {
        Object.assign(this, data);
        this.generated_id = Date.now() + generateRandomNumber();
    }
}

export class MConsultation {
    public generated_id?: number;
    public id!: number | null;
    public case_id!: number | null;
    public consultant!: string | null;
    public date!: Date | null;
    public type!: string | null;
    public duration!: string | null;
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
    public diagnosisCols: ICaseCol[] = diagnosisCols;
    public referralCols: ICaseCol[] = referralCols;
    public consultationCols: ICaseCol[] = consultationCols;
    public symptomCols: ICaseCol[] = mentalSymptomCols;
    public caseCols: ICaseCol[] = caseCols;
    public otherSymptomList: ICustomInput[] = otherSymptomList;
    public otherSymptomCols: ICaseCol[] = otherSymptomCols;
}

export class MOnSectionEvent {
    data?: any;
    model?: any;
    errorMessage?: string;
    successMessage?: string;
}

const caseKeys = [
    'project_id',
    'case_manager_id',
    'client_id',
    'branch',
    'registration_date',
    'referral_body',
    'recommender',
    'incident',
    'incident_text',
    'social_status',
    'legal_status',
];

const caseINTKeys: string[] = [
    'id',
    'status_id',
    'generated_id',
    'case_id'
];


export const checkCaseKeys = (key: string) => !caseINTKeys.includes(key);

export const isCaseKey = (key: string) => caseKeys.includes(key);

