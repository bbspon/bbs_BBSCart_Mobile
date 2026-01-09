// ContactUsScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';

export default function ContactUsScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    const mailUrl = `mailto:info@bbscart.com?subject=Contact from ${name}&body=${message}`;
    Linking.openURL(mailUrl);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.inner}>
      {/* Header */}
      <Text style={styles.heading}>Get in Touch</Text>
      <Text style={styles.subText}>
        Need help? Reach out via phone, email, WhatsApp, or drop us a message!
      </Text>

      {/* Contact info */}
      <View style={styles.infoGrid}>
        <View style={styles.infoCard}>
          <MaterialCommunityIcons name="phone" size={40} color="#4B5563" />
          <Text style={styles.cardTitle}>Phone Number</Text>
          <Text
            style={styles.link}
            onPress={() => Linking.openURL('tel:+914134068916')}
          >
            +91 4134068916
          </Text>
        </View>

        <View style={styles.infoCard}>
          <FontAwesome name="whatsapp" size={40} color="green" />
          <Text style={styles.cardTitle}>WhatsApp</Text>
          <Text
            style={styles.link}
            onPress={() => Linking.openURL('https://wa.me/9600729596')}
          >
            +91 9600729596
          </Text>
        </View>

        <View style={styles.infoCard}>
          <MaterialIcons name="email" size={40} color="#2563EB" />
          <Text style={styles.cardTitle}>Email</Text>
          <Text
            style={styles.link}
            onPress={() => Linking.openURL('mailto:info@bbscart.com')}
          >
            info@bbscart.com
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Entypo name="location-pin" size={40} color="red" />
          <Text style={styles.cardTitle}>Address</Text>
          <Text style={styles.address}>
            No: 20, 100 Feet Road, Ellaipillaichavady, Puducherry – 605005
          </Text>
        </View>
      </View>

      {/* Message Form */}
      <View style={styles.form}>
        <Text style={styles.formHeading}>Send Us a Message</Text>

        <TextInput
          placeholder="Your Name"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          placeholder="Your Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Your Message"
          style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
          value={message}
          onChangeText={setMessage}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Send Message</Text>
        </TouchableOpacity>
      </View>

      {/* Social icons */}
      <View style={styles.socialRow}>
        <FontAwesome
          name="facebook-square"
          size={36}
          color="#2563EB"
          onPress={() =>
            Linking.openURL('https://www.facebook.com/profile.php?id=100090804256179')
          }
        />
        <FontAwesome
          name="instagram"
          size={36}
          color="#E1306C"
          onPress={() =>
            Linking.openURL('https://www.instagram.com/bbscart/?hl=en')
          }
        />
        <FontAwesome
          name="whatsapp"
          size={36}
          color="green"
          onPress={() => Linking.openURL('https://wa.me/914134068916')}
        />
        <FontAwesome
          name="linkedin-square"
          size={36}
          color="#0A66C2"
          onPress={() =>
            Linking.openURL(
              'https://www.linkedin.com/in/pavarasu-mayavan-50a171355/'
            )
          }
        />
        <FontAwesome
          name="youtube-play"
          size={36}
          color="red"
          onPress={() =>
            Linking.openURL(
              'https://www.youtube.com/channel/UCNiBeRvAW1bQOUEcaqc0hYA'
            )
          }
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inner: { padding: 20, alignItems: 'center' },
  heading: { fontSize: 28, fontWeight: 'bold', color: '#1F2937', marginTop: 10 },
  subText: {
    textAlign: 'center',
    color: '#4B5563',
    marginVertical: 10,
    maxWidth: 320,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  infoCard: {
    width: '45%',
    marginVertical: 10,
    alignItems: 'center',
  },
  cardTitle: { fontSize: 16, fontWeight: '600', marginTop: 6, color: '#374151' },
  link: { color: '#2563EB', marginTop: 4 },
  address: { textAlign: 'center', color: '#4B5563', marginTop: 4 },
  form: {
    width: '100%',
    marginTop: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
  },
  formHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    width: '100%',
  },
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginTop: 30,
  },
});
