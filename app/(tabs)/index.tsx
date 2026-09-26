import { buscarNotas } from "@/database";
import type { Nota } from "@/types";
import { calcularVencimento, statusGarantia } from "@/utils/garantia";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ListagemScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [notas, setNotas] = useState<Nota[]>([]);

  useFocusEffect(
    useCallback(() => {
      setNotas(buscarNotas());
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.headerTitle}>NotaFácil</Text>
      </View>

      <FlatList
        data={notas}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => {
          const vencimento = calcularVencimento(item.dataCompra, item.tempoGarantiaMeses);
          const status = statusGarantia(vencimento);

          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push({
                pathname: '/detalhes',
                params: { id: String(item.id) }
              })}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.descricaoProduto}</Text>
                <Text style={styles.cardSubtitle}>{item.loja}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: status.fundo }]}>
                <Text style={[styles.badgeText, { color: status.cor }]}>{status.texto}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
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
    borderWidth: 1, borderColor: '#223564',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  cardTitle: { color: '#F0F2FA', fontSize: 15, fontWeight: 'bold' },
  cardSubtitle: { color: '#98A4C8', fontSize: 13, marginTop: 2 },
  badge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8, marginLeft: 8 },
  badgeText: { fontSize: 11, fontWeight: 'bold' },
});