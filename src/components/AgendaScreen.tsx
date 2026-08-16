import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import {
  formatAgendaDayLabel,
  formatAgendaTime,
  fromEditableClockDate,
  sortAgendaItems,
  toEditableClockDate,
} from '../agenda/agendaModel';
import type { AgendaItem } from '../agenda/types';

const flowersBackground = require('../../assets/flowers-background.png');

type AgendaScreenProps = {
  items: AgendaItem[];
  dayIso: string;
  onBack: () => void;
  onToggleDone: (id: string) => void;
  onAddItem: (title: string) => void;
  onUpdateTime: (id: string, startsAt: string) => void;
};

export function AgendaScreen({
  items,
  dayIso,
  onBack,
  onToggleDone,
  onAddItem,
  onUpdateTime,
}: AgendaScreenProps) {
  const [draft, setDraft] = useState('');
  const [editingItem, setEditingItem] = useState<AgendaItem | null>(null);
  const [draftTime, setDraftTime] = useState<Date | null>(null);
  const listOpacity = useRef(new Animated.Value(0)).current;
  const listTranslate = useRef(new Animated.Value(14)).current;

  const sorted = sortAgendaItems(items);

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

  const submitDraft = () => {
    const title = draft.trim();
    if (!title) {
      return;
    }
    onAddItem(title);
    setDraft('');
  };

  const openTimeEditor = (item: AgendaItem) => {
    setEditingItem(item);
    setDraftTime(toEditableClockDate(item.startsAt));
  };

  const closeTimeEditor = () => {
    setEditingItem(null);
    setDraftTime(null);
  };

  const saveTime = () => {
    if (!editingItem || !draftTime) {
      return;
    }
    onUpdateTime(
      editingItem.id,
      fromEditableClockDate(editingItem.startsAt, draftTime),
    );
    closeTimeEditor();
  };

  return (
    <View style={styles.root}>
      <ImageBackground
        testID="agenda-flowers-background"
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

      <KeyboardAvoidingView
        style={styles.shell}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
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
            Today’s bloom
          </Text>
          <Text style={styles.dayLabel}>{formatAgendaDayLabel(dayIso)}</Text>
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
          {sorted.length === 0 ? (
            <Text style={styles.empty}>
              Your garden is quiet — plant a plan below.
            </Text>
          ) : (
            <FlatList
              data={sorted}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.row}>
                  <Pressable
                    testID={`edit-time-${item.id}`}
                    accessibilityRole="button"
                    accessibilityLabel={`Edit time for ${item.title}`}
                    onPress={() => openTimeEditor(item)}
                    hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
                    style={({ pressed }) => [
                      styles.timeButton,
                      pressed && styles.timePressed,
                    ]}
                  >
                    <Text style={styles.time}>
                      {formatAgendaTime(item.startsAt)}
                    </Text>
                  </Pressable>

                  <Text
                    style={[styles.title, item.done && styles.titleDone]}
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>

                  <Pressable
                    testID={`toggle-done-${item.id}`}
                    accessibilityRole="button"
                    accessibilityLabel={
                      item.done
                        ? `Mark ${item.title} not done`
                        : `Mark ${item.title} done`
                    }
                    onPress={() => onToggleDone(item.id)}
                    hitSlop={10}
                    style={({ pressed }) => [
                      styles.petalButton,
                      pressed && styles.rowPressed,
                    ]}
                  >
                    <View
                      style={[styles.petal, item.done && styles.petalDone]}
                    />
                  </Pressable>
                </View>
              )}
            />
          )}
        </Animated.View>

        <View style={styles.compose}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Plant a new plan…"
            placeholderTextColor="rgba(247, 240, 232, 0.45)"
            style={styles.input}
            returnKeyType="done"
            onSubmitEditing={submitDraft}
            accessibilityLabel="Plant a new plan"
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add to agenda"
            onPress={submitDraft}
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.addPressed,
            ]}
          >
            <Text style={styles.addLabel}>Add</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      <Modal
        visible={editingItem != null}
        transparent
        animationType="fade"
        onRequestClose={closeTimeEditor}
      >
        <View style={styles.modalRoot}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Dismiss time editor"
            style={styles.modalScrim}
            onPress={closeTimeEditor}
          />
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Set bloom time</Text>
            {editingItem ? (
              <Text style={styles.modalSubtitle} numberOfLines={1}>
                {editingItem.title}
              </Text>
            ) : null}
            {draftTime ? (
              <DateTimePicker
                testID="agenda-time-picker"
                value={draftTime}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                themeVariant="dark"
                onChange={(_event, selected) => {
                  if (selected) {
                    setDraftTime(selected);
                  }
                }}
              />
            ) : null}
            <View style={styles.modalActions}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Cancel time edit"
                onPress={closeTimeEditor}
                style={({ pressed }) => [
                  styles.modalGhost,
                  pressed && styles.backPressed,
                ]}
              >
                <Text style={styles.modalGhostLabel}>Cancel</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Save time"
                onPress={saveTime}
                style={({ pressed }) => [
                  styles.addButton,
                  pressed && styles.addPressed,
                ]}
              >
                <Text style={styles.addLabel}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingRight: 8,
  },
  backPressed: {
    opacity: 0.7,
  },
  backLabel: {
    fontFamily: 'SourceSans3_400Regular',
    fontSize: 15,
    letterSpacing: 0.2,
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
  dayLabel: {
    fontFamily: 'SourceSans3_400Regular',
    fontSize: 16,
    color: 'rgba(247, 240, 232, 0.72)',
  },
  listWrap: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 16,
    gap: 10,
  },
  empty: {
    fontFamily: 'SourceSans3_400Regular',
    fontSize: 17,
    lineHeight: 26,
    color: 'rgba(247, 240, 232, 0.78)',
    maxWidth: 280,
    marginTop: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(247, 240, 232, 0.18)',
    gap: 12,
  },
  timeButton: {
    zIndex: 2,
    paddingVertical: 10,
    paddingHorizontal: 8,
    minWidth: 86,
    borderRadius: 4,
    backgroundColor: 'rgba(168, 196, 160, 0.12)',
  },
  timePressed: {
    backgroundColor: 'rgba(168, 196, 160, 0.28)',
  },
  rowPressed: {
    opacity: 0.7,
  },
  time: {
    fontFamily: 'SourceSans3_600SemiBold',
    fontSize: 13,
    letterSpacing: 0.4,
    color: '#A8C4A0',
    textDecorationLine: 'underline',
    textDecorationColor: 'rgba(168, 196, 160, 0.55)',
  },
  title: {
    flex: 1,
    fontFamily: 'CormorantGaramond_500Medium',
    fontSize: 22,
    lineHeight: 28,
    color: '#F7F0E8',
  },
  titleDone: {
    color: 'rgba(247, 240, 232, 0.45)',
    textDecorationLine: 'line-through',
  },
  petalButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  petal: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: 'rgba(168, 196, 160, 0.65)',
    backgroundColor: 'transparent',
  },
  petalDone: {
    backgroundColor: '#4F6B4E',
    borderColor: '#4F6B4E',
  },
  compose: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
  },
  input: {
    flex: 1,
    fontFamily: 'SourceSans3_400Regular',
    fontSize: 16,
    color: '#F7F0E8',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(247, 240, 232, 0.28)',
  },
  addButton: {
    backgroundColor: '#4F6B4E',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  addPressed: {
    backgroundColor: '#3F5740',
  },
  addLabel: {
    fontFamily: 'SourceSans3_600SemiBold',
    fontSize: 15,
    letterSpacing: 0.3,
    color: '#F7F0E8',
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(18, 10, 8, 0.55)',
  },
  modalSheet: {
    backgroundColor: '#2F201C',
    paddingTop: 22,
    paddingHorizontal: 22,
    paddingBottom: 34,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  modalTitle: {
    fontFamily: 'CormorantGaramond_600SemiBold',
    fontSize: 28,
    color: '#F7F0E8',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontFamily: 'SourceSans3_400Regular',
    fontSize: 15,
    color: 'rgba(247, 240, 232, 0.7)',
    marginBottom: 8,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 16,
    marginTop: 8,
  },
  modalGhost: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  modalGhostLabel: {
    fontFamily: 'SourceSans3_400Regular',
    fontSize: 15,
    color: 'rgba(247, 240, 232, 0.78)',
  },
});
