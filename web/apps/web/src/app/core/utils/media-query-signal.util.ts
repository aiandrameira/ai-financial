import { DestroyRef, inject, signal } from "@angular/core";

export function mediaQuerySignal(query: string) {
    const mediaQueryList = window.matchMedia(query);
    const state = signal(mediaQueryList.matches);

    const onChange = (event: MediaQueryListEvent) => state.set(event.matches);
    mediaQueryList.addEventListener("change", onChange);
    inject(DestroyRef).onDestroy(() => mediaQueryList.removeEventListener("change", onChange));

    return state.asReadonly();
}
