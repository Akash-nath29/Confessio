import { Linking, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PRIVACY_TEXT, TERMS_TEXT } from '../lib/terms';

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>About Confessio</Text>
        <Text style={styles.text}>
          Confessio lets anyone write and read confessions—fully anonymously. No login, no email, no
          tracking. Your device gets a random codename (like &quot;anon-brave-fox-1a2b&quot;) that lives only on
          your phone.
        </Text>

        <Text style={styles.subtitle}>Privacy Commitment</Text>
        <Text style={styles.text}>{PRIVACY_TEXT}</Text>

        <Text style={styles.subtitle}>Terms & Conditions</Text>
        <Text style={styles.text}>{TERMS_TEXT}</Text>

        <Text style={styles.text}>Made by{' '}
          <Text style={styles.link} onPress={() => Linking.openURL('https://aksn.lol')}>
            Akash Nath
          </Text>
          .
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f7f7f7' },
  container: { flexGrow: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  subtitle: { fontSize: 18, fontWeight: '600', marginTop: 16, marginBottom: 8 },
  text: { fontSize: 16, marginBottom: 10, lineHeight: 22 },
  link: { color: '#007AFF' },
});
