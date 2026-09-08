import { FilterManager, FilterProps } from "@core/ui";
import { AccountFilterDto } from "@domain/schemas";

export class AccountFilter {
    props: AccountFilterDto;

    constructor(props: AccountFilterDto) {
        this.props = props;
    }

    getFilters(): FilterManager {
        return new FilterProps<AccountFilterDto>(this.props).getFilters();
    }
}
