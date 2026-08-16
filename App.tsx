import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import {
  CormorantGaramond_500Medium,
  CormorantGaramond_600SemiBold,
  useFonts as useCormorantFonts,
} from '@expo-google-fonts/cormorant-garamond';
import {
  SourceSans3_400Regular,
  SourceSans3_600SemiBold,
  useFonts as useSourceSansFonts,
} from '@expo-google-fonts/source-sans-3';
import { createAgendaItem, toggleAgendaItemDone } from './src/agenda/agendaModel';
import { sampleAgendaItems } from './src/agenda/sampleAgenda';
import type { AgendaItem } from './src/agenda/types';
import { AgendaScreen } from './src/components/AgendaScreen';

const flowersBackground = require('./assets/flowers-background.png');

type Screen = 'home' | 'agenda';

export default function App() {
  const [cormorantLoaded] = useCormorantFonts({
    CormorantGaramond_500Medium,
    CormorantGaramond_600SemiBold,
  });
  const [sourceSansLoaded] = useSourceSansFonts({
    SourceSans3_400Regular,
    SourceSans3_600SemiBold,
  });

  const fontsReady = cormorantLoaded && sourceSansLoaded;
  const [screen, setScreen] = useState<Screen>('home');
  const [items, setItems] = useState<AgendaItem[]>(sampleAgendaItems);
  const dayIso = '2026-08-16T12:00:00.000Z';

  const bgScale = useRef(new Animated.Value(1)).current;
  const brandOpacity = useRef(new Animated.Value(0)).current;
  const brandTranslate = useRef(new Animated.Value(18)).current;
  const copyOpacity = useRef(new Animated.Value(0)).current;
  const ctaOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!fontsReady || screen !== 'home') {
      return;
    }

    bgScale.setValue(1);
    brandOpacity.setValue(0);
    brandTranslate.setValue(18);
    copyOpacity.setValue(0);
    ctaOpacity.setValue(0);

    Animated.parallel([
      Animated.timing(bgScale, {
        toValue: 1.08,
        duration: 14000,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.parallel([
          Animated.timing(brandOpacity, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(brandTranslate, {
            toValue: 0,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(copyOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(ctaOpacity, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [
    fontsReady,
    screen,
    bgScale,
    brandOpacity,
    brandTranslate,
    copyOpacity,
    ctaOpacity,
  ]);

  if (!fontsReady) {
    return <View style={styles.loading} />;
  }

  if (screen === 'agenda') {
    return (
      <>
        <AgendaScreen
          items={items}
          dayIso={dayIso}
          onBack={() => setScreen('home')}
          onToggleDone={(id) => setItems((prev) => toggleAgendaItemDone(prev, id))}
          onAddItem={(title) =>
            setItems((prev) => [
              ...prev,
              createAgendaItem({
                title,
                startsAt: new Date().toISOString(),
              }),
            ])
          }
        />
        <StatusBar style="light" />
      </>
    );
  }

  return (
    <View style={styles.root}>
      <Animated.View
        style={[styles.backgroundMotion, { transform: [{ scale: bgScale }] }]}
      >
        <ImageBackground
          testID="flowers-background"
          source={flowersBackground}
          style={styles.background}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        >
          <LinearGradient
            colors={[
              'rgba(28, 18, 16, 0.08)',
              'rgba(28, 18, 16, 0.28)',
              'rgba(24, 14, 12, 0.72)',
            ]}
            locations={[0, 0.42, 1]}
            style={styles.veil}
          />
        </ImageBackground>
      </Animated.View>

      <View style={styles.content}>
        <Animated.View
          style={{
            opacity: brandOpacity,
            transform: [{ translateY: brandTranslate }],
          }}
        >
          <Text style={styles.brand} accessibilityRole="header">
            kwagenda
          </Text>
        </Animated.View>

        <Animated.View style={{ opacity: copyOpacity }}>
          <Text style={styles.subtitle}>
            Your agenda, blooming into place.
          </Text>
        </Animated.View>

        <Animated.View style={[styles.ctaWrap, { opacity: ctaOpacity }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open agenda"
            style={({ pressed }) => [
              styles.cta,
              pressed && styles.ctaPressed,
            ]}
            onPress={() => setScreen('agenda')}
          >
            <Text style={styles.ctaLabel}>Open agenda</Text>
          </Pressable>
        </Animated.View>
      </View>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#2A1A16',
  },
  loading: {
    flex: 1,
    backgroundColor: '#2A1A16',
  },
  backgroundMotion: {
    ...StyleSheet.absoluteFillObject,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  veil: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 28,
    paddingBottom: 72,
  },
  brand: {
    fontFamily: 'CormorantGaramond_600SemiBold',
    fontSize: 64,
    lineHeight: 68,
    letterSpacing: -1.2,
    color: '#F7F0E8',
    marginBottom: 14,
  },
  subtitle: {
    fontFamily: 'SourceSans3_400Regular',
    fontSize: 18,
    lineHeight: 28,
    color: 'rgba(247, 240, 232, 0.86)',
    maxWidth: 280,
    marginBottom: 28,
  },
  ctaWrap: {
    alignSelf: 'flex-start',
  },
  cta: {
    backgroundColor: '#4F6B4E',
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderRadius: 4,
  },
  ctaPressed: {
    backgroundColor: '#3F5740',
  },
  ctaLabel: {
    fontFamily: 'SourceSans3_600SemiBold',
    fontSize: 16,
    letterSpacing: 0.3,
    color: '#F7F0E8',
  },
});
