import { HttpFilter } from "../http.filter";
import { FilterManager } from "./filter-manage.interface";
import { GenericFilter } from "./generic-filter";

/**
 * Classe responsável por armazenar as informações dos filtros necessários para as pesquisas, utilizando os props passados
 * para criar os filtros. Ela possui um método `getFilters()` que retorna um objeto do tipo `FilterManager`, contendo os
 * filtros construídos a partir dos props.
 */
export class FilterProps<T extends object> {
    private props: T;
    private httpFilter = new HttpFilter();

    protected isValidFilterValue = (value: unknown): boolean => value !== null && value !== undefined && value !== "";

    constructor(props: T) {
        this.props = props;
    }

    /**
     * Método que retorna um objeto do tipo `FilterManager`, contendo os filtros construídos a partir dos props.
     */
    getFilters(): FilterManager {
        const keys = Object.keys(this.props) as (keyof T)[];

        keys.forEach(key => {
            const value = this.props[key];
            if (this.isValidFilterValue(value)) this.httpFilter.addFilter(new GenericFilter(String(key), value));
        });

        return this.httpFilter;
    }
}
