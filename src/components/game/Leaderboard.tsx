import React from "react";
import { Trophy } from "lucide-react";
import "./Leaderboard.css";

interface LeaderboardProps {
  leaderboard: { playerName: string; pattern: string }[];
  players: { name: string }[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ leaderboard, players }) => {
  return (
    <div>
      <h2 className="leaderboard-title">Leaderboard</h2>
      <h3 className="claimed-prizes-title">Claimed Prizes</h3>
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Player Name</th>
              <th>Claimed Prize</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={index} className="claimed-prize-row">
                <td>
                  <Trophy className="player-icon" size={16} />
                  {entry.playerName}
                </td>
                <td>{entry.pattern}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3 className="all-players-title">All Players</h3>
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <table className="players-table">
          <thead>
            <tr>
              <th>Player Name</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => (
              <tr key={index} className="player-row">
                <td>
                  <Trophy className="player-icon" size={16} />
                  {player.name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
