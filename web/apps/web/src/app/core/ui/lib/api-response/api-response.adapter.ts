import { FindResponse, GetResponse, IPaginated, PaginatedResponse } from "./api-response.interface";

/**
 * Adapter para respostas da API do tipo Get
 */
export class GetAdapter<T> {
    private response: GetResponse<T>;

    constructor(response: unknown) {
        this.response = response as GetResponse<T>;
    }

    adapt(): T {
        return this.response?.data || ({} as T);
    }
}

/**
 * Adapter para respostas da API sem paginação
 */
export class FindAdapter<T> {
    private response: FindResponse<T>;

    constructor(response: unknown) {
        this.response = response as FindResponse<T>;
    }

    adapt(): T[] {
        return this.response?.data || [];
    }
}

export class PaginationAdapter<T> {
    private response: PaginatedResponse<T>;

    constructor(response: unknown) {
        this.response = response as PaginatedResponse<T>;
    }

    adapt(): IPaginated<T> {
        if (!this.response) return {} as IPaginated<T>;

        const { data, total, page, size } = this.response;
        return { data, total, page, size };
    }
}
