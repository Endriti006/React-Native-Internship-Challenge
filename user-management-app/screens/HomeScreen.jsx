import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, selectFilteredUsers, selectUsersState, setSearch } from '../store/store';

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { status, error, search } = useSelector(selectUsersState);
  const users = useSelector(selectFilteredUsers);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers());
    }
  }, [status, dispatch]);

  const handleSearch = value => {
    dispatch(setSearch(value));
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={() => router.push(`/user/${item.id}`)}>
        <View style={styles.avatar}>
          <Text style={styles.avatarLabel}>{item.name.charAt(0)}</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardSubtitle}>{item.email}</Text>
          <Text style={styles.cardMeta}>{item.company?.name}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
      </TouchableOpacity>
    );
  };

  const listHeader = (
    <View style={styles.headerSection}>
      <Text style={styles.heading}>Team Directory</Text>
      <Text style={styles.subheading}>Manage your team members</Text>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
        <TextInput
          value={search}
          onChangeText={handleSearch}
          placeholder="Search by name or email"
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
        />
      </View>
    </View>
  );

  const listEmpty = (
    <View style={styles.emptyState}>
      <Ionicons name="people-outline" size={64} color="#D1D5DB" />
      <Text style={styles.emptyTitle}>No teammates yet</Text>
      <Text style={styles.emptySubtitle}>Add a new teammate to get started</Text>
    </View>
  );

  return (
    <View style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
        <FlatList
          data={users}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={status === 'succeeded' ? listEmpty : null}
          ListFooterComponent={status === 'loading' ? <ActivityIndicator size="large" color="#4F46E5" style={styles.loader} /> : null}
          refreshing={status === 'loading'}
          onRefresh={() => dispatch(fetchUsers())}
          showsVerticalScrollIndicator={false}
        />
        
        {error ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => dispatch(fetchUsers())}>
              <Text style={styles.retryLabel}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.fab}
          onPress={() => router.push({ pathname: '/user/manage', params: { mode: 'add' } })}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  },
  safeArea: {
    flex: 1
  },
  listContent: {
    padding: 16,
    paddingBottom: 20
  },
  headerSection: {
    marginBottom: 24,
    paddingTop: 8
  },
  heading: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
    marginTop: 30
  },
  subheading: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  searchIcon: {
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    color: '#111827',
    fontSize: 16
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  avatar: {
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  avatarLabel: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600'
  },
  cardContent: {
    flex: 1
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2
  },
  cardMeta: {
    fontSize: 13,
    color: '#9CA3AF'
  },
  emptyState: {
    marginTop: 80,
    alignItems: 'center',
    paddingHorizontal: 32
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center'
  },
  loader: {
    marginTop: 24
  },
  errorBanner: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 96,
    backgroundColor: '#FEE2E2',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#FCA5A5'
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    flex: 1,
    marginRight: 12,
    fontWeight: '500'
  },
  retryButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8
  },
  retryLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 16,
    height: 56,
    width: 56,
    borderRadius: 28,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4
  }
});
