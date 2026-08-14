import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "mapLabel",
})
export class MapLabelPipe implements PipeTransform {
    transform<Enum>(value: Enum, mapLabel: Map<Enum, string>): string {
        return mapLabel.get(value) as string;
    }
}
