import React from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, AccentColor } from '../lib/theme';

const accentColors: { key: AccentColor; label: string; color: string }[] = [
  { key: 'blue', label: 'Blue', color: '#2196F3' },
  { key: 'purple', label: 'Purple', color: '#9c27b0' },
  { key: 'green', label: 'Green', color: '#4caf50' },
  { key: 'pink', label: 'Pink', color: '#e91e63' },
  { key: 'orange', label: 'Orange', color: '#ff9800' },
  { key: 'red', label: 'Red', color: '#f44336' },
  { key: 'teal', label: 'Teal', color: '#009688' },
  { key: 'yellow', label: 'Yellow', color: '#ffeb3b' },
  { key: 'indigo', label: 'Indigo', color: '#3f51b5' },
  { key: 'cyan', label: 'Cyan', color: '#00bcd4' },
  { key: 'rose', label: 'Rose', color: '#e91e63' },
  { key: 'emerald', label: 'Emerald', color: '#10b981' },
  { key: 'amber', label: 'Amber', color: '#f59e0b' },
  { key: 'violet', label: 'Violet', color: '#8b5cf6' },
  { key: 'lime', label: 'Lime', color: '#84cc16' },
];

export default function SettingsScreen() {
  const { theme, toggleTheme, setAccentColor, isSystemTheme, setSystemTheme } = useTheme();

  const handleAccentColorChange = (color: AccentColor) => {
    setAccentColor(color);
  };

  return (
    <SafeAreaView style={styles(theme).safeArea}>
      <ScrollView style={styles(theme).container}>
        <Text style={styles(theme).title}>Settings</Text>

        {/* Theme Section */}
        <View style={styles(theme).section}>
          <Text style={styles(theme).sectionTitle}>Appearance</Text>

          {/* System Theme Toggle */}
          <View style={styles(theme).settingRow}>
            <View style={styles(theme).settingInfo}>
              <Ionicons name="phone-portrait-outline" size={20} color={theme.colors.textSecondary} />
              <View style={styles(theme).settingText}>
                <Text style={styles(theme).settingLabel}>Follow System Theme</Text>
                <Text style={styles(theme).settingDescription}>
                  Automatically match your device&apos;s theme
                </Text>
              </View>
            </View>
            <Switch
              value={isSystemTheme}
              onValueChange={setSystemTheme}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={isSystemTheme ? theme.colors.primary : theme.colors.textSecondary}
            />
          </View>

          {/* Manual Dark Mode Toggle */}
          {!isSystemTheme && (
            <View style={styles(theme).settingRow}>
              <View style={styles(theme).settingInfo}>
                <Ionicons name="moon-outline" size={20} color={theme.colors.textSecondary} />
                <View style={styles(theme).settingText}>
                  <Text style={styles(theme).settingLabel}>Dark Mode</Text>
                  <Text style={styles(theme).settingDescription}>
                    Switch between light and dark themes
                  </Text>
                </View>
              </View>
              <Switch
                value={theme.isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor={theme.isDark ? theme.colors.primary : theme.colors.textSecondary}
              />
            </View>
          )}
        </View>

        {/* Accent Color Section */}
        <View style={styles(theme).section}>
          <Text style={styles(theme).sectionTitle}>Accent Color</Text>
          <Text style={styles(theme).sectionDescription}>
            Choose your favorite accent color for buttons and highlights
          </Text>

          <View style={styles(theme).colorGrid}>
            {accentColors.map(({ key, label, color }) => (
              <Pressable
                key={key}
                style={[
                  styles(theme).colorOption,
                  {
                    borderColor: theme.accentColor === key ? theme.colors.primary : theme.colors.border,
                    borderWidth: theme.accentColor === key ? 2 : 1,
                  },
                ]}
                onPress={() => handleAccentColorChange(key)}
              >
                <View style={[styles(theme).colorDot, { backgroundColor: color }]} />
                <Text style={styles(theme).colorLabel}>{label}</Text>
                {theme.accentColor === key && (
                  <Ionicons name="checkmark-circle" size={16} color={theme.colors.primary} />
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* Preview Section */}
        <View style={styles(theme).section}>
          <Text style={styles(theme).sectionTitle}>Preview</Text>

          <View style={styles(theme).previewCard}>
            <Text style={styles(theme).previewTitle}>Sample Confession</Text>
            <Text style={styles(theme).previewMeta}>
              — Anonymous at {new Date().toLocaleTimeString()}
            </Text>
            <Text style={styles(theme).previewContent}>
              This is how your confessions will look with the current theme...
            </Text>

            {/* Sample reaction buttons */}
            <View style={styles(theme).previewReactions}>
              <View style={styles(theme).previewReaction}>
                <Text style={styles(theme).previewReactionEmoji}>👍</Text>
                <Text style={styles(theme).previewReactionCount}>12</Text>
              </View>
              <View style={[styles(theme).previewReaction, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <Text style={styles(theme).previewReactionEmoji}>❤️</Text>
                <Text style={[styles(theme).previewReactionCount, { color: theme.colors.textSecondary }]}>8</Text>
              </View>
            </View>

            {/* Sample upvote button */}
            <View style={styles(theme).previewUpvote}>
              <Ionicons name="arrow-up" size={16} color={theme.colors.upvoteActive} />
              <Text style={styles(theme).previewUpvoteCount}>24</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = (theme: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  container: { flex: 1, padding: 16 },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
    color: theme.colors.text,
  },
  section: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: theme.colors.text,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
    color: theme.colors.textSecondary,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
    color: theme.colors.text,
  },
  settingDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: theme.colors.textSecondary,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  colorOption: {
    width: '31%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: theme.colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 6,
  },
  colorLabel: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    color: theme.colors.text,
  },
  previewCard: {
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: theme.colors.text,
  },
  previewMeta: {
    fontSize: 12,
    marginBottom: 8,
    color: theme.colors.textSecondary,
  },
  previewContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    color: theme.colors.textSecondary,
  },
  previewReactions: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  previewReaction: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    borderWidth: 1,
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  previewReactionEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  previewReactionCount: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primaryDark,
  },
  previewUpvote: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  previewUpvoteCount: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
    color: theme.colors.upvoteActive,
  },
});