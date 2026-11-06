export type StatusGarantia = 'vigente' | 'vencendo' | 'vencida';
 
export type Nota = {
  id: number;
  descricaoProduto: string;
  fotoUri: string | null;      // agora é a URL devolvida pela API
  dataCompra: string;          // dd/mm/aaaa
  tempoGarantiaMeses: number;
  loja: string;
  assistenciaTecnica: string;
  // Calculados pela API (somente leitura)
  dataVencimento?: string;
  statusGarantia?: StatusGarantia;
};
 
export type NotaFormulario = Omit<Nota, 'id' | 'dataVencimento' | 'statusGarantia'>;