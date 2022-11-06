import { RowItem } from './app.interfaces';

export const STAFF_TYPES: Map<number, string> = new Map([
    [1, 'მომხმარებელი'],
    [2, 'ადმინისტრატორი'],
    [3, 'ტექ. სტაფი'],
    [4, 'მენეჯერი'],
]);


export const DUMMY_USERS: RowItem[] =
    [
        {
            id: 1,
            title: 'ირაკლი ჯუღელი',
            typeID: 1,
            description: 'ჯუღელი ირაკლი',
            date: '08/02/2022',
        } as RowItem,
        {
            id: 2,
            title: 'კახა კახიაშვილი',
            typeID: 1,
            description: 'კახებერ კახიაშვილი',
            date: '08/09/2022',
        } as RowItem,
        {
            id: 3,
            title: 'გელა ღოღობერიძე',
            typeID: 2,
            description: 'ხებე ოღობერ',
            date: '08/10/2022',
        } as RowItem,
        {
            id: 4,
            title: 'გოჩა კაციაშვილი',
            typeID: 2,
            description: 'კაციაშვილი გოჩა',
            date: '08/18/2022',
        } as RowItem,
        {
            id: 5,
            title: 'მანუჩარ გელაშვილი',
            typeID: 3,
            description: 'მანუჩარ გელაშვილი',
            date: '08/21/2022',
        } as RowItem,
        {
            id: 6,
            title: 'გელადი ბახტაძე',
            typeID: 1,
            description: 'კახებერ ბახტაძე',
            date: '09/16/2022',
        } as RowItem,
        {
            id: 7,
            title: 'მათე კახიაშვილი',
            typeID: 4,
            description: 'მათე კახიაშვილი',
            date: '11/13/2022',
        } as RowItem,
        {
            id: 8,
            title: 'ლაშა გელაძე',
            typeID: 2,
            description: 'ლაშა გელაძე',
            date: '09/14/2022',
        } as RowItem,
        {
            id: 9,
            title: 'გიორგი გნოლიძე',
            typeID: 4,
            description: 'გიორგი გნოლიძე',
            date: '09/11/2022',
        } as RowItem,
        {
            id: 10,
            title: 'დავით ამაშუკელი',
            typeID: 3,
            description: 'დავით ამაშუკელი',
            date: '09/12/2022',
        } as RowItem,
        {
            id: 11,
            title: 'ვლადიმერ რასესისძე',
            typeID: 4,
            description: 'ვლადიმერ რასესისძე',
            date: '10/15/2022',
        } as RowItem,
        {
            id: 12,
            title: 'ირაკლი ირემაძე',
            typeID: 1,
            description: 'ირაკლი ირემაძე',
            date: '11/12/2022',
        } as RowItem,
        {
            id: 13,
            title: 'ავთანდილ ძნელაძე',
            typeID: 1,
            description: 'ავთანდილ ძნელაძე',
            date: '11/13/2022',
        } as RowItem,
    ];

