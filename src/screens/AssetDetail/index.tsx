import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { usePortfolio } from '../../context/PortfolioContext';
import { calculateAssetPerformance } from '../../utils/finance';
import { formatCurrency, formatPercentage } from '../../utils/format';
import { TransactionItem } from '../../components/portfolio/TransactionItem';
import { colors } from '../../theme/colors';
import { InfoButton } from '../../components/common/InfoButton';

type AssetDetailRouteProp = RouteProp<RootStackParamList, 'AssetDetail'>;

export default function AssetDetailScreen() {
    const route = useRoute<AssetDetailRouteProp>();
    const { ticker } = route.params;
    const { assets } = usePortfolio();

    const asset = assets.find((a) => a.ticker === ticker);

    const stats = useMemo(() => {
        if (!asset) return null;
        return calculateAssetPerformance(asset);
    }, [asset]);

    if (!asset || !stats) {
        return (
            <View style={styles.center}>
                <Text>Activo no encontrado</Text>
            </View>
        );
    }

    const isProfitable = stats.unrealizedPL >= 0;
    const pnlColor = isProfitable ? colors.semantic.success : colors.semantic.danger;

    const sortedTransactions = [...asset.transactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return (
        <ScrollView style={styles.container}>
            {/* HEADER: PRECIO Y P&L */}
            <View style={styles.header}>
                <Text style={styles.ticker}>{asset.ticker}</Text>
                <Text style={styles.name}>{asset.name}</Text>

                <View style={styles.bigPriceContainer}>
                    <Text style={styles.bigPrice}>
                        {formatCurrency(asset.currentPrice, asset.currency)}
                    </Text>
                    <View style={[styles.pnlTag, { backgroundColor: pnlColor + '20' }]}>
                        <Text style={[styles.pnlText, { color: pnlColor }]}>
                            {formatCurrency(stats.unrealizedPL, asset.currency)} ({formatPercentage(stats.unrealizedPLPercentage)})
                        </Text>
                    </View>
                </View>
            </View>

            {/* SECCIÓN ESTADÍSTICAS */}
            <View style={styles.sectionHeaderContainer}>
                <Text style={styles.sectionTitle}>Métricas</Text>
                <InfoButton
                    title="Guía de Métricas"
                    message={
                        "• P.P.P: Tu costo promedio de compra. No cambia al vender.\n\n" +
                        "• Latente (Unrealized): Ganancia o pérdida teórica si vendieras todo HOY.\n\n" +
                        "• Realizado (Histórico): Dinero real que ya ganaste o perdiste al cerrar operaciones pasadas."
                    }
                />
            </View>

            {/* GRILLA DE ESTADISTICAS */}
            <View style={styles.statsGrid}>
                <StatBox label="Tenencia" value={`${stats.totalQuantity} u.`} />
                <StatBox label="P.P.P." value={formatCurrency(stats.avgPrice, asset.currency)} />
                <StatBox label="Latente" value={formatCurrency(stats.unrealizedPL, asset.currency)} />

                {/* NUEVO: Mostramos lo que ya ganaste en el pasado con ventas */}
                <View style={[styles.statBox, stats.realizedPL !== 0 && { borderColor: stats.realizedPL > 0 ? colors.semantic.success : colors.semantic.danger, borderWidth: 1 }]}>
                    <Text style={styles.statLabel}>Histórica</Text>
                    <Text style={[styles.statValue, { color: stats.realizedPL >= 0 ? colors.semantic.success : colors.semantic.danger }]}>
                        {formatCurrency(stats.realizedPL, asset.currency)}
                    </Text>
                </View>
            </View>

            {/* HISTORIAL */}
            <View style={styles.sectionHeaderContainer}>
                <Text style={styles.sectionTitle}>Historial de Operaciones</Text>
            </View>

            <View style={styles.historyList}>
                {sortedTransactions.length === 0 ? (
                    <Text style={styles.emptyText}>No hay operaciones registradas.</Text>
                ) : (
                    sortedTransactions.map((tx, index) => (
                        <View key={tx.id}>
                            <TransactionItem transaction={tx} currency={asset.currency} />
                            {/* Opcional: Si no quieres divisor en el último ítem */}
                        </View>
                    ))
                )}
            </View>

            {/* Un espaciador al final para que no se corte en pantallas con notch */}
            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const StatBox = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.statBox}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { padding: 20, backgroundColor: colors.card, alignItems: 'center', borderBottomWidth: 1, borderColor: colors.border },
    ticker: { fontSize: 24, fontWeight: '900', color: colors.text.primary },
    name: { fontSize: 14, color: colors.text.secondary, marginBottom: 10 },
    bigPriceContainer: { alignItems: 'center', gap: 8 },
    bigPrice: { fontSize: 36, fontWeight: 'bold', color: colors.text.primary },
    pnlTag: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
    pnlText: { fontWeight: 'bold', fontSize: 16 },

    sectionHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: 24,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text.primary,
    },

    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 15, gap: 10 },
    statBox: { flexBasis: '47%', backgroundColor: colors.card, padding: 16, borderRadius: 12, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
    statLabel: { fontSize: 12, color: colors.text.secondary, marginBottom: 4 },
    statValue: { fontSize: 16, fontWeight: 'bold', color: colors.text.primary },

    historySection: { paddingBottom: 40 },
    historyList: {
        backgroundColor: colors.card,
        borderRadius: 12,
        marginHorizontal: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    emptyText: {
        textAlign: 'center',
        color: colors.text.secondary,
        padding: 20,
        fontStyle: 'italic'
    }
});