export interface QueryResultError {
    name: string,
    length: number,
    severity: string,
    code: string,
    detail: string,
    hint: any,
    position: number,
    internalPosition: number,
    internalQuery: any,
    where: any,
    schema: string,
    table: string,
    column: number,
    dataType: undefined,
    constraint: string,
    file: string,
    line: string,
    routine: string;
}