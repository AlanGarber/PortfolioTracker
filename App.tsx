import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/navigation/RootNavigator';
import { PortfolioProvider } from './src/context/PortfolioContext'; // <--- Importar

export default function App() {
  return (
    <SafeAreaProvider>
      <PortfolioProvider> 
        <RootNavigator />
        <StatusBar style="auto" />
      </PortfolioProvider>
    </SafeAreaProvider>
  );
}