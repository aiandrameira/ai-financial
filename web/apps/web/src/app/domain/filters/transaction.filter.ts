import { FilterManager, FilterProps } from "@core/ui";

export type TransactionFilterProps = {
    page?: number;
    size?: number;
    accountId?: string;
    categoryId?: string;
    status?: string;
    type?: string;
    dateFrom?: string;
    dateTo?: string;
};

export class TransactionFilter {
    props: TransactionFilterProps;

    constructor(props: TransactionFilterProps) {
        this.props = props;
    }

    getFilters(): FilterManager {
        return new FilterProps<TransactionFilterProps>(this.props).getFilters();
    }
}
