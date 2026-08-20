import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import type { Observable } from "rxjs";
import { map } from "rxjs";

import { mapGet } from "@core/ui";
import { environment } from "@env/environment";

export type NotifyDueInvoicesResult = {
    configured: boolean;
    checked: number;
    notified: number;
    failed: number;
};

@Injectable({
    providedIn: "root",
})
export class NotifyDueInvoicesService {
    #client = inject(HttpClient);
    #api = environment.apiUrl.concat("/jobs/notify-due-invoices");

    run(): Observable<NotifyDueInvoicesResult> {
        return this.#client.post(this.#api, {}).pipe(map(response => mapGet(response)));
    }
}
