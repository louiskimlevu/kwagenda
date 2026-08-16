import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.brand}>kwagenda</Text>
      <Text style={styles.subtitle}>Your agenda, ready on device.</Text>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1F2A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  brand: {
    color: '#F4EFE6',
    fontSize: 48,
    fontWeight: '700',
    letterSpacing: -1,
    marginBottom: 12,
  },
  subtitle: {
    color: '#A8C0CC',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
  },
});
