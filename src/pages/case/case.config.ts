import { IFormMenuOption } from "src/app/app.interfaces";

export const menuOptions: IFormMenuOption[] = [
    { anchor: 'case', label: 'ქეისი', value: 0, icon: 'pi pi-briefcase' },
    { anchor: 'forms_of_violences', label: 'ძალადობის ფორმები', value: 1, icon: 'pi pi-list' },
    { anchor: 'care_plans', label: 'მოვლის გეგმა', value: 2, icon: 'pi pi-list' },
    { anchor: 'diagnoses', label: 'დიაგნოზი', value: 3, icon: 'pi pi-copy' },
    { anchor: 'referrals', label: 'რეფერალი', value: 4, icon: 'pi pi-building' },
    { anchor: 'consultations', label: 'კონსულტაცია', value: 5, icon: 'pi pi-book' },
    { anchor: 'psychoDiagnoses', label: 'ფსიქოდიაგნოსტირება', value: 6, icon: 'pi pi-book' },
];

export const detailTypes: Record<number, string> = {
    1: 'forms_of_violences',
    2: 'care_plans',
    3: 'diagnoses',
    4: 'referrals',
    5: 'consultations',
    6: 'psychoDiagnoses',
}

export const detailTypeIDS: Record<string, number> = {
    forms_of_violences: 1,
    care_plans: 2,
    diagnoses: 3,
    referrals: 4,
    consultations: 5,
    psychoDiagnoses: 6,
};