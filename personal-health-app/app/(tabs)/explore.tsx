import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Button, Animated, Dimensions, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';

const calculateHealthScore = (sleep: number, steps: number, water: number, calories: number) => {
  const sleepScore = (sleep / 8) * 100; // Assuming 8 hours is the healthy average
  const stepsScore = (steps / 10000) * 100; // Assuming 10,000 steps is the healthy average
  const waterScore = (water / 8) * 100; // Assuming 8 cups is the healthy average
  const caloriesScore = (calories / 2000) * 100; // Assuming 2000 calories is the healthy average

  const totalScore = (sleepScore + stepsScore + waterScore + caloriesScore) / 4;
  return Math.round(totalScore);
};

interface HealthScoreProps {
  score: number;
}

const HealthScore: React.FC<HealthScoreProps> = ({ score }) => (
  <View style={styles.healthScoreBox}>
    <View style={styles.circle}>
      <Text style={styles.circleText}>{score}</Text>
    </View>
    <Text style={styles.healthScoreText}>Health Score</Text>
  </View>
);

const HomeScreen: React.FC = () => {
  const [sleep, setSleep] = useState(9);
  const [steps, setSteps] = useState(7431);
  const [water, setWater] = useState(5);
  const [calories, setCalories] = useState(1784);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const slideAnim = useState(new Animated.Value(Dimensions.get('window').height))[0];

  const healthScore = calculateHealthScore(sleep, steps, water, calories);

  const openModal = (metric: React.SetStateAction<string>) => {
    setSelectedMetric(metric);
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    if (inputValue) {
      switch (selectedMetric) {
        case 'Sleep':
          setSleep(Number(inputValue));
          break;
        case 'Steps':
          setSteps(Number(inputValue));
          break;
        case 'Water':
          setWater(Number(inputValue));
          break;
        case 'Calories':
          setCalories(Number(inputValue));
          break;
        default:
          break;
      }
    }

    Animated.timing(slideAnim, {
      toValue: Dimensions.get('window').height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setInputValue('');
      setDate(new Date());
    });
  };

  const onDateChange = (_event: any, selectedDate: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Button, Animated, Dimensions, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';

const calculateHealthScore = (sleep: number, steps: number, water: number, calories: number) => {
  const sleepScore = (sleep / 8) * 100; // Assuming 8 hours is the healthy average
  const stepsScore = (steps / 10000) * 100; // Assuming 10,000 steps is the healthy average
  const waterScore = (water / 8) * 100; // Assuming 8 cups is the healthy average
  const caloriesScore = (calories / 2000) * 100; // Assuming 2000 calories is the healthy average

  const totalScore = (sleepScore + stepsScore + waterScore + caloriesScore) / 4;
  return Math.round(totalScore);
};

interface HealthScoreProps {
  score: number;
}

const HealthScore: React.FC<HealthScoreProps> = ({ score }) => (
  <View style={styles.healthScoreBox}>
    <View style={styles.circle}>
      <Text style={styles.circleText}>{score}</Text>
    </View>
    <Text style={styles.healthScoreText}>Health Score</Text>
  </View>
);

const HomeScreen: React.FC = () => {
  const [sleep, setSleep] = useState(9);
  const [steps, setSteps] = useState(7431);
  const [water, setWater] = useState(5);
  const [calories, setCalories] = useState(1784);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const slideAnim = useState(new Animated.Value(Dimensions.get('window').height))[0];

  const healthScore = calculateHealthScore(sleep, steps, water, calories);

  const openModal = (metric: React.SetStateAction<string>) => {
    setSelectedMetric(metric);
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    if (inputValue) {
      switch (selectedMetric) {
        case 'Sleep':
          setSleep(Number(inputValue));
          break;
        case 'Steps':
          setSteps(Number(inputValue));
          break;
        case 'Water':
          setWater(Number(inputValue));
          break;
        case 'Calories':
          setCalories(Number(inputValue));
          break;
        default:
          break;
      }
    }

    Animated.timing(slideAnim, {
      toValue: Dimensions.get('window').height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setInputValue('');
      setDate(new Date());
    });
  };

  const onDateChange = (_event: any, selectedDate: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore</ThemedText>
      </ThemedView>
      <ThemedText>This app includes example code to help you get started.</ThemedText>
      <Collapsible title="File-based routing">
        <ThemedText>
          This app has two screens:{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
        </ThemedText>
        <ThemedText>
          The layout file in <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{' '}
          sets up the tab navigator.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Android, iOS, and web support">
        <ThemedText>
          You can open this project on Android, iOS, and the web. To open the web version, press{' '}
          <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Images">
        <ThemedText>
          For static images, you can use the <ThemedText type="defaultSemiBold">@2x</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">@3x</ThemedText> suffixes to provide files for
          different screen densities
        </ThemedText>
        <Image source={require('@/assets/images/react-logo.png')} style={{ alignSelf: 'center' }} />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Custom fonts">
        <ThemedText>
          Open <ThemedText type="defaultSemiBold">app/_layout.tsx</ThemedText> to see how to load{' '}
          <ThemedText style={{ fontFamily: 'SpaceMono' }}>
            custom fonts such as this one.
          </ThemedText>
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/versions/latest/sdk/font">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Light and dark mode components">
        <ThemedText>
          This template has light and dark mode support. The{' '}
          <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook lets you inspect
          what the user's current color scheme is, and so you can adjust UI colors accordingly.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Animations">
        <ThemedText>
          This template includes an example of an animated component. The{' '}
          <ThemedText type="defaultSemiBold">components/HelloWave.tsx</ThemedText> component uses
          the powerful <ThemedText type="defaultSemiBold">react-native-reanimated</ThemedText> library
          to create a waving hand animation.
        </ThemedText>
        {Platform.select({
          ios: (
            <ThemedText>
              The <ThemedText type="defaultSemiBold">components/ParallaxScrollView.tsx</ThemedText>{' '}
              component provides a parallax effect for the header image.
            </ThemedText>
          ),
        })}
      </Collapsible>
    </ParallaxScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingVertical: 20,
  },
  healthScoreBox: {
    width: 500,
    height: 150,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20, // Match the style of other containers
    marginBottom: 20, // Space between the health score and buttons
    padding: 10,
  },
  healthScoreContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10, // Space between the circle and the text
  },
  circleText: {
    color: '#4CAF50',
    fontSize: 20,
    fontWeight: 'bold',
  },
  healthScoreText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});

export default HomeScreen;

export default HomeScreen