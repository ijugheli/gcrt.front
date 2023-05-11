import { IFormMenuOption } from "src/app/app.interfaces";

export const menuOptions: IFormMenuOption[] = [
    { anchor: 'case', label: 'ქეისი', value: 0, icon: 'pi pi-briefcase' },
    { anchor: 'forms_of_violences', label: 'ძალადობის ფორმები', value: 1, icon: 'pi pi-sitemap' },
    { anchor: 'care_plans', label: 'მოვლის გეგმა', value: 2, icon: 'pi pi-sitemap' },
    { anchor: 'diagnoses', label: 'დიაგნოზი', value: 3, icon: 'pi pi-copy' },
    { anchor: 'referrals', label: 'რეფერალი', value: 4, icon: 'pi pi-building' },
    { anchor: 'consultations', label: 'კონსულტაცია', value: 5, icon: 'pi pi-users' },
    { anchor: 'mental_symptoms', label: 'მენტალური სიმპტომები', value: 6, icon: 'pi pi-list' },
    { anchor: 'somatic_symptoms', label: 'სომატური სიმპტომები', value: 7, icon: 'pi pi-list' },
    { anchor: 'other_symptoms', label: 'სხვა სიმპტომები', value: 8, icon: 'pi pi-align-center' },
    { anchor: 'psycho_diagnoses', label: 'ფსიქოდიაგნოსტირება', value: 9, icon: 'pi pi-book' },
];

export const detailTypes: Record<number, string> = {
    1: 'forms_of_violences',
    2: 'care_plans',
    3: 'diagnoses',
    4: 'referrals',
    5: 'consultations',
    6: 'mental_symptoms',
    7: 'somatic_symptoms',
    8: 'other_symptoms',
    9: 'psycho_diagnoses',
}

export const detailTypeIDS: Record<string, number> = {
    forms_of_violences: 1,
    care_plans: 2,
    diagnoses: 3,
    referrals: 4,
    consultations: 5,
    mental_symptoms: 6,
    somatic_symptoms: 7,
    other_symptoms: 8,
    psycho_diagnoses: 9,
};