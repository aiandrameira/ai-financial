import { AI_PAGINATION_INTL, AI_PAGINATION_INTL_PT_BR, AiBadge, AiButton, AiCellTemplateDirective, AiTable, AiTooltipDirective } from "@aiandralves/ai-ui";
import { CurrencyPipe, DatePipe } from "@angular/common";
import { NgModule } from "@angular/core";

const components = [AiTable, AiBadge, AiCellTemplateDirective, DatePipe, CurrencyPipe, AiButton, AiTooltipDirective];

@NgModule({
    imports: [...components],
    exports: [...components],
    providers: [
        {
            provide: AI_PAGINATION_INTL,
            useValue: AI_PAGINATION_INTL_PT_BR,
        },
    ],
})
export class TableImports {}
