import { FilterManager, FilterProps } from "@core/ui";
import { BudgetFilterDto } from "@domain/schemas";

export class BudgetFilter {
    props: BudgetFilterDto;

    constructor(props: BudgetFilterDto) {
        this.props = props;
    }

    getFilters(): FilterManager {
        return new FilterProps<BudgetFilterDto>(this.props).getFilters();
    }
}
