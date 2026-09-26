import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
 
const CORAL = "#D85A30";
const NAVY = "#0E1B33";
const MUTED = "#98A4C8";
 
export default function TabsLayout() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 16);
 
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: CORAL,
        tabBarInactiveTintColor: MUTED,
        tabBarStyle: { 
          backgroundColor: NAVY,
          borderTopWidth: 0,
          height: 64,
          paddingTop: 8,
          paddingBottom: bottomInset + 6,
        },
        tabBarLabelStyle: { fontSize: 11 },
        tabBarItemStyle: { paddingVertical: 2},
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Notas",
          tabBarIcon: ({ color, size }) => <Ionicons name="document-text-outline" 
          size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: "",
          tabBarIcon: () => (
            <View style={styles.scanButton}>
              <Ionicons name="camera" size={26} color="#FFFFFF" />
            </View>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push('/cadastro');
          },
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
 
const styles = StyleSheet.create({
  scanButton: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: CORAL,
    alignItems: "center", justifyContent: "center",
    top: -20,
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 6, elevation: 6,
  },
});


