---
name: ai-ui
version: "1.0"
description: "Sistema de design Angular moderno com 30+ componentes, Tailwind CSS 4 e dark mode nativo."

colors:
  # Light Mode
  background: "oklch(100% 0 0)"
  foreground: "oklch(0% 0 0)"
  muted: "oklch(0.97 0 0)"
  muted-foreground: "oklch(0.525 0 0)"
  default: "oklch(94.969% 0.00277 285.769)"
  default-foreground: "oklch(0.225 0 0)"
  primary: "oklch(20.77% 0.04 265.75)"
  primary-foreground: "oklch(1 0 0)"
  accent: "oklch(75.35% 0.139 232.66)"
  accent-foreground: "oklch(1 0 0)"
  ghost: "oklch(97.02% 0 0)"
  ghost-foreground: "oklch(0.333 0 0)"
  success: "oklch(54.69% 0.184 142.23)"
  success-foreground: "oklch(1 0 0)"
  warning: "oklch(0.625 0.163 48.998)"
  warning-foreground: "oklch(1 0 0)"
  info: "oklch(49.02% 0.21 266.93)"
  info-foreground: "oklch(1 0 0)"
  destructive: "oklch(52.01% 0.19 24.6)"
  destructive-foreground: "oklch(1 0 0)"
  border: "oklch(92.2% 0 0)"
  input: "oklch(92.2% 0 0)"
  ring: "oklch(70.8% 0 0)"

  # Dark Mode (class="dark")
  dark-background: "oklch(20.46% 0.000 0)"
  dark-foreground: "oklch(98.51% 0 0)"
  dark-muted: "oklch(0.269 0 0)"
  dark-muted-foreground: "oklch(0.708 0 0)"
  dark-default: "oklch(0.269 0 0)"
  dark-default-foreground: "oklch(0.985 0 0)"
  dark-primary: "oklch(98.82% 0.045 277.19)"
  dark-primary-foreground: "oklch(18.48% 0.045 277.19)"
  dark-accent: "oklch(75.35% 0.139 232.66)"
  dark-accent-foreground: "oklch(100.00% 0.000 0)"
  dark-ghost: "oklch(26.86% 0 0)"
  dark-ghost-foreground: "oklch(70.9% 0 0)"
  dark-success: "oklch(91.74% 0.155 140.26)"
  dark-success-foreground: "oklch(26.97% 0.086 142.39)"
  dark-warning: "oklch(82.07% 0.15 75.5)"
  dark-warning-foreground: "oklch(39.15% 0.119 35.84)"
  dark-info: "oklch(79.78% 0.088 258.13)"
  dark-info-foreground: "oklch(27.92% 0.081 271.53)"
  dark-destructive: "oklch(81.06% 0.098 15.53)"
  dark-destructive-foreground: "oklch(25.63% 0.083 22.57)"
  dark-border: "oklch(26.86% 0 0)"
  dark-input: "oklch(26.86% 0 0)"
  dark-ring: "oklch(32.55% 0 0)"

typography:
  display:
    fontFamily: Montserrat
    fontSize: 32–48px
    fontWeight: 600
  heading:
    fontFamily: Montserrat
    fontSize: 20–28px
    fontWeight: 600
  body-md:
    fontFamily: "Nunito Sans"
    fontSize: 16px
    fontWeight: 400
  body-sm:
    fontFamily: "Nunito Sans"
    fontSize: 14px
    fontWeight: 400
  caption:
    fontFamily: "Nunito Sans"
    fontSize: 12px
    fontWeight: 400
  code:
    fontFamily: "JetBrains Mono"
    fontSize: 14px
    fontWeight: 600

rounded:
  sm: 4px
  md: 6px
  lg: 8px
  xl: 12px
  2xl: 16px
  full: 9999px

spacing:
  base: 8px
  xs: 2px
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px
  2xl: 24px
  3xl: 32px
  4xl: 48px
  5xl: 64px
---

# Design System — @aiandralves/ai-ui

## Overview

Sistema de design Angular moderno com 30+ componentes, Tailwind CSS 4 e dark mode nativo.
Interface limpa de baixo ruído visual, alta densidade de informação, suporte a temas customizáveis.

Cores implementadas em **OKLCH** (espaço perceptualmente uniforme) via CSS custom properties.
Os valores hex no frontmatter são aproximações para referência rápida — os valores reais estão em `apps/web/public/theme/app.css`.

## Colors

Cada cor semântica tem um par `foreground` que garante contraste mínimo WCAG AA.

- **primary**: Ações principais, CTAs, elementos interativos de destaque
- **accent**: Links, ênfase visual, destaques secundários (azul)
- **success**: Confirmações, checkmarks, estados positivos (verde)
- **warning**: Alertas, avisos, estados de atenção (laranja)
- **info**: Informações, tooltips, hints (azul escuro)
- **destructive**: Ações perigosas, erros, deletar (vermelho)
- **background / foreground**: Fundo base e texto padrão
- **muted / muted-foreground**: Backgrounds e texto de elementos desativados
- **ghost / ghost-foreground**: Superfícies secundárias, hover states
- **default / default-foreground**: Cor neutra padrão para elementos sem semântica
- **border**: Bordas hairline 1px — use sempre `border` (Tailwind) ou `var(--border)`
- **ring**: Focus ring acessível para elementos interativos

