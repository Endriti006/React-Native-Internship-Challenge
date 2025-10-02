import { useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserById, deleteUser } from '../store/store';

export default function UserDetailsScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useLocalSearchParams();
  const userId = Array.isArray(params.id) ? params.id[0] : params.id;
  const user = useSelector(state => selectUserById(state, userId));

  const addressText = useMemo(() => {
    if (!user) {
      return '';
    }
    const { street, suite, city, zipcode } = user.address || {};
    return [street, suite, city].filter(Boolean).join(', ').concat(zipcode ? ` · ${zipcode}` : '');
  }, [user]);

  const handleDelete = () => {
    Alert.alert('Delete user', 'Are you sure you want to remove this teammate?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          dispatch(deleteUser(userId));
          router.back();
        }
      }
    ]);
  };

  if (!user) {
    return (
      <LinearGradient colors={['#F7F8FA', '#FFFFFF']} style={styles.emptyContainer}>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>User not found</Text>
          <TouchableOpacity style={styles.emptyButton} onPress={() => router.replace('/') }>
            <Text style={styles.emptyButtonLabel}>Back to directory</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#FFFFFF', '#F7F8FA']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#4C6EF5', '#9B5CF6']} start={[0, 0]} end={[1, 1]} style={styles.heroCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeLabel}>{user.name.charAt(0)}</Text>
          </View>
          <Text style={styles.heroName}>{user.name}</Text>
          <Text style={styles.heroSubtitle}>{user.company?.name}</Text>
        </LinearGradient>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Email</Text>
            <Text style={styles.detailValue}>{user.email}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phone</Text>
            <Text style={styles.detailValue}>{user.phone || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Website</Text>
            <Text style={styles.detailValue}>{user.website || 'N/A'}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailValue}>{addressText || 'No address provided'}</Text>
          </View>
        </View>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            activeOpacity={0.9}
            onPress={() => router.push({ pathname: '/user/manage', params: { mode: 'edit', id: userId } })}
          >
            <Text style={styles.actionLabelPrimary}>Edit details</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.dangerButton]} activeOpacity={0.9} onPress={handleDelete}>
            <Text style={styles.actionLabelDanger}>Delete user</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 48
  },
  heroCard: {
    borderRadius: 32,
    paddingVertical: 36,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#1B3A8A',
    shadowOpacity: 0.25,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 16 }
  },
  avatarLarge: {
    height: 88,
    width: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  avatarLargeLabel: {
    fontSize: 40,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  heroName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  heroSubtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#0B0C1E',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 }
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0B0C1E',
    marginBottom: 16
  },
  detailRow: {
    marginBottom: 12
  },
  detailLabel: {
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: '#5A6073',
    marginBottom: 6
  },
  detailValue: {
    fontSize: 16,
    color: '#0B0C1E',
    lineHeight: 22
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center'
  },
  primaryButton: {
    backgroundColor: '#4C6EF5'
  },
  dangerButton: {
    backgroundColor: '#E03131'
  },
  actionLabelPrimary: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  },
  actionLabelDanger: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingVertical: 48,
    borderRadius: 24,
    alignItems: 'center',
    gap: 16,
    shadowColor: '#0B0C1E',
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 }
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0B0C1E'
  },
  emptyButton: {
    backgroundColor: '#4C6EF5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16
  },
  emptyButtonLabel: {
    color: '#FFFFFF',
    fontWeight: '600'
  }
});
