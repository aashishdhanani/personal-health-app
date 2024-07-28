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
    <ScrollView contentContainerStyle={styles.container}>
      <HealthScore score={healthScore} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => openModal('Sleep')}>
          <Icon name="bed" size={40} color="#fff" />
          <Text style={styles.buttonText}>Sleep</Text>
          <Text style={styles.dataText}>{sleep} hours</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => openModal('Steps')}>
          <Icon name="map-signs" size={40} color="#fff" />
          <Text style={styles.buttonText}>Steps</Text>
          <Text style={styles.dataText}>{steps} steps</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => openModal('Water')}>
          <Icon name="tint" size={40} color="#fff" />
          <Text style={styles.buttonText}>Water</Text>
          <Text style={styles.dataText}>{water} cups</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => openModal('Calories')}>
          <Icon name="apple" size={40} color="#fff" />
          <Text style={styles.buttonText}>Calories</Text>
          <Text style={styles.dataText}>{calories} kcal</Text>
        </TouchableOpacity>
      </View>
      <Modal transparent visible={modalVisible} animationType="none">
        <Animated.View style={[styles.modalContainer, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter {selectedMetric} Data</Text>
            <TextInput
              style={styles.input}
              placeholder={`Enter ${selectedMetric} value`}
              keyboardType="numeric"
              value={inputValue}
              onChangeText={setInputValue}
            />
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Text style={styles.dateText}>{date.toDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                //onChange={onDateChange}
              />
            )}
            <Button title="Save" onPress={closeModal} />
            <Button title="Close" onPress={closeModal} color="red" />
          </View>
        </Animated.View>
      </Modal>
    </ScrollView>
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
    flexWrap: 'wrap',
    justifyContent: 'space-around', // Space around to align items properly
    width: '100%',
  },
  button: {
    width: 165, // Adjust the width to make the buttons fit in two columns
    height: 180, // Adjust the height to make the buttons larger
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20, // Increase border radius for a more rounded look
    margin: 10, // Increase margin for more spacing between buttons
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 10, // Add margin to space out the text from the icon
  },
  dataText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 5, // Add margin to space out the data text from the button text
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    width: '100%',
    height: 300,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#4CAF50',
    marginBottom: 20,
  },
});

export default HomeScreen;
