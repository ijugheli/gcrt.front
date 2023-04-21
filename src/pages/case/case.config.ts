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

export const caseSectionForms: Record<number, string> = {
    0: 'diagnoses',
    1: 'referrals',
    2: 'consultations',
}

export const detailTypes: Record<number, string> = {
    0: 'diagnosis',
    1: 'referral',
    2: 'consultation',
    3: 'formsOfViolence',
    4: 'carePlan',
    5: 'psychoDiagnosis',
}