import { buscarNotas } from "@/database";
import type { Nota } from "@/types";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
 

export default function ListagemScreen() {
  const router = useRouter();
  const [notas, setNotas] = useState<Nota[]>([]);

  useFocusEffect(
    useCallback(() => {
      setNotas(buscarNotas());
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>NotaFácil</Text>
        <TouchableOpacity onPress={() => router.push('/cadastro')}>
          <Text style={styles.addButton}>+</Text>
        </TouchableOpacity>
      </View>
 
      <FlatList
        data={notas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push({
              pathname: '/cadastro',
              params: { id: String(item.id) }
            })}
            
          >
            <Text style={styles.cardTitle}>{item.descricaoProduto}</Text>
            <Text style={styles.cardSubtitle}>{item.loja}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0E1B33' },
  header: {
    backgroundColor: '#D85A30', padding: 16,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  headerTitle: { color: '#FAECE7', fontSize: 20, fontWeight: 'bold' },
  addButton: { color: '#FAECE7', fontSize: 26, fontWeight: 'bold' },
  card: {
    backgroundColor: '#16264A', borderRadius: 10, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: '#223564',
  },
  cardTitle: { color: '#F0F2FA', fontSize: 15, fontWeight: 'bold' },
  cardSubtitle: { color: '#98A4C8', fontSize: 13, marginTop: 2 },
});
