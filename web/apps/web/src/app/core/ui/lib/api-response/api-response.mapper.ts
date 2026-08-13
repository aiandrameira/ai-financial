import { ResponseFactory } from "./api-response.factory";
import { CursorPaginated, CursorPaginatedResponse, IPaginated } from "./api-response.interface";

/**
 * Mapeia automaticamente respostas GetResponse<T> para o tipo T
 * @param response - Resposta da API (auto-detecta se é GetResponse)
 * @returns Dados extraídos do tipo T
 */
export function mapGet<T>(response: unknown): T {
    const adapter = ResponseFactory.createGetAdapter<T>(response);
    return adapter.adapt();
}

/**
 * Mapeia automaticamente respostas FindResponse<T> para array T[]
 * @param response - Resposta da API (auto-detecta se é FindResponse)
 * @returns Array de dados do tipo T[]
 */
export function mapFind<T>(response: unknown): T[] {
    const adapter = ResponseFactory.createFindAdapter<T>(response);
    return adapter.adapt();
}

/**
 * Mapeia automaticamente respostas PaginatedResponse<T> para IPaginated<T>
 * @param response - Resposta da API (auto-detecta se é PaginatedResponse)
 * @returns Estrutura paginada IPaginated<T>
 */
export function mapPaginated<T>(response: unknown): IPaginated<T> {
    const adapter = ResponseFactory.createPaginatedAdapter<T>(response);
    return adapter.adapt();
}

export function mapCursorPaginated<T>(response: unknown): CursorPaginated<T> {
    if (isCursorPaginatedResponse<T>(response)) {
        return { data: response.data, pagination: response.pagination };
    }

    if (isLegacyPaginatedResponse<T>(response)) {
        return {
            data: response.data,
            pagination: {
                limit: response.size,
                next: null,
                prev: null,
                total: response.total,
            },
        };
    }

    throw new Error("Resposta inválida para paginação por cursor");
}

function isCursorPaginatedResponse<T>(response: unknown): response is CursorPaginatedResponse<T> {
    return (
        response !== null &&
        typeof response === "object" &&
        "data" in response &&
        Array.isArray(response.data) &&
        "pagination" in response &&
        response.pagination !== null &&
        typeof response.pagination === "object"
    );
}

function isLegacyPaginatedResponse<T>(response: unknown): response is { data: T[]; size: number; total: number } {
    return (
        response !== null &&
        typeof response === "object" &&
        "data" in response &&
        Array.isArray(response.data) &&
        "size" in response &&
        typeof response.size === "number" &&
        "total" in response &&
        typeof response.total === "number"
    );
}
