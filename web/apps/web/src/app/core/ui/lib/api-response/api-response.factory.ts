import { FindAdapter, GetAdapter, PaginationAdapter } from "./api-response.adapter";

export class ResponseFactory {
    /**
     * Cria adapter para GetResponse<T>
     */
    static createGetAdapter<T>(response: unknown): GetAdapter<T> {
        if (!this.isGetResponse(response)) {
            throw new Error("Resposta não é do tipo GetResponse<T>");
        }
        return new GetAdapter<T>(response);
    }

    /**
     * Cria adapter para FindResponse<T>
     */
    static createFindAdapter<T>(response: unknown): FindAdapter<T> {
        if (!this.isFindResponse(response)) {
            throw new Error("Resposta não é do tipo FindResponse<T>");
        }
        return new FindAdapter<T>(response);
    }

    /**
     * Cria adapter para PaginatedResponse<T>
     */
    static createPaginatedAdapter<T>(response: unknown): PaginationAdapter<T> {
        if (!this.isPaginatedResponse(response)) {
            throw new Error("Resposta não é do tipo PaginatedResponse<T>");
        }
        return new PaginationAdapter<T>(response);
    }

    private static isGetResponse(response: unknown): boolean {
        return response !== null && typeof response === "object" && "data" in response;
    }

    private static isFindResponse(response: unknown): boolean {
        return response !== null && typeof response === "object" && "data" in response;
    }

    private static isPaginatedResponse(response: unknown): boolean {
        return response !== null && typeof response === "object" && "data" in response && "total" in response && "page" in response && "size" in response;
    }
}
