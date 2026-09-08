import { FilterManager, FilterProps } from "@core/ui";
import { SavingsGoalFilterDto } from "@domain/schemas";

export class SavingsGoalFilter {
    props: SavingsGoalFilterDto;

    constructor(props: SavingsGoalFilterDto) {
        this.props = props;
    }

    getFilters(): FilterManager {
        return new FilterProps<SavingsGoalFilterDto>(this.props).getFilters();
    }
}
