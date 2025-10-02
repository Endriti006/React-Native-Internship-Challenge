import { Ionicons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { addUser, selectUserById, updateUser } from '../store/store';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  phone: yup.string().optional(),
  website: yup.string().optional(),
  company: yup.string().optional(),
  street: yup.string().optional(),
  suite: yup.string().optional(),
  city: yup.string().optional(),
  zipcode: yup.string().optional()
});

const fields = [
  { name: 'name', label: 'Full name', placeholder: 'Jane Doe' },
  { name: 'email', label: 'Email', placeholder: 'jane.doe@company.com', keyboardType: 'email-address' },
  { name: 'phone', label: 'Phone', placeholder: '+1 555-0100' },
  { name: 'company', label: 'Company', placeholder: 'Acme Inc.' },
  { name: 'website', label: 'Website', placeholder: 'janedoe.dev', autoCapitalize: 'none' },
  { name: 'street', label: 'Street', placeholder: '123 Market Street' },
  { name: 'suite', label: 'Apartment / Suite', placeholder: 'Suite 200' },
  { name: 'city', label: 'City', placeholder: 'San Francisco' },
  { name: 'zipcode', label: 'Postal code', placeholder: '94105' }
];

export default function ManageUserScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const mode = Array.isArray(params.mode) ? params.mode[0] : params.mode;
  const userId = Array.isArray(params.id) ? params.id[0] : params.id;
  const dispatch = useDispatch();
  const user = useSelector(state => selectUserById(state, userId));

  const defaultValues = useMemo(() => {
    if (mode === 'edit' && user) {
      return {
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        website: user.website || '',
        company: user.company?.name || '',
        street: user.address?.street || '',
        suite: user.address?.suite || '',
        city: user.address?.city || '',
        zipcode: user.address?.zipcode || ''
      };
    }
    return {
      name: '',
      email: '',
      phone: '',
      website: '',
      company: '',
      street: '',
      suite: '',
      city: '',
      zipcode: ''
    };
  }, [mode, user]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues
  });

  if (mode === 'edit' && !user) {
    return (
      <View style={styles.missingContainer}>
        <View style={styles.missingCard}>
          <Ionicons name="alert-circle-outline" size={48} color="#6B7280" />
          <Text style={styles.missingTitle}>User not available</Text>
          <TouchableOpacity style={styles.missingButton} onPress={() => router.replace('/') }>
            <Text style={styles.missingButtonLabel}>Back to directory</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const onSubmit = values => {
    const payload = {
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      website: values.website.trim(),
      company: { name: values.company.trim() },
      address: {
        street: values.street.trim(),
        suite: values.suite.trim(),
        city: values.city.trim(),
        zipcode: values.zipcode.trim()
      }
    };

    if (mode === 'edit' && user) {
      dispatch(updateUser({ id: userId, ...payload }));
      router.replace(`/user/${userId}`);
      return;
    }

    const action = dispatch(addUser(payload));
    const createdId = action.payload.id;
    router.replace(`/user/${createdId}`);
  };

  const title = mode === 'edit' ? 'Update teammate' : 'Add new teammate';
  const ctaLabel = mode === 'edit' ? 'Save changes' : 'Create profile';

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>Fill in the details below</Text>
          
          <View style={styles.formCard}>
            {fields.map(field => (
              <View key={field.name} style={styles.fieldBlock}>
                <Text style={styles.fieldLabel}>{field.label}</Text>
                <Controller
                  control={control}
                  name={field.name}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder={field.placeholder}
                      placeholderTextColor="#9CA3AF"
                      style={[styles.input, errors[field.name] ? styles.inputError : null]}
                      keyboardType={field.keyboardType || 'default'}
                      autoCapitalize={field.autoCapitalize || 'sentences'}
                    />
                  )}
                />
                {errors[field.name] ? <Text style={styles.errorText}>{errors[field.name].message}</Text> : null}
              </View>
            ))}
            
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.submitButton, isSubmitting ? styles.submitButtonDisabled : null]}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              <Text style={styles.submitLabel}>{ctaLabel}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity activeOpacity={0.8} style={styles.cancelButton} onPress={() => router.back()}>
              <Text style={styles.cancelLabel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  },
  flex: {
    flex: 1
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 48
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 8
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827'
  },
  closeButton: {
    padding: 8
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 24
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    gap: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  fieldBlock: {
    gap: 8
  },
  fieldLabel: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600'
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#111827',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  inputError: {
    borderColor: '#DC2626'
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13
  },
  submitButton: {
    marginTop: 12,
    backgroundColor: '#4F46E5',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center'
  },
  submitButtonDisabled: {
    opacity: 0.6
  },
  submitLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  },
  cancelButton: {
    marginTop: 8,
    alignItems: 'center',
    paddingVertical: 12
  },
  cancelLabel: {
    color: '#6B7280',
    fontSize: 15,
    fontWeight: '600'
  },
  missingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    padding: 24
  },
  missingCard: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingVertical: 48,
    borderRadius: 16,
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  missingTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '600'
  },
  missingButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8
  },
  missingButtonLabel: {
    color: '#FFFFFF',
    fontWeight: '600'
  }
});
