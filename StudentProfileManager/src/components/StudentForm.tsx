import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import { documentDirectory, copyAsync } from 'expo-file-system/legacy';

// Validation Schema using Yup
export const studentValidationSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(3, 'Name must be at least 3 characters')
    .required('Full Name is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9\-+\s]{8,15}$/, 'Invalid phone number format')
    .required('Phone number is required'),
  address: Yup.string().required('Address is required'),
  faculty: Yup.string().required('Faculty is required'),
  semester: Yup.string().required('Semester is required'),
  imageUri: Yup.string().nullable(),
});

interface StudentFormValues {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  faculty: string;
  semester: string;
  imageUri: string | null;
}

interface StudentFormProps {
  initialValues?: StudentFormValues;
  onSubmit: (values: StudentFormValues) => void;
  submitButtonText: string;
}

const FACULTIES = ['Computer Science', 'Information Technology', 'Software Engineering', 'Business Administration', 'Civil Engineering'];
const SEMESTERS = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'];

export const StudentForm: React.FC<StudentFormProps> = ({
  initialValues = {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    faculty: '',
    semester: '',
    imageUri: null,
  },
  onSubmit,
  submitButtonText,
}) => {
  
  // Handlers for picking image (Phase 6)
  const handlePickImage = async (setFieldValue: (field: string, value: any) => void) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access photos is required to add a profile image.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const pickedUri = result.assets[0].uri;
        
        if (documentDirectory) {
          // Save the photo locally inside app directory only on native mobile platforms
          const filename = pickedUri.split('/').pop();
          const localUri = `${documentDirectory}${Date.now()}_${filename}`;
          
          await copyAsync({
            from: pickedUri,
            to: localUri,
          });

          setFieldValue('imageUri', localUri);
        } else {
          // On Web, use the picked URI (typically a blob: URI) directly
          setFieldValue('imageUri', pickedUri);
        }
      }
    } catch (error) {
      console.error('Error selecting profile image:', error);
      alert('An error occurred while picking the image.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardContainer}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <Formik
          initialValues={initialValues}
          validationSchema={studentValidationSchema}
          onSubmit={onSubmit}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
            isValid,
          }) => (
            <View style={styles.formContainer}>
              {/* Profile Image Picker Container */}
              <View style={styles.imagePickerContainer}>
                <TouchableOpacity
                  style={styles.avatarTouchable}
                  onPress={() => handlePickImage(setFieldValue)}
                  activeOpacity={0.8}
                >
                  {values.imageUri ? (
                    <Image source={{ uri: values.imageUri }} style={styles.avatar} />
                  ) : (
                    <View style={styles.avatarPlaceholder}>
                      <Text style={styles.avatarPlaceholderText}>Add Photo</Text>
                    </View>
                  )}
                  <View style={styles.editIconContainer}>
                    <Text style={styles.editIconText}>📷</Text>
                  </View>
                </TouchableOpacity>
                {errors.imageUri && touched.imageUri && (
                  <Text style={styles.errorText}>{errors.imageUri}</Text>
                )}
              </View>

              {/* Input Fields */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={[styles.input, touched.fullName && errors.fullName ? styles.inputError : null]}
                  placeholder="e.g. John Doe"
                  placeholderTextColor="#9CA3AF"
                  onChangeText={handleChange('fullName')}
                  onBlur={handleBlur('fullName')}
                  value={values.fullName}
                />
                {touched.fullName && errors.fullName && (
                  <Text style={styles.errorText}>{errors.fullName}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={[styles.input, touched.email && errors.email ? styles.inputError : null]}
                  placeholder="e.g. john.doe@example.com"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                />
                {touched.email && errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={[styles.input, touched.phone && errors.phone ? styles.inputError : null]}
                  placeholder="e.g. +1 555-0199"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                  onChangeText={handleChange('phone')}
                  onBlur={handleBlur('phone')}
                  value={values.phone}
                />
                {touched.phone && errors.phone && (
                  <Text style={styles.errorText}>{errors.phone}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Home Address</Text>
                <TextInput
                  style={[styles.input, touched.address && errors.address ? styles.inputError : null]}
                  placeholder="e.g. 123 Main St, New York"
                  placeholderTextColor="#9CA3AF"
                  onChangeText={handleChange('address')}
                  onBlur={handleBlur('address')}
                  value={values.address}
                />
                {touched.address && errors.address && (
                  <Text style={styles.errorText}>{errors.address}</Text>
                )}
              </View>

              {/* Faculty Selector */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Faculty</Text>
                <View style={styles.selectorRow}>
                  {FACULTIES.map((fac) => (
                    <TouchableOpacity
                      key={fac}
                      style={[
                        styles.selectorItem,
                        values.faculty === fac ? styles.selectorItemActive : null,
                      ]}
                      onPress={() => setFieldValue('faculty', fac)}
                    >
                      <Text
                        style={[
                          styles.selectorItemText,
                          values.faculty === fac ? styles.selectorItemTextActive : null,
                        ]}
                      >
                        {fac}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {touched.faculty && errors.faculty && (
                  <Text style={styles.errorText}>{errors.faculty}</Text>
                )}
              </View>

              {/* Semester Selector */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Semester</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                  <View style={styles.horizontalSelectorRow}>
                    {SEMESTERS.map((sem) => (
                      <TouchableOpacity
                        key={sem}
                        style={[
                          styles.semesterItem,
                          values.semester === sem ? styles.semesterActive : null,
                        ]}
                        onPress={() => setFieldValue('semester', sem)}
                      >
                        <Text
                          style={[
                            styles.semesterText,
                            values.semester === sem ? styles.semesterTextActive : null,
                          ]}
                        >
                          {sem}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
                {touched.semester && errors.semester && (
                  <Text style={styles.errorText}>{errors.semester}</Text>
                )}
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.submitButton, !isValid ? styles.submitButtonDisabled : null]}
                onPress={() => handleSubmit()}
                activeOpacity={0.8}
              >
                <Text style={styles.submitButtonText}>{submitButtonText}</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 40,
  },
  imagePickerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarTouchable: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
  },
  avatarPlaceholderText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    textAlign: 'center',
  },
  editIconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#4F46E5',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  editIconText: {
    fontSize: 14,
    color: '#ffffff',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 6,
    fontWeight: '500',
  },
  selectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectorItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  selectorItemActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#818CF8',
  },
  selectorItemText: {
    fontSize: 13,
    color: '#4B5563',
  },
  selectorItemTextActive: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  horizontalScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  horizontalSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 4,
  },
  semesterItem: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  semesterActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#818CF8',
  },
  semesterText: {
    fontSize: 13,
    color: '#4B5563',
  },
  semesterTextActive: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
