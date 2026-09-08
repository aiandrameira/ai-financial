import { FilterManager, FilterProps } from "@core/ui";
import { InvestmentPriceFilterDto } from "@domain/schemas";

export class InvestmentPriceFilter {
    props: InvestmentPriceFilterDto;

    constructor(props: InvestmentPriceFilterDto) {
        this.props = props;
    }

    getFilters(): FilterManager {
        return new FilterProps<InvestmentPriceFilterDto>(this.props).getFilters();
    }
}
