import { Injectable } from '@angular/core';

interface CacheItem {
    value: any;
    expires_at: number;
}

@Injectable({
    providedIn: 'root'
})
export class CacheService {
    private cache: { [key: string]: CacheItem } = {};
    private defaultTTL = (60 * 60 * 1000);

    public get(key: string): any {
        const item = this.cache[key];
        if (item) {
            if (this.isExpired(item.expires_at)) {
                this.remove(key);
                return null;
            }
            return item.value;
        }

        const storedItem = localStorage.getItem(key);

        if (storedItem) {
            const parsedItem: CacheItem = JSON.parse(storedItem);
            if (this.isExpired(parsedItem.expires_at)) {
                this.remove(key);
                return null;
            }
            this.cache[key] = parsedItem;
            return parsedItem.value;
        }

        return null;
    }

    public set(key: string, value: any, expiresAt?: number): void {
        const expires_at = expiresAt || this.getTTL();
        const item: CacheItem = { value, expires_at };

        this.cache[key] = item;
        localStorage.setItem(key, JSON.stringify(item));
    }

    public remove(key: string): void {
        if (key in this.cache) {
            delete this.cache[key];
        }
        localStorage.removeItem(key);
    }

    public clear(): void {
        this.cache = {};
        localStorage.clear();
    }

    private getTTL(): number {
        return Date.now() + this.defaultTTL;
    }

    private isExpired(expiresAt: number): boolean {
        return expiresAt > 0 && Date.now() > expiresAt;
    }
}
