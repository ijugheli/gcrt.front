export const reverseMap = (m: Map<number, string>) => {
    return new Map(Array.from(m, entry => [entry[1], entry[0]]));
}