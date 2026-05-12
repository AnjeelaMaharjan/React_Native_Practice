/**
 * Screen: Example3_Auth
 *
 * Demonstrates withAuth HOC.
 *
 * The withAuth HOC decides whether to show the login form or this dashboard.
 * This component only handles what a logged-in user sees.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import withAuth from '../hocs/withAuth';
import { WithAuthProps } from '../hocs/types';

// ── Component ─────────────────────────────────────────────────────────────────
// Accepts only the props injected by withAuth.
// Callers (App.tsx) don't pass any of these — the HOC fills them in.
type Props = WithAuthProps;

const ProtectedDashboard: React.FC<Props> = ({ user, logout }) => (
  <ScrollView style={styles.container}>

    {/* Header */}
    <View style={styles.header}>
      <Text style={styles.welcome}> Welcome, {user.username}!</Text>
      <Text style={styles.email}>{user.email}</Text>
    </View>

    {/* User details */}
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Your Info</Text>
      <Row label="User ID"    value={user.id} />
      <Row label="Login Time" value={user.loginTime} />
      <Row label="Status"     value="✓ Authenticated" badge />
    </View>

    {/* Why this works */}
    <View style={styles.infoBox}>
      <Text style={styles.infoTitle}> How withAuth works:</Text>
      <Text style={styles.infoText}>
        1. withAuth checks isAuthenticated state{'\n'}
        2. If false - it renders its own login form{'\n'}
        3. After login - user object is created{'\n'}
        4. It then renders THIS component with user + logout as props{'\n'}
        5. Press logout - auth state clears → login form appears again
      </Text>
    </View>

    <TouchableOpacity style={styles.logoutButton} onPress={logout}>
      <Text style={styles.logoutText}> Logout</Text>
    </TouchableOpacity>

  </ScrollView>
);

// ── Small helper (not exported, only used above) ──────────────────────────────
interface RowProps {
  label: string;
  value: string;
  badge?: boolean;
}

const Row: React.FC<RowProps> = ({ label, value, badge = false }) => (
  <View style={rowStyles.row}>
    <Text style={rowStyles.label}>{label}</Text>
    {badge ? (
      <View style={rowStyles.badge}>
        <Text style={rowStyles.badgeText}>{value}</Text>
      </View>
    ) : (
      <Text style={rowStyles.value}>{value}</Text>
    )}
  </View>
);

// ── HOC wrapping ──────────────────────────────────────────────────────────────
export default withAuth(ProtectedDashboard);

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#f5f5f5' },
  header:       { backgroundColor: '#6200ee', padding: 30, paddingTop: 50, alignItems: 'center' },
  welcome:      { fontSize: 26, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  email:        { fontSize: 14, color: '#e0e0e0' },
  section:      { backgroundColor: '#fff', margin: 20, padding: 20, borderRadius: 12 },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  infoBox:      { backgroundColor: '#e3f2fd', marginHorizontal: 20, padding: 16, borderRadius: 8, borderLeftWidth: 4, borderLeftColor: '#1976d2' },
  infoTitle:    { fontSize: 14, fontWeight: 'bold', color: '#1976d2', marginBottom: 8 },
  infoText:     { fontSize: 13, color: '#1565c0', lineHeight: 22 },
  logoutButton: { margin: 20, paddingVertical: 14, backgroundColor: '#d32f2f', borderRadius: 8, alignItems: 'center' },
  logoutText:   { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

const rowStyles = StyleSheet.create({
  row:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  label:     { fontSize: 14, fontWeight: '600', color: '#666' },
  value:     { fontSize: 14, color: '#333', flex: 1, textAlign: 'right' },
  badge:     { backgroundColor: '#4caf50', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});
