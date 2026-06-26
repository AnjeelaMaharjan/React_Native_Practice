import { copyAsync, documentDirectory } from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Yup from 'yup';

// Helper: converts a display name like "Computer Science" -> "computerScience"
export const getFacultyKey = (fac: string): string => {
  const words = fac.split(' ');
  return words[0].toLowerCase() + words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
};

// Helper: converts a display name like "Semester 1" -> "semester1"
export const getSemesterKey = (sem: string): string => {
  return sem.charAt(0).toLowerCase() + sem.slice(1).replace(/\s+/g, '');
};

// Dynamic Yup validation schema driven by i18n translations
export const getValidationSchema = (t: (key: string, fallback: string) => string) =>
  Yup.object().shape({
    fullName: Yup.string()
      .min(3, t('validation.nameMin', 'Name must be at least 3 characters'))
      .required(t('validation.nameRequired', 'Full Name is required')),
    email: Yup.string()
      .email(t('validation.emailInvalid', 'Please enter a valid email address'))
      .required(t('validation.emailRequired', 'Email is required')),
    phone: Yup.string()
      .matches(/^[0-9\-+\s]{8,15}$/, t('validation.phoneInvalid', 'Invalid phone number format'))
      .required(t('validation.phoneRequired', 'Phone number is required')),
    address: Yup.string().required(t('validation.addressRequired', 'Address is required')),
    faculty: Yup.string().required(t('validation.facultyRequired', 'Faculty is required')),
    semester: Yup.string().required(t('validation.semesterRequired', 'Semester is required')),
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

// Stored values remain English (DB consistency). UI display is translated via keys.
const FACULTIES = [
  'Computer Science',
  'Information Technology',
  'Software Engineering',
  'Business Administration',
  'Civil Engineering',
];
const SEMESTERS = [
  'Semester 1',
  'Semester 2',
  'Semester 3',
  'Semester 4',
  'Semester 5',
  'Semester 6',
  'Semester 7',
  'Semester 8',
];

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
  const { t } = useTranslation();

  const handlePickImage = async (setFieldValue: (field: string, value: any) => void) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          t('common.error', 'Error'),
          t('form.photoPermission', 'Permission to access photos is required to add a profile image.')
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
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
          await copyAsync({ from: pickedUri, to: localUri });
          setFieldValue('imageUri', localUri);
        } else {
          // On Web, use the picked URI (typically a blob: URI) directly
          setFieldValue('imageUri', pickedUri);
        }
      }
    } catch (error) {
      console.error('Error selecting profile image:', error);
      Alert.alert(
        t('common.error', 'Error'),
        t('form.photoError', 'An error occurred while picking the image.')
      );
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
          validationSchema={getValidationSchema(t as any)}
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
              {/* Profile Image Picker */}
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
                      <Text style={styles.avatarPlaceholderText}>
                        {t('form.addPhoto', 'Add Photo')}
                      </Text>
                    </View>
                  )}
                  <View style={styles.editIconContainer}>
                    <Text style={styles.editIconText}>✎</Text>
                  </View>
                </TouchableOpacity>
                {errors.imageUri && touched.imageUri && (
                  <Text style={styles.errorText}>{errors.imageUri}</Text>
                )}
              </View>

              {/* Full Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('form.fullName', 'Full Name')}</Text>
                <TextInput
                  style={[styles.input, touched.fullName && errors.fullName ? styles.inputError : null]}
                  placeholder={t('form.fullNamePlaceholder', 'e.g. John Doe')}
                  placeholderTextColor="#9CA3AF"
                  onChangeText={handleChange('fullName')}
                  onBlur={handleBlur('fullName')}
                  value={values.fullName}
                />
                {touched.fullName && errors.fullName && (
                  <Text style={styles.errorText}>{errors.fullName}</Text>
                )}
              </View>

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('form.email', 'Email Address')}</Text>
                <TextInput
                  style={[styles.input, touched.email && errors.email ? styles.inputError : null]}
                  placeholder={t('form.emailPlaceholder', 'e.g. john.doe@example.com')}
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

              {/* Phone */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('form.phone', 'Phone Number')}</Text>
                <TextInput
                  style={[styles.input, touched.phone && errors.phone ? styles.inputError : null]}
                  placeholder={t('form.phonePlaceholder', 'e.g. +977 9800000000')}
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

              {/* Address */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('form.address', 'Home Address')}</Text>
                <TextInput
                  style={[styles.input, touched.address && errors.address ? styles.inputError : null]}
                  placeholder={t('form.addressPlaceholder', 'e.g. Kathmandu, Nepal')}
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
                <Text style={styles.label}>{t('form.faculty', 'Faculty')}</Text>
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
                        {t(`faculties.${getFacultyKey(fac)}`, fac)}
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
                <Text style={styles.label}>{t('form.semester', 'Semester')}</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.horizontalScroll}
                >
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
                          {t(`semesters.${getSemesterKey(sem)}`, sem)}
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
    backgroundColor: '#ee8b2f',
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
    borderColor: '#fac18b',
  },
  selectorItemText: {
    fontSize: 13,
    color: '#4B5563',
  },
  selectorItemTextActive: {
    color: '#ee8b2f',
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
    borderColor: '#fac18b',
  },
  semesterText: {
    fontSize: 13,
    color: '#4B5563',
  },
  semesterTextActive: {
    color: '#ee8b2f',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#ee8b2f',
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
