
import { IFormMenuOption } from "src/app/app.interfaces";

export const ageGroups: Record<string, number>[] = [
    {
        'from': 0,
        'to': 15,
        'id': 234,
    },
    {
        'from': 16,
        'to': 25,
        'id': 236,
    },
    {
        'from': 26,
        'to': 35,
        'id': 238,
    },
    {
        'from': 36,
        'to': 45,
        'id': 240,
    },
    {
        'from': 46,
        'to': 60,
        'id': 126863,
    },
    {
        'from': 60,
        'to': 110,
        'id': 126865,
    },
];

export const menuOptions: IFormMenuOption[] = [
    { anchor: 'main', label: 'ძირითადი მახასიათებლები', value: 0, icon: 'pi pi-user' },
    { anchor: 'additional', label: 'დამატებითი ინფორმაცია', value: 1, icon: 'pi pi-plus-circle' },
    { anchor: 'contact', label: 'საკონტაქტო ინფორმაცია', value: 2, icon: 'pi pi-phone' },
    { anchor: 'address', label: 'სამისამართო ინფორმაცია', value: 3, icon: 'pi pi-map-marker' },
];
export const detailTypes: Record<number, string> = {
    0: 'main',
    1: 'additional',
    2: 'contact',
    3: 'address',
}