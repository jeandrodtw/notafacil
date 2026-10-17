import { atualizarNota, buscarNotaPorId, inserirNota } from "@/notas";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CadastroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const notaId = id ? Number(id) : null;

  const [descricaoProduto, setDescricaoProduto] = useState('');
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [dataCompra, setDataCompra] = useState('');
  const [tempoGarantiaMeses, setTempoGarantiaMeses] = useState('');
  const [loja, setLoja] = useState('');
  const [assistenciaTecnica, setAssistenciaTecnica] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!notaId) return;
    buscarNotaPorId(notaId)
      .then((nota) => {
        setDescricaoProduto(nota.descricaoProduto);
        setFotoUri(nota.fotoUri);
        setDataCompra(nota.dataCompra);
        setTempoGarantiaMeses(String(nota.tempoGarantiaMeses));
        setLoja(nota.loja);
        setAssistenciaTecnica(nota.assistenciaTecnica);
      })
      .catch((e) => alert(e.message));
  }, [notaId]);

  async function tirarFoto() {
    const permissao = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissao.granted) {
      alert('É preciso permitir o acesso à câmera.');
      return;
    }
    const resultado = await ImagePicker.launchCameraAsync({ quality: 0.6 });
    if (!resultado.canceled) {
      setFotoUri(resultado.assets[0].uri);
    }
  }

  async function salvarNota() {
    if (!descricaoProduto || !loja || !dataCompra) {
      alert('Preencha ao menos a descrição, a data da compra e a loja.');
      return;
    }
    const dados = {
      descricaoProduto,
      fotoUri,
      dataCompra,
      tempoGarantiaMeses: Number(tempoGarantiaMeses) || 0,
      loja,
      assistenciaTecnica,
    };
    setSalvando(true);
    try {
      if (notaId) {
        await atualizarNota(notaId, dados);
      } else {
        await inserirNota(dados);
      }
      router.back();
    } catch (e: any) {
      // Mensagem de validação vinda da API (ex.: data inválida)
      alert(e.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>{' < '}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{notaId ? 'Editar nota' : 'Nova nota'}</Text>
      </View>

      <View style={{ padding: 16 }}>
        <TouchableOpacity style={styles.photoBox} onPress={tirarFoto}>
          {fotoUri ? (
            <Image source={{ uri: fotoUri }} style={styles.photoPreview} />
          ) : (
            <Text style={styles.photoText}>Fotografar nota fiscal</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Descrição do produto</Text>
        <TextInput style={styles.input} value={descricaoProduto} onChangeText={setDescricaoProduto}
          placeholder='Ex: Televisão 50 polegadas' placeholderTextColor='#5C6AA0' />

        <Text style={styles.label}>Data da compra</Text>
        <TextInput style={styles.input} value={dataCompra} onChangeText={setDataCompra}
          placeholder='dd/mm/aaaa' placeholderTextColor='#5C6AA0' />

        <Text style={styles.label}>Tempo de garantia (meses)</Text>
        <TextInput style={styles.input} value={tempoGarantiaMeses} onChangeText={setTempoGarantiaMeses}
          placeholder='Ex: 12' keyboardType='numeric' placeholderTextColor='#5C6AA0' />

        <Text style={styles.label}>Loja</Text>
        <TextInput style={styles.input} value={loja} onChangeText={setLoja}
          placeholder='Ex: Eletro Sul' placeholderTextColor='#5C6AA0' />

        <Text style={styles.label}>Assistência técnica (opcional)</Text>
        <TextInput style={styles.input} value={assistenciaTecnica} onChangeText={setAssistenciaTecnica}
          placeholder='Endereço ou contato' placeholderTextColor='#5C6AA0' />

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
      </View>
    </View>
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
  photoBox: {
    height: 140, borderRadius: 10, borderWidth: 1, borderColor: '#223564',
    borderStyle: 'dashed', backgroundColor: '#16264A',
    alignItems: 'center', justifyContent: 'center', marginBottom: 16, overflow: 'hidden',
  },
  photoPreview: { width: '100%', height: '100%' },
  photoText: { color: '#5C6AA0', fontSize: 14 },
  label: { color: '#98A4C8', fontSize: 13, marginTop: 12, marginBottom: 4 },
  input: {
    borderWidth: 1, borderColor: '#223564', borderRadius: 8,
    padding: 10, color: '#F0F2FA', backgroundColor: '#16264A',
  },
  saveButton: {
    backgroundColor: '#D85A30', borderRadius: 8, padding: 14,
    alignItems: 'center', marginTop: 20,
  },
  saveButtonText: { color: '#FAECE7', fontWeight: 'bold', fontSize: 15 },
});