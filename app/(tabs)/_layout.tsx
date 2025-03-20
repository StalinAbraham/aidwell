import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Bell, Calendar, Hospital, CirclePlus as PlusCircle, CircleUser as UserCircle, MessageCircle } from 'lucide-react-native';

const TAB_ICON_SIZE = 24;

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#e1f16b',
          borderTopWidth: 1,
          borderTopColor: '#d1e15b',
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 10,
          // Add these properties to prevent keyboard from pushing the tab bar
          position: Platform.OS === 'web' ? 'fixed' : 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarActiveTintColor: '#2c346b',
        tabBarInactiveTintColor: 'rgba(44, 52, 107, 0.5)',
        tabBarLabelStyle: {
          fontFamily: 'Inter-Regular',
          fontSize: 12,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Hospital size={TAB_ICON_SIZE} color={color} />,
        }}
      />
      <Tabs.Screen
        name="medications"
        options={{
          title: 'Medications',
          tabBarIcon: ({ color }) => <Calendar size={TAB_ICON_SIZE} color={color} />,
        }}
      />
      <Tabs.Screen
        name="symptoms"
        options={{
          title: 'Symptoms',
          tabBarIcon: ({ color }) => <PlusCircle size={TAB_ICON_SIZE} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'AI Nurse',
          tabBarIcon: ({ color }) => <MessageCircle size={TAB_ICON_SIZE} color={color} />,
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color }) => <Bell size={TAB_ICON_SIZE} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <UserCircle size={TAB_ICON_SIZE} color={color} />,
        }}
      />
    </Tabs>
  );
}