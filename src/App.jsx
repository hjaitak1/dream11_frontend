import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "https://dream11-f25v.onrender.com";

export default function Dream11Dashboard() {
  const [userId, setUserId] = useState(1);
  const [matchId, setMatchId] = useState(1);
  const [playerIds, setPlayerIds] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/leaderboard`);
      setLeaderboard(response.data.leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const playerIdsArray = playerIds.split(",").map((id) => parseInt(id.trim()));
      await axios.post(`${API_BASE_URL}/select_team`, {
        user_id: userId,
        match_id: matchId,
        player_ids: playerIdsArray,
      });
      alert("Team selection saved!");
      fetchLeaderboard();
    } catch (error) {
      alert("Error submitting team selection.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Dream11 Automation</h1>
      <div className="mb-2">
        <label>User ID</label>
        <input type="number" value={userId} onChange={(e) => setUserId(parseInt(e.target.value))} />
      </div>
      <div className="mb-2">
        <label>Match ID</label>
        <input type="number" value={matchId} onChange={(e) => setMatchId(parseInt(e.target.value))} />
      </div>
      <div className="mb-4">
        <label>Player IDs (comma-separated)</label>
        <input type="text" value={playerIds} onChange={(e) => setPlayerIds(e.target.value)} />
      </div>
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Submitting..." : "Submit Team"}
      </button>

      <h2 className="text-xl font-semibold mt-6">Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Total Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, index) => (
            <tr key={index}>
              <td>{entry.user_id}</td>
              <td>{entry.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
