import React, { useState } from 'react';
import { Search, TrendingUp, Menu, X } from 'lucide-react';

export function Dashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="w-full md:w-[1200px] bg-gradient-to-r from-primary-900 to-primary-800 rounded-xl overflow-hidden shadow-2xl">
      <header className="bg-primary-950/60 p-4 md:p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-primary-500 p-2 rounded-full">
              <TrendingUp className="w-6 md:w-8 h-6 md:h-8 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">NBA Stats Pro</h1>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex gap-8 text-primary-100">
              <li className="hover:text-white transition-colors relative group">
                <a href="#" className="flex items-center gap-1">
                  Teams
                  <span className="material-symbols-outlined text-sm">expand_more</span>
                </a>
                <div className="absolute hidden group-hover:block bg-white text-primary-900 rounded-lg shadow-lg p-4 w-48 z-10 mt-2">
                  <ul className="space-y-2">
                    <li className="hover:bg-primary-50 p-2 rounded transition-colors">Eastern Conference</li>
                    <li className="hover:bg-primary-50 p-2 rounded transition-colors">Western Conference</li>
                    <li className="hover:bg-primary-50 p-2 rounded transition-colors">Team Rankings</li>
                  </ul>
                </div>
              </li>
              <li className="hover:text-white transition-colors">
                <a href="#">Players</a>
              </li>
              <li className="hover:text-white transition-colors">
                <a href="#">Games</a>
              </li>
              <li className="hover:text-white transition-colors">
                <a href="#">News</a>
              </li>
              <li className="hover:text-white transition-colors">
                <a href="#">Fantasy</a>
              </li>
            </ul>
          </nav>

          {/* Desktop Search and Sign In */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search players, teams..."
                className="bg-primary-800/50 border border-primary-700 text-white rounded-full py-2 px-4 pl-10 w-64 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
              <Search className="w-5 h-5 absolute left-3 top-2.5 text-primary-300" />
            </div>
            <button className="bg-primary-500 hover:bg-primary-400 text-white px-4 py-2 rounded-full transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined">account_circle</span>
              Sign In
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 border-t border-primary-700/50 pt-4">
            <nav className="mb-4">
              <ul className="space-y-4 text-primary-100">
                <li className="hover:text-white transition-colors">
                  <a href="#" className="flex items-center justify-between">
                    Teams
                    <span className="material-symbols-outlined text-sm">expand_more</span>
                  </a>
                </li>
                <li className="hover:text-white transition-colors">
                  <a href="#">Players</a>
                </li>
                <li className="hover:text-white transition-colors">
                  <a href="#">Games</a>
                </li>
                <li className="hover:text-white transition-colors">
                  <a href="#">News</a>
                </li>
                <li className="hover:text-white transition-colors">
                  <a href="#">Fantasy</a>
                </li>
              </ul>
            </nav>
            <div className="space-y-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search players, teams..."
                  className="w-full bg-primary-800/50 border border-primary-700 text-white rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
                <Search className="w-5 h-5 absolute left-3 top-2.5 text-primary-300" />
              </div>
              <button className="w-full bg-primary-500 hover:bg-primary-400 text-white px-4 py-2 rounded-full transition-colors flex items-center gap-2 justify-center">
                <span className="material-symbols-outlined">account_circle</span>
                Sign In
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="p-4 md:p-6">
        <section className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-6">
            <h2 className="text-2xl font-bold text-white">Today's Games</h2>
            <div className="flex items-center bg-primary-800/60 rounded-lg p-1 self-stretch md:self-auto">
              <button className="bg-primary-600 text-white px-4 py-1 rounded-md flex-1 md:flex-none">Live</button>
              <button className="text-primary-200 hover:text-white px-4 py-1 transition-colors flex-1 md:flex-none">Upcoming</button>
              <button className="text-primary-200 hover:text-white px-4 py-1 transition-colors flex-1 md:flex-none">Finished</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <GameCard
              status="live"
              time="Q3 - 5:43"
              team1={{
                name: "Lakers",
                logo: "https://cdn.nba.com/logos/nba/1610612747/global/L/logo.svg",
                record: "24-13",
                score: "87"
              }}
              team2={{
                name: "Celtics",
                logo: "https://cdn.nba.com/logos/nba/1610612738/global/L/logo.svg",
                record: "29-8",
                score: "91"
              }}
              venue="TD Garden"
              broadcast="ESPN"
            />
            
            <GameCard
              status="live"
              time="Q2 - 2:18"
              team1={{
                name: "Warriors",
                logo: "https://cdn.nba.com/logos/nba/1610612744/global/L/logo.svg",
                record: "18-19",
                score: "54"
              }}
              team2={{
                name: "Bucks",
                logo: "https://cdn.nba.com/logos/nba/1610612749/global/L/logo.svg",
                record: "25-12",
                score: "48"
              }}
              venue="Chase Center"
              broadcast="TNT"
            />

            <GameCard
              status="upcoming"
              time="Today, 8:30 PM ET"
              team1={{
                name: "Thunder",
                logo: "https://cdn.nba.com/logos/nba/1610612760/global/L/logo.svg",
                record: "26-11",
                score: "-"
              }}
              team2={{
                name: "Suns",
                logo: "https://cdn.nba.com/logos/nba/1610612756/global/L/logo.svg",
                record: "21-16",
                score: "-"
              }}
              venue="Footprint Center"
              broadcast="NBA TV"
            />
          </div>
        </section>

        <section className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-6">
            <h2 className="text-2xl font-bold text-white">Player Stats Leaders</h2>
            <div className="flex gap-2 self-stretch md:self-auto">
              <button className="bg-primary-700 hover:bg-primary-600 text-white px-4 py-1 rounded-md transition-colors flex-1 md:flex-none">Season</button>
              <button className="bg-primary-800/60 hover:bg-primary-700 text-primary-200 hover:text-white px-4 py-1 rounded-md transition-colors flex-1 md:flex-none">Last 10 Games</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <StatsLeaderCard
              title="Points Per Game"
              leader={{
                name: "Luka Dončić",
                team: "Dallas Mavericks",
                image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629027.png",
                value: "33.6"
              }}
              runners={[
                { name: "Joel Embiid", value: "33.1" },
                { name: "Giannis Antetokounmpo", value: "30.9" },
                { name: "Shai Gilgeous-Alexander", value: "30.7" }
              ]}
            />

            <StatsLeaderCard
              title="Rebounds Per Game"
              leader={{
                name: "Anthony Davis",
                team: "Los Angeles Lakers",
                image: "https://cdn.nba.com/headshots/nba/latest/1040x760/203076.png",
                value: "12.4"
              }}
              runners={[
                { name: "Domantas Sabonis", value: "12.2" },
                { name: "Giannis Antetokounmpo", value: "11.5" },
                { name: "Nikola Jokić", value: "11.3" }
              ]}
            />

            <StatsLeaderCard
              title="Assists Per Game"
              leader={{
                name: "Nikola Jokić",
                team: "Denver Nuggets",
                image: "https://cdn.nba.com/headshots/nba/latest/1040x760/203999.png",
                value: "9.2"
              }}
              runners={[
                { name: "Tyrese Haliburton", value: "8.7" },
                { name: "James Harden", value: "8.3" },
                { name: "Luka Dončić", value: "8.0" }
              ]}
            />
          </div>
        </section>

        <section>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-6">
            <h2 className="text-2xl font-bold text-white">Team Standings</h2>
            <div className="flex gap-2 self-stretch md:self-auto">
              <button className="bg-primary-700 hover:bg-primary-600 text-white px-4 py-1 rounded-md transition-colors flex-1 md:flex-none">Eastern</button>
              <button className="bg-primary-800/60 hover:bg-primary-700 text-primary-200 hover:text-white px-4 py-1 rounded-md transition-colors flex-1 md:flex-none">Western</button>
            </div>
          </div>

          <div className="bg-primary-800/40 rounded-xl border border-primary-700/50 backdrop-blur-sm overflow-x-auto">
            <table className="w-full text-white">
              <thead className="border-b border-primary-700/50">
                <tr>
                  <th className="py-3 px-4 text-left text-primary-300 font-medium">Rank</th>
                  <th className="py-3 px-4 text-left text-primary-300 font-medium">Team</th>
                  <th className="py-3 px-4 text-center text-primary-300 font-medium">W</th>
                  <th className="py-3 px-4 text-center text-primary-300 font-medium">L</th>
                  <th className="py-3 px-4 text-center text-primary-300 font-medium">Win %</th>
                  <th className="py-3 px-4 text-center text-primary-300 font-medium">GB</th>
                  <th className="py-3 px-4 text-center text-primary-300 font-medium">Last 10</th>
                  <th className="py-3 px-4 text-center text-primary-300 font-medium">Streak</th>
                </tr>
              </thead>
              <tbody>
                <TeamStandingRow
                  rank={1}
                  team={{
                    name: "Boston Celtics",
                    logo: "https://cdn.nba.com/logos/nba/1610612738/global/L/logo.svg"
                  }}
                  wins={29}
                  losses={8}
                  winPercentage=".784"
                  gamesBack="-"
                  lastTen="8-2"
                  streak={{ type: "W", count: 4 }}
                />
                <TeamStandingRow
                  rank={2}
                  team={{
                    name: "Milwaukee Bucks",
                    logo: "https://cdn.nba.com/logos/nba/1610612749/global/L/logo.svg"
                  }}
                  wins={25}
                  losses={12}
                  winPercentage=".676"
                  gamesBack="4.0"
                  lastTen="6-4"
                  streak={{ type: "W", count: 2 }}
                />
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

interface GameCardProps {
  status: 'live' | 'upcoming';
  time: string;
  team1: {
    name: string;
    logo: string;
    record: string;
    score: string;
  };
  team2: {
    name: string;
    logo: string;
    record: string;
    score: string;
  };
  venue: string;
  broadcast: string;
}

function GameCard({ status, time, team1, team2, venue, broadcast }: GameCardProps) {
  return (
    <div className="bg-primary-800/40 rounded-xl p-4 border border-primary-700/50 backdrop-blur-sm hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer">
      <div className="flex justify-between items-center mb-2">
        <span className={`${status === 'live' ? 'bg-red-500 animate-pulse' : 'bg-gray-500'} text-white text-xs px-2 py-1 rounded-full`}>
          {status === 'live' ? 'LIVE' : 'UPCOMING'}
        </span>
        <span className="text-primary-300 text-sm">{time}</span>
      </div>
      
      <TeamScore team={team1} />
      <TeamScore team={team2} />
      
      <div className="mt-4 border-t border-primary-700/50 pt-2 flex justify-between text-primary-300 text-sm">
        <span>{venue}</span>
        <span>{broadcast}</span>
      </div>
    </div>
  );
}

function TeamScore({ team }: { team: GameCardProps['team1'] }) {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        <img src={team.logo} alt={team.name} className="w-10 md:w-12 h-10 md:h-12" />
        <div>
          <p className="text-white font-semibold">{team.name}</p>
          <p className="text-primary-300 text-sm">{team.record}</p>
        </div>
      </div>
      <p className="text-white text-xl md:text-2xl font-bold">{team.score}</p>
    </div>
  );
}

