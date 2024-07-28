import React, { useState, useEffect, useCallback, useContext } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Dimensions, Modal, ScrollView, Switch, Alert } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Ionicons } from '@expo/vector-icons'; // Assuming you have expo installed
import axios from 'axios'; // Assuming you have axios installed
import { AuthContext } from '../context/AuthContext'; // Adjust the path as necessary

interface Goal {
  _id?: string; // Add _id field for existing goals
  title: string;
  description: string;
  typeOfGoal: string;
  dueDate: string;
  completed: boolean;
}

const quotes = [
  "Believe you can and you're halfway there.",
  "Push yourself because no one else is going to do it for you.",
  "Your only limit is you.",
  "The harder you work for something, the greater you'll feel when you achieve it."
];

const { width } = Dimensions.get('window');

const Slideshow: React.FC = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const opacity = useSharedValue(1);

  const changeQuote = useCallback(() => {
    setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      opacity.value = withTiming(0, 
        { 
          duration: 1000, 
          easing: Easing.out(Easing.cubic) 
        }, 
        () => {
          runOnJS(changeQuote)();
          opacity.value = withTiming(1, { duration: 1000, easing: Easing.in(Easing.cubic) });
        }
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [opacity, changeQuote]);

  return (
    <View style={styles.slideshowContainer}>
      <Animated.Text style={[styles.quote, animatedStyle]}>
        {quotes[quoteIndex]}
      </Animated.Text>
    </View>
  );
};

const GoalsPage: React.FC = () => {
  const { user } = useContext(AuthContext); // Get user from AuthContext
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState<Goal>({ title: '', description: '', typeOfGoal: '', dueDate: '', completed: false });
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleInputChange = (name: keyof Goal, value: string) => {
    if (isEditing && editingGoal) {
      setEditingGoal({ ...editingGoal, [name]: value });
    } else {
      setNewGoal({ ...newGoal, [name]: value });
    }
  };

  const handleToggleCompletion = () => {
    if (isEditing && editingGoal) {
      setEditingGoal({ ...editingGoal, completed: !editingGoal.completed });
    } else {
      setNewGoal({ ...newGoal, completed: !newGoal.completed });
    }
  };

  const handleAddGoal = async () => {
    try {
      const response = await axios.post('http://localhost:5001/add-goal', {
        email: user?.email, // Use dynamic user email
        title: newGoal.title,
        description: newGoal.description,
        typeOfGoal: newGoal.typeOfGoal,
        dueDate: newGoal.dueDate,
        completed: newGoal.completed,
      });

      setGoals(response.data.goals);
      setNewGoal({ title: '', description: '', typeOfGoal: '', dueDate: '', completed: false });
      Alert.alert('Success', 'Goal added successfully');
    } catch (error) {
      console.error('Failed to add goal:', error);
      Alert.alert('Error', 'Failed to add goal');
    }
  };

  const handleEditGoal = (index: number) => {
    setEditingGoal(goals[index]);
    setEditingIndex(index);
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (editingGoal && editingGoal._id) {
      try {
        const response = await axios.put('http://localhost:5001/goals/update-goal', {
          email: user?.email, // Use dynamic user email
          _id: editingGoal._id,
          title: editingGoal.title,
          description: editingGoal.description,
          typeOfGoal: editingGoal.typeOfGoal,
          dueDate: editingGoal.dueDate,
          completed: editingGoal.completed,
        });

        setGoals(response.data.goals);
        setEditingGoal(null);
        setEditingIndex(null);
        setIsEditing(false);
        Alert.alert('Success', 'Goal updated successfully');
      } catch (error) {
        console.error('Failed to update goal:', error);
        Alert.alert('Error', 'Failed to update goal');
      }
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0];
    handleInputChange('dueDate', formattedDate);
    hideDatePicker();
  };

  const closeEditingModal = () => {
    setIsEditing(false);
    setEditingGoal(null);
    setEditingIndex(null);
  };

  return (
    <View style={styles.container}>
      <Slideshow />
      <View style={styles.addGoalForm}>
        <TextInput
          style={styles.input}
          placeholder="Goal Title"
          value={isEditing && editingGoal ? editingGoal.title : newGoal.title}
          onChangeText={(text) => handleInputChange('title', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Goal Description"
          value={isEditing && editingGoal ? editingGoal.description : newGoal.description}
          onChangeText={(text) => handleInputChange('description', text)}
        />
        <TouchableOpacity style={styles.pickerContainer} onPress={() => setPickerVisible(true)}>
          <Text style={styles.pickerText}>
            {isEditing && editingGoal ? editingGoal.typeOfGoal : newGoal.typeOfGoal ? newGoal.typeOfGoal : "Select Goal Type"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dateInput} onPress={showDatePicker}>
          <Text style={styles.dateText}>
            {isEditing && editingGoal ? editingGoal.dueDate : newGoal.dueDate ? newGoal.dueDate : "Select Due Date"}
          </Text>
          <Ionicons name="calendar" size={24} color="gray" style={styles.calendarIcon} />
        </TouchableOpacity>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Completed:</Text>
          <Switch
            value={isEditing && editingGoal ? editingGoal.completed : newGoal.completed}
            onValueChange={handleToggleCompletion}
          />
        </View>
        {isEditing ? (
          <>
            <TouchableOpacity style={styles.button} onPress={handleSaveEdit}>
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={closeEditingModal}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleAddGoal}>
            <Text style={styles.buttonText}>Add Goal</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView style={styles.goalsList}>
        {goals.map((goal, index) => (
          <TouchableOpacity key={index} style={styles.goalItem} onPress={() => handleEditGoal(index)}>
            <Text style={styles.goalTitle}>{goal.title}</Text>
            <Text style={styles.goalDescription}>{goal.description}</Text>
            <Text style={styles.goalType}>Type: {goal.typeOfGoal}</Text>
            <Text style={styles.goalDueDate}>Due Date: {goal.dueDate}</Text>
            <Text>{goal.completed ? 'Completed' : 'Not Completed'}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Modal visible={isPickerVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Picker
              selectedValue={isEditing && editingGoal ? editingGoal.typeOfGoal : newGoal.typeOfGoal}
              onValueChange={(itemValue) => {
                handleInputChange('typeOfGoal', itemValue);
                setPickerVisible(false);
              }}
            >
              <Picker.Item label="Daily" value="Daily" />
              <Picker.Item label="Weekly" value="Weekly" />
              <Picker.Item label="Monthly" value="Monthly" />
            </Picker>
            <TouchableOpacity style={styles.button} onPress={() => setPickerVisible(false)}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#e0f7fa',
  },
  slideshowContainer: {
    height: 150,
    width: width - 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
    backgroundColor: '#4CAF50',
    overflow: 'hidden',
  },
  quote: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    width: width - 80, // Account for container padding
  },
  addGoalForm: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#80deea',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    fontWeight: 'bold',
    backgroundColor: '#ffffff',
  },
  pickerContainer: {
    height: 40,
    borderColor: '#80deea',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#ffffff',
  },
  pickerText: {
    fontSize: 16,
    color: '#007BFF',
  },
  dateInput: {
    height: 40,
    borderColor: '#80deea',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
  },
  dateText: {
    fontSize: 16,
    color: '#007BFF',
  },
  calendarIcon: {
    marginLeft: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  switchLabel: {
    fontSize: 16,
    color: '#666',
    marginRight: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  goalsList: {
    width: '100%',
  },
  goalItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  goalDescription: {
    fontSize: 14,
    color: '#666',
  },
  goalType: {
    fontSize: 14,
    color: '#666',
  },
  goalDueDate: {
    fontSize: 14,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  completedContainer: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  completedText: {
    fontSize: 16,
    color: '#007BFF',
  },
});

export default GoalsPage;
