import { useQuery } from '@tanstack/react-query';
import { getTodaysGames, getTeamStandings, getPlayerSeasonStats } from '../api';

export function useTodaysGames() {
  return useQuery({
    queryKey: ['todaysGames'],
    queryFn: getTodaysGames,
    refetchInterval: 30000, // Refetch every 30 seconds for live scores
  });
}

export function useTeamStandings(conference?: string) {
  return useQuery({
    queryKey: ['teamStandings', conference],
    queryFn: () => getTeamStandings(conference),
    staleTime: 300000, // Consider standings stale after 5 minutes
  });
}

export function usePlayerStats() {
  return useQuery({
    queryKey: ['playerStats'],
    queryFn: () => getPlayerSeasonStats(),
    staleTime: 3600000, // Stats update less frequently, stale after 1 hour
  });
}