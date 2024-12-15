import React, { useState, useEffect } from "react";

// Example data structure for players
const playersData = [
  { position: "QB1", salaryFlex: 8000, salaryCaptain: 12000, projectedPoints: 25 },
  { position: "RB1", salaryFlex: 6000, salaryCaptain: 10000, projectedPoints: 18 },
  { position: "RB2", salaryFlex: 5000, salaryCaptain: 9000, projectedPoints: 15 },
  { position: "WR1", salaryFlex: 7000, salaryCaptain: 11000, projectedPoints: 20 },
  // Add more players...
];

const getTopLineups = (players, numLineups = 18) => {
  const validCaptains = players.filter(player => player.salaryCaptain > 0);

  let lineups = [];

  validCaptains.forEach(captain => {
    // Exclude the captain from the remaining pool of players
    const nonCaptains = players.filter(player => player.position !== captain.position && player.salaryCaptain > 0);

    // Sort non-captains by projected points in descending order
    const sortedNonCaptains = nonCaptains.sort((a, b) => b.projectedPoints - a.projectedPoints);

    // Select the top 5 non-captains
    const topNonCaptains = sortedNonCaptains.slice(0, 5);

    // Combine captain with top non-captains
    const lineup = [captain, ...topNonCaptains];

    // Calculate total projected points for the lineup
    const totalProjectedPoints = lineup.reduce((sum, player) => sum + player.projectedPoints, 0);

    // Add to lineups array
    lineups.push({ lineup, totalProjectedPoints });
  });

  // Sort lineups by total projected points in descending order and return top `numLineups`
  lineups.sort((a, b) => b.totalProjectedPoints - a.totalProjectedPoints);

  return lineups.slice(0, numLineups);
};

const NFLLineups = () => {
  const [lineups, setLineups] = useState([]);

  useEffect(() => {
    const topLineups = getTopLineups(playersData);
    setLineups(topLineups);
  }, []);

  return (
    <div>
      <h1>Top NFL Lineups</h1>
      {lineups.length > 0 ? (
        <ul>
          {lineups.map((entry, index) => (
            <li key={index}>
              Lineup {index + 1}: {entry.lineup.map(player => `${player.position} (Points: ${player.projectedPoints})`).join(", ")} 
              - Total Projected Points: {entry.totalProjectedPoints}
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading lineups...</p>
      )}
    </div>
  );
};

export default NFLLineups;