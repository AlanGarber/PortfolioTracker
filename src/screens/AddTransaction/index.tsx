import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Input } from '../../components/common/Input'; 
import { styles } from './styles';
import { parseInputToNumber } from '../../utils/validation';
import { AssetPickerModal } from '../../components/common/AssetPickerModal';
import { usePortfolio } from '../../context/PortfolioContext';
import { colors } from '../../theme/colors';

type TransactionType = 'BUY' | 'SELL';

export default function AddTransactionScreen() {
  const navigation = useNavigation();
  const { addTransaction, assets } = usePortfolio();

  
  const [ticker, setTicker] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [type, setType] = useState<TransactionType>('BUY');
  const [errors, setErrors] = useState({ ticker: '', price: '', quantity: '' });

  const [isPickerVisible, setPickerVisible] = useState(false);

  useEffect(() => {
    setTicker('');
  }, [type]);

  const handleSave = () => {
    // Reiniciar errores
    setErrors({ ticker: '', price: '', quantity: '' });
    let hasError = false;
    if (!ticker.trim()) {
      setErrors(prev => ({ ...prev, ticker: 'El ticker es obligatorio' }));
      hasError = true;
    }
    const validPrice = parseInputToNumber(price);
    if (validPrice === null || validPrice <= 0) {
      setErrors(prev => ({ ...prev, price: 'Ingresa un precio válido (ej: 150,50)' }));
      hasError = true;
    }
    const validQuantity = parseInputToNumber(quantity);
    if (validQuantity === null || validQuantity <= 0) {
      setErrors(prev => ({ ...prev, quantity: 'Ingresa una cantidad válida' }));
      hasError = true;
    }

    if (hasError) return;

    addTransaction({
      ticker: ticker.toUpperCase(),
      price: validPrice!,    
      quantity: validQuantity!,
      type,
      date: new Date().toISOString(),
    });

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.content}>
        
        {/* Selector Compra / Venta */}
        <View style={styles.typeSelector}>
          <TouchableOpacity 
            style={[styles.typeButton, type === 'BUY' && styles.activeBuy]} 
            onPress={() => setType('BUY')}
          >
            <Text style={[styles.typeText, type === 'BUY' && styles.activeTypeText]}>Comprar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.typeButton, type === 'SELL' && styles.activeSell]} 
            onPress={() => setType('SELL')}
          >
            <Text style={[styles.typeText, type === 'SELL' && styles.activeTypeText]}>Vender</Text>
          </TouchableOpacity>
        </View>

        {/* Inputs */}
        {type === 'BUY' ? (
          <Input
            label="Ticker"
            placeholder="Ej: AAPL"
            value={ticker}
            onChangeText={setTicker}
            autoCapitalize="characters"
            error={errors.ticker}
          />
        ) : (
          <TouchableOpacity onPress={() => setPickerVisible(true)} activeOpacity={0.8}>
            <View pointerEvents="none">
              <Input
                label="Ticker (Selecciona de tu portafolio)"
                placeholder="Seleccionar activo..."
                value={ticker}
                editable={false}
                error={errors.ticker}
                style={{ color: colors.primary, fontWeight: 'bold' }} 
              />
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Input
              label="Precio"
              placeholder="0,00"
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad" 
              error={errors.price} 
            />
          </View>
          <View style={styles.halfInput}>
            <Input
              label="Cantidad"
              placeholder="0"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              error={errors.quantity} 
            />
          </View>
        </View>

        {/* Botón Guardar */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSave} activeOpacity={0.8}>
          <Text style={styles.submitText}>Guardar Operación</Text>
        </TouchableOpacity>

        <AssetPickerModal 
          visible={isPickerVisible}
          onClose={() => setPickerVisible(false)}
          onSelect={(selectedTicker) => setTicker(selectedTicker)}
          assets={assets}
        />

      </View>
    </ScrollView>
  );
}