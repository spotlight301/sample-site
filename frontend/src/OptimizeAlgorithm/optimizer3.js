import React, { useState, useEffect } from 'react';

const playerData = [
  { id: 'Jayden Daniels (36619104)', name: 'Jayden Daniels (36619155)', position: 'QB1A', salaryCaptain: 15600, salaryFlex: 10400 },
  { id: 'Brian Robinson Jr. (36619108)', name: 'Brian Robinson Jr. (36619159)', position: 'RB1A', salaryCaptain: 12300, salaryFlex: 8200 },
  // Add the rest of the player data here
];

const MAX_SALARY = 50000;
const MAX_LINEUPS = 150;
const NUM_PLAYERS = 6;

function LineupGenerator() {
  const [lineups, setLineups] = useState([]);

  // Helper function to filter eligible flex players for a lineup
  const filterFlexPlayers = (captainId) => {
    return playerData.filter(player => player.id !== captainId);
  };

  // Recursive function to generate lineup combinations
  const generateLineups = () => {
    const generatedLineups = [];

    for (let captain of playerData) {
      const flexPlayers = filterFlexPlayers(captain.id);
      for (let i = 0; i < flexPlayers.length; i++) {
        for (let j = i + 1; j < flexPlayers.length; j++) {
          for (let k = j + 1; k < flexPlayers.length; k++) {
            for (let l = k + 1; l < flexPlayers.length; l++) {
              for (let m = l + 1; m < flexPlayers.length; m++) {
                const lineup = [captain, flexPlayers[i], flexPlayers[j], flexPlayers[k], flexPlayers[l], flexPlayers[m]];
                const totalSalary = lineup.reduce((sum, player, idx) => sum + (idx === 0 ? player.salaryCaptain : player.salaryFlex), 0);
                if (totalSalary <= MAX_SALARY) {
                  generatedLineups.push(lineup);
                  if (generatedLineups.length >= MAX_LINEUPS) return generatedLineups;
                }
              }
            }
          }
        }
      }
    }
    return generatedLineups;
  };

  useEffect(() => {
    setLineups(generateLineups());
  }, []);

  return (
    <div>
      <h1>Generated Lineups</h1>
      {lineups.length === 0 ? (
        <p>Generating lineups...</p>
      ) : (
        lineups.map((lineup, index) => (
          <div key={index} style={{ marginBottom: '20px' }}>
            <h2>Lineup {index + 1}</h2>
            <ul>
              {lineup.map((player, idx) => (
                <li key={player.id}>
                  {idx === 0 ? `(Captain) ${player.name} - $${player.salaryCaptain}` : `${player.id} - $${player.salaryFlex}`}
                </li>
              ))}
            </ul>
            <strong>Total Salary: ${lineup.reduce((sum, player, idx) => sum + (idx === 0 ? player.salaryCaptain : player.salaryFlex), 0)}</strong>
          </div>
        ))
      )}
    </div>
  );
}

export default LineupGenerator;