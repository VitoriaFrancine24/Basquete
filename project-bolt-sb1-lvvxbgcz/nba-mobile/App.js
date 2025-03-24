import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';

const Stack = createNativeStackNavigator();

// Componente Home
function HomeScreen({ navigation }) {
  const [data, setData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch('http://192.168.10.143:8000/static/data.json');
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const searchPlayers = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`http://192.168.10.143:8000/search_player?query=${encodeURIComponent(query)}`);
      const results = await response.json();
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching players:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  }, []);

  if (!data) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1d4ed8" />
        <Text style={styles.loadingText}>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar jogador..."
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            searchPlayers(text);
          }}
        />
      </View>

      {searchResults.length > 0 && (
        <View style={styles.searchResults}>
          <ScrollView>
            {searchResults.map((player) => (
              <TouchableOpacity
                key={player.id}
                style={styles.searchResultItem}
                onPress={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                  navigation.navigate('PlayerDetails', { player });
                }}
              >
                <Image
                  source={{ uri: player.image }}
                  style={styles.searchResultImage}
                  defaultSource={require('./assets/player-fallback.png')}
                />
                <View>
                  <Text style={styles.searchResultName}>{player.name}</Text>
                  <Text style={styles.searchResultTeam}>{player.team} - {player.position}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Principais Jogadores</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {data.players.slice(0, 8).map((player) => (
              <TouchableOpacity
                key={player.id}
                style={styles.playerCard}
                onPress={() => navigation.navigate('PlayerDetails', { player })}
              >
                <Image
                  source={{ uri: player.image }}
                  style={styles.playerImage}
                  defaultSource={require('./assets/player-fallback.png')}
                />
                <Text style={styles.playerName}>{player.name}</Text>
                <Text style={styles.playerTeam}>{player.team}</Text>
                <View style={styles.statsContainer}>
                  <Text style={styles.statText}>PPG: {player.stats.points}</Text>
                  <Text style={styles.statText}>RPG: {player.stats.rebounds}</Text>
                  <Text style={styles.statText}>APG: {player.stats.assists}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Próximos Jogos</Text>
          {data.games.map((game) => (
            <View key={game.gameId} style={styles.gameCard}>
              <View style={styles.gameHeader}>
                <Text style={styles.gameDate}>
                  {new Date(game.date).toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </View>
              <View style={styles.gameContent}>
                <View style={styles.teamContainer}>
                  <Image source={{ uri: game.home_team.logo }} style={styles.teamLogo} />
                  <Text style={styles.teamName}>{game.home_team.nickname}</Text>
                  <Text style={styles.teamRecord}>{game.home_team.record}</Text>
                </View>
                <View style={styles.gameInfo}>
                  <Text style={styles.vsText}>vs</Text>
                  <Text style={styles.gameTime}>{game.time}</Text>
                </View>
                <View style={styles.teamContainer}>
                  <Image source={{ uri: game.away_team.logo }} style={styles.teamLogo} />
                  <Text style={styles.teamName}>{game.away_team.nickname}</Text>
                  <Text style={styles.teamRecord}>{game.away_team.record}</Text>
                </View>
              </View>
              <View style={styles.gameFooter}>
                <Text style={styles.gameVenue}>{game.arena}</Text>
                {game.broadcast && <Text style={styles.broadcast}>TV: {game.broadcast}</Text>}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Classificação</Text>
          <View style={styles.standingsContainer}>
            <View style={styles.conference}>
              <Text style={styles.conferenceTitle}>Conferência Leste</Text>
              {data.standings.eastern.map((team, index) => (
                <View key={team.id} style={styles.standingRow}>
                  <Text style={styles.standingRank}>{index + 1}</Text>
                  <Image source={{ uri: team.logo }} style={styles.standingTeamLogo} />
                  <Text style={styles.standingTeamName}>{team.nickname}</Text>
                  <Text style={styles.standingRecord}>{team.wins}-{team.losses}</Text>
                  <Text style={styles.standingPct}>{team.win_pct}%</Text>
                </View>
              ))}
            </View>
            <View style={styles.conference}>
              <Text style={styles.conferenceTitle}>Conferência Oeste</Text>
              {data.standings.western.map((team, index) => (
                <View key={team.id} style={styles.standingRow}>
                  <Text style={styles.standingRank}>{index + 1}</Text>
                  <Image source={{ uri: team.logo }} style={styles.standingTeamLogo} />
                  <Text style={styles.standingTeamName}>{team.nickname}</Text>
                  <Text style={styles.standingRecord}>{team.wins}-{team.losses}</Text>
                  <Text style={styles.standingPct}>{team.win_pct}%</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Componente PlayerDetails
function PlayerDetailsScreen({ route }) {
  const { player } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.playerDetailsHeader}>
          <Image
            source={{ uri: player.image }}
            style={styles.playerDetailsImage}
            defaultSource={require('./assets/player-fallback.png')}
          />
          <Text style={styles.playerDetailsName}>{player.name}</Text>
          <Text style={styles.playerDetailsTeam}>{player.team}</Text>
          {player.position && (
            <Text style={styles.playerDetailsPosition}>{player.position}</Text>
          )}
        </View>
        {player.stats && (
          <View style={styles.playerDetailsStats}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{player.stats.points}</Text>
              <Text style={styles.statLabel}>PPG</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{player.stats.rebounds}</Text>
              <Text style={styles.statLabel}>RPG</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{player.stats.assists}</Text>
              <Text style={styles.statLabel}>APG</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{player.stats.steals}</Text>
              <Text style={styles.statLabel}>SPG</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{player.stats.blocks}</Text>
              <Text style={styles.statLabel}>BPG</Text>
            </View>
          </View>
        )}
        {player.stats && (
          <View style={styles.playerDetailsPercentages}>
            <Text style={styles.percentageTitle}>Percentuais</Text>
            <View style={styles.percentageRow}>
              <Text style={styles.percentageLabel}>FG%:</Text>
              <Text style={styles.percentageValue}>{player.stats.fg_pct}%</Text>
            </View>
            <View style={styles.percentageRow}>
              <Text style={styles.percentageLabel}>3P%:</Text>
              <Text style={styles.percentageValue}>{player.stats.three_pct}%</Text>
            </View>
            <View style={styles.percentageRow}>
              <Text style={styles.percentageLabel}>FT%:</Text>
              <Text style={styles.percentageValue}>{player.stats.ft_pct}%</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// App Principal
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'NBA Dashboard',
            headerStyle: {
              backgroundColor: '#1d4ed8',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="PlayerDetails"
          component={PlayerDetailsScreen}
          options={({ route }) => ({
            title: route.params.player.name,
            headerStyle: {
              backgroundColor: '#1d4ed8',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
  },
  searchContainer: {
    padding: 10,
    backgroundColor: '#1f2937',
  },
  searchInput: {
    backgroundColor: '#374151',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  searchResults: {
    position: 'absolute',
    top: 60,
    left: 10,
    right: 10,
    backgroundColor: '#1f2937',
    borderRadius: 8,
    maxHeight: 300,
    zIndex: 1000,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  searchResultImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  searchResultName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchResultTeam: {
    color: '#9ca3af',
    fontSize: 14,
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  playerCard: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 15,
    marginRight: 15,
    width: 200,
    alignItems: 'center',
  },
  playerImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  playerName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  playerTeam: {
    color: '#9ca3af',
    fontSize: 14,
    marginBottom: 10,
  },
  statsContainer: {
    alignItems: 'center',
  },
  statText: {
    color: '#d1d5db',
    fontSize: 14,
    marginBottom: 2,
  },
  gameCard: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
  },
  gameHeader: {
    backgroundColor: '#374151',
    padding: 10,
  },
  gameDate: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  gameContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  teamContainer: {
    alignItems: 'center',
    flex: 1,
  },
  teamLogo: {
    width: 60,
    height: 60,
    marginBottom: 5,
  },
  teamName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  teamRecord: {
    color: '#9ca3af',
    fontSize: 14,
  },
  gameInfo: {
    alignItems: 'center',
    flex: 0.5,
  },
  vsText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameTime: {
    color: '#9ca3af',
    fontSize: 14,
  },
  gameFooter: {
    backgroundColor: '#374151',
    padding: 10,
    alignItems: 'center',
  },
  gameVenue: {
    color: '#fff',
    fontSize: 14,
  },
  broadcast: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 2,
  },
  standingsContainer: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 15,
  },
  conference: {
    marginBottom: 20,
  },
  conferenceTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  standingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  standingRank: {
    color: '#9ca3af',
    width: 30,
    fontSize: 14,
  },
  standingTeamLogo: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  standingTeamName: {
    color: '#fff',
    flex: 1,
    fontSize: 14,
  },
  standingRecord: {
    color: '#9ca3af',
    width: 60,
    textAlign: 'right',
    fontSize: 14,
  },
  standingPct: {
    color: '#9ca3af',
    width: 50,
    textAlign: 'right',
    fontSize: 14,
  },
  playerDetailsHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1f2937',
  },
  playerDetailsImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 15,
  },
  playerDetailsName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  playerDetailsTeam: {
    color: '#9ca3af',
    fontSize: 18,
    marginTop: 5,
  },
  playerDetailsPosition: {
    color: '#d1d5db',
    fontSize: 16,
    marginTop: 5,
  },
  playerDetailsStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#374151',
    marginTop: 1,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#9ca3af',
    fontSize: 14,
    marginTop: 5,
  },
  playerDetailsPercentages: {
    padding: 20,
    backgroundColor: '#1f2937',
    marginTop: 1,
  },
  percentageTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  percentageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  percentageLabel: {
    color: '#9ca3af',
    fontSize: 16,
  },
  percentageValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 