import axios from 'axios';
import { format } from 'date-fns';
import { Player, Stats, Game, Team } from './types';

const api = axios.create({
  baseURL: 'https://www.balldontlie.io/api/v1',
});

export const searchPlayers = async (query: string): Promise<Player[]> => {
  const response = await api.get(`/players?search=${query}`);
  return response.data.data;
};

export const getPlayerStats = async (playerId: number): Promise<Stats[]> => {
  const response = await api.get(`/season_averages?player_ids[]=${playerId}`);
  return response.data.data;
};

export const getTodaysGames = async (): Promise<Game[]> => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const response = await api.get(`/games?start_date=${today}&end_date=${today}`);
  return response.data.data;
};

export const getTeamStandings = async (conference?: string): Promise<Team[]> => {
  const response = await api.get('/teams');
  const teams = response.data.data;
  
  if (conference) {
    return teams.filter((team: Team) => team.conference === conference.toUpperCase());
  }
  
  return teams;
};

export const getPlayerSeasonStats = async (season = 2023): Promise<Stats[]> => {
  const response = await api.get(`/season_averages?season=${season}`);
  return response.data.data;
};