Dark mode ativado adicionando a classe `.dark` em qualquer elemento ancestral (geralmente `<html>`).

## Typography

Três famílias com papéis distintos — nunca misture os papéis:

- **Montserrat** (`font-title`): Títulos, headings, destaque de hierarquia
- **Nunito Sans** (`font-text`): Corpo, labels, metadados, textos em geral
- **JetBrains Mono** (`font-code`): Código inline, valores técnicos, terminais

| Nível      | Fonte          | Tamanho | Peso    | Uso                                            |
| ---------- | -------------- | ------- | ------- | ---------------------------------------------- |
| Display    | Montserrat     | 32–48px | 600–700 | Títulos de página, heroes                      |
| Heading XL | Montserrat     | 28px    | 600     | Títulos de seção                               |
| Heading LG | Montserrat     | 24px    | 600     | Sub-títulos, h2/h3                             |
| Heading MD | Montserrat     | 20px    | 600     | Headings de card                               |
| Heading SM | Montserrat     | 16px    | 600     | Labels de form, titles de dialog               |
| Body MD    | Nunito Sans    | 16px    | 400     | Parágrafo padrão                               |
| Body SM    | Nunito Sans    | 14px    | 400     | Metadados, helper text, descrições secundárias |
| Caption    | Nunito Sans    | 12px    | 400     | Timestamps, labels mínimos, footers            |
| Code       | JetBrains Mono | 14px    | 600     | Código, valores técnicos                       |

## Layout

- **Base de 8px**: todos os espaçamentos são múltiplos de 8 (ou 4 para casos finos)
- **Max-width**: 1200px para conteúdo desktop, gutters 16–24px
- **Mobile-first**: Tailwind breakpoints `xs` 480px · `sm` 640px · `md` 768px · `lg` 1024px · `xl` 1280px
- **Sem drop-shadows**: profundidade via bordas 1px + contraste de cor de fundo
- Padding de cards: `16px`; dialogs: `24px`; buttons: `8px 16px`; badges: `4px 8px`

## Components

### Accordion

Seletor: `<ai-accordion>`, `<ai-accordion-item>`

```ts
@Component({
  imports: [AiAccordionImports],
  template: `
    <ai-accordion multi>
      <ai-accordion-item
        title="Primeiro"
        description="Descrição do painel primeiro"
        icon="exchange"
      >
        <p>Este é o conteúdo do primeiro painel do accordion.</p>
      </ai-accordion-item>

      <ai-accordion-item
        [expanded]="true"
        title="Segundo"
        description="Descrição do painel segundo"
        icon="file-text"
      >
        <p>Este é o conteúdo do segundo painel do accordion.</p>
      </ai-accordion-item>

      <ai-accordion-item
        title="Terceiro"
        description="Descrição do painel terceiro"
        icon="attachment-2"
      >
        <p>Este é o conteúdo do terceiro painel do accordion.</p>
      </ai-accordion-item>
    </ai-accordion>
  `,
})
export class DemoAccordion {}
```

---

---

### Alert

Seletor: `<ai-alert>`

```ts
@Component({
  selector: "ai-demo-alert",
  imports: [AiAlert],
  template: `
    <ai-alert
      variant="primary"
      appearance="fill"
      [title]="title"
      [description]="description"
    />
  `,
})
export class DemoAlert {
  title = "Title alert!";
  description =
    "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda, sint.";
}
```

---

### Alert Dialog

Service: `AiAlertDialogService`
Interfaces: `AiAlertDialogConfig<T>` · `AiAlertDialogRef<T>`

````ts

```html
<ai-button variant="destructive" (click)="openDialogConfirm()">Excluir conta</ai-button>
````

```ts
@Component({
  selector: "ai-demo-alert-dialog",
  imports: [AiButton],
  template: `
    <ai-button (click)="openDialogConfirm()"> Show Dialog </ai-button>
  `,
})
export class DemoAlertDialog {
  #alertDialog = inject(AiAlertDialogService);

