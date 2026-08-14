import { CategoryDto, RequestCategoryDto } from "@domain/schemas";

export class CategoryAdapter {
    static toDto(raw: CategoryDto): RequestCategoryDto {
        return {
            id: raw.id,
            name: raw.name,
            type: raw.type,
            parentId: raw.parentId ?? "",
            icon: raw.icon ?? "",
            color: raw.color ?? "",
        };
    }
}
