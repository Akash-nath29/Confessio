import { Linking, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PRIVACY_TEXT, TERMS_TEXT } from '../lib/terms';
import { useTheme } from '../lib/theme';

export default function AboutScreen() {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles(theme).safeArea]}>
      <ScrollView contentContainerStyle={styles(theme).container}>
        <Text style={[styles(theme).title, { color: theme.colors.text }]}>About Confessio</Text>
        <Text style={[styles(theme).text, { color: theme.colors.textSecondary }]}>
          Confessio lets anyone write and read confessions—fully anonymously. No login, no email, no
          tracking. Your device gets a random codename (like &quot;anon-brave-fox-1a2b&quot;) that lives only on
          your phone.
        </Text>

        <Text style={[styles(theme).subtitle, { color: theme.colors.text }]}>Privacy Commitment</Text>
        <Text style={[styles(theme).text, { color: theme.colors.textSecondary }]}>{PRIVACY_TEXT}</Text>

        <Text style={[styles(theme).subtitle, { color: theme.colors.text }]}>Terms & Conditions</Text>
        <Text style={[styles(theme).text, { color: theme.colors.textSecondary }]}>{TERMS_TEXT}</Text>

        <Text style={[styles(theme).text, { color: theme.colors.textSecondary }]}>Made by{' '}
          <Text style={[styles(theme).link, { color: theme.colors.primary }]} onPress={() => Linking.openURL('https://aksn.lol')}>
            Akash Nath
          </Text>
          .
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = (theme: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  container: { flexGrow: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  subtitle: { fontSize: 18, fontWeight: '600', marginTop: 16, marginBottom: 8 },
  text: { fontSize: 16, marginBottom: 10, lineHeight: 22 },
  link: {},
});
