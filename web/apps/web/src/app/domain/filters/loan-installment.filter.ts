import { FilterManager, FilterProps } from "@core/ui";
import { LoanInstallmentFilterDto } from "@domain/schemas";

export class LoanInstallmentFilter {
    props: LoanInstallmentFilterDto;

    constructor(props: LoanInstallmentFilterDto) {
        this.props = props;
    }

    getFilters(): FilterManager {
        return new FilterProps<LoanInstallmentFilterDto>(this.props).getFilters();
    }
}
