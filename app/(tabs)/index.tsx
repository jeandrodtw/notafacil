import { buscarNotas } from '@/notasApi';
import type { Nota, StatusGarantia } from '@/types';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator, FlatList, RefreshControl, StyleSheet,
  Text, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CORES: Record<StatusGarantia, string> = {
  vigente: '#2E9E6B',
  vencendo: '#E0A526',
  vencida: '#D64545',
};

export default function ListagemScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [notas, setNotas] = useState<Nota[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState('');

  async function carregar() {
    try {
      setErro('');
      setNotas(await buscarNotas());
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }

  // Recarrega sempre que a tela ganha foco (ex.: ao voltar do cadastro)
  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [])
  );
  function puxarParaAtualizar() {
    setAtualizando(true);
    carregar();
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.headerTitle}>NotaFácil</Text>
        <TouchableOpacity onPress={() => router.push('/cadastro')}>
          <Text style={styles.addButton}>+</Text>
        </TouchableOpacity>
      </View>

      {carregando ? (
        <ActivityIndicator size="large" color="#D85A30" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={notas}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 12 }}
          refreshControl={
            <RefreshControl
              refreshing={atualizando}
              onRefresh={puxarParaAtualizar}
              tintColor="#D85A30"
              colors={['#D85A30']}
            />
          }
          ListEmptyComponent={
            erro ? (
              <View style={{ alignItems: 'center', marginTop: 40 }}>
                <Text style={styles.erro}>{erro}</Text>
                <TouchableOpacity style={styles.botaoTentar} onPress={carregar}>
                  <Text style={styles.botaoTentarTexto}>Tentar novamente</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.vazio}>Nenhuma nota cadastrada ainda.</Text>
            )
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push({ pathname: '/detalhes', params: { id: String(item.id) } })}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.descricaoProduto}</Text>
                <Text style={styles.cardSubtitle}>{item.loja}</Text>
              </View>
              {item.statusGarantia && (
                <View style={[styles.badge, { backgroundColor: CORES[item.statusGarantia] }]}>
                  <Text style={styles.badgeTexto}>{item.statusGarantia}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0E1B33' },
  header: {
    backgroundColor: '#D85A30', paddingHorizontal: 16, paddingBottom: 16,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  headerTitle: { color: '#FAECE7', fontSize: 20, fontWeight: 'bold' },
  addButton: { color: '#FAECE7', fontSize: 26, fontWeight: 'bold', marginLeft: 4 },
  card: {
    backgroundColor: '#16264A', borderRadius: 10, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: '#223564', flexDirection: 'row', alignItems: 'center',
  },
  cardTitle: { color: '#F0F2FA', fontSize: 15, fontWeight: 'bold' },
  cardSubtitle: { color: '#98A4C8', fontSize: 13, marginTop: 2 },
  badge: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, marginLeft: 8 },
  badgeTexto: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' },
  vazio: { color: '#98A4C8', textAlign: 'center', marginTop: 40 },
  erro: { color: '#FF8A70', textAlign: 'center', paddingHorizontal: 24 },
  botaoTentar: { backgroundColor: '#D85A30', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 18, marginTop: 16 },
  botaoTentarTexto: { color: '#FAECE7', fontWeight: 'bold' },
});
