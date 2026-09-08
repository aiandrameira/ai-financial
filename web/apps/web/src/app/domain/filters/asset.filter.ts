import { FilterManager, FilterProps } from "@core/ui";
import { AssetFilterDto } from "@domain/schemas";

export class AssetFilter {
    props: AssetFilterDto;

    constructor(props: AssetFilterDto) {
        this.props = props;
    }

    getFilters(): FilterManager {
        return new FilterProps<AssetFilterDto>(this.props).getFilters();
    }
}
