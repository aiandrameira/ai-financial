interface IFilter<T> {
    field: string;
    value: T;
}

/**
 * Classe abstrata que representa um filtro genérico, implementando a interface `IFilter<T>`. Ela define os campos e o valor do filtro,
 * além de um método abstrato `validate()` que deve ser implementado pelas classes filhas para validar o valor do filtro.
 */
export abstract class Filter<T> implements IFilter<T> {
    field: string;
    value: T;

    constructor(field: string, value: T) {
        this.field = field;
        this.value = value;
    }

    abstract validate(): boolean;
}
