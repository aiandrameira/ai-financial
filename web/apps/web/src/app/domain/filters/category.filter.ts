import { FilterManager, FilterProps } from "@core/ui";
import { CategoryFilterDto } from "@domain/schemas";

export class CategoryFilter {
    props: CategoryFilterDto;

    constructor(props: CategoryFilterDto) {
        this.props = props;
    }

    getFilters(): FilterManager {
        return new FilterProps<CategoryFilterDto>(this.props).getFilters();
    }
}
