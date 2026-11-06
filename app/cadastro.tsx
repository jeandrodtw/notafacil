import { atualizarNota, buscarNotaPorId, criarNota } from '@/notasApi';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DATA_VALIDA = /^\d{2}\/\d{2}\/\d{4}$/;

export default function CadastroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const notaId = id ? Number(id) : null;

  const [descricaoProduto, setDescricaoProduto] = useState('');
  const [dataCompra, setDataCompra] = useState('');
  const [tempoGarantiaMeses, setTempoGarantiaMeses] = useState('');
  const [loja, setLoja] = useState('');
  const [assistenciaTecnica, setAssistenciaTecnica] = useState('');
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(!!notaId);
  const [salvando, setSalvando] = useState(false);

  // Modo edição: busca a nota na API e preenche o formulário
  useEffect(() => {
    if (!notaId) return;
    buscarNotaPorId(notaId)
      .then((n) => {
        setDescricaoProduto(n.descricaoProduto);
        setDataCompra(n.dataCompra);
        setTempoGarantiaMeses(String(n.tempoGarantiaMeses));
        setLoja(n.loja);
        setAssistenciaTecnica(n.assistenciaTecnica ?? '');
        setFotoUri(n.fotoUri);
      })
      .catch((e) =>
        Alert.alert('Erro', e.message, [{ text: 'Voltar', onPress: () => router.back() }])
      )
      .finally(() => setCarregando(false));
  }, [notaId]);

  async function escolherFoto(origem: 'camera' | 'galeria') {
    if (origem === 'camera') {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permissão negada', 'Libere o acesso à câmera nas configurações do celular.');
        return;
      }
    }
    const opcoes: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], quality: 0.7 };
    const r =
      origem === 'camera'
        ? await ImagePicker.launchCameraAsync(opcoes)
        : await ImagePicker.launchImageLibraryAsync(opcoes);
    if (!r.canceled) setFotoUri(r.assets[0].uri);
  }

  function validar(): string {
    if (!descricaoProduto.trim()) return 'Informe a descrição do produto.';
    if (!loja.trim()) return 'Informe a loja.';
    if (!DATA_VALIDA.test(dataCompra)) return 'A data deve estar no formato dd/mm/aaaa.';
    if (tempoGarantiaMeses && isNaN(Number(tempoGarantiaMeses))) return 'A garantia deve ser um número de meses.';
    return '';
  }

  async function salvarNota() {
    const mensagem = validar();
    if (mensagem) {
      Alert.alert('Atenção', mensagem);
      return;
    }
    const dados = {
      descricaoProduto: descricaoProduto.trim(),
      dataCompra,
      tempoGarantiaMeses: Number(tempoGarantiaMeses) || 0,
      loja: loja.trim(),
      assistenciaTecnica: assistenciaTecnica.trim(),
      fotoUri,
    };
    setSalvando(true);
    try {
      if (notaId) await atualizarNota(notaId, dados);
      else await criarNota(dados);
      Alert.alert('Pronto!', notaId ? 'Nota atualizada.' : 'Nota salva.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e: any) {
      Alert.alert('Não foi possível salvar', e.message);
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#D85A30" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>{'< '}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{notaId ? 'Editar nota' : 'Nova nota'}</Text>
      </View>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>Foto da nota fiscal</Text>
        {fotoUri && <Image source={{ uri: fotoUri }} style={styles.foto} />}
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity style={styles.botaoFoto} onPress={() => escolherFoto('camera')}>
            <Text style={styles.botaoFotoTexto}>Tirar foto</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botaoFoto} onPress={() => escolherFoto('galeria')}>
            <Text style={styles.botaoFotoTexto}>Galeria</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Descrição do produto</Text>
        <TextInput style={styles.input} value={descricaoProduto} onChangeText={setDescricaoProduto}
          placeholder="Ex: Televisão 50 polegadas" placeholderTextColor="#5C6AA0" />

        <Text style={styles.label}>Data da compra</Text>
        <TextInput style={styles.input} value={dataCompra} onChangeText={setDataCompra}
          placeholder="dd/mm/aaaa" keyboardType="numbers-and-punctuation" placeholderTextColor="#5C6AA0" />

        <Text style={styles.label}>Tempo de garantia (meses)</Text>
        <TextInput style={styles.input} value={tempoGarantiaMeses} onChangeText={setTempoGarantiaMeses}
          placeholder="Ex: 12" keyboardType="numeric" placeholderTextColor="#5C6AA0" />

        <Text style={styles.label}>Loja</Text>
        <TextInput style={styles.input} value={loja} onChangeText={setLoja}
          placeholder="Ex: Eletro Sul" placeholderTextColor="#5C6AA0" />

        <Text style={styles.label}>Assistência técnica (opcional)</Text>
        <TextInput style={styles.input} value={assistenciaTecnica} onChangeText={setAssistenciaTecnica}
          placeholder="Endereço ou contato" placeholderTextColor="#5C6AA0" />

        <TouchableOpacity
          style={[styles.saveButton, salvando && { opacity: 0.6 }]}
          onPress={salvarNota}
          disabled={salvando}
        >
          {salvando ? (
            <ActivityIndicator color="#FAECE7" />
          ) : (
            <Text style={styles.saveButtonText}>{notaId ? 'Salvar alterações' : 'Salvar nota'}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0E1B33' },
  header: {
    backgroundColor: '#D85A30', paddingHorizontal: 16, paddingBottom: 16,
    flexDirection: 'row', alignItems: 'center',
  },
  backButton: { color: '#FAECE7', fontSize: 20, fontWeight: 'bold', marginRight: 8 },
  headerTitle: { color: '#FAECE7', fontSize: 20, fontWeight: 'bold' },
  label: { color: '#98A4C8', fontSize: 13, marginTop: 12, marginBottom: 4 },
  input: {
    borderWidth: 1, borderColor: '#223564', borderRadius: 8,
    padding: 10, color: '#F0F2FA', backgroundColor: '#16264A',
  },
  foto: { width: '100%', height: 180, borderRadius: 8, marginBottom: 10, backgroundColor: '#16264A' },
  botaoFoto: {
    flex: 1, borderWidth: 1, borderColor: '#D85A30', borderRadius: 8,
    padding: 10, alignItems: 'center',
  },

  botaoFotoTexto: { color: '#FAECE7', fontWeight: 'bold' },
  saveButton: {
    backgroundColor: '#D85A30', borderRadius: 8, padding: 14,
    alignItems: 'center', marginTop: 24,
  },
  saveButtonText: { color: '#FAECE7', fontWeight: 'bold', fontSize: 15 },
});
