import { buscarNotaPorId } from "@/database";
import type { Nota } from "@/types";
import { calcularVencimento, formatarData, statusGarantia } from "@/utils/garantia";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DetalhesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [nota, setNota] = useState<Nota | null>(null);

  useFocusEffect(
    useCallback(() => {
      setNota(buscarNotaPorId(Number(id)));
    }, [id])
  );

  if (!nota) return null;

  const vencimento = calcularVencimento(nota.dataCompra, nota.tempoGarantiaMeses);
  const status = statusGarantia(vencimento);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>{'< '}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes</Text>
        <TouchableOpacity onPress={() => router.push({ pathname: '/cadastro', params: { id: String(nota.id) } })}>
          <Text style={styles.editButton}>Editar</Text>
        </TouchableOpacity>
      </View>

      {nota.fotoUri ? (
        <Image source={{ uri: nota.fotoUri }} style={styles.photo} />
      ) : (
        <View style={styles.photoPlaceholder}>
          <Text style={{ color: '#5C6AA0' }}>Sem foto</Text>
        </View>
      )}

      <View style={{ padding: 16 }}>
        <Text style={styles.title}>{nota.descricaoProduto}</Text>

        <View style={[styles.badge, { backgroundColor: status.fundo, alignSelf: 'flex-start' }]}>
          <Text style={{ color: status.cor, fontWeight: 'bold', fontSize: 12 }}>{status.texto}</Text>
        </View>

        <Linha rotulo='Data da compra' valor={nota.dataCompra || '-'} />
        <Linha rotulo='Garantia' valor={`${nota.tempoGarantiaMeses} meses`} />
        <Linha rotulo='Vence em' valor={formatarData(vencimento)} />
        <Linha rotulo='Loja' valor={nota.loja || '-'} />
        <Linha rotulo='Assistência' valor={nota.assistenciaTecnica || '-'} />
      </View>
    </View>
  );
}

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <View style={styles.linha}>
      <Text style={styles.linhaRotulo}>{rotulo}</Text>
      <Text style={styles.linhaValor}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0E1B33' },
  header: {
    backgroundColor: '#D85A30', paddingHorizontal: 16, paddingBottom: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  backButton: { color: '#FAECE7', fontSize: 20, fontWeight: 'bold', marginRight: 8 },
  headerTitle: { color: '#FAECE7', fontSize: 20, fontWeight: 'bold', flex: 1 },
  editButton: { color: '#FAECE7', fontSize: 14, fontWeight: 'bold' },
  photo: { width: '100%', height: 200 },
  photoPlaceholder: { width: '100%', height: 120, alignItems: 'center', justifyContent: 'center' },
  title: { color: '#F0F2FA', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  badge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8, marginBottom: 14 },
  linha: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#223564' },
  linhaRotulo: { color: '#98A4C8', fontSize: 13 },
  linhaValor: { color: '#F0F2FA', fontSize: 13 },
});