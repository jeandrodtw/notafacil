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
  
// Extrai a primeira mensagem de erro no formato do Django REST 

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
  if (!(opcoes.body instanceof FormData)) headers['Content-Type'] = 'application/json'; 
  if (token) headers.Authorization = `Token ${token}`; 
  
  // Timeout de 8s: sem isso, um IP errado deixa o app carregando para sempre 
  const controle = new AbortController(); 
  const timer = setTimeout(() => controle.abort(), 8000); 
  
  let resp: Response; 
  try { 
    resp = await fetch(`${API_URL}${caminho}`, { ...opcoes, headers, signal: controle.signal }); 
  } catch { 
    throw new ApiError('Não foi possível conectar ao servidor. Confira o IP e a rede Wi-Fi.', 0); 
  } finally { 
    clearTimeout(timer); 
  } 
  
  const dados = resp.status === 204 ? null : await resp.json().catch(() => null); 
  
  if (!resp.ok) { 
    // Token inválido ou expirado: encerra a sessão 
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
  
// Confirma se o token salvo ainda é válido 
export function verificarSessao() { 
  return requisicao<{ id: number; username: string }>('/auth/eu/'); 
} 