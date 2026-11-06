import { buscarNotaPorId, excluirNota } from '@/notasApi';
import type { Nota, StatusGarantia } from '@/types';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator, Alert, Image, ScrollView, StyleSheet,
  Text, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CORES: Record<StatusGarantia, string> = {
  vigente: '#2E9E6B',
  vencendo: '#E0A526',
  vencida: '#D64545',
};

export default function DetalhesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [nota, setNota] = useState<Nota | null>(null);
  const [erro, setErro] = useState('');

  // Recarrega ao voltar da edição
  useFocusEffect(
    useCallback(() => {
      buscarNotaPorId(Number(id))
        .then(setNota)
        .catch((e) => setErro(e.message));
    }, [id])
  );

  function confirmarExclusao() {
    Alert.alert('Excluir nota', 'Esta ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await excluirNota(Number(id));
            router.back();
          } catch (e: any) {
            Alert.alert('Erro', e.message);
          }
        },
      },
    ]);
  }

  function Linha({ rotulo, valor }: { rotulo: string; valor?: string | number }) {
    return (
      <View style={{ marginTop: 14 }}>
        <Text style={styles.rotulo}>{rotulo}</Text>
        <Text style={styles.valor}>{valor || '-'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>{'< '}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes</Text>
      </View>

      {!nota ? (
        erro ? (
          <Text style={styles.erro}>{erro}</Text>
        ) : (
          <ActivityIndicator size="large" color="#D85A30" style={{ marginTop: 40 }} />
        )
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}>
          {nota.fotoUri && <Image source={{ uri: nota.fotoUri }} style={styles.foto} />}

          <Text style={styles.titulo}>{nota.descricaoProduto}</Text>
          {nota.statusGarantia && (
            <View style={[styles.badge, { backgroundColor: CORES[nota.statusGarantia] }]}>
              <Text style={styles.badgeTexto}>Garantia {nota.statusGarantia}</Text>
            </View>
          )}

          <Linha rotulo="Loja" valor={nota.loja} />
          <Linha rotulo="Data da compra" valor={nota.dataCompra} />
          <Linha rotulo="Garantia" valor={`${nota.tempoGarantiaMeses} meses`} />
          <Linha rotulo="Vencimento da garantia" valor={nota.dataVencimento} />
          <Linha rotulo="Assistência técnica" valor={nota.assistenciaTecnica} />

          <TouchableOpacity
            style={styles.botaoEditar}
            onPress={() => router.push({ pathname: '/cadastro', params: { id: String(nota.id) } })}
          >
            <Text style={styles.botaoTexto}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botaoExcluir} onPress={confirmarExclusao}>
            <Text style={[styles.botaoTexto, { color: '#FF8A70' }]}>Excluir</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
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
  foto: { width: '100%', height: 200, borderRadius: 10, marginBottom: 14, backgroundColor: '#16264A' },
  titulo: { color: '#F0F2FA', fontSize: 20, fontWeight: 'bold' },
  badge: { alignSelf: 'flex-start', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4, marginTop: 8 },
  badgeTexto: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  rotulo: { color: '#98A4C8', fontSize: 12 },
  valor: { color: '#F0F2FA', fontSize: 15, marginTop: 2 },
  botaoEditar: { backgroundColor: '#D85A30', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 28 },
  botaoExcluir: { borderWidth: 1, borderColor: '#FF8A70', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 12 },
  botaoTexto: { color: '#FAECE7', fontWeight: 'bold', fontSize: 15 },
  erro: { color: '#FF8A70', textAlign: 'center', marginTop: 40, paddingHorizontal: 24 },
});