  openDialogConfirm() {
    this.#alertDialog.confirm({
      icon: { name: "delete-bin", color: "destructive" },
      title: "Apagar usuário",
      description: "Tem certeza que deseja apagar esse usuário?",
      confirmText: "Sim",
      cancelText: "Não",
    });
  }
}
```

---

### Avatar

Seletor: `<ai-avatar>`, `<ai-avatar-group>`

```ts
@Component({
  selector: "ai-demo-avatar",
  imports: [AiAvatar, AiAvatarGroup],
  template: `
    <ai-avatar image="./img/avatar.png" fallback="AI" [size]="32" />
    <ai-avatar fallback="AI" size="sm" />

    <ai-avatar-group>
      <ai-avatar
        image="https://raw.githubusercontent.com/aiandralves/smart-watch/refs/heads/main/assets/img/team/person2.jpg"
        fallback="AI"
        size="sm"
      />
      <ai-avatar
        image="https://raw.githubusercontent.com/aiandralves/smart-watch/refs/heads/main/assets/img/team/person4.jpg"
        fallback="AI"
        size="sm"
      />
      <ai-avatar
        image="https://avatars.githubusercontent.com/u/33138081?v=4"
        fallback="AI"
        size="sm"
      />
    </ai-avatar-group>
  `,
})
export class DemoAvatar {}
```

---

### Badge

Seletor: `<ai-badge>`

```ts
@Component({
  selector: "ai-demo-badge",
  imports: [AiBadge],
  template: `
    <ai-badge variant="default" close (closed)="onClose()"
      >It must be of the default type</ai-badge
    >
  `,
})
export class DemoBadge {
  onClose() {
    console.log("Badge closed");
  }
}
```

---

### Breadcrumb

Seletor: `<ai-breadcrumb>`, `<ai-breadcrumb-content>`, `<ai-breadcrumb-ellipsis>`, `<ai-breadcrumb-item>`, `<ai-breadcrumb-link>`, `ai-breadcrumb-list`, `ai-breadcrumb-page`, `<ai-breadcrumb-separator>`
Interfaces: `AiBreadcrumbConfig`
Directive: `AiBreadcrumbActionsDirective` • `aiBreadcrumbActions`
Imports: `AiBreadcrumbImports`

```ts
@Component({
  selector: "ai-demo-breadcrumb",
  imports: [AiBreadcrumbImports, AiIcon],
  template: `
    <ai-breadcrumb-content>
      <ai-breadcrumb-list wrap="wrap" [align]="'start'">
        <ai-breadcrumb-item>
          <ai-breadcrumb-link link="/controle">
            <ai-icon icon="contacts" />
            Controle
          </ai-breadcrumb-link>
        </ai-breadcrumb-item>
        <ai-breadcrumb-separator />
        <ai-breadcrumb-item>
          <ai-breadcrumb-link link="/colaborador"
            >Colaboradores</ai-breadcrumb-link
          >
        </ai-breadcrumb-item>
        <ai-breadcrumb-separator />
        <ai-breadcrumb-item>
          <ai-breadcrumb-page>Cadastrar colaborador</ai-breadcrumb-page>
        </ai-breadcrumb-item>
      </ai-breadcrumb-list>
    </ai-breadcrumb-content>
  `,
})
export class DemoBreadcrumb {}
```

---

### Button

Seletor: `<ai-button>`, `<button ai-button>`, `<a ai-button>`

```ts
@Component({
  selector: "ai-demo-button",
  imports: [AiButton],
  template: `
    <ai-button variant="primary">Salvar</ai-button>
    <ai-button variant="outline" size="sm">Cancelar</ai-button>
    <ai-button variant="destructive" icon="delete-bin-2">Excluir</ai-button>
    <ai-button variant="ghost" [loading]="true">Aguarde...</ai-button>
    <ai-button variant="primary" shape="circle" icon="add" />
  `,
})
export class DemoButton {}
```

---

### Button Toggle

Seletor: `<ai-button-toggle>`

```ts
@Component({
  selector: "ai-demo-button-toggle",
  imports: [AiButtonToggle],
  template: `
    <ai-button-toggle
      mode="multiple"
      [defaultValue]="['italic']"
      variant="primary"
      [items]="items"
      (changeValue)="onToggleChange($event)"
    />
  `,
})
export class DemoButtonToggle {
  items: AiButtonToggleItem[] = [
    { value: "bold", icon: "bold" as AiIconType, label: "Negrito" },
    { value: "italic", icon: "italic" as AiIconType, label: "Itálico" },
    {
      value: "underline",
      icon: "underline" as AiIconType,
      label: "Sublinhado",
    },
  ];

