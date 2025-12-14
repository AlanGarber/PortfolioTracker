import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background 
  },
  header: { 
    paddingHorizontal: 20,
    paddingBottom: 20, 
    paddingTop: 10,
    backgroundColor: colors.background, 
  },
  title: { 
    fontSize: 32, 
    fontWeight: '800', 
    color: colors.text.primary,
    letterSpacing: -0.5
  },
  listContent: { 
    padding: 16 
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    marginTop: -4, 
    fontWeight: '300'
  }
});
