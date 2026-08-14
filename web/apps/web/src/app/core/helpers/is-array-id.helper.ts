export function isArrayId(value: unknown): string {
    return (Array.isArray(value) ? value[0] : value) as string;
}
