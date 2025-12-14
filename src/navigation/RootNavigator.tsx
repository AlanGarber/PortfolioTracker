import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/Dashboard';
import AddTransactionScreen from '../screens/AddTransaction/index'; 
import AssetDetailScreen from '../screens/AssetDetail';

// Parámetros que recibe cada pantalla
export type RootStackParamList = {
  Dashboard: undefined;
  AddTransaction: undefined;
  AssetDetail: { ticker: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Pantalla Principal */}
        <Stack.Screen 
          name="Dashboard" 
          component={DashboardScreen} 
          options={{ headerShown: false }} 
        />
        
        {/* Modal (Formulario) */}
        <Stack.Screen 
          name="AddTransaction" 
          component={AddTransactionScreen} 
          options={{ 
            presentation: 'modal', 
            headerTitle: 'Nueva Transacción'
          }} 
        />

        <Stack.Screen 
          name="AssetDetail" 
          component={AssetDetailScreen}
          options={({ route }) => ({ title: route.params.ticker })} // Título dinámico
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}