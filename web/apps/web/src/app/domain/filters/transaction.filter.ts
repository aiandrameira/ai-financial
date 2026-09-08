import { FilterManager, FilterProps } from "@core/ui";
import { TransactionFilterDto } from "@domain/schemas";

export class TransactionFilter {
    props: TransactionFilterDto;

    constructor(props: TransactionFilterDto) {
        this.props = props;
    }

    getFilters(): FilterManager {
        return new FilterProps<TransactionFilterDto>(this.props).getFilters();
    }
}
