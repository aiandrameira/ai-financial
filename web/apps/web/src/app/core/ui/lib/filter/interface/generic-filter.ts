import { Filter } from "./filter.interface";

/**
 * Classe abstrata que representa um filtro genérico, implementando a interface `IFilter<T>`. Ela define os campos e o valor do filtro,
 * além de um método abstrato `validate()` que deve ser implementado pelas classes filhas para validar o valor do filtro.
 */
export class GenericFilter<T> extends Filter<T> {
    validate(): boolean {
        return this.value !== null && this.value !== undefined;
    }
}
