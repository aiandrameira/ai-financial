import type { AiIconType } from "@aiandralves/ai-ui";
import { AiIcon } from "@aiandralves/ai-ui";
import { CurrencyPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import { tpCreditCardNetworkEnum, tpCreditCardNetworkMap } from "@domain/enums";

const NETWORK_GRADIENT: Record<tpCreditCardNetworkEnum, string> = {
    [tpCreditCardNetworkEnum.VISA]: "bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-950 shadow-blue-900/30",
    [tpCreditCardNetworkEnum.MASTERCARD]: "bg-gradient-to-br from-purple-800 via-indigo-950 to-slate-950 shadow-purple-950/40",
    [tpCreditCardNetworkEnum.ELO]: "bg-gradient-to-br from-amber-600 via-orange-800 to-slate-950 shadow-amber-900/30",
    [tpCreditCardNetworkEnum.AMEX]: "bg-gradient-to-br from-sky-600 via-cyan-800 to-slate-950 shadow-cyan-950/30",
    [tpCreditCardNetworkEnum.OTHER]: "bg-gradient-to-br from-slate-800 via-zinc-900 to-black shadow-zinc-950/40",
};

@Component({
    selector: "ai-credit-card-preview",
    imports: [AiIcon, CurrencyPipe],
    template: `
        <div [class]="classes()">
            <!-- Fluid Wave SVG Background Overlay -->
            <svg class="absolute inset-0 h-full w-full pointer-events-none opacity-20" viewBox="0 0 350 220" fill="none" preserveAspectRatio="none">
                <path d="M0 65C130 135 190 35 350 105V220H0V65Z" fill="url(#wave-grad)" />
                <defs>
                    <linearGradient id="wave-grad" x1="0" y1="0" x2="350" y2="220" gradientUnits="userSpaceOnUse">
                        <stop stop-color="white" stop-opacity="0.85" />
                        <stop offset="1" stop-color="white" stop-opacity="0.08" />
                    </linearGradient>
                </defs>
            </svg>

            <!-- Glossy Ambient Orbs & Sheen -->
            <div class="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/10 blur-xl pointer-events-none"></div>
            <div class="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/10 blur-xl pointer-events-none"></div>
            <div class="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 pointer-events-none"></div>

            <!-- Card Content Layer -->
            <div class="relative flex h-full flex-col justify-between z-10">
                <!-- Header: Institution Name & Contactless -->
                <div class="flex items-center justify-between gap-x-2">
                    <span class="font-credit-card text-xs font-medium tracking-[0.22em] uppercase text-white/80 drop-shadow-2xs truncate max-w-[210px]">
                        {{ institution() || "INSTITUIÇÃO" }}
                    </span>

                    <svg class="h-5 w-5 text-white/75 shrink-0 drop-shadow-2xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                        <path d="M8.5 14.5A4 4 0 0 1 8.5 9.5" />
                        <path d="M12 17A7.5 7.5 0 0 0 12 7" />
                        <path d="M15.5 19.5A11 11 0 0 0 15.5 4.5" />
                    </svg>
                </div>

                <!-- Middle: Metallic Chip & Icon -->
                <div class="flex items-center justify-between my-1">
                    <div class="flex items-center gap-x-3">
                        <!-- Refined Metallic Chip -->
                        <div
                            class="relative h-7 w-10 overflow-hidden rounded-md border border-amber-400/50 bg-gradient-to-tr from-amber-300 via-amber-200 to-yellow-400 p-0.5 shadow-inner"
                        >
                            <div class="h-[1px] w-full bg-amber-700/40"></div>
                            <div class="my-[1.5px] flex h-full justify-between">
                                <div class="h-full w-[1px] bg-amber-700/40"></div>
                                <div class="h-full w-[1px] bg-amber-700/40"></div>
                            </div>
                            <div class="h-[1px] w-full bg-amber-700/40"></div>
                        </div>

                        @if (icon()) {
                            <ai-icon [icon]="iconType()" type="fill" size="sm" class="text-white/65" />
                        }
                    </div>
                </div>

                <!-- Simulated Card Number in Share Tech Mono -->
                <div class="my-0.5">
                    <p class="font-credit-card text-sm sm:text-base font-medium tracking-[0.22em] text-white/95 drop-shadow-2xs">•••• •••• •••• 8842</p>
                </div>

                <!-- Footer: Cardholder & Expiry/Limit & Brand Logo -->
                <div class="flex items-end justify-between gap-x-2">
                    <div class="flex flex-col gap-y-0.5 min-w-0">
                        <!-- Holder Name -->
                        <p class="font-credit-card text-xs font-medium tracking-[0.18em] uppercase text-white/90 drop-shadow-2xs truncate">
                            {{ name() || "NOME DO TITULAR" }}
                        </p>

                        <!-- Fechamento / Vencimento & Limite -->
                        <div class="font-credit-card text-[9.5px] sm:text-[10.5px] tracking-wider text-white/65 leading-tight">
                            <p>FECHA DIA {{ closingDay() }} | VENCE DIA {{ dueDay() }}</p>
                            <p class="font-medium text-white/85">LIMITE {{ limitAmount() | currency }}</p>
                        </div>
                    </div>

                    <!-- Network Logo -->
                    <div class="shrink-0 flex items-center">
                        @switch (network()) {
                            @case (tpCreditCardNetworkEnum.VISA) {
                                <span class="font-credit-card text-xl font-black italic tracking-wider text-white/90 drop-shadow-2xs">VISA</span>
                            }
                            @case (tpCreditCardNetworkEnum.MASTERCARD) {
                                <div class="flex items-center">
                                    <div class="h-6 w-6 rounded-full bg-red-600 shadow-2xs"></div>
                                    <div class="-ml-2.5 h-6 w-6 rounded-full bg-amber-400 opacity-90 shadow-2xs"></div>
                                </div>
                            }
                            @case (tpCreditCardNetworkEnum.ELO) {
                                <span class="font-credit-card text-base font-black italic tracking-widest text-amber-300/90 drop-shadow-2xs">elo</span>
                            }
                            @case (tpCreditCardNetworkEnum.AMEX) {
                                <span class="font-credit-card text-[10px] font-bold uppercase border border-white/80 px-1 py-0.5 rounded text-white/90 tracking-widest">AMEX</span>
                            }
                            @default {
                                @if (networkLabel()) {
                                    <span class="font-credit-card text-xs font-medium uppercase tracking-wider text-white/75">{{ networkLabel() }}</span>
                                }
                            }
                        }
                    </div>
                </div>
            </div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditCardPreview {
    readonly name = input<string>("");
    readonly institution = input<string>("");
    readonly limitAmount = input<number>(0);
    readonly closingDay = input<number>(1);
    readonly dueDay = input<number>(10);
    readonly network = input<tpCreditCardNetworkEnum>(tpCreditCardNetworkEnum.OTHER);
    readonly icon = input<string>("");

    protected readonly tpCreditCardNetworkEnum = tpCreditCardNetworkEnum;

    protected readonly classes = computed(() => {
        const gradient = NETWORK_GRADIENT[this.network()] ?? NETWORK_GRADIENT[tpCreditCardNetworkEnum.OTHER];
        return `relative aspect-[1.586/1] w-full max-w-[400px] overflow-hidden rounded-2xl p-5 sm:p-6 text-white shadow-2xl transition-all duration-300 hover:scale-[1.01] ${gradient}`;
    });
    protected readonly iconType = computed<AiIconType>(() => (this.icon() || "bank-card") as AiIconType);
    protected readonly networkLabel = computed<string>(() => {
        const network = this.network();
        return network === tpCreditCardNetworkEnum.OTHER ? "" : (tpCreditCardNetworkMap.get(network) ?? "");
    });
}
