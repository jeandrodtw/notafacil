export function calcularVencimento(dataCompraTexto: string, tempoGarantiaMeses: number): Date | null {
  const [dia, mes, ano] = dataCompraTexto.split('/').map(Number);
  if (!dia || !mes || !ano) return null;

  const data = new Date(ano, mes - 1, dia);
  data.setMonth(data.getMonth() + Number(tempoGarantiaMeses || 0));
  return data;
}

export type StatusGarantia = { texto: string; cor: string; fundo: string };

export function statusGarantia(dataVencimento: Date | null): StatusGarantia {
  if (!dataVencimento) return { texto: 'Sem data', cor: '#98A4C8', fundo: '#223564' };

  const hoje = new Date();
  const diasRestantes = Math.ceil((dataVencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

  if (diasRestantes < 0) return { texto: 'Vencida', cor: '#501313', fundo: '#E24B4A' };
  if (diasRestantes <= 30) return { texto: 'Vence em breve', cor: '#412402', fundo: '#EF9F27' };
  return { texto: 'Garantia ok', cor: '#04342C', fundo: '#1D9E75' };
}

export function formatarData(data: Date | null): string {
  if (!data) return '-';
  return data.toLocaleDateString('pt-BR');
}