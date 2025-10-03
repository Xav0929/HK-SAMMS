import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
  useWindowDimensions, // Import for responsive sizing
  Alert, // <-- Added Alert for the login fail message
} from 'react-native';



const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isDesktop = screenWidth >= 768;
const isTablet = screenWidth >= 640 && screenWidth < 768;

const southImage = require('../assets/south.jpg');
const logoImage = require('../assets/login.png');

// Helper to add shadows cross-platform
const addShadow = (obj) => ({
  ...obj,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
  ...(Platform.OS === 'android' && { elevation: 5 }),
});

// 🚨 FIX 1: Renamed the prop to 'navigation' in the child component 
// 🚨 FIX 2: This component should receive the navigation prop, not 'navigations'
const LoginFormContent = ({ idSuffix, navigation }) => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // IMPORTANT: Add your actual authentication logic here

    // 💡 Dummy Logic for Demonstration:
    if (username === 'test' && password === '123') {
        console.log('Login Success! Navigating to AdminTabs...');
        // 🚨 FIX 3: Use the 'navigation' prop directly here.
        // Navigate to the Stack Screen name you defined in App.js
        navigation.navigate('AdminTabs'); 
    } else {
        console.log('Login Failed:', { username, password });
        Alert.alert('Login Failed', 'Invalid username or password.'); 
    }
  };
  const handleForgotPassword = () => {
    console.log('Forgot Password clicked.');
    // Navigation logic for Forgot Password screen goes here
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <View style={styles.formContainer}>
      {/* Username Input Group */}
      <View style={styles.inputGroup}>
        <Text style={styles.label} accessibilityLabel="Username label">
          Username:
        </Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter Username..."
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel={`Username input ${idSuffix}`}
          accessibilityHint="Enter your username"
        />
      </View>

      {/* Password Input Group */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password:</Text>
        <View style={styles.passwordInputContainer}>
          <TextInput
            secureTextEntry={!showPassword}
            style={[styles.input, styles.passwordInput]}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter Password..."
          />
         
        </View>

        <TouchableOpacity
          style={styles.forgotLinkContainer}
          onPress={handleForgotPassword}
          activeOpacity={0.7}
        >
          <Text style={styles.forgotLinkText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>


      <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const LogoSection = ({ size = 36 }) => {
  return (
    <View style={[styles.logoContainer, { marginBottom: 40 }]}>
      <View style={styles.logoWrapper}>
        <Image
          source={logoImage}
          style={[
            styles.logoImage,
            {
              width: size * 5, 
              height: size * 0.8, 
              maxWidth: 420, 
              minWidth: 24, 
            },
          ]}
          resizeMode="contain"
          accessibilityLabel="University Logo"
          onError={(error) => console.error('Logo image load error:', error.nativeEvent?.error)}
        />
      </View>
    </View>
  );
};

const PortalImage = ({ style }) => (
  <Image
    source={southImage}
    style={[styles.portalImageDefault, style]}
    resizeMode="cover"
    accessibilityLabel="University building"
    onError={(error) => console.error('Image load error:', error.nativeEvent?.error)}
  />
);

// 🚨 FIX 4: The main component MUST receive the 'navigation' prop.
const LoginScreen = ({ navigation }) => { 
  return (
    <View style={styles.mainContainer}>
      {/* Background color */}
      <View style={styles.background} />

      {isDesktop ? (
        /* Desktop Layout: Side-by-side */
        <View style={styles.desktopWrapper}>
          <View style={styles.desktopImagePanel}>
            <PortalImage />
          </View>
          <View style={styles.desktopFormPanel}>
            <View style={{ width: '100%', maxWidth: 320, alignSelf: 'center' }}>
              <LogoSection size={96} />
              {/* 🚨 FIX 5: Pass the received 'navigation' prop to the child component */}
              <LoginFormContent idSuffix="desktop" navigation={navigation} /> 
            </View>
          </View>
        </View>
      ) : (
        /* Mobile/Tablet Layout: Stacked with overlap */
        <View style={styles.mobileWrapper}>
          <View style={styles.mobileImageContainer}>
            <PortalImage />
          </View>
          <View style={styles.mobileFormContainer}>
            <View style={{ width: '100%' }}>
              <LogoSection size={48} />
              {/* 🚨 FIX 6: Pass the received 'navigation' prop to the child component */}
              <LoginFormContent idSuffix="mobile" navigation={navigation} /> 
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Global-ish
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f3f4f6',
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    minHeight: screenHeight,
  },

  // Form Styles 
  formContainer: {
    flexDirection: 'column',
    rowGap: 24,
  },
  inputGroup: {
    flexDirection: 'column',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  input: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: 'white',
    color: '#1f2937',
    fontSize: 14,
    ...addShadow({ shadowOpacity: 0.05, elevation: 1 }),
  },
  
  // New Styles for Password Visibility Toggle
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  passwordInput: {
    flex: 1, 
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    padding: 8, // Increase touch target size
    zIndex: 20, // Ensure it's above the TextInput
  },
  eyeIconText: {
    fontSize: 18,
    color: '#6b7280', // Gray color for icon
  },

  // New Styles for Forgot Password Link
  forgotLinkContainer: {
    alignSelf: 'flex-end',
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  forgotLinkText: {
    fontSize: 12,
    color: '#60a5fa',
    fontWeight: '600',
  },

  button: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#60a5fa',
    justifyContent: 'center',
    alignItems: 'center',
    ...addShadow(),
    marginTop: 32,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Logo Styles 
  logoContainer: {
    alignItems: 'center',
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16, 
  },
  logoImage: {
    // Base styles (empty for flexibility via inline props)
  },

  // Desktop Layout 
  desktopWrapper: {
    width: '100%',
    maxWidth: 896,
    height: 650,
    flexDirection: 'row',
    borderRadius: 16,
    overflow: 'hidden',
    ...addShadow({ shadowOpacity: 0.25, elevation: 12 }),
  },
  desktopImagePanel: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  desktopFormPanel: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: isTablet ? 40 : 48,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  portalImageDefault: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  // Mobile Layout 
  mobileWrapper: {
    flexDirection: 'column',
    width: '100%',
    maxWidth: 384,
    alignSelf: 'center',
  },
  mobileImageContainer: {
    width: '100%',
    height: 256,
    borderRadius: 12,
    overflow: 'hidden',
    ...addShadow(),
  },
  mobileFormContainer: {
    width: '88%',
    backgroundColor: 'white',
    marginTop: -96,
    zIndex: 10,
    padding: isTablet ? 32 : 24,
    borderRadius: 12,
    alignSelf: 'center',
    ...addShadow({ shadowOpacity: 0.25, elevation: 12 }),
  },
});

export default LoginScreen;
