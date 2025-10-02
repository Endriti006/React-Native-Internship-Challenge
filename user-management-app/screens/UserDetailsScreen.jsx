import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, selectUserById } from '../store/store';

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

  const handleEmail = () => {
    if (user?.email) {
      Linking.openURL(`mailto:${user.email}`);
    }
  };

  const handlePhone = () => {
    if (user?.phone) {
      Linking.openURL(`tel:${user.phone}`);
    }
  };

  const handleWebsite = () => {
    if (user?.website) {
      const url = user.website.startsWith('http') ? user.website : `https://${user.website}`;
      Linking.openURL(url);
    }
  };

  if (!user) {
    return (
      <LinearGradient colors={['#F7F8FA', '#FFFFFF']} style={styles.emptyContainer}>
        <View style={styles.emptyCard}>
          <View style={styles.emptyIcon}>
            <Ionicons name="person-outline" size={40} color="#9CA3AF" />
          </View>
          <Text style={styles.emptyTitle}>User not found</Text>
          <Text style={styles.emptySubtitle}>This user may have been removed or doesn't exist</Text>
          <TouchableOpacity style={styles.emptyButton} onPress={() => router.replace('/')}>
            <LinearGradient colors={['#4C6EF5', '#9B5CF6']} start={[0, 0]} end={[1, 1]} style={styles.emptyButtonGradient}>
              <Text style={styles.emptyButtonLabel}>Back to directory</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#F8F9FE', '#FFFFFF']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} activeOpacity={0.7} onPress={() => router.replace('/')}>
          <LinearGradient colors={['#4C6EF5', '#9B5CF6']} start={[0, 0]} end={[1, 1]} style={styles.backButtonInner}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Profile Details</Text>
          <View style={styles.headerDivider} />
        </View>
        <TouchableOpacity
          style={styles.editIconButton}
          activeOpacity={0.7}
          onPress={() => router.push({ pathname: '/user/manage', params: { mode: 'edit', id: userId } })}
        >
          <Ionicons name="create-outline" size={22} color="#4C6EF5" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
   
        <View style={styles.heroWrapper}>
          <LinearGradient colors={['#4C6EF5', '#7C3AED', '#9B5CF6']} start={[0, 0]} end={[1, 1]} style={styles.heroCard}>
            <View style={styles.heroPattern}>
              <View style={[styles.patternCircle, styles.patternCircle1]} />
              <View style={[styles.patternCircle, styles.patternCircle2]} />
              <View style={[styles.patternCircle, styles.patternCircle3]} />
            </View>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                style={styles.avatarRing}
              >
                <View style={styles.avatarLarge}>
                  <Text style={styles.avatarLargeLabel}>{user.name.charAt(0)}</Text>
                </View>
              </LinearGradient>
            </View>
            <Text style={styles.heroName}>{user.name}</Text>
            {user.company?.name && (
              <View style={styles.companyBadge}>
                <Ionicons name="business" size={16} color="#FFFFFF" style={styles.companyIcon} />
                <Text style={styles.companyBadgeText}>{user.company.name}</Text>
              </View>
            )}
          </LinearGradient>
        </View>


        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="call-outline" size={24} color="#4C6EF5" style={styles.sectionIconElement} />
            <Text style={styles.sectionTitle}>Contact Information</Text>
          </View>

          <TouchableOpacity style={styles.contactRow} activeOpacity={0.7} onPress={handleEmail}>
            <View style={styles.contactIconContainer}>
              <LinearGradient colors={['#4C6EF5', '#9B5CF6']} start={[0, 0]} end={[1, 1]} style={styles.contactIcon}>
                <Ionicons name="mail" size={22} color="#FFFFFF" />
              </LinearGradient>
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactLabel}>Email Address</Text>
              <Text style={styles.contactValue}>{user.email}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#D1D5DB" />
          </TouchableOpacity>

          {user.phone && (
            <TouchableOpacity style={styles.contactRow} activeOpacity={0.7} onPress={handlePhone}>
              <View style={styles.contactIconContainer}>
                <LinearGradient colors={['#10B981', '#059669']} start={[0, 0]} end={[1, 1]} style={styles.contactIcon}>
                  <Ionicons name="call" size={22} color="#FFFFFF" />
                </LinearGradient>
              </View>
              <View style={styles.contactContent}>
                <Text style={styles.contactLabel}>Phone Number</Text>
                <Text style={styles.contactValue}>{user.phone}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#D1D5DB" />
            </TouchableOpacity>
          )}

          {user.website && (
            <TouchableOpacity style={styles.contactRow} activeOpacity={0.7} onPress={handleWebsite}>
              <View style={styles.contactIconContainer}>
                <LinearGradient colors={['#F59E0B', '#D97706']} start={[0, 0]} end={[1, 1]} style={styles.contactIcon}>
                  <Ionicons name="globe" size={22} color="#FFFFFF" />
                </LinearGradient>
              </View>
              <View style={styles.contactContent}>
                <Text style={styles.contactLabel}>Website</Text>
                <Text style={styles.contactValue}>{user.website}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#D1D5DB" />
            </TouchableOpacity>
          )}
        </View>


        {addressText && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="location-outline" size={24} color="#EC4899" style={styles.sectionIconElement} />
              <Text style={styles.sectionTitle}>Location</Text>
            </View>
            <View style={styles.addressCard}>
              <View style={styles.addressIconContainer}>
                <LinearGradient colors={['#EC4899', '#DB2777']} start={[0, 0]} end={[1, 1]} style={styles.addressIconCircle}>
                  <Ionicons name="location" size={24} color="#FFFFFF" />
                </LinearGradient>
              </View>
              <Text style={styles.addressText}>{addressText}</Text>
            </View>
          </View>
        )}


        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.actionButtonPrimary}
            activeOpacity={0.85}
            onPress={() => router.push({ pathname: '/user/manage', params: { mode: 'edit', id: userId } })}
          >
            <LinearGradient colors={['#4C6EF5', '#9B5CF6']} start={[0, 0]} end={[1, 1]} style={styles.actionButtonGradient}>
              <Ionicons name="create-outline" size={20} color="#FFFFFF" />
              <Text style={styles.actionLabelPrimary}>Edit Profile</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButtonDanger}
            activeOpacity={0.85}
            onPress={handleDelete}
          >
            <View style={styles.actionButtonDangerInner}>
              <Ionicons name="trash-outline" size={20} color="#DC2626" />
              <Text style={styles.actionLabelDanger}>Delete User</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.footerSpace} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 20,
    backgroundColor: 'transparent'
  },
  backButton: {
    height: 44,
    width: 44,
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#4C6EF5',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5
  },
  backButtonInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: 0.3
  },
  headerDivider: {
    width: 40,
    height: 3,
    backgroundColor: '#4C6EF5',
    borderRadius: 2,
    marginTop: 4
  },
  editIconButton: {
    height: 44,
    width: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center'
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32
  },
  heroWrapper: {
    marginBottom: 24
  },
  heroCard: {
    borderRadius: 28,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#4C6EF5',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
    overflow: 'hidden'
  },
  heroPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  patternCircle: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 999
  },
  patternCircle1: {
    width: 200,
    height: 200,
    top: -80,
    right: -60
  },
  patternCircle2: {
    width: 150,
    height: 150,
    bottom: -40,
    left: -50
  },
  patternCircle3: {
    width: 100,
    height: 100,
    top: 100,
    left: 20
  },
  avatarContainer: {
    marginBottom: 20,
    zIndex: 1
  },
  avatarRing: {
    padding: 6,
    borderRadius: 60,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 }
  },
  avatarLarge: {
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)'
  },
  avatarLargeLabel: {
    fontSize: 44,
    fontWeight: '800',
    color: '#4C6EF5'
  },
  heroName: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.5,
    zIndex: 1
  },
  companyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    zIndex: 1,
    gap: 8
  },
  companyIcon: {
    marginRight: 0
  },
  companyBadgeText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF'
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#0B0C1E',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  sectionIconElement: {
    marginRight: 12
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: 0.3
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6'
  },
  contactIconContainer: {
    marginRight: 16
  },
  contactIcon: {
    height: 48,
    width: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  contactContent: {
    flex: 1
  },
  contactLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4
  },
  contactValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    letterSpacing: 0.2
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6'
  },
  addressIconContainer: {
    marginRight: 16
  },
  addressIconCircle: {
    height: 48,
    width: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  addressText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: '#374151',
    fontWeight: '500'
  },
  actionsSection: {
    gap: 14,
    marginTop: 8
  },
  actionButtonPrimary: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#4C6EF5',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10
  },
  actionLabelPrimary: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3
  },
  actionButtonDanger: {
    borderRadius: 20,
    backgroundColor: '#FEE2E2',
    borderWidth: 2,
    borderColor: '#FCA5A5',
    overflow: 'hidden'
  },
  actionButtonDangerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10
  },
  actionLabelDanger: {
    color: '#DC2626',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3
  },
  footerSpace: {
    height: 20
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingVertical: 48,
    borderRadius: 28,
    alignItems: 'center',
    gap: 16,
    shadowColor: '#0B0C1E',
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    maxWidth: 400,
    width: '100%'
  },
  emptyIcon: {
    backgroundColor: '#F3F4F6',
    height: 80,
    width: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937'
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22
  },
  emptyButton: {
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#4C6EF5',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 }
  },
  emptyButtonGradient: {
    paddingHorizontal: 28,
    paddingVertical: 14
  },
  emptyButtonLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16
  }
});
