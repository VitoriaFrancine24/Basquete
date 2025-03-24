from basketball_reference_web_scraper import client
from datetime import datetime, timedelta
import json
import requests
from bs4 import BeautifulSoup
import time

def get_headers():
    return {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Origin': 'https://www.nba.com',
        'Referer': 'https://www.nba.com/'
    }

def get_all_games():
    try:
        # Get today's games
        today = datetime.now()
        games = []
        
        # Fetch games for next 7 days
        for i in range(7):
            date = today + timedelta(days=i)
            formatted_date = date.strftime('%Y-%m-%d')
            url = f"https://cdn.nba.com/static/json/liveData/scoreboard/todaysScoreboard_{formatted_date.replace('-', '')}.json"
            
            response = requests.get(url, headers=get_headers())
            if response.status_code == 200:
                data = response.json()
                if 'games' in data.get('scoreboard', {}):
                    for game in data['scoreboard']['games']:
                        game_data = {
                            'gameId': game.get('gameId', ''),
                            'date': formatted_date,
                            'status': {
                                'clock': game.get('gameStatusText', ''),
                                'is_live': game.get('gameStatus', 2) == 2,
                                'period': game.get('period', 0)
                            },
                            'home_team': {
                                'id': game['homeTeam'].get('teamId', ''),
                                'name': game['homeTeam'].get('teamName', ''),
                                'nickname': game['homeTeam'].get('teamTricode', ''),
                                'score': game['homeTeam'].get('score', 0),
                                'record': f"{game['homeTeam'].get('wins', 0)}-{game['homeTeam'].get('losses', 0)}",
                                'logo': f"https://cdn.nba.com/logos/nba/{game['homeTeam'].get('teamId', '')}/global/L/logo.svg"
                            },
                            'away_team': {
                                'id': game['awayTeam'].get('teamId', ''),
                                'name': game['awayTeam'].get('teamName', ''),
                                'nickname': game['awayTeam'].get('teamTricode', ''),
                                'score': game['awayTeam'].get('score', 0),
                                'record': f"{game['awayTeam'].get('wins', 0)}-{game['awayTeam'].get('losses', 0)}",
                                'logo': f"https://cdn.nba.com/logos/nba/{game['awayTeam'].get('teamId', '')}/global/L/logo.svg"
                            },
                            'arena': game.get('arena', {}).get('name', ''),
                            'broadcast': game.get('broadcasters', {}).get('nationalTvBroadcasters', [{}])[0].get('broadcasterAbbreviation', ''),
                            'time': game.get('gameTimeEst', '').split('T')[1].split('.')[0]
                        }
                        games.append(game_data)
        
        return sorted(games, key=lambda x: x['date'])
    except Exception as e:
        print(f"Error fetching games: {e}")
        return []

def get_player_stats():
    try:
        url = "https://stats.nba.com/stats/leagueLeaders"
        params = {
            'LeagueID': '00',
            'PerMode': 'PerGame',
            'Scope': 'S',
            'Season': '2023-24',
            'SeasonType': 'Regular Season',
            'StatCategory': 'PTS'
        }
        
        response = requests.get(url, headers=get_headers(), params=params)
        data = response.json()
        
        players = []
        for player in data['resultSet']['rowSet'][:20]:  # Top 20 scorers
            player_data = {
                'id': player[0],
                'name': player[2],
                'team': player[3],
                'games_played': player[4],
                'stats': {
                    'points': round(player[22], 1),
                    'rebounds': round(player[17], 1),
                    'assists': round(player[18], 1),
                    'steals': round(player[19], 1),
                    'blocks': round(player[20], 1),
                    'fg_pct': round(player[11] * 100, 1),
                    'three_pct': round(player[13] * 100, 1),
                    'ft_pct': round(player[15] * 100, 1)
                },
                'image': f"https://cdn.nba.com/headshots/nba/latest/1040x760/{player[0]}.png"
            }
            players.append(player_data)
        return players
    except Exception as e:
        print(f"Error fetching player stats: {e}")
        return []

def search_players(query):
    try:
        url = "https://stats.nba.com/stats/playerindex"
        params = {
            'Historical': 0,
            'LeagueID': '00',
            'Season': '2023-24'
        }
        
        response = requests.get(url, headers=get_headers(), params=params)
        data = response.json()
        
        players = []
        query = query.lower()
        
        for player in data['resultSet']['rowSet']:
            name = f"{player[2]} {player[3]}".lower()
            if query in name:
                player_data = {
                    'id': player[0],
                    'name': f"{player[2]} {player[3]}",
                    'team': player[7],
                    'position': player[11],
                    'image': f"https://cdn.nba.com/headshots/nba/latest/1040x760/{player[0]}.png"
                }
                players.append(player_data)
        
        return players[:10]  # Return top 10 matches
    except Exception as e:
        print(f"Error searching players: {e}")
        return []

def get_team_standings():
    try:
        url = "https://stats.nba.com/stats/leaguestandings"
        params = {
            'LeagueID': '00',
            'Season': '2023-24',
            'SeasonType': 'Regular Season'
        }
        
        response = requests.get(url, headers=get_headers(), params=params)
        data = response.json()
        
        teams = {
            'eastern': [],
            'western': []
        }
        
        for team in data['resultSet']['rowSet']:
            team_data = {
                'id': team[2],
                'name': team[3],
                'nickname': team[4],
                'conference': team[6],
                'wins': team[13],
                'losses': team[14],
                'win_pct': round(team[15] * 100, 1),
                'games_behind': team[37],
                'last_10': f"{team[20]}-{10-team[20]}",
                'streak': f"{'W' if team[35] > 0 else 'L'}{abs(team[35])}",
                'logo': f"https://cdn.nba.com/logos/nba/{team[2]}/global/L/logo.svg"
            }
            
            if team[6] == 'East':
                teams['eastern'].append(team_data)
            else:
                teams['western'].append(team_data)
        
        # Sort by win percentage
        teams['eastern'] = sorted(teams['eastern'], key=lambda x: x['win_pct'], reverse=True)
        teams['western'] = sorted(teams['western'], key=lambda x: x['win_pct'], reverse=True)
        
        return teams
    except Exception as e:
        print(f"Error fetching team standings: {e}")
        return {'eastern': [], 'western': []}

def update_data():
    data = {
        'last_update': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'games': get_all_games(),
        'players': get_player_stats(),
        'standings': get_team_standings()
    }
    
    with open('static/data.json', 'w') as f:
        json.dump(data, f)

    print(f"Data updated at {data['last_update']}")

if __name__ == '__main__':
    print("Starting NBA data collection service...")
    while True:
        try:
            update_data()
            time.sleep(30)  # Update every 30 seconds
        except KeyboardInterrupt:
            print("\nStopping data collection service...")
            break
        except Exception as e:
            print(f"Error in main loop: {e}")
            time.sleep(5)  # Wait 5 seconds before retrying 