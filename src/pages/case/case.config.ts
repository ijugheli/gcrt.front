import { IFormMenuOption } from "src/app/app.interfaces";

export const menuOptions: IFormMenuOption[] = [
    { label: 'ქეისი', value: 0, icon: 'pi pi-briefcase' },
    { label: 'ძალადობის ფორმები', value: 1, icon: 'pi pi-list' },
    { label: 'მოვლის გეგმა', value: 2, icon: 'pi pi-list' },
    { label: 'დიაგნოზი', value: 3, icon: 'pi pi-copy' },
    { label: 'რეფერალი', value: 4, icon: 'pi pi-building' },
    { label: 'კონსულტაცია', value: 5, icon: 'pi pi-book' },
    { label: 'ფსიქოდიაგნოსტირება', value: 6, icon: 'pi pi-book' },
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