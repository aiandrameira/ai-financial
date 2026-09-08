import { FilterManager, FilterProps } from "@core/ui";
import { InvestmentMovementFilterDto } from "@domain/schemas";

export class InvestmentMovementFilter {
    props: InvestmentMovementFilterDto;

    constructor(props: InvestmentMovementFilterDto) {
        this.props = props;
    }

    getFilters(): FilterManager {
        return new FilterProps<InvestmentMovementFilterDto>(this.props).getFilters();
    }
}
