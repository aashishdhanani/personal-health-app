import React, { useContext, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Button, Icon } from 'react-native-elements';

const LoginScreen = ({ navigation } : { navigation: any }) => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Username:', username); // Debug log
    console.log('Password:', password); // Debug log
    login(username, password);
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
            placeholder="email"
            value={username}
            onChangeText={text => {
              console.log('Username input:', text); // Debug log
              setUsername(text);
            }}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock" type="font-awesome" color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={text => {
              console.log('Password input:', text); // Debug log
              setPassword(text);
            }}
            secureTextEntry
          />
        </View>

        <Button
          title="Login"
          buttonStyle={styles.loginButton}
          onPress={handleLogin}
        />
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.signupText}>Don't have an account? Sign up here</Text>
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
  loginButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
  },
  signupText: {
    color: '#4CAF50',
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
