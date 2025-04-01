import { StyleSheet } from 'react-native';

import TempleScreenInfo from '@/components/TempleScreenInfo';
import { Text, View } from '@/components/Themed';

export default function TempleScreen() {
  return (
    <View style={styles.container}>
      <TempleScreenInfo path="app/(tabs)/temples.tsx" />
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
