import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ImageBackground, ActivityIndicator, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Button, Icon } from 'react-native-elements';

const RegisterScreen = ({ navigation } : { navigation: any }) => {
  const { register } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      await register(username, password);
      setLoading(false);
      Alert.alert('Success', 'User registered successfully', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
      setUsername('');
      setPassword('');
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to register user');
    }
  };

  return (
    <ImageBackground source={{ uri: 'https://example.com/health-background.jpg' }} style={styles.background}>
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Text style={styles.title}>HealthHub</Text>
        
        <View style={styles.inputContainer}>
          <Icon name="envelope" type="font-awesome" color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={username}
            onChangeText={text => setUsername(text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock" type="font-awesome" color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={text => setPassword(text)}
            secureTextEntry
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : (
          <Button
            title="Register"
            buttonStyle={styles.registerButton}
            onPress={handleRegister}
          />
        )}

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>Already have an account? Log in here</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black overlay
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
  },
  title: {
    fontSize: 32,
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
  },
  icon: {
    padding: 10,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 8,
  },
  registerButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
  },
  loginText: {
    color: '#4CAF50',
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
