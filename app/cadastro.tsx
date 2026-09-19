import { atualizarNota, buscarNotaPorId, inserirNota } from "@/database";
import type { Nota } from "@/types";
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

 
export default function CadastroScreen() {
  const router = useRouter();
  const { nota } = useLocalSearchParams<{ nota?: string }>();
  const notaExistente: Nota | null = nota ? JSON.parse(nota) : null;
 
  const [descricaoProduto, setDescricaoProduto] = useState(notaExistente?.descricaoProduto ?? '');
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [dataCompra, setDataCompra] = useState(notaExistente?.dataCompra ?? '');
  const [loja, setLoja] = useState(notaExistente?.loja ?? '');
  const [tempoGarantiaMeses, setTempoGarantiaMeses] = useState('');
  const [assistenciaTecnica, setAssistenciaTecnica] = useState('');

  const { id } = useLocalSearchParams<{ id?: string }>();
  const notaId = id ? Number(id) : null;
 
  useEffect(() => {
    if (notaId) {
      const nota = buscarNotaPorId(notaId);
      if (nota) {
        setDescricaoProduto(nota.descricaoProduto);
        setFotoUri(nota.fotoUri);
        setDataCompra(nota.dataCompra);
        setTempoGarantiaMeses(String(nota.tempoGarantiaMeses));
        setLoja(nota.loja);
        setAssistenciaTecnica(nota.assistenciaTecnica);
      }
    }
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
  
 function salvarNota() {

    if (!descricaoProduto || !loja) {
      alert('Preencha ao menos a descrição e a loja.');
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

    if (notaId) {
      atualizarNota(notaId, dados);
    } else {
      inserirNota(dados);
    }
    router.back();
  
  }
 
  return (
    <View style={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.backButton}>{' < '}</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{notaId ? 'Editar nota' : 'Nova nota'}</Text>
    </View>

    <View style={{ padding: 16 }}>

      <TouchableOpacity style = {styles.photoBox} onPress={tirarFoto}>
        {fotoUri ? 
          (<Image source={{ uri: fotoUri}} style={styles.photoPreview}/> ) :
          (<Text style={styles.photoText}>Fotografar uma Nota</Text>)
        }

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

      <TouchableOpacity style={styles.saveButton} onPress={salvarNota}>
        <Text style={styles.saveButtonText}>{notaId ? 'Salvar alterações' : 'Salvar nota'}</Text>
      </TouchableOpacity>
    </View>
  </View>
);

}
 
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0E1B33' },
  header: {
    backgroundColor: '#D85A30', padding: 16,
    flexDirection: 'row', alignItems: 'center',
  },
  backButton: { color: '#FAECE7', fontSize: 20, fontWeight: 'bold', marginRight: 8 },
  headerTitle: { color: '#FAECE7', fontSize: 20, fontWeight: 'bold' },
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
  photoBox: {
    height:140, borderRadius: 10, borderWidth: 1, borderColor: '#223564',
    borderStyle: 'dashed', backgroundColor: '#16264A',
    alignItems: 'center', justifyContent: 'center', marginBottom: 16, overflow:'hidden',
  },
  photoPreview:{
    width: '100%', height:"100%"
  },
  photoText:{
    color: '#5C6AA0', fontSize: 14
  }
  
});
