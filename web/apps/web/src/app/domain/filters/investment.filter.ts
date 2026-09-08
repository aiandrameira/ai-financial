import { FilterManager, FilterProps } from "@core/ui";
import { InvestmentFilterDto } from "@domain/schemas";

export class InvestmentFilter {
    props: InvestmentFilterDto;

    constructor(props: InvestmentFilterDto) {
        this.props = props;
    }

    getFilters(): FilterManager {
        return new FilterProps<InvestmentFilterDto>(this.props).getFilters();
    }
}
