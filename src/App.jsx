import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css"; // Ensure Tailwind is included

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Dream11 Automation</h1>
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700">User ID</label>
          <input type="number" value={userId} onChange={(e) => setUserId(parseInt(e.target.value))} className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Match ID</label>
          <input type="number" value={matchId} onChange={(e) => setMatchId(parseInt(e.target.value))} className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Player IDs (comma-separated)</label>
          <input type="text" value={playerIds} onChange={(e) => setPlayerIds(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
        </div>
        <button onClick={handleSubmit} disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
          {loading ? "Submitting..." : "Submit Team"}
        </button>
      </div>

      <h2 className="text-2xl font-semibold mt-8 text-gray-800">Leaderboard</h2>
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg mt-4">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-2 border">User ID</th>
              <th className="p-2 border">Total Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.length === 0 ? (
              <tr>
                <td colSpan="2" className="text-center p-4">No leaderboard data available</td>
              </tr>
            ) : (
              leaderboard.map((entry, index) => (
                <tr key={index} className="text-center border">
                  <td className="p-2 border">{entry.user_id}</td>
                  <td className="p-2 border">{entry.total}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
