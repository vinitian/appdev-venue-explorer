import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import {Drawer} from "expo-router/drawer"
import { createContext, useContext, useState } from 'react';

// When user clicks "Book this venue" button, we want the information venue place to be retained from index to explore page.
// So, we use Context. (https://www.youtube.com/watch?v=KfbJ2S7_XMg)

const AppContext = createContext<{ selectedVenue:string, setSelectedVenue:Function } | null>(null)

export function useAppContext() {
  const context = useContext(AppContext)
  // make sure that the components using this context must be wrapped with the context provider
  if (!context) { // if context is null i.e. not available
    throw new Error('useAppContext must be used inside AppContext Provider')
  }
  return context
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [selectedVenue, setSelectedVenue] = useState('')
  
  // notice how it's wrapped with AppContext.Provider
  if (Platform.OS === 'web') 
    return (
            <AppContext.Provider value={{ selectedVenue, setSelectedVenue }}>
              <Drawer>
                  <Drawer.Screen name="index" options={{ title: "Home" }} />
                  <Drawer.Screen name="explore" options={{ title: "Explore" }} />
              </Drawer>
            </AppContext.Provider>
        )
  else
    return (
      <AppContext.Provider value={{ selectedVenue, setSelectedVenue }}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            headerShown: false,
            tabBarButton: HapticTab,
            tabBarBackground: TabBarBackground,
            tabBarStyle: Platform.select({
              ios: {
                // Use a transparent background on iOS to show the blur effect
                position: 'absolute',
              },
              default: {},
            }),
          }}>
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
            }}
          />
          <Tabs.Screen
            name="explore"
            options={{
              title: 'Explore',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
            }}
          />
        </Tabs>
      </AppContext.Provider>
    );
}
