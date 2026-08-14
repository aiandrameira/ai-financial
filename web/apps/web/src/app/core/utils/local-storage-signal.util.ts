import { effect, signal } from "@angular/core";

export function localStorageSignal<T>(key: string, initialValue: T) {
    const saved = window.localStorage.getItem(key);
    const stored = saved ? (JSON.parse(saved) as T) : initialValue;

    const state = signal<T>(stored);

    effect(() => window.localStorage.setItem(key, JSON.stringify(state())));

    return state;
}
