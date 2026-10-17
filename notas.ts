import { requisicao } from '@/api';
import type { Nota, NotaFormulario } from '@/types';
import { File } from 'expo-file-system';

// Foto recém-tirada pela câmera é um arquivo local (file://...).
// Foto que já veio da API é uma URL http(s) e não precisa ser reenviada.
function fotoLocal(uri: string | null): uri is string {
  return !!uri && !uri.startsWith('http');
}

// Com foto nova: multipart (FormData). Sem foto nova: JSON simples.
function montarCorpo(nota: NotaFormulario): BodyInit {
  if (!fotoLocal(nota.fotoUri)) {
    return JSON.stringify({
      descricaoProduto: nota.descricaoProduto,
      // Reenviar a URL atual mantém a foto; null remove
      fotoUri: nota.fotoUri,
      dataCompra: nota.dataCompra,
      tempoGarantiaMeses: nota.tempoGarantiaMeses,
      loja: nota.loja,
      assistenciaTecnica: nota.assistenciaTecnica,
    });
  }

  const form = new FormData();
  form.append('descricaoProduto', nota.descricaoProduto);
  form.append('dataCompra', nota.dataCompra);
  form.append('tempoGarantiaMeses', String(nota.tempoGarantiaMeses));
  form.append('loja', nota.loja);
  form.append('assistenciaTecnica', nota.assistenciaTecnica);
  // O fetch do Expo não aceita o formato antigo { uri, name, type }:
  // o arquivo precisa ir como Blob. O File do expo-file-system é um Blob.
  form.append('fotoUri', new File(nota.fotoUri), 'nota.jpg');
  return form;
}

export function buscarNotas(): Promise<Nota[]> {
  return requisicao<Nota[]>('/notas/');
}

export function buscarNotaPorId(id: number): Promise<Nota> {
  return requisicao<Nota>(`/notas/${id}/`);
}

export function inserirNota(nota: NotaFormulario): Promise<Nota> {
  return requisicao<Nota>('/notas/', { method: 'POST', body: montarCorpo(nota) });
}

export function atualizarNota(id: number, nota: NotaFormulario): Promise<Nota> {
  return requisicao<Nota>(`/notas/${id}/`, { method: 'PUT', body: montarCorpo(nota) });
}

export function excluirNota(id: number): Promise<void> {
  return requisicao<void>(`/notas/${id}/`, { method: 'DELETE' });
}
