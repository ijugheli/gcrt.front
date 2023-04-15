import { DatePipe } from "@angular/common";
import { TreeNode } from "primeng/api";

export const reverseMap = (m: Map<number, string>) => {
    return new Map(Array.from(m, entry => [entry[1], entry[0]]));
}

export const flattenTree = (arr: any[]): any[] => {
    return arr.reduce((acc, curr) => {
        if (Array.isArray(curr.children)) {
            return acc.concat(curr, flattenTree(curr.children));
        } else {
            return acc.concat(curr);
        }
    }, []);
}

export const validateEmail = (email: string) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

export const formatDate = (date: any) => {
    const pipe = new DatePipe('en_US');
    return pipe.transform(date, 'd/M/yy');
}

export const calculateAge = (date: Date) => {
    let timeDiff = Math.abs(Date.now() - date.getTime());
    return Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
}


export const clone = (obj: any): any => {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        let c: { [key: string]: any } = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) c[attr] = clone(obj[attr]);
        }
        return c;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}


export const storageItemExists = (key: string) => {
    const items = localStorage.getItem(key)
    return items != null && items !== undefined;
}

export const parseTree = (tree: any[]): TreeNode[] => {
    return (Array.from(Object.values(tree)) as TreeNode[])
        .filter((item) => {
            return item.data != undefined && item.data != null;
        })
        .map((node: any) => {
            if (node.children) {
                node.children = parseTree(node.children);
            }

            return node;
        });
}