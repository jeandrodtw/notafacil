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
 
  return <Stack screenOptions={{ headerShown: false }} />;
}
