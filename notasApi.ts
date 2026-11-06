import { requisicao } from '@/api';
import type { Nota, NotaFormulario, StatusGarantia } from '@/types';

// Monta o corpo multipart (necessário para enviar a foto)
function montarForm(dados: NotaFormulario): FormData {
    const form = new FormData();
    form.append('descricaoProduto', dados.descricaoProduto);
    form.append('dataCompra', dados.dataCompra);
    form.append('tempoGarantiaMeses', String(dados.tempoGarantiaMeses));
    form.append('loja', dados.loja);
    form.append('assistenciaTecnica', dados.assistenciaTecnica);

    // Só envia a foto se for um arquivo local novo (não uma URL que já veio da API)
    if (dados.fotoUri && !dados.fotoUri.startsWith('http')) {
        form.append('fotoUri', {
            uri: dados.fotoUri,
            name: 'nota.jpg',
            type: 'image/jpeg',
        } as any);
    }
    return form;
}

export function buscarNotas(busca?: string, status?: StatusGarantia): Promise<Nota[]> {
    const params: string[] = [];
    if (busca) params.push(`busca=${encodeURIComponent(busca)}`);
    if (status) params.push(`status=${status}`);
    const query = params.length ? `?${params.join('&')}` : '';
    return requisicao<Nota[]>(`/notas/${query}`);
}

export function buscarNotaPorId(id: number): Promise<Nota> {
    return requisicao<Nota>(`/notas/${id}/`);
}

export function criarNota(dados: NotaFormulario): Promise<Nota> {
    return requisicao<Nota>('/notas/', { method: 'POST', body: montarForm(dados) });
}

export function atualizarNota(id: number, dados: NotaFormulario): Promise<Nota> {
    return requisicao<Nota>(`/notas/${id}/`, { method: 'PATCH', body: montarForm(dados) });
}

export async function excluirNota(id: number): Promise<void> {
    await requisicao<null>(`/notas/${id}/`, { method: 'DELETE' });
}
