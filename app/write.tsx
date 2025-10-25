import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAnonDeviceName } from '../lib/deviceName';
import { supabase } from '../lib/supabase';
import { useTheme } from '../lib/theme';

export default function WriteScreen() {
  const { theme } = useTheme();
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const MAX_LENGTH = 500;

  const submitConfession = async () => {
    const trimmed = content.trim();
    if (!trimmed) return Alert.alert('Empty', 'Please write something.');
    try {
      setSubmitting(true);
      const device_name = await getAnonDeviceName();
      const { error } = await supabase
        .from('confessions')
        .insert([{ content: trimmed, device_name }]);

      if (error) Alert.alert('Error', error.message);
      else {
        Alert.alert('Success', 'Your confession has been posted anonymously.');
        setContent('');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const remaining = MAX_LENGTH - content.length;

  return (
    <SafeAreaView style={[styles(theme).safeArea]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <ScrollView
          contentContainerStyle={styles(theme).container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles(theme).title, { color: theme.colors.text }]}>Write a confession</Text>
          <Text style={[styles(theme).helper, { color: theme.colors.textSecondary }]}>Share anything honestly. No names, no accounts.</Text>
          <View style={[styles(theme).inputWrap, { borderColor: theme.colors.border }]}>
            <TextInput
              placeholder="Write your confession..."
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              value={content}
              onChangeText={setContent}
              style={[styles(theme).input, { color: theme.colors.text }]}
              editable={!submitting}
              maxLength={MAX_LENGTH}
              textAlignVertical="top"
            />
            <Text style={[styles(theme).counter, remaining < 20 && { color: theme.colors.warning }]}>
              {content.trim().length}/{MAX_LENGTH}
            </Text>
          </View>

          <Pressable
            onPress={submitConfession}
            disabled={submitting || !content.trim()}
            style={({ pressed }) => [
              styles(theme).button,
              (submitting || !content.trim()) && styles(theme).buttonDisabled,
              pressed && styles(theme).buttonPressed,
            ]}
          >
            <Text style={[
              styles(theme).buttonText,
              (submitting || !content.trim()) && styles(theme).buttonTextDisabled
            ]}>
              {submitting ? 'Submitting…' : 'Confess'}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = (theme: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  container: { flexGrow: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 6 },
  helper: { marginBottom: 14 },
  inputWrap: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 12,
    minHeight: 180,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  input: {
    fontSize: 16,
    minHeight: 140,
  },
  counter: { alignSelf: 'flex-end', marginTop: 8 },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: { opacity: 0.9 },
  buttonDisabled: { 
    backgroundColor: theme.isDark ? '#404040' : '#d1d5db',
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  buttonText: { color: theme.colors.surface, fontWeight: '700', fontSize: 16 },
  buttonTextDisabled: { 
    color: theme.isDark ? '#9ca3af' : '#6b7280' 
  },
});
