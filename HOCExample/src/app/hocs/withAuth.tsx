/**
 * HOC: withAuth
 *
 * WHAT IT DOES:
 *   Guards a component behind a login screen.
 *   → Not logged in : shows username/email login form.
 *   → Logged in     : renders the wrapped component with user info as props.
 *
 * WHY WE NEED IT:
 *   Without this HOC you'd duplicate the login form, auth state, and the
 *   isAuthenticated check in every protected screen. The HOC owns that
 *   logic once and can guard any component with one line:
 *     const ProtectedDashboard = withAuth(Dashboard);
 *
 * USAGE:
 *   const ProtectedScreen = withAuth(MyScreen);
 *   // MyScreen now receives: user, logout, isAuthenticated
 *
 * FLOW:
 *   withAuth(Dashboard)
 *     └─ returns <WithAuthWrapper>
 *           ├─ owns: isAuthenticated, user state
 *           ├─ not authenticated → shows <LoginScreen>
 *           └─ authenticated     → <Dashboard user={...} logout={...} />
 */

import React, { useState, ComponentType } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { User, WithAuthProps } from './types';

function withAuth<T extends object>(
  WrappedComponent: ComponentType<T & WithAuthProps>,
): ComponentType<Omit<T, keyof WithAuthProps>> {

  const WithAuthWrapper = (props: Omit<T, keyof WithAuthProps>) => {

    // ── Auth state lives here, not in the wrapped component ──────
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser]                       = useState<User | null>(null);
    const [username, setUsername]               = useState<string>('');
    const [email, setEmail]                     = useState<string>('');

    // ── Handlers ──────────────────────────────────────────────────
    const login = (): void => {
      if (!username.trim() || !email.trim()) {
        Alert.alert('Missing fields', 'Please fill in both username and email.');
        return;
      }
      const newUser: User = {
        username,
        email,
        id:        Math.random().toString(36).slice(2, 11),
        loginTime: new Date().toLocaleString(),
      };
      setUser(newUser);
      setIsAuthenticated(true);
      setUsername('');
      setEmail('');
    };

    const logout = (): void => {
      setUser(null);
      setIsAuthenticated(false);
    };

    // ── Gate: not authenticated → show login ─────────────────────
    if (!isAuthenticated) {
      return (
        <View style={styles.loginContainer}>
          <Text style={styles.title}> Login Required</Text>

          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity style={styles.loginButton} onPress={login}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          {/* Quick demo — fills in fake credentials */}
          <TouchableOpacity
            style={styles.demoButton}
            onPress={() => {
              const demo: User = {
                username:  'DemoUser',
                email:     'demo@example.com',
                id:        '12345',
                loginTime: new Date().toLocaleString(),
              };
              setUser(demo);
              setIsAuthenticated(true);
            }}
          >
            <Text style={styles.demoButtonText}>Try Demo Login</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // ── Authenticated → render wrapped component ─────────────────
    // user! is safe here because isAuthenticated is only true after setUser()
    return (
      <WrappedComponent
        {...(props as T)}
        user={user!}
        logout={logout}
        isAuthenticated={isAuthenticated}
      />
    );
  };

  WithAuthWrapper.displayName = `WithAuth(${
    WrappedComponent.displayName ?? WrappedComponent.name ?? 'Component'
  })`;

  return WithAuthWrapper;
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#6200ee',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 10,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  demoButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  demoButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default withAuth;
