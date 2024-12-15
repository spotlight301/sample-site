import React, { useState, useEffect } from 'react';

// Sample player data (Replace with actual data)
const players = [
  { name: 'Player1', position: 'QB1', salaryFlex: 6000, salaryCaptain: 8000, projectedPoints: 20 },
  { name: 'Player2', position: 'RB1', salaryFlex: 5000, salaryCaptain: 0, projectedPoints: 15 },
  { name: 'Player3', position: 'RB2', salaryFlex: 4500, salaryCaptain: 0, projectedPoints: 10 },
  { name: 'Player4', position: 'WR1', salaryFlex: 5500, salaryCaptain: 0, projectedPoints: 18 },
  { name: 'Player5', position: 'WR2', salaryFlex: 4800, salaryCaptain: 0, projectedPoints: 12 },
  { name: 'Player6', position: 'WR3', salaryFlex: 4700, salaryCaptain: 0, projectedPoints: 8 },
  { name: 'Player7', position: 'TE1', salaryFlex: 4000, salaryCaptain: 0, projectedPoints: 6 },
  { name: 'Player8', position: 'K1', salaryFlex: 3000, salaryCaptain: 0, projectedPoints: 4 },
  { name: 'Player9', position: 'DEF1', salaryFlex: 3500, salaryCaptain: 0, projectedPoints: 10 },
  { name: 'Player10', position: 'RB3', salaryFlex: 4000, salaryCaptain: 0, projectedPoints: 5 },
  // More players...
];

const LINEUP_COUNT = 18;
const MAX_SALARY = 50000;

const generateLineups = (players) => {
  const lineups = [];

  // Function to find a captain and create a lineup
  const generateLineup = () => {
    const captainCandidates = players.filter(player => player.salaryCaptain > 0); // Only select players with salaryCaptain > 0

    for (let i = 0; i < captainCandidates.length; i++) {
      const captain = captainCandidates[i];
      const remainingPlayers = players.filter(player => player.position !== captain.position && player.salaryCaptain === 0); // Exclude captain from remaining pool

      const selectedPlayers = [captain];

      // Randomly select 5 other players ensuring positions are unique
      let positionsSelected = new Set([captain.position]);
      while (selectedPlayers.length < 6) {
        const randomIndex = Math.floor(Math.random() * remainingPlayers.length);
        const player = remainingPlayers[randomIndex];
        
        // Ensure no duplicate positions
        if (!positionsSelected.has(player.position)) {
          selectedPlayers.push(player);
          positionsSelected.add(player.position);
        }
      }

      const totalSalary = selectedPlayers.reduce((sum, player) => sum + player.salaryFlex + player.salaryCaptain, 0);
      const totalPoints = selectedPlayers.reduce((sum, player) => sum + player.projectedPoints, 0);

      if (totalSalary <= MAX_SALARY) {
        lineups.push({ lineup: selectedPlayers, totalSalary, totalPoints });
      }

      if (lineups.length >= LINEUP_COUNT) {
        break;
      }
    }
  };

  while (lineups.length < LINEUP_COUNT) {
    generateLineup();
  }

  // Sort lineups by projected points
  lineups.sort((a, b) => b.totalPoints - a.totalPoints);
  return lineups.slice(0, LINEUP_COUNT);
};

const LineupGenerator = () => {
  const [lineups, setLineups] = useState([]);

  useEffect(() => {
    const generatedLineups = generateLineups(players);
    setLineups(generatedLineups);
  }, []);

  return (
    <div>
      <h1>Generated Lineups</h1>
      <ul>
        {lineups.map((lineup, index) => (
          <li key={index}>
            <h3>Lineup {index + 1}</h3>
            <ul>
              {lineup.lineup.map(player => (
                <li key={player.name}>{player.name} - {player.position} - Points: {player.projectedPoints} - Salary: {player.salaryFlex + player.salaryCaptain}</li>
              ))}
            </ul>
            <p>Total Salary: {lineup.totalSalary} | Total Points: {lineup.totalPoints}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LineupGenerator;