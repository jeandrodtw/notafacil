import { initDatabase } from "@/database";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
 
export default function Layout() {
  const [pronto, setPronto] = useState(false);
 
  useEffect(() => {
    initDatabase();
    setPronto(true);
  }, []);
 
  if (!pronto) return null;
 
  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        // 👇 Insira os ajustes do header aqui
        headerStyle: {
          backgroundColor: '#121214', // Cor de fundo do header
        },
        headerTintColor: '#fff',       // Cor do texto do título e botões de voltar
        headerTitleStyle: {
          fontWeight: 'bold',          // Estilo da fonte do título
          fontSize: 18,
        },
        headerTitleAlign: 'center',    // Centraliza o título (padrão no iOS, opcional no Android)
        headerShadowVisible: false,    // Remove a linha/sombra inferior do header se desejar
      }} 
    />
  );
}
