import { Injectable, signal } from "@angular/core";

import { localStorageSignal } from "@core/utils";

export const SIDENAV_MIN_WIDTH = 200;
export const SIDENAV_MAX_WIDTH = 400;
export const SIDENAV_DEFAULT_WIDTH = 256;
export const SIDENAV_COLLAPSED_WIDTH = 64;

@Injectable()
export class SidenavService {
    readonly collapsed = localStorageSignal("sidenav-collapsed", false);
    readonly width = localStorageSignal("sidenav-width", SIDENAV_DEFAULT_WIDTH);
    readonly mobileOpen = signal(false);

    toggle(): void {
        this.collapsed.update(value => !value);
    }

    resize(width: number): void {
        const clamped = Math.min(SIDENAV_MAX_WIDTH, Math.max(SIDENAV_MIN_WIDTH, width));
        this.width.set(clamped);
    }

    toggleMobile(): void {
        this.mobileOpen.update(value => !value);
    }

    closeMobile(): void {
        this.mobileOpen.set(false);
    }
}
