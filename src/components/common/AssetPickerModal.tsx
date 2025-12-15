import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, TextInput, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { getCurrencyFlag } from '../../utils/format';

export interface PickerItem {
  ticker: string;
  name: string;
  price: number;
  currency: string;
  badge?: string;
}

interface AssetPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (ticker: string) => void;
  items: PickerItem[];
  title?: string;
}

export const AssetPickerModal = ({ visible, onClose, onSelect, items, title }: AssetPickerModalProps) => {
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (visible) setSearch('');
  }, [visible]);


  const filteredItems = items.filter(item =>
    item.ticker.toLowerCase().includes(search.toLowerCase()) ||
    (item.name && item.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>

          <View style={styles.header}>
            <Text style={styles.title}>{title || "Seleccionar Activo"}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeText}>Cancelar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar..."
              placeholderTextColor={colors.text.secondary}
              value={search}
              onChangeText={setSearch}
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>

          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.ticker}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  onSelect(item.ticker);
                  onClose();
                  setSearch('');
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.ticker}>{item.ticker}</Text>
                  <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.price}>
                    {getCurrencyFlag(item.currency)} ${item.price}
                  </Text>
                  <Text style={styles.currency}>{item.currency}</Text>
                  {item.badge && (
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  )}
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No se encontraron resultados.</Text>
              </View>
            }
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: colors.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 40, height: '75%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderColor: colors.border },
  title: { fontSize: 18, fontWeight: 'bold', color: colors.text.primary },
  closeText: { color: colors.primary, fontSize: 16, fontWeight: '600' },
  searchContainer: { paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderColor: colors.border },
  searchInput: { backgroundColor: colors.background, padding: 12, borderRadius: 10, fontSize: 16, color: colors.text.primary },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: colors.border },
  ticker: { fontSize: 16, fontWeight: 'bold', color: colors.text.primary },
  name: { fontSize: 13, color: colors.text.secondary, marginTop: 2 },
  price: { fontWeight: 'bold', color: colors.text.primary, fontSize: 16 },
  currency: { fontSize: 12, color: colors.text.secondary, textAlign: 'right', fontWeight: '600' },
  badgeText: { fontSize: 11, color: colors.semantic.success, marginTop: 2, fontWeight: 'bold' },
  emptyState: { padding: 40, alignItems: 'center' },
  emptyText: { color: colors.text.secondary, fontStyle: 'italic' },
});