  onToggleChange(value: string | string[]): void {
    console.log("Button Toggle Value:", value);
  }
}
```

---

### Card

Seletor: `<ai-card>`

```ts
@Component({
  selector: "ai-demo-card",
  imports: [AiCard, AiButton],
  template: `
    <ai-card
      title="Componente Card"
      variant="default"
      description="Um card padrão com borda cinza e layout organizado"
      icon="function"
    >
      <div class="flex flex-col gap-y-4 mt-4 mb-6">
        <p class="text-sm text-muted-foreground">
          Este é o conteúdo do card. Você pode adicionar qualquer elemento aqui.
        </p>
        <ai-button variant="outline" size="sm" icon="arrow-left-up"
          >acessar</ai-button
        >
      </div>
    </ai-card>
  `,
})
export class DemoCard {}
```

---

### Carousel

Seletor: `<ai-carousel>`, `<ai-carousel-item>`
Imports: `AiCarouselImports`

```ts
@Component({
  selector: "ai-demo-carousel",
  imports: [AiCarouselImports],
  template: `
    <ai-carousel>
      @for (slide of slides; track slide.id) {
        <ai-carousel-item>
          <div
            class="flex items-center justify-center h-52 rounded-lg bg-muted"
          >
            <span class="text-2xl font-semibold text-muted-foreground">{{
              slide.label
            }}</span>
          </div>
        </ai-carousel-item>
      }
    </ai-carousel>
  `,
})
export class DemoCarousel {
  slides = [
    { id: 1, label: "Slide 1" },
    { id: 2, label: "Slide 2" },
    { id: 3, label: "Slide 3" },
    { id: 4, label: "Slide 4" },
    { id: 5, label: "Slide 5" },
  ];
}
```

---

### Command

Seletor: `<ai-command>` · `<ai-command-empty>` · `<ai-command-input>` · `<ai-command-item-group>` · `<ai-command-item>` · `<ai-command-list>` · `<ai-command-separator>`
Interfaces: `AiCommandItemConfig` · `AiCommandGroup` · `AiCommandConfig`
Imports: `AiCommandImports`

```ts
@Component({
  selector: "ai-demo-command",
  imports: [AiCommandImports],
  template: `
    <ai-command
      class="min-w-xs sm:min-w-sm md:min-w-md"
      (selectedCommand)="handleCommand($event)"
    >
      <ai-command-input placeholder="Search actions, files, and more..." />

      <ai-command-list>
        <ai-command-empty />

        <ai-command-item-group label="Quick Actions">
          <ai-command-item
            label="Create new project"
            value="new-project"
            icon="folder"
            shortcut="⌘N"
          />
          <ai-command-item
            label="Open file"
            value="open-file"
            icon="folder-open"
            shortcut="⌘O"
          />
        </ai-command-item-group>

        <ai-command-separator />

        <ai-command-item-group label="Navigation">
          <ai-command-item
            label="Go to Dashboard"
            value="dashboard"
            icon="dashboard"
            shortcut="⌘1"
          />
          <ai-command-item
            label="Go to Projects"
            value="projects"
            icon="folder"
            shortcut="⌘2"
          />
        </ai-command-item-group>
      </ai-command-list>
    </ai-command>
  `,
  host: {
    "(window:keydown)": "handleKeydown($event)",
  },
})
export class DemoCommand {
  private readonly commandActions: Record<string, () => void> = {
    "new-project": () => this._showAlert("Creating new project..."),
    "open-file": () => this._showAlert("Opening file dialog..."),
    dashboard: () => this._showAlert("Navigating to Dashboard..."),
    projects: () => this._showAlert("Navigating to Projects..."),
  };

  private readonly keyMap: Record<string, { value: string; label: string }> = {
    n: { value: "new-project", label: "Create new project" },
    o: { value: "open-file", label: "Open file" },
    "1": { value: "dashboard", label: "Go to Dashboard" },
    "2": { value: "projects", label: "Go to Projects" },
  };

  handleCommand(item: AiCommandItemConfig) {
    (
      this.commandActions[item.value as keyof typeof this.commandActions] ??
      (() => this._showAlert(`Action: ${item.label}`))
    )();
  }

  handleKeydown(event: KeyboardEvent) {
    if (event.metaKey || event.ctrlKey) {
      const key = event.key.toLowerCase();
      if (this.keyMap[key]) {
        event.preventDefault();
        this._executeCommand(this.keyMap[key].value, this.keyMap[key].label);
      }
    }
  }

  private _executeCommand(value: string, label: string) {
    this.handleCommand({ value, label } as AiCommandItemConfig);
  }

  private _showAlert(message: string, warning = false) {
    if (warning) {
      console.warn(message);
    } else {
      console.log(message);
    }
  }
}
```

---

### Date Picker

Seletor: `<ai-date-picker>`

```ts
@Component({
  selector: "ai-demo-date-picker",
  imports: [AiDatePicker],
  template: `
    <ai-date-picker placeholder="Selecione a data" [(value)]="''" />
  `,
})
export class DemoDatePicker {}
```

---

### Dialog

Service: `AiDialogService`
Interfaces: `AiDialogConfig<T>` · `AiDialogRef<T>`
Module: `AiDialogModule`

```ts
@Component({
  selector: "ai-demo-dialog",
  imports: [AiButton],
  template: ` <ai-button (click)="openDialog()">Open Dialog</ai-button> `,
})
export class DemoDialog {
  #dialogService = inject(AiDialogService);

  openDialog() {
    this.#dialogService.create({
      component: DemoDialogDefaultFormComponent,
      title: "Update User",
      description: "Update user information",
      data: {
        name: "John Doe",
        email: "johndoe@example.com",
      } as UserDto,
      width: "425px",
      confirmText: "Save",
      onConfirm: (instance) => {
        console.log("Confirmed with data:", instance.user());
      },
    });
  }
}
```

---

### Drawer

Service: `AiDrawerService`
Interfaces: `AiDrawerConfig<T>` · `AiDrawerRef<T>`
Token: `AI_DRAWER_DATA`

```ts
@Component({
  selector: "ai-demo-drawer",
  imports: [AiButton],
  template: `
    <ai-button variant="primary" icon="filter" (click)="openDrawer()"
      >Abrir drawer</ai-button
    >
  `,
})
export class DemoDrawer {
  #drawerService = inject(AiDrawerService);

