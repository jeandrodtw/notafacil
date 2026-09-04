export type Nota = {
    id: number;
    descricaoProduto: string;
    dataCompra: string;
    tempoGarantiaMeses: number;
    loja: string;
    assistenciaTecnica: string;
};

export type NotaFormulario = Omit<Nota, 'id'>;
  