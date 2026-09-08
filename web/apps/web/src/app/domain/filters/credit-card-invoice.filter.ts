import { FilterManager, FilterProps } from "@core/ui";
import { CreditCardInvoiceFilterDto } from "@domain/schemas";

export class CreditCardInvoiceFilter {
    props: CreditCardInvoiceFilterDto;

    constructor(props: CreditCardInvoiceFilterDto) {
        this.props = props;
    }

    getFilters(): FilterManager {
        return new FilterProps<CreditCardInvoiceFilterDto>(this.props).getFilters();
    }
}
