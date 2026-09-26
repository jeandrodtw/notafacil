import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
 
export default function PerfilScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <Text style={styles.text}>Em construção</Text>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0E1B33', alignItems: 'center', justifyContent: 'center' },
  text: { color: '#98A4C8', fontSize: 15 },
});
