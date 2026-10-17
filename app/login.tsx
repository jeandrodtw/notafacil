import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import {
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { entrar, criarConta } = useAuth();

  const [modoCadastro, setModoCadastro] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Validação feita no app, antes de chamar a API
  function validar(): string {
    if (usuario.trim().length < 3) return 'O usuário deve ter ao menos 3 caracteres.';
    if (senha.length < 6) return 'A senha deve ter ao menos 6 caracteres.';
    if (modoCadastro && senha !== confirmar) return 'As senhas não conferem.';
    return '';
  }

  async function enviar() {
    const mensagem = validar();
    if (mensagem) {
      setErro(mensagem);
      return;
    }
    setErro('');
    setEnviando(true);
    try {
      if (modoCadastro) await criarConta(usuario.trim(), senha);
      else await entrar(usuario.trim(), senha);
      // Sem navegação manual: o Stack.Protected leva para as abas
    } catch (e: any) {
      setErro(e.message ?? 'Falha ao entrar.');
    } finally {
      setEnviando(false);
    }
  }

  function alternarModo() {
    setModoCadastro(!modoCadastro);
    setErro('');
    setConfirmar('');
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingTop: insets.top + 60, paddingBottom: insets.bottom + 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.logo}>NotaFácil</Text>
        <Text style={styles.subtitulo}>
          {modoCadastro ? 'Crie sua conta' : 'Entre para ver suas garantias'}
        </Text>

        <Text style={styles.label}>Usuário</Text>
        <TextInput
          style={styles.input}
          value={usuario}
          onChangeText={setUsuario}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Ex: aluno"
          placeholderTextColor="#5C6AA0"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          autoCapitalize="none"
          placeholder="Mínimo 6 caracteres"
          placeholderTextColor="#5C6AA0"
        />

        {modoCadastro && (
          <>
            <Text style={styles.label}>Confirmar senha</Text>
            <TextInput
              style={styles.input}
              value={confirmar}
              onChangeText={setConfirmar}
              secureTextEntry
              autoCapitalize="none"
              placeholder="Repita a senha"
              placeholderTextColor="#5C6AA0"
            />
          </>
        )}

        {!!erro && <Text style={styles.erro}>{erro}</Text>}

        <TouchableOpacity
          style={[styles.botao, enviando && { opacity: 0.6 }]}
          onPress={enviar}
          disabled={enviando}
        >
          {enviando ? (
            <ActivityIndicator color="#FAECE7" />
          ) : (
            <Text style={styles.botaoTexto}>{modoCadastro ? 'Criar conta' : 'Entrar'}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={alternarModo} style={{ marginTop: 20 }}>
          <Text style={styles.link}>
            {modoCadastro ? 'Já tenho conta. Entrar' : 'Não tenho conta. Cadastrar'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0E1B33' },
  logo: { color: '#FAECE7', fontSize: 34, fontWeight: 'bold', textAlign: 'center' },
  subtitulo: { color: '#98A4C8', fontSize: 14, textAlign: 'center', marginTop: 6, marginBottom: 32 },
  label: { color: '#98A4C8', fontSize: 13, marginTop: 12, marginBottom: 4 },
  input: {
    borderWidth: 1, borderColor: '#223564', borderRadius: 8,
    padding: 12, color: '#F0F2FA', backgroundColor: '#16264A',
  },
  erro: { color: '#FF8A70', marginTop: 14, fontSize: 13 },
  botao: {
    backgroundColor: '#D85A30', borderRadius: 8, padding: 14,
    alignItems: 'center', marginTop: 24,
  },
  botaoTexto: { color: '#FAECE7', fontWeight: 'bold', fontSize: 15 },
  link: { color: '#98A4C8', textAlign: 'center', fontSize: 14 },
});
