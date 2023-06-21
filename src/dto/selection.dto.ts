export class SelectionSet {
    name: string;
    children: SelectionSet[]
}

export class SelectionDTO {
    selection?: SelectionSet[] = null;
}
