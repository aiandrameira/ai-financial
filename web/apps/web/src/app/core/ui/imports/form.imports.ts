import { AiBadge, AiDatePicker, AiInput, AiSelectImports, AiTextarea } from "@aiandralves/ai-ui";
import { NgModule } from "@angular/core";
import { FormField } from "@angular/forms/signals";

import { ButtonForm } from "../components";

const components = [FormField, ButtonForm, AiInput, ...AiSelectImports, AiTextarea, AiDatePicker, AiBadge];

@NgModule({
    imports: [...components],
    exports: [...components],
})
export class FormImports {}