interface StatsLeaderCardProps {
  title: string;
  leader: {
    name: string;
    team: string;
    image: string;
    value: string;
  };
  runners: Array<{
    name: string;
    value: string;
  }>;
}

function StatsLeaderCard({ title, leader, runners }: StatsLeaderCardProps) {
  return (
    <div className="bg-primary-800/40 rounded-xl p-4 border border-primary-700/50 backdrop-blur-sm hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer">
      <h3 className="text-center text-primary-300 font-medium mb-4">{title}</h3>
      <div className="flex items-center gap-4 mb-3">
        <img src={leader.image} alt={leader.name} className="w-14 md:w-16 h-14 md:h-16 rounded-full object-cover border-2 border-primary-500" />
        <div>
          <p className="text-white font-bold text-base md:text-lg">{leader.name}</p>
          <p className="text-primary-300 text-sm">{leader.team}</p>
        </div>
        <p className="ml-auto text-white text-xl md:text-2xl font-bold">{leader.value}</p>
      </div>
      <ul className="space-y-2 mt-4">
        {runners.map((runner, index) => (
          <li key={index} className="flex justify-between items-center py-1 border-b border-primary-700/30 last:border-0">
            <span className="text-primary-300 text-sm md:text-base">{index + 2}. {runner.name}</span>
            <span className="text-white">{runner.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface TeamStandingRowProps {
  rank: number;
  team: {
    name: string;
    logo: string;
  };
  wins: number;
  losses: number;
  winPercentage: string;
  gamesBack: string;
  lastTen: string;
  streak: {
    type: 'W' | 'L';
    count: number;
  };
}

function TeamStandingRow({ rank, team, wins, losses, winPercentage, gamesBack, lastTen, streak }: TeamStandingRowProps) {
  return (
    <tr className="hover:bg-primary-700/30 transition-colors cursor-pointer border-b border-primary-700/30">
      <td className="py-3 px-4">{rank}</td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <img src={team.logo} alt={team.name} className="w-6 md:w-8 h-6 md:h-8" />
          <span className="text-sm md:text-base">{team.name}</span>
        </div>
      </td>
      <td className="py-3 px-4 text-center">{wins}</td>
      <td className="py-3 px-4 text-center">{losses}</td>
      <td className="py-3 px-4 text-center">{winPercentage}</td>
      <td className="py-3 px-4 text-center">{gamesBack}</td>
      <td className="py-3 px-4 text-center">{lastTen}</td>
      <td className="py-3 px-4 text-center font-medium text-green-400">{streak.type}{streak.count}</td>
    </tr>
  );
}

export default Dashboard;