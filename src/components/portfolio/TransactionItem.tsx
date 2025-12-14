import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Transaction } from '../../types';
import { formatCurrency } from '../../utils/format';
import { colors } from '../../theme/colors';

interface Props {
  transaction: Transaction;
  currency: string;
}

export const TransactionItem = ({ transaction, currency }: Props) => {
  const isBuy = transaction.type === 'BUY';
  const dateObj = new Date(transaction.date);
  const formattedDate = dateObj.toLocaleDateString(); 

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={[styles.badge, isBuy ? styles.badgeBuy : styles.badgeSell]}>
          <Text style={styles.badgeText}>{isBuy ? 'C' : 'V'}</Text>
        </View>
        <View>
          <Text style={styles.typeText}>{isBuy ? 'Compra' : 'Venta'}</Text>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>
      </View>
      
      <View style={styles.right}>
        <Text style={styles.amountText}>
          {isBuy ? '+' : '-'}{transaction.quantity} u.
        </Text>
        <Text style={styles.priceText}>
          @ {formatCurrency(transaction.price, currency)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  left: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  badge: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  badgeBuy: { backgroundColor: colors.semantic.success + '20' }, // +20 añade transparencia hex
  badgeSell: { backgroundColor: colors.semantic.danger + '20' },
  badgeText: { fontWeight: 'bold', color: colors.text.primary },
  typeText: { fontWeight: '600', color: colors.text.primary },
  dateText: { fontSize: 12, color: colors.text.secondary },
  right: { alignItems: 'flex-end' },
  amountText: { fontWeight: 'bold', fontSize: 16, color: colors.text.primary },
  priceText: { color: colors.text.secondary, fontSize: 13 },
});