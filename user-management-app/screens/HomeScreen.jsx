import { useEffect } from 'react';
import { FlatList, TouchableOpacity, View, Text, StyleSheet, TextInput, ActivityIndicator, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
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
      <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={() => router.push(`/user/${item.id}`)}>
        <LinearGradient colors={['#4C6EF5', '#9B5CF6']} start={[0, 0]} end={[1, 1]} style={styles.avatar}>
          <Text style={styles.avatarLabel}>{item.name.charAt(0)}</Text>
        </LinearGradient>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardSubtitle}>{item.email}</Text>
          <Text style={styles.cardMeta}>{item.company?.name}</Text>
        </View>
        <LinearGradient colors={['#9B5CF6', '#4C6EF5']} start={[0, 0]} end={[1, 1]} style={styles.chevron}>
          <Text style={styles.chevronLabel}>›</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const listHeader = (
    <View style={styles.headerSection}>
      <Text style={styles.heading}>Team Directory</Text>
      <Text style={styles.subheading}>Discover teammates, explore full details, and keep your roster up to date.</Text>
      <View style={styles.searchContainer}>
        <TextInput
          value={search}
          onChangeText={handleSearch}
          placeholder="Search by name or email"
          placeholderTextColor="rgba(255,255,255,0.6)"
          style={styles.searchInput}
        />
      </View>
    </View>
  );

  const listEmpty = (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>No teammates yet</Text>
      <Text style={styles.emptySubtitle}>Add a new teammate to see them appear here instantly.</Text>
    </View>
  );

  return (
    <LinearGradient colors={['#F7F8FA', '#FFFFFF']} style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topGradient}>
          <LinearGradient colors={['#1B3A8A', '#4C6EF5']} start={[0, 0]} end={[1, 1]} style={styles.gradientOverlay}>
            <FlatList
              data={users}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
              ListHeaderComponent={listHeader}
              ListEmptyComponent={status === 'succeeded' ? listEmpty : null}
              ListFooterComponent={status === 'loading' ? <ActivityIndicator size="large" color="#FFFFFF" style={styles.loader} /> : null}
              refreshing={status === 'loading'}
              onRefresh={() => dispatch(fetchUsers())}
              showsVerticalScrollIndicator={false}
            />
          </LinearGradient>
        </View>
        {error ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => dispatch(fetchUsers())}>
              <Text style={styles.retryLabel}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        <TouchableOpacity style={styles.fab} activeOpacity={0.9} onPress={() => router.push({ pathname: '/user/manage', params: { mode: 'create' } })}>
          <LinearGradient colors={['#9B5CF6', '#4C6EF5']} start={[0, 0]} end={[1, 1]} style={styles.fabInner}>
            <Text style={styles.fabLabel}>+</Text>
          </LinearGradient>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1
  },
  safeArea: {
    flex: 1
  },
  topGradient: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden'
  },
  gradientOverlay: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 120
  },
  listContent: {
    paddingBottom: 32
  },
  headerSection: {
    gap: 12,
    marginBottom: 24
  },
  heading: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  subheading: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 24
  },
  searchContainer: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14
  },
  searchInput: {
    color: '#FFFFFF',
    fontSize: 16
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    gap: 16
  },
  avatar: {
    height: 56,
    width: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarLabel: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700'
  },
  cardContent: {
    flex: 1
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF'
  },
  cardSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4
  },
  cardMeta: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4
  },
  chevron: {
    height: 32,
    width: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  chevronLabel: {
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 24
  },
  emptyState: {
    marginTop: 64,
    alignItems: 'center',
    gap: 8
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF'
  },
  emptySubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 22
  },
  loader: {
    marginTop: 24
  },
  errorBanner: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 96,
    backgroundColor: 'rgba(224,49,49,0.95)',
    padding: 16,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 14,
    flex: 1,
    marginRight: 12
  },
  retryButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16
  },
  retryLabel: {
    color: '#E03131',
    fontWeight: '600'
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    height: 64,
    width: 64,
    borderRadius: 32,
    elevation: 6,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 }
  },
  fabInner: {
    flex: 1,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
  fabLabel: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    marginTop: -4
  }
});