  openDrawer() {
    const drawerRef = this.#drawerService.open({
      component: DrawerFormComponent,
      title: "Filtros",
      icon: "filter_alt",
      position: "right",
      data: { username: "John Doe" },
      confirmText: "Aplicar",
      cancelText: "Limpar",
      onConfirm: (child) => child?.onConfirm(),
      onCancel: (child) => child?.onCancel(),
    });

    drawerRef.afterClosed().subscribe((result) => {
      if (result) console.log(result);
    });
  }
}
```

---

### Empty

Seletor: `<ai-empty>`

```ts
@Component({
  selector: "ai-demo-empty",
  imports: [AiEmpty, AiButton],
  template: `
    <ai-empty
      icon="inbox-2"
      title="Sem resultados"
      description="Nenhum item encontrado para os filtros aplicados."
    />

    <ai-empty
      image="./img/avatar.png"
      title="User invisible"
      description="This user is currently offline. You can leave a message to notify them or try again later."
      [actions]="[actionPrimary]"
      class="[&_img]:size-12 [&_img]:rounded-full [&_img]:grayscale"
    >
      <ng-template #actionPrimary>
        <ai-button type="button" size="sm"> Leave Message </ai-button>
      </ng-template>
    </ai-empty>
  `,
})
export class DemoEmpty {}
```

---

### Float Button

Seletor: `<ai-float-button | button[ai-float-button] | a[ai-float-button]>` · `<ai-float-button-group>` · `<ai-float-button-top>`

```ts
@Component({
  selector: "ai-demo-float-button",
  imports: [AiFloatButton, AiFloatButtonGroup, AiFloatButtonTop],
  template: `
    <!-- Botão de ação flutuante simples -->
    <ai-float-button icon="add" (click)="novo()" />

    <!-- Grupo de float buttons -->
    <ai-float-button-group>
      <ai-float-button icon="edit-2" />
      <ai-float-button icon="share-forward" />
      <ai-float-button icon="delete-bin-2" variant="destructive" />
    </ai-float-button-group>

    <!-- Botão de voltar ao topo -->
    <ai-float-button-top />
  `,
})
export class DemoFloatButton {}
```

---

### Icon

Seletor: `<ai-icon | [ai-icon]>`
Lib: `Remix Icon` (https://remixicon.com/)
Type: `AiIconType`

```ts
@Component({
  selector: "ai-demo-icon",
  imports: [AiIcon],
  template: `
    <ai-icon icon="user-3" />
    <ai-icon icon="check" size="sm" type="fill" />
    <ai-icon icon="arrow-right-s" size="lg" />
  `,
})
export class DemoIcon {}
```

---

### Loader

Seletor: `<ai-loader>`
Serviço: `AiLoaderService`

```ts
@Component({
  selector: "ai-demo-loader",
  imports: [AiLoader],
  template: `
    <!-- Spinner padrão -->
    <ai-loader />

    <!-- Dots -->
    <ai-loader type="dots" />

    <!-- Progress -->
    @if (isLoading()) {
      <ai-loader type="progress" />
    }
  `,
})
export class DemoLoader {
  protected isLoading = inject(AiLoaderService).isLoading;
}
```

---

### Markdown

Seletor: `<ai-markdown>`

```ts
@Component({
  selector: "ai-demo-markdown-viewer",
  imports: [AiMarkdown],
  template: `
    <ai-markdown
      mode="editor"
      [code]="code"
      [theme]="theme()"
      language="typescript"
    />
    <ai-markdown
      mode="viewer"
      [code]="code"
      [theme]="theme()"
      language="typescript"
    />
  `,
})
export class DemoMarkdownViewerComponent {
  protected theme = inject(ThemeStore).theme;
  readonly code = `console.log("Hello, Markdown!");`;
}
```

---

### Menu

Seletor: `<ai-content>`, `<ai-menu-item>`, `<ai-menu-label>`, `<ai-menu-shortcut>`, `<ai-dropdown-menu>`
Service: `AiMenuService`
Directive: `AiMenuDirective`
Imports: `AiMenuImports`

```ts
@Component({
  selector: "ai-demo-menu",
  imports: [AiButton, AiMenuImports, AiSeparator],
  template: `
    <button ai-button variant="ghost" ai-menu [menu]="menu">Abrir menu</button>

    <ai-menu-content #menu="aiMenuContent">
      <ai-menu-label>Conta</ai-menu-label>

      <ai-menu-item>
        Billing
        <ai-menu-shortcut>⌘B</ai-menu-shortcut>
      </ai-menu-item>
      <ai-separator />
      <ai-menu-item>
        Keyboard shortcuts
        <ai-menu-shortcut>⌘K</ai-menu-shortcut>
      </ai-menu-item>
    </ai-menu-content>
  `,
})
export class DemoMenu {}
```

---

### Popover

Seletor: `<ai-popover>`
Directive: `AiPopoverDirective`

```ts
@Component({
  selector: "ai-demo-popover",
  imports: [AiPopoverImports, AiButton],
  template: `
    <button ai-button variant="ghost" aiPopover [content]="popoverContent">
      Abrir popover
    </button>

    <ng-template #popoverContent>
      <ai-popover>
        <div class="space-y-2">
          <h4 class="font-medium font-title text-primary leading-none">
            Dimensions
          </h4>
          <p class="text-sm text-muted-foreground">
            Set the dimensions for the layer.
          </p>
        </div>
      </ai-popover>
    </ng-template>
  `,
})
export class DemoPopover {}
```

---

### Pagination

Seletor: `<button[ai-pagination-button] | a[ai-pagination-button]>`, `<ul[ai-pagination-content]>`, `<ai-pagination-ellipsis>`, `<li[ai-pagination-item]>`, `<ai-pagination-next>`, `<ai-pagination-prev>`, `<ai-pagination>`
Providers: `AI_PAGINATION_INTL` · `AI_PAGINATION_INTL_PT_BR`

```ts
@Component({
  selector: "ai-demo-pagination",
  imports: [AiPaginationImports],
  providers: [
    { provide: AI_PAGINATION_INTL, useValue: AI_PAGINATION_INTL_PT_BR },
  ],
  template: `
    <ai-pagination
      size="sm"
      [total]="totalPages()"
      [totalItems]="totalItems"
      [(pageIndex)]="currentPage"
      [(pageSize)]="pageSize"
      [pageSizeOptions]="[10, 20, 50]"
      showInfo
      showPageSize
    />
  `,
})
export class DemoPagination {
  readonly totalItems = 50;
  readonly currentPage = signal(1);
  readonly pageSize = signal(10);
  readonly totalPages = computed(() =>
    Math.ceil(this.totalItems / this.pageSize()),
  );
}
```

---

### Progress Bar

Seletor: `<ai-progress-bar>`

```ts
@Component({
  selector: "ai-demo-progress-bar",
  imports: [AiProgressBar],
  template: `
    <ai-progress-bar indeterminate />
    <ai-progress-bar variant="accent" indeterminate />
    <ai-progress-bar
      shape="circle"
      size="sm"
      [progress]="progress()"
      showLabel
    />
  `,
})
export class DemoProgressBar {
  progress = signal(72);
}
```

---

### Separator

Seletor: `<ai-separator>`

```ts
@Component({
  selector: "ai-demo-separator",
  imports: [AiSeparator],
  template: `
    <!-- Horizontal (padrão) -->
    <ai-separator />

    <!-- Vertical -->
    <ai-separator orientation="vertical" />
  `,
})
export class DemoSeparator {}
```

---

### Skeleton

Seletor: `<ai-skeleton>`

```ts
@Component({
  selector: "ai-demo-skeleton",
  imports: [AiSkeleton],
  template: `
    <!-- Linha de texto -->
    <ai-skeleton class="h-4 w-48" />

    <!-- Avatar placeholder -->
    <ai-skeleton class="h-10 w-10 rounded-full" />

    <!-- Card placeholder -->
    <ai-skeleton class="h-32 w-full rounded-lg" />
  `,
})
export class DemoSkeleton {}
```

---

### Stepper

Seletor: `<ai-stepper>`, `<ai-step>`
Imports: `AiStepperImports`

```ts
@Component({
  selector: "ai-demo-stepper",
  imports: [AiStepperImports],
  template: `
    <ai-stepper #stepper="aiStepper" linear>
      <ai-step label="Identificação">...</ai-step>
      <ai-step label="Contestação">...</ai-step>
      <ai-step label="Confirmação">...</ai-step>
    </ai-stepper>
  `,
})
export class DemoStepper {}
```

---

### Table

Seletor: `<ai-table>`
Directive: `AiCellTemplateDirective` · `aiCellTemplate`
Interfaces: `AiTableColumn<T>` · `AiTableConfig<T>` · `AiTableSort` · `AiTablePagination`

```ts
interface iUser {
  id: string;
  name: string;
  age: number;
  type: userTypeEnum;
}

