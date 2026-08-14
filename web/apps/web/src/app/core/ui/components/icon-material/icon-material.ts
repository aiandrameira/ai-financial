import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";

const SIZE_CLASS: Record<"xs" | "sm" | "default" | "lg" | "xl", string> = {
    xs: "text-xs w-3 h-3 leading-3",
    sm: "text-sm w-3.5 h-3.5 leading-3.5",
    default: "text-base w-4 h-4 leading-4",
    lg: "text-lg w-4.5 h-4.5 leading-4.5",
    xl: "text-xl w-5 h-5 leading-5",
};

@Component({
    selector: "ai-icon-material, [ai-icon-material]",
    template: ` <span class="flex shrink-0 items-center justify-center select-none overflow-hidden" [class]="classes()">{{ icon() }}</span> `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconMaterial {
    readonly icon = input.required<string>();
    readonly size = input<"xs" | "sm" | "default" | "lg" | "xl">("default");
    readonly type = input<"fill" | "line">("line");

    protected readonly classes = computed(() => `font-icon-${this.type()} ${SIZE_CLASS[this.size()]}`);
}
