import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const ShippingPolicyScreen = () => (
  <ScrollView style={styles.container} contentContainerStyle={styles.inner}>
    <Text style={styles.title}>Shipping Policy</Text>

    <Text style={styles.paragraph}>
      We ship across India via trusted courier partners. Orders are processed
      within 1–2 business days. Standard delivery typically takes 3–7 business
      days depending on location.
    </Text>

    <Text style={styles.paragraph}>
      Tracking details will be emailed to you once the order is dispatched.
      Shipping delays caused by weather, courier issues, or customs are outside
      our control.
    </Text>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inner: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1F2937', marginBottom: 16 },
  paragraph: { fontSize: 14, color: '#4B5563', lineHeight: 20, marginBottom: 16 },
});

export default ShippingPolicyScreen;
