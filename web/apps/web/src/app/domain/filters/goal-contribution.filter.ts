import { FilterManager, FilterProps } from "@core/ui";
import { GoalContributionFilterDto } from "@domain/schemas";

export class GoalContributionFilter {
    props: GoalContributionFilterDto;

    constructor(props: GoalContributionFilterDto) {
        this.props = props;
    }

    getFilters(): FilterManager {
        return new FilterProps<GoalContributionFilterDto>(this.props).getFilters();
    }
}
