import { useAuth } from '@/context/AuthContext';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

 
 
export default function PerfilScreen() {
  const insets = useSafeAreaInsets();
  // 2) dentro do componente 
  const { sair } = useAuth();
  
  function confirmarSaida() { 
    Alert.alert('Sair', 'Deseja encerrar a sessão?', [ 
      { text: 'Cancelar', style: 'cancel' }, 
      { text: 'Sair', style: 'destructive', onPress: sair }, 
    ]); 
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <TouchableOpacity 
        onPress={confirmarSaida} 
        style={{ backgroundColor: '#D85A30', borderRadius: 8, padding: 14, alignItems: 'center', margin: 16 }} 
      > 
        <Text style={{ color: '#FAECE7', fontWeight: 'bold' }}>Sair da conta</Text> 
      </TouchableOpacity> 

    </View>
  );
}
 
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0E1B33', alignItems: 'center', justifyContent: 'center' },
  text: { color: '#98A4C8', fontSize: 15 },
});
