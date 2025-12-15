import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  listContent: { padding: 20, paddingTop: 10 },
  centerLoading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerContainer: { marginBottom: 20 },
  
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: { fontSize: 28, fontWeight: '800', color: colors.text.primary, letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 13, fontWeight: '600', color: colors.text.secondary, textTransform: 'uppercase', marginBottom: 4 },
  
  avatarPlaceholder: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.border,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: 16, fontWeight: 'bold', color: colors.text.secondary },

  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  
  summaryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16, 
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  selectorContainer: {
    flexDirection: 'row',
    backgroundColor: '#E5E5EA',
    borderRadius: 20,
    height: 40,
    width: 100, 
    padding: 3,
    position: 'relative',
  },
  selectorIndicator: {
    position: 'absolute',
    top: 3,
    left: 3,
    height: 34,
    width: 47, 
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 3,
  },
  selectorButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, 
  },
  selectorButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 3,
  },
  flagText: {
    fontSize: 18,
  },

  summaryBalance: {
    fontSize: 38,
    fontWeight: '900',
    color: colors.text.primary,
    marginBottom: 8,
    letterSpacing: -1,
    textAlign: 'center',
  },
  pnlContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center' },
  pnlText: { fontSize: 17, fontWeight: '600' },
  pnlBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  pnlPercentage: { fontSize: 13, fontWeight: '700' },
  exchangeRateText: { fontSize: 11, color: colors.text.secondary, marginTop: 16, fontWeight: '500', textAlign: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text.primary, marginBottom: 10 },
  fab: { position: 'absolute', bottom: 30, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  fabText: { fontSize: 30, color: '#fff', marginTop: -4, fontWeight: '300' }
});