const USERS: iUser[] = [
  { id: "1", name: "John Doe", age: 30, type: userTypeEnum.ADMIN },
  { id: "2", name: "Jane Smith", age: 25, type: userTypeEnum.MANAGER },
  { id: "3", name: "Bob Johnson", age: 40, type: userTypeEnum.SUPORT },
];

const COLUMNS: AiTableColumn<iUser>[] = [
  { key: "id", label: "ID", width: "80px" },
  { key: "name", label: "Name" },
  { key: "age", label: "Age" },
  {
    key: "type",
    label: "Type",
    cell: (row: iUser) => userTypeMap.get(row.type) || "",
  },
];

@Component({
  selector: "ai-demo-table",
  imports: [AiTable, AiBadge, AiCellTemplateDirective],
  template: `
    <ai-table [config]="config()" (rowClick)="onRowClick($event)">
      <ng-template aiCellTemplate="age" let-item>
        <ai-badge shape="circle">{{ item.age }} anos</ai-badge>
      </ng-template>
    </ai-table>
  `,
})
export class DemoTableDefaultComponent {
  columns = signal<AiTableColumn<iUser>[]>(COLUMNS);
  data = USERS;
  clicked = signal<iUser | null>(null);

  config = computed<AiTableConfig<iUser>>(() => ({
    columns: this.columns(),
    data: this.data,
  }));

  onRowClick(row: iUser) {
    this.clicked.set(row);
  }
}
```

---

### Tabs

Seletor: `<ai-tabs-group>`, `<ai-tab>`
Imports: `AiTabsImports`

```ts
@Component({
  selector: "ai-demo-tabs-default",
  imports: [AiTabsImports],
  template: `
    <ai-tabs-group>
      <ai-tab label="Tab 1">Content 1</ai-tab>
      <ai-tab label="Tab 2">Content 2</ai-tab>
      <ai-tab label="Tab 3">Content 3</ai-tab>
    </ai-tabs-group>
  `,
})
export class DemoTabsDefaultComponent {}
```

---

### Toast

Seletor: `<ai-toast | ai-toaster>`, `<ai-toast-content>`
Service: `AiToastService`
Interfaces: `AiToastConfig`

```ts
@Component({
  selector: "ai-demo-toast",
  imports: [AiButton],
  template: `
    <ai-button size="sm" (click)="onShowToast()">Show toast</ai-button>
  `,
})
export class DemoToast {
  #toast = inject(AiToastService);

  onShowToast() {
    this.#toast.default({
      message: "Toast message",
      description: "Certifique-se de que os campos estejam válidos.",
      icon: "alarm-warning",
    });
  }
}
```

---

### Tooltip

Selector: `<ai-tooltip>`
Directive: `AiTooltipDirective` · `[aiTooltip]`

```ts
@Component({
  selector: "ai-demo-tooltip",
  imports: [AiButton, AiTooltipImports],
  template: `
    <ai-button type="button" aiTooltip="Tooltip content">
      Tooltip hover
    </ai-button>
    <ai-button type="button" aiTooltip="Tooltip content" aiTrigger="click">
      Tooltip click
    </ai-button>
    <ai-button type="button" aiTooltip="Tooltip content" aiPosition="top">
      Tooltip position top
    </ai-button>
  `,
})
export class DemoTooltip {}
```

---

### Tree

Seletor: `<ai-tree>`, `<ai-tree-node>`
Interfaces: `AiTreeNode<T = unknown>`

```ts
@Component({
  selector: "ai-demo-tree",
  imports: [AiTree],
  template: ` <ai-tree [nodes]="nodes" /> `,
})
export class DemoTree {
  nodes: AiTreeNode[] = [
    {
      label: "src",
      icon: "folder",
      expanded: true,
      children: [
        {
          label: "app",
          icon: "folder",
          expanded: true,
          children: [
            { label: "app.component.ts", icon: "file-code" },
            { label: "app.component.html", icon: "file-code" },
          ],
        },
        {
          label: "assets",
          icon: "folder",
          children: [{ label: "logo.svg", icon: "image" }],
        },
        { label: "main.ts", icon: "file-code" },
      ],
    },
    { label: "package.json", icon: "file-text" },
  ];
}
```

---

### Upload

Seletor: `<ai-upload>`, `<ai-upload-selected>`
Interfaces: `AiFileUpload<T = unknown>`
Service: `AiFileUploadService`

```ts
@Component({
  selector: "ai-demo-upload",
  imports: [AiUploadImports],
  template: `
    <ai-upload
      class="w-full"
      [accept]="accept"
      (changeFile)="onChangeFile($event)"
    />

    @if (config()) {
      <ai-upload-selected [config]="config()" (remove)="onDelete()" />
    }
  `,
})
export class DemoUpload {
  #fileUpload = inject(AiFileUploadService);

  accept = ".png, .jpg, .jpeg, .gif";
  config = signal<AiFileUpload | null>(null);

  async onChangeFile(file: File) {
    const result = await this.#fileUpload.readAsBase64(file);
    this.config.set(result);
  }

  onDelete() {
    this.config.set(null);
  }
}
```

---

### FormField - Input

Seletor: `<ai-input>`
Interfaces: `AiMaskConfig`

```ts
@Component({
  selector: "ai-demo-input",
  imports: [AiInput, FormField],
  template: `
    <ai-input class="w-full" label="Name" [formField]="form.name" />
    <ai-input
      class="w-full"
      label="Password"
      type="password"
      strength
      [formField]="form.password"
    />
    <ai-input
      class="w-full"
      label="CPF"
      mask="000.000.000-00"
      [formField]="form.cpf"
    />
    <ai-input
      class="w-full"
      label="Email"
      type="email"
      icon="mail"
      [formField]="form.email"
    />
  `,
})
export class DemoInput {
  schema = signal<{
    name: string;
    password: string;
    cpf: string;
    email: string;
  }>({
    name: "",
    password: "",
    cpf: "",
    email: "",
  });

  form = form(this.schema);
}
```

---

### FormField - Textarea

Seletor: `<ai-textarea>`

```ts
@Component({
  selector: "ai-demo-textarea",
  imports: [AiTextarea, FormField],
  template: `
    <ai-textarea
      class="w-full"
      label="Description"
      [formField]="form.description"
    />
  `,
})
export class DemoTextarea {
  schema = signal<{ description: string }>({ description: "" });

