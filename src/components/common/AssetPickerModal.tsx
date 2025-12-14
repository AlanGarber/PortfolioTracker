import React from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Asset } from '../../types';
import { colors } from '../../theme/colors';
import { calculateAssetPerformance } from '../../utils/finance';

interface AssetPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (ticker: string) => void;
  assets: Asset[];
}

export const AssetPickerModal = ({ visible, onClose, onSelect, assets }: AssetPickerModalProps) => {
  const ownedAssets = assets.filter(a => calculateAssetPerformance(a).totalQuantity > 0);

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Selecciona un Activo</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
          
          {ownedAssets.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No tienes activos para vender.</Text>
            </View>
          ) : (
            <FlatList
              data={ownedAssets}
              keyExtractor={(item) => item.ticker}
              renderItem={({ item }) => {
                 const stats = calculateAssetPerformance(item);
                 return (
                  <TouchableOpacity 
                    style={styles.item} 
                    onPress={() => {
                      onSelect(item.ticker);
                      onClose();
                    }}
                  >
                    <View>
                      <Text style={styles.ticker}>{item.ticker}</Text>
                      <Text style={styles.name}>{item.name}</Text>
                    </View>
                    <Text style={styles.quantity}>{stats.totalQuantity} disp.</Text>
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: colors.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 40, maxHeight: '60%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderColor: colors.border },
  title: { fontSize: 18, fontWeight: 'bold' },
  closeText: { color: colors.primary, fontSize: 16 },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: colors.border },
  ticker: { fontSize: 16, fontWeight: 'bold' },
  name: { fontSize: 12, color: colors.text.secondary },
  quantity: { fontSize: 14, color: colors.text.secondary },
  emptyState: { padding: 40, alignItems: 'center' },
  emptyText: { color: colors.text.secondary },
});