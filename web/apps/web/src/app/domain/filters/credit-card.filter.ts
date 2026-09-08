import { FilterManager, FilterProps } from "@core/ui";
import { CreditCardFilterDto } from "@domain/schemas";

export class CreditCardFilter {
    props: CreditCardFilterDto;

    constructor(props: CreditCardFilterDto) {
        this.props = props;
    }

    getFilters(): FilterManager {
        return new FilterProps<CreditCardFilterDto>(this.props).getFilters();
    }
}
