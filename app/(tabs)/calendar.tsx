import { StyleSheet } from 'react-native';

import CalendarScreenInfo from '@/components/CalendarScreenInfo';
import { Text, View } from '@/components/Themed';

export default function CalendarScreen() {
  return (
    <View style={styles.container}>
      <CalendarScreenInfo path="app/(tabs)/calendar.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
