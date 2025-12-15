import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Input } from '../../components/common/Input';
import { styles } from './styles';
import { parseInputToNumber } from '../../utils/validation';
import { AssetPickerModal, PickerItem } from '../../components/common/AssetPickerModal';
import { usePortfolio } from '../../context/PortfolioContext';
import { colors } from '../../theme/colors';
import { calculateAssetPerformance } from '../../utils/finance';

type TransactionType = 'BUY' | 'SELL';

export default function AddTransactionScreen() {
  const navigation = useNavigation();
  const { addTransaction, assets, availableAssets } = usePortfolio();

  const [ticker, setTicker] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [type, setType] = useState<TransactionType>('BUY');
  const [errors, setErrors] = useState({ ticker: '', price: '', quantity: '' });

  const [isPickerVisible, setPickerVisible] = useState(false);


  useEffect(() => {
    setTicker('');
  }, [type]);

  const pickerList: PickerItem[] = useMemo(() => {
    if (type === 'BUY') {
      return availableAssets.map(a => ({
        ticker: a.ticker,
        name: a.name,
        price: a.price,
        currency: a.currency,
      }));
    } else {
      return assets
        .filter(a => calculateAssetPerformance(a).totalQuantity > 0)
        .map(a => {
          const stats = calculateAssetPerformance(a);
          return {
            ticker: a.ticker,
            name: a.name,
            price: a.currentPrice,
            currency: a.currency,
            badge: `${stats.totalQuantity} disp.`
          };
        });
    }
  }, [type, availableAssets, assets]);

  const handleSave = () => {
    setErrors({ ticker: '', price: '', quantity: '' });
    let hasError = false;

    if (!ticker.trim()) {
      setErrors(prev => ({ ...prev, ticker: 'El ticker es obligatorio' }));
      hasError = true;
    }
    const validPrice = parseInputToNumber(price);
    if (validPrice === null || validPrice <= 0) {
      setErrors(prev => ({ ...prev, price: 'Ingresa un precio válido' }));
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

        <TouchableOpacity onPress={() => setPickerVisible(true)} activeOpacity={0.8}>
          <View pointerEvents="none">
            <Input
              label={type === 'BUY' ? "Ticker (Buscar en Mercado)" : "Ticker (Mis Activos)"}
              placeholder={type === 'BUY' ? "Seleccionar activo a comprar..." : "Seleccionar activo a vender..."}
              value={ticker}
              editable={false}
              error={errors.ticker}
              style={{ color: colors.primary, fontWeight: 'bold' }}
            />
          </View>
        </TouchableOpacity>

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

        <TouchableOpacity style={styles.submitButton} onPress={handleSave} activeOpacity={0.8}>
          <Text style={styles.submitText}>
            {type === 'BUY' ? 'Confirmar Compra' : 'Confirmar Venta'}
          </Text>
        </TouchableOpacity>

        <AssetPickerModal
          visible={isPickerVisible}
          onClose={() => setPickerVisible(false)}
          onSelect={(selectedTicker) => setTicker(selectedTicker)}
          items={pickerList}
          title={type === 'BUY' ? "Mercado" : "Mi Cartera"}
        />

      </View>
    </ScrollView>
  );
}