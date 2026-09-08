import { FilterManager, FilterProps } from "@core/ui";
import { LoanFilterDto } from "@domain/schemas";

export class LoanFilter {
    props: LoanFilterDto;

    constructor(props: LoanFilterDto) {
        this.props = props;
    }

    getFilters(): FilterManager {
        return new FilterProps<LoanFilterDto>(this.props).getFilters();
    }
}
