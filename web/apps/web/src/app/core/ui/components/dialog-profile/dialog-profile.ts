import { AiAvatar, AiButton, AiDialogRef, AiIcon, AiInput, AiToastService } from "@aiandralves/ai-ui";
import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, signal, viewChild } from "@angular/core";
import { disabled, form, FormField, minLength, required } from "@angular/forms/signals";
import { AuthService } from "@infra/services";

const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024;

@Component({
    selector: "ai-dialog-profile",
    imports: [FormField, AiInput, AiButton, AiAvatar, AiIcon],
    templateUrl: "./dialog-profile.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogProfile {
    #auth = inject(AuthService);
    #toast = inject(AiToastService);
    #dialogRef = inject(AiDialogRef<DialogProfile>);

    readonly fileInput = viewChild<ElementRef<HTMLInputElement>>("fileInput");

    readonly loading = signal(false);
    readonly uploadingAvatar = signal(false);
    readonly hoveringAvatar = signal(false);
    readonly previewImage = signal<string | null>(null);

    readonly user = this.#auth.user;

    readonly avatarImage = computed(() => this.previewImage() ?? this.user()?.image ?? "");
    readonly initials = computed(() => {
        const name = this.user()?.name ?? "";
        return name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map(part => part[0]?.toUpperCase())
            .join("");
    });

    protected schema = signal<{ name: string; email: string }>({
        name: this.user()?.name ?? "",
        email: this.user()?.email ?? "",
    });

    readonly form = form(this.schema, schema => {
        disabled(schema.email);
        required(schema.name, { message: "O nome é obrigatório." });
        minLength(schema.name, 3, { message: "O nome deve conter no mínimo 3 caracteres." });
    });

    onCancel(): void {
        this.#dialogRef.close();
    }

    onAvatarClick(): void {
        if (this.uploadingAvatar()) return;
        this.fileInput()?.nativeElement.click();
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        input.value = "";
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            this.#toast.destructive({ message: "Selecione um arquivo de imagem." });
            return;
        }

        if (file.size > MAX_AVATAR_SIZE_BYTES) {
            this.#toast.destructive({ message: "A imagem deve ter no máximo 5MB." });
            return;
        }

        this.uploadingAvatar.set(true);

        this.#auth.uploadAvatar(file).subscribe({
            next: async result => {
                this.previewImage.set(result.url);

                const error = await this.#auth.updateProfile({ image: result.url });
                this.uploadingAvatar.set(false);

                if (error) {
                    this.#toast.destructive({ message: "Falha ao salvar a nova imagem.", description: error });
                    return;
                }

                this.#toast.success({ message: "Avatar atualizado." });
                this.#auth.patchLocalUser({ image: result.url });
            },
            error: () => {
                this.#toast.destructive({ message: "Falha ao enviar a imagem." });
                this.uploadingAvatar.set(false);
            },
        });
    }

    async onSave(): Promise<void> {
        if (this.form().invalid()) return;

        this.loading.set(true);
        const { name } = this.form().value() as { name: string };

        const error = await this.#auth.updateProfile({ name });
        this.loading.set(false);

        if (error) {
            this.#toast.destructive({ message: "Erro ao atualizar perfil", description: error });
            return;
        }

        this.#toast.success({ message: "Perfil atualizado com sucesso." });
        this.#auth.patchLocalUser({ name });
        this.#dialogRef.close();
    }
}
