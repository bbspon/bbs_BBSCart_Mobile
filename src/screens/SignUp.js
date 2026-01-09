import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  Image,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BBSCARTLOGO from '../assets/images/bbscart-logo.png';

const Registration = () => {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateRegister = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required');
      return false;
    } else if (!/^[A-Za-z\s]+$/.test(name)) {
      Alert.alert('Error', 'Name must contain only letters');
      return false;
    }

    if (!email.trim()) {
      Alert.alert('Error', 'Email is required');
      return false;
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
    ) {
      Alert.alert('Error', 'Enter a valid email address');
      return false;
    }

    if (!phone.trim()) {
      Alert.alert('Error', 'Phone number is required');
      return false;
    } else if (!/^\d{10}$/.test(phone)) {
      Alert.alert('Error', 'Phone number must be 10 digits');
      return false;
    }

    if (!password) {
      Alert.alert('Error', 'Password is required');
      return false;
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(
        password
      )
    ) {
      Alert.alert(
        'Error',
        'Min 8 chars: uppercase, lowercase, number & special.'
      );
      return false;
    }

    if (!confirmPassword) {
      Alert.alert('Error', 'Confirm password is required');
      return false;
    } else if (confirmPassword !== password) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateRegister()) return;

    const payload = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password,
      confirmPassword,
      role: 'customer',
    };

    try {
      setIsLoading(true);

      const response = await fetch(
        'https://bbscart.com/api/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Registration failed');
      }

      Alert.alert('Success', 'Registration successful');

      setName('');
      setPhone('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      navigation.navigate('SignIn');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar backgroundColor="#2874F0" barStyle="light-content" />

      <View style={styles.header}>
        <Image source={BBSCARTLOGO} style={styles.logo} />
        <Text style={styles.subtitle}>
          Create an account to explore best deals & offers
        </Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.title}>Create Your Account</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            placeholder="Enter your phone number"
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Already have an account?{' '}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate('SignIn')}
          >
            Sign In
          </Text>
        </Text>
      </View>

      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#2874F0" />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f1f3f6',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 250,
    height: 150,
    resizeMode: 'contain',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#444',
    marginBottom: 5,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#333',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#fb641b',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  footerText: {
    marginTop: 15,
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
  },
  link: {
    color: '#2874F0',
    fontWeight: '600',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Registration;
