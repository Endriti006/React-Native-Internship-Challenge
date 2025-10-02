import { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { addUser, updateUser, selectUserById } from '../store/store';

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
      <LinearGradient colors={['#1B3A8A', '#4C6EF5']} style={styles.missingContainer}>
        <View style={styles.missingCard}>
          <Text style={styles.missingTitle}>User not available</Text>
          <TouchableOpacity style={styles.missingButton} onPress={() => router.replace('/') }>
            <Text style={styles.missingButtonLabel}>Back to directory</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
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
    <LinearGradient colors={['#1B3A8A', '#4C6EF5']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>Craft a complete profile so your team always has the latest details.</Text>
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
                      placeholderTextColor="rgba(255,255,255,0.5)"
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
              activeOpacity={0.9}
              style={[styles.submitButton, isSubmitting ? styles.submitButtonDisabled : null]}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              <Text style={styles.submitLabel}>{ctaLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.9} style={styles.cancelButton} onPress={() => router.back()}>
              <Text style={styles.cancelLabel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  flex: {
    flex: 1
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 48
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 24,
    marginBottom: 24
  },
  formCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 28,
    padding: 24,
    gap: 18,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 }
  },
  fieldBlock: {
    gap: 10
  },
  fieldLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 15,
    fontWeight: '600'
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#FFFFFF',
    fontSize: 16
  },
  inputError: {
    borderWidth: 1,
    borderColor: 'rgba(224,49,49,0.7)'
  },
  errorText: {
    color: '#FFB4AB',
    fontSize: 13
  },
  submitButton: {
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center'
  },
  submitButtonDisabled: {
    opacity: 0.6
  },
  submitLabel: {
    color: '#4C6EF5',
    fontSize: 17,
    fontWeight: '700'
  },
  cancelButton: {
    marginTop: 8,
    alignItems: 'center'
  },
  cancelLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  },
  missingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  missingCard: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 32,
    paddingVertical: 48,
    borderRadius: 24,
    alignItems: 'center',
    gap: 16
  },
  missingTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600'
  },
  missingButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 18
  },
  missingButtonLabel: {
    color: '#4C6EF5',
    fontWeight: '600'
  }
});