  form = form(this.schema);
}
```

---

### FormField - Select

Seletor: `<ai-select>`, `<ai-select-item>`, `[ai-select-item]`
Imports: `AiSelectImports`

```ts
@Component({
  selector: "ai-demo-select",
  imports: [AiSelectImports],
  template: `
    <!-- Single -->
    <ai-select
      class="w-75"
      label="Opção"
      placeholder="Selecione..."
      [(value)]="selectValue"
    >
      <ai-select-item value="option1">Option 1</ai-select-item>
      <ai-select-item value="option2">Option 2</ai-select-item>
      <ai-select-item value="option3">Option 3</ai-select-item>
    </ai-select>

    <!-- Multiple -->
    <ai-select class="w-75" label="Opções" multiple [(value)]="multiValue">
      <ai-select-item value="a">Alpha</ai-select-item>
      <ai-select-item value="b">Beta</ai-select-item>
      <ai-select-item value="c">Gamma</ai-select-item>
    </ai-select>
  `,
})
export class DemoSelect {
  selectValue = "";
  multiValue: string[] = [];
}
```

---

### FormField - Checkbox

Seletor: `<ai-checkbox>`, `[ai-checkbox]`

```ts
@Component({
  selector: "ai-demo-checkbox",
  imports: [AiCheckbox, FormsModule],
  template: `
    <ai-checkbox [(checked)]="state">Aceitar termos</ai-checkbox>
    <ai-checkbox variant="accent" shape="square" size="lg"
      >Opção accent</ai-checkbox
    >
    <ai-checkbox [disabled]="true">Desabilitado</ai-checkbox>
  `,
})
export class DemoCheckbox {
  state = false;
}
```

---

### FormField - Radio

Seletor: `<ai-radio-group>`, `<ai-radio>`
Imports: `AiRadioImports`

```ts
@Component({
  selector: "ai-demo-radio",
  imports: [AiRadioImports, FormField],
  template: `
    <ai-radio-group
      [formField]="schemaForm.selected"
      class="flex flex-col gap-2"
    >
      <ai-radio variant="primary" [value]="1">Opção 1</ai-radio>
      <ai-radio variant="accent" [value]="2">Opção 2</ai-radio>
      <ai-radio variant="destructive" [value]="3">Opção 3</ai-radio>
    </ai-radio-group>
  `,
})
export class DemoRadio {
  schema = signal<{ selected: number | null }>({ selected: 1 });
  schemaForm = form(this.schema);
}
```

---

### FormField - Switch

Seletor: `<ai-switch>`

```ts
@Component({
  selector: "ai-demo-switch",
  imports: [AiSwitch],
  template: `
    <ai-switch variant="primary">Switch primary</ai-switch>
    <ai-switch variant="accent">Switch accent</ai-switch>
    <ai-switch variant="destructive">Switch destructive</ai-switch>
  `,
})
export class DemoSwitch {}
```

---

### FormField - Autocomplete

Seletor: `<ai-autocomplete>`
Classes: `AiAutocompleteConfig<TData, TValue>`

```ts
interface User {
  id: number;
  name: string;
  email: string;
}

const USERS: User[] = [
  { id: 1, name: "João Silva", email: "joao@email.com" },
  { id: 2, name: "Maria Santos", email: "maria@email.com" },
];

@Component({
  selector: "ai-demo-autocomplete",
  imports: [AiAutocomplete, FormField],
  template: `
    <ai-autocomplete
      class="w-full"
      label="Usuário"
      placeholder="Buscar usuário..."
      [config]="autoCompleteConfig"
      [formField]="schemaForm.userId"
    />
  `,
})
export class DemoAutocomplete {
  schema = signal<{ userId: number | null }>({ userId: null });

  schemaForm = form(this.schema);

  autoCompleteConfig = new AiAutocompleteConfig<User, number>({
    data: USERS,
    keyword: ["name", "email"],
    useLabel: "name",
    useValue: "id",
    displayLabel: (item: User) => `${item.id} - ${item.name}`,
  });
}
```

---

### FormField - Datetime

Seletor: `<ai-datetime>`
Type: `AiDatetimeType` (`"date"` · `"time"` · `"month"` · `"datetime-local"`)

```ts
@Component({
  selector: "ai-demo-datetime",
  imports: [AiDatetime, FormField],
  template: `
    <ai-datetime
      class="w-75"
      type="datetime-local"
      label="Data e hora"
      [formField]="schemaForm.dtInfracao"
    />
    <ai-datetime
      class="w-75"
      type="date"
      label="Data"
      [formField]="schemaForm.dtMovimento"
    />
    <ai-datetime
      class="w-75"
      type="time"
      label="Hora"
      [formField]="schemaForm.hrMovimento"
    />
    <ai-datetime
      class="w-75"
      type="month"
      label="Mês"
      [formField]="schemaForm.msMovimento"
    />
  `,
})
export class DemoDatetime {
  schema = signal<{
    dtInfracao: string;
    dtMovimento: string;
    hrMovimento: string;
    msMovimento: string;
  }>({
    dtInfracao: "",
    dtMovimento: "",
    hrMovimento: "",
    msMovimento: "",
  });

  schemaForm = form(this.schema);
}
```

---

### FormField - Segmented

Seletor: `<ai-segmented>`
Interfaces: `AiSegmentedItem`

```ts
@Component({
  selector: "ai-demo-segmented",
  imports: [AiSegmented, FormField],
  template: ` <ai-segmented [items]="items" [formField]="schemaForm.view" /> `,
})
export class DemoSegmented {
  schema = signal<{ view: string }>({ view: "list" });

  schemaForm = form(this.schema);

  items: AiSegmentedItem[] = [
    { value: "list", icon: "list-unordered" as AiIconType, label: "Lista" },
    { value: "grid", icon: "grid" as AiIconType, label: "Grade" },
    { value: "table", icon: "table" as AiIconType, label: "Tabela" },
  ];
}
```

---
