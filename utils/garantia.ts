import type { StatusGarantiaApi } from '@/types';

// O cálculo do vencimento e do status agora é feito pela API (notas/garantia.py).
// Aqui fica só a aparência de cada status.

export type StatusGarantia = { texto: string; cor: string; fundo: string };

export function statusGarantia(status: StatusGarantiaApi | null | undefined): StatusGarantia {
  if (status === 'vencida') return { texto: 'Vencida', cor: '#501313', fundo: '#E24B4A' };
  if (status === 'vencendo') return { texto: 'Vence em breve', cor: '#412402', fundo: '#EF9F27' };
  if (status === 'vigente') return { texto: 'Garantia ok', cor: '#04342C', fundo: '#1D9E75' };
  return { texto: 'Sem data', cor: '#98A4C8', fundo: '#223564' };
}
