import { useEffect, useRef } from 'react';
import {
  Animated,
  FlatList,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  formatAgendaTime,
  getCompletedAgendaItems,
} from '../agenda/agendaModel';
import type { AgendaItem } from '../agenda/types';

const flowersBackground = require('../../assets/flowers-background.png');

type CompletedSummaryScreenProps = {
  items: AgendaItem[];
  onBack: () => void;
};

export function CompletedSummaryScreen({
  items,
  onBack,
}: CompletedSummaryScreenProps) {
  const completed = getCompletedAgendaItems(items);
  const listOpacity = useRef(new Animated.Value(0)).current;
  const listTranslate = useRef(new Animated.Value(14)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(listOpacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(listTranslate, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, [listOpacity, listTranslate]);

  return (
    <View style={styles.root}>
      <ImageBackground
        testID="completed-flowers-background"
        source={flowersBackground}
        style={styles.background}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      >
        <LinearGradient
          colors={[
            'rgba(32, 22, 18, 0.55)',
            'rgba(28, 18, 16, 0.72)',
            'rgba(22, 14, 12, 0.88)',
          ]}
          locations={[0, 0.45, 1]}
          style={styles.veil}
        />
      </ImageBackground>

      <View style={styles.shell}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to home"
            onPress={onBack}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.backPressed,
            ]}
          >
            <Text style={styles.backLabel}>← Home</Text>
          </Pressable>

          <Text style={styles.heading} accessibilityRole="header">
            Completed blooms
          </Text>
          <Text style={styles.countLabel}>
            {completed.length === 1
              ? '1 completed'
              : `${completed.length} completed`}
          </Text>
        </View>

        <Animated.View
          style={[
            styles.listWrap,
            {
              opacity: listOpacity,
              transform: [{ translateY: listTranslate }],
            },
          ]}
        >
          {completed.length === 0 ? (
            <Text style={styles.empty}>No blooms completed yet.</Text>
          ) : (
            <FlatList
              data={completed}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.row}>
                  <Text style={styles.time}>
                    {formatAgendaTime(item.startsAt)}
                  </Text>
                  <Text style={styles.title} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <View style={styles.petalDone} />
                </View>
              )}
            />
          )}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#2A1A16',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  veil: {
    ...StyleSheet.absoluteFillObject,
  },
  shell: {
    flex: 1,
    paddingTop: 56,
    paddingHorizontal: 22,
    paddingBottom: 28,
  },
  header: {
    marginBottom: 22,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 18,
    paddingVertical: 4,
  },
  backPressed: {
    opacity: 0.7,
  },
  backLabel: {
    fontFamily: 'SourceSans3_600SemiBold',
    fontSize: 15,
    color: 'rgba(247, 240, 232, 0.78)',
  },
  heading: {
    fontFamily: 'CormorantGaramond_600SemiBold',
    fontSize: 40,
    lineHeight: 44,
    letterSpacing: -0.6,
    color: '#F7F0E8',
    marginBottom: 6,
  },
  countLabel: {
    fontFamily: 'SourceSans3_400Regular',
    fontSize: 15,
    color: 'rgba(196, 214, 170, 0.9)',
  },
  listWrap: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 16,
  },
  empty: {
    fontFamily: 'SourceSans3_400Regular',
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(247, 240, 232, 0.72)',
    marginTop: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(247, 240, 232, 0.16)',
  },
  time: {
    fontFamily: 'SourceSans3_600SemiBold',
    fontSize: 14,
    color: '#C4D6AA',
    minWidth: 58,
  },
  title: {
    flex: 1,
    fontFamily: 'SourceSans3_400Regular',
    fontSize: 16,
    lineHeight: 22,
    color: 'rgba(247, 240, 232, 0.72)',
    textDecorationLine: 'line-through',
  },
  petalDone: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#4F6B4E',
    borderWidth: 1.5,
    borderColor: '#C4D6AA',
  },
});
