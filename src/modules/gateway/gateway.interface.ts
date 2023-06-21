
export interface IGatewayTransactionAdditional {
    name: string,
    value: string,
}

export interface IGatewayPixTransaction {
    valor: number, // 1234.56 | 1234.50
    dataValidade: Date, // GMT
    adicionais?: IGatewayTransactionAdditional[],
}