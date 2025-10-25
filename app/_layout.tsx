import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import { ThemeProvider, useTheme } from '../lib/theme';

function TabLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      initialRouteName="write"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: ComponentProps<typeof Ionicons>['name'] = 'help-outline';
          if (route.name === 'write') iconName = 'create-outline';
          else if (route.name === 'feed') iconName = 'list-outline';
          else if (route.name === 'about') iconName = 'information-circle-outline';
          else if (route.name === 'settings') iconName = 'settings-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
      })}
    >
      <Tabs.Screen name="write" options={{ title: 'Write' }} />
      <Tabs.Screen name="feed" options={{ title: 'Feed' }} />
      <Tabs.Screen name="about" options={{ title: 'About' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
      {/* Hide these routes from the tab bar */}
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="+not-found" options={{ href: null }} />
    </Tabs>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <TabLayout />
    </ThemeProvider>
  );
}
