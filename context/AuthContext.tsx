import { definirAoNaoAutorizado, definirToken, login, registrar } from '@/api';
import * as SecureStore from 'expo-secure-store';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

const CHAVE = 'notafacil_token';

type AuthContextType = {
  token: string | null;
  carregando: boolean;
  entrar: (usuario: string, senha: string) => Promise<void>;
  criarConta: (usuario: string, senha: string) => Promise<void>;
  sair: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  async function guardar(novo: string | null) {
    definirToken(novo);
    setToken(novo);
    try {
      if (novo) await SecureStore.setItemAsync(CHAVE, novo);
      else await SecureStore.deleteItemAsync(CHAVE);
    } catch {}
  }

  // Ao abrir o app: recupera o token salvo (login persistente)
  useEffect(() => {
    (async () => {
      try {
        const salvo = await SecureStore.getItemAsync(CHAVE);
        if (salvo) {
          definirToken(salvo);
          setToken(salvo);
        }
      } catch {}
      setCarregando(false);
    })();
  }, []);

  // Se a API responder 401 em qualquer chamada, sai da sessão
  useEffect(() => {
    definirAoNaoAutorizado(() => { guardar(null); });
    return () => definirAoNaoAutorizado(null);
  }, []);

  async function entrar(usuario: string, senha: string) {
    const { token } = await login(usuario, senha);
    await guardar(token);
  }

  async function criarConta(usuario: string, senha: string) {
    const { token } = await registrar(usuario, senha);
    await guardar(token);
  }

  async function sair() {
    await guardar(null);
  }

  return (
    <AuthContext.Provider value={{ token, carregando, entrar, criarConta, sair }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
