import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

function Navegacao() {
  const { token, carregando } = useAuth();

  if (carregando) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0E1B33', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#D85A30" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Só existem para quem está logado */}
      <Stack.Protected guard={!!token}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="cadastro" />
        <Stack.Screen name="detalhes" />
      </Stack.Protected>

      {/* Só existe para quem NÃO está logado */}
      <Stack.Protected guard={!token}>
        <Stack.Screen name="login" />
      </Stack.Protected>
    </Stack>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <Navegacao />
    </AuthProvider>
  );
}
