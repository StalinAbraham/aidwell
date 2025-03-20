import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { SplashScreen } from 'expo-router';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  withDelay,
  interpolate,
  withSpring,
  runOnJS
} from 'react-native-reanimated';

export default function RootLayout() {
  useFrameworkReady();
  const [showMainContent, setShowMainContent] = useState(false);
  const [titleText] = useState('AIdWell');
  const [subtitleText] = useState('Your Personal Health Assistant');
  const [displayedTitle, setDisplayedTitle] = useState('');
  const [displayedSubtitle, setDisplayedSubtitle] = useState('');

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Start the typing animation for the title
      let currentIndex = 0;
      const titleInterval = setInterval(() => {
        if (currentIndex <= titleText.length) {
          setDisplayedTitle(titleText.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(titleInterval);
          // Start subtitle animation after title is complete
          let subtitleIndex = 0;
          const subtitleInterval = setInterval(() => {
            if (subtitleIndex <= subtitleText.length) {
              setDisplayedSubtitle(subtitleText.slice(0, subtitleIndex));
              subtitleIndex++;
            } else {
              clearInterval(subtitleInterval);
              // Delay before showing main content
              setTimeout(() => {
                setShowMainContent(true);
              }, 500);
            }
          }, 50); // Adjust speed of subtitle typing
        }
      }, 150); // Adjust speed of title typing

      return () => {
        clearInterval(titleInterval);
      };
    }
  }, [fontsLoaded, fontError]);

  const fadeAnim = useAnimatedStyle(() => {
    return {
      opacity: withSequence(
        withTiming(1, { duration: 500 }),
        withDelay(2000, withTiming(0, { duration: 500 }))
      ),
      transform: [
        {
          scale: withSpring(1, {
            damping: 10,
            stiffness: 100,
          }),
        },
      ],
    };
  });

  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>{displayedTitle}</Text>
          <Text style={styles.subtitle}>{displayedSubtitle}</Text>
        </View>
      </View>
    );
  }

  return (
    <>
      {!showMainContent ? (
        <Animated.View style={[styles.container, fadeAnim]}>
          <View style={styles.content}>
            <Text style={styles.title}>{displayedTitle}</Text>
            <Text style={styles.subtitle}>{displayedSubtitle}</Text>
          </View>
        </Animated.View>
      ) : (
        <>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="dark" />
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e1f16b',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    color: '#2c346b',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#2c346b',
    opacity: 0.9,
    textAlign: 'center',
  },
});