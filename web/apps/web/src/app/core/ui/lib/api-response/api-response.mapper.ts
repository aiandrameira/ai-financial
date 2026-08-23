import { ResponseFactory } from "./api-response.factory";
import { CursorPaginated, CursorPaginatedResponse } from "./api-response.interface";

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
 * Mapeia automaticamente respostas CursorPaginatedResponse<T> para CursorPaginated<T>
 * @param response - Resposta da API (formato de paginação por cursor)
 * @returns Estrutura paginada CursorPaginated<T>
 */
export function mapCursorPaginated<T>(response: unknown): CursorPaginated<T> {
    if (!isCursorPaginatedResponse<T>(response)) {
        throw new Error("Resposta inválida para paginação por cursor");
    }

    return { data: response.data, pagination: response.pagination };
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
