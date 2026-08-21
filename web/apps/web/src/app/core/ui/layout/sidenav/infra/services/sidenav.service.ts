import { Injectable, signal } from "@angular/core";

import { localStorageSignal } from "@core/utils";

export const SIDENAV_MIN_WIDTH = 200;
export const SIDENAV_MAX_WIDTH = 400;
export const SIDENAV_DEFAULT_WIDTH = 256;
export const SIDENAV_COLLAPSED_WIDTH = 64;

function clampWidth(value: number): number {
    return Math.min(SIDENAV_MAX_WIDTH, Math.max(SIDENAV_MIN_WIDTH, value));
}

@Injectable()
export class SidenavService {
    readonly collapsed = localStorageSignal("sidenav-collapsed", false);
    readonly width = localStorageSignal("sidenav-width", SIDENAV_DEFAULT_WIDTH);
    readonly mobileOpen = signal(false);

    constructor() {
        // localStorage is read once, unvalidated, on init — the drag handle only clamps live
        // interaction, so a stale/out-of-range persisted value (old app version, manual edit,
        // anything) would otherwise render the sidenav at that raw width forever. Clamping the
        // signal itself, not just the interactive drag path, closes that gap for every write.
        const rawSet = this.width.set.bind(this.width);
        this.width.set = (value: number) => rawSet(clampWidth(value));

        const rawUpdate = this.width.update.bind(this.width);
        this.width.update = updateFn => rawUpdate(current => clampWidth(updateFn(current)));

        this.width.set(this.width());
    }

    toggle(): void {
        this.collapsed.update(value => !value);
    }

    resize(width: number): void {
        this.width.set(width);
    }

    toggleMobile(): void {
        this.mobileOpen.update(value => !value);
    }

    closeMobile(): void {
        this.mobileOpen.set(false);
    }
}
