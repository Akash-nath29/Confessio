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

export default function WriteScreen() {
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
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Write a confession</Text>
          <Text style={styles.helper}>Share anything honestly. No names, no accounts.</Text>
          <View style={styles.inputWrap}>
            <TextInput
              placeholder="Write your confession..."
              placeholderTextColor="#999"
              multiline
              value={content}
              onChangeText={setContent}
              style={styles.input}
              editable={!submitting}
              maxLength={MAX_LENGTH}
              textAlignVertical="top"
            />
            <Text style={[styles.counter, remaining < 20 && { color: '#d35400' }]}>
              {content.trim().length}/{MAX_LENGTH}
            </Text>
          </View>

          <Pressable
            onPress={submitConfession}
            disabled={submitting || !content.trim()}
            style={({ pressed }) => [
              styles.button,
              (submitting || !content.trim()) && styles.buttonDisabled,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>{submitting ? 'Submitting…' : 'Confess'}</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f7f7f7' },
  container: { flexGrow: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 6 },
  helper: { color: '#666', marginBottom: 14 },
  inputWrap: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    minHeight: 180,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  input: {
    fontSize: 16,
    minHeight: 140,
    color: '#111',
  },
  counter: { alignSelf: 'flex-end', color: '#999', marginTop: 8 },
  button: {
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: { opacity: 0.9 },
  buttonDisabled: { backgroundColor: '#c7c7c7' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
