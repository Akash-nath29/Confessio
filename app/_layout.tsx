import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';

export default function RootLayout() {
  return (
    <Tabs
      initialRouteName="write"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: ComponentProps<typeof Ionicons>['name'] = 'help-outline';
          if (route.name === 'write') iconName = 'create-outline';
          else if (route.name === 'feed') iconName = 'list-outline';
          else if (route.name === 'about') iconName = 'information-circle-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="write" options={{ title: 'Write' }} />
      <Tabs.Screen name="feed" options={{ title: 'Feed' }} />
      <Tabs.Screen name="about" options={{ title: 'About' }} />
      {/* Hide these routes from the tab bar */}
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="+not-found" options={{ href: null }} />
    </Tabs>
  );
}
