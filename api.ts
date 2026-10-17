import { API_URL } from '@/config';

export class ApiError extends Error {
  status: number;
  constructor(mensagem: string, status: number) {
    super(mensagem);
    this.status = status;
  }
}

let token: string | null = null;
let aoNaoAutorizado: (() => void) | null = null;

export function definirToken(t: string | null) { token = t; }
export function definirAoNaoAutorizado(fn: (() => void) | null) { aoNaoAutorizado = fn; }

// Extrai a primeira mensagem de erro do formato do Django REST
function mensagemDeErro(dados: any): string {
  if (!dados) return 'Erro inesperado. Tente novamente.';
  if (typeof dados === 'string') return dados;
  if (dados.detail) return String(dados.detail);
  const primeiro: any = Object.values(dados)[0];
  return Array.isArray(primeiro) ? String(primeiro[0]) : String(primeiro);
}

export async function requisicao<T>(caminho: string, opcoes: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(opcoes.headers as Record<string, string>),
  };
  // Com FormData (upload de foto) o fetch define o Content-Type sozinho
  const upload = opcoes.body instanceof FormData;
  if (!upload) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Token ${token}`;

  // Timeout: sem isso, IP errado deixa o app carregando para sempre.
  // Upload de foto ganha mais tempo, porque o arquivo pode ter alguns MB.
  const controle = new AbortController();
  const timer = setTimeout(() => controle.abort(), upload ? 30000 : 8000);

  let resp: Response;
  try {
    resp = await fetch(`${API_URL}${caminho}`, { ...opcoes, headers, signal: controle.signal });
  } catch (e: any) {
    // Mostra o erro real no terminal do Expo para facilitar o diagnóstico
    console.warn('Falha na requisição', caminho, e);
    if (controle.signal.aborted) {
      throw new ApiError('O servidor demorou demais para responder. Tente novamente.', 0);
    }
    throw new ApiError('Não foi possível conectar ao servidor. Confira o IP e a rede Wi-Fi.', 0);
  } finally {
    clearTimeout(timer);
  }

  const dados = resp.status === 204 ? null : await resp.json().catch(() => null);

  if (!resp.ok) {
    // Token inválido ou expirado: desloga o usuário
    if (resp.status === 401 && token) aoNaoAutorizado?.();
    throw new ApiError(mensagemDeErro(dados), resp.status);
  }
  return dados as T;
}

type RespostaAuth = { token: string };

export function login(username: string, password: string) {
  return requisicao<RespostaAuth>('/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export function registrar(username: string, password: string) {
  return requisicao<RespostaAuth>('/auth/registro/', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}
