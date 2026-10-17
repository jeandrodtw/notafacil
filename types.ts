export type StatusGarantiaApi = 'vigente' | 'vencendo' | 'vencida';

export type Nota = {
    id: number;
    descricaoProduto: string;
    fotoUri: string | null;
    dataCompra: string;
    tempoGarantiaMeses: number;
    loja: string;
    assistenciaTecnica: string;
    // Calculados pela API (somente leitura)
    dataVencimento: string;
    statusGarantia: StatusGarantiaApi;
};

export type NotaFormulario = Omit<Nota, 'id' | 'dataVencimento' | 'statusGarantia'>;
