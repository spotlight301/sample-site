import React, { useState, useEffect } from 'react';

const playerData = [
  { id: 'Jayden Daniels (36619104)', name: 'Jayden Daniels (36619155)', position: 'QB1A', salaryCaptain: 15600, salaryFlex: 10400 },
  { id: 'Brian Robinson Jr. (36619108)', name: 'Brian Robinson Jr. (36619159)', position: 'RB1A', salaryCaptain: 12300, salaryFlex: 8200 },
  { id: 'A.J. Brown (36619156)', name: 'A.J. Brown (36619167)', position: 'WR1', salaryCaptain: 14000, salaryFlex: 9000 },
  // Add the rest of the player data here
];

const MAX_SALARY = 50000;
const MAX_LINEUPS = 150;
const MIN_UNIQUE_CAPTAINS = 30;
const LINEUPS_PER_CAPTAIN = Math.floor(MAX_LINEUPS / MIN_UNIQUE_CAPTAINS);

function LineupGenerator() {
  const [lineups, setLineups] = useState([]);

  // Helper function to filter eligible flex players for a lineup
  const filterFlexPlayers = (captainId) => {
    return playerData.filter(player => player.id !== captainId);
  };

  // Function to generate lineups with unique captains
  const generateLineups = () => {
    const sortedPlayers = [...playerData].sort((a, b) => a.id.localeCompare(b.id)); // Sort players for consistency
    const selectedCaptains = sortedPlayers.slice(0, MIN_UNIQUE_CAPTAINS); // Ensure 30 unique captains
    const generatedLineups = [];

    for (let captain of selectedCaptains) {
      const flexPlayers = filterFlexPlayers(captain.id);
      let lineupCount = 0;

      for (let i = 0; i < flexPlayers.length; i++) {
        for (let j = i + 1; j < flexPlayers.length; j++) {
          for (let k = j + 1; k < flexPlayers.length; k++) {
            for (let l = k + 1; l < flexPlayers.length; l++) {
              for (let m = l + 1; m < flexPlayers.length; m++) {
                const lineup = [captain, flexPlayers[i], flexPlayers[j], flexPlayers[k], flexPlayers[l], flexPlayers[m]];
                const totalSalary = lineup.reduce((sum, player, idx) => sum + (idx === 0 ? player.salaryCaptain : player.salaryFlex), 0);
                if (totalSalary <= MAX_SALARY) {
                  generatedLineups.push(lineup);
                  lineupCount++;
                  if (generatedLineups.length >= MAX_LINEUPS || lineupCount >= LINEUPS_PER_CAPTAIN) break;
                }
              }
              if (generatedLineups.length >= MAX_LINEUPS || lineupCount >= LINEUPS_PER_CAPTAIN) break;
            }
            if (generatedLineups.length >= MAX_LINEUPS || lineupCount >= LINEUPS_PER_CAPTAIN) break;
          }
          if (generatedLineups.length >= MAX_LINEUPS || lineupCount >= LINEUPS_PER_CAPTAIN) break;
        }
        if (generatedLineups.length >= MAX_LINEUPS || lineupCount >= LINEUPS_PER_CAPTAIN) break;
      }
    }

    return generatedLineups;
  };

  // Convert the lineups to CSV format
  const convertLineupsToCSV = () => {
    const csvRows = [
      ['Captain Name', 'Captain Salary', 'Flex1 Name', 'Flex1 Salary', 'Flex2 Name', 'Flex2 Salary', 'Flex3 Name', 'Flex3 Salary', 'Flex4 Name', 'Flex4 Salary', 'Flex5 Name', 'Flex5 Salary', 'Total Salary']
    ];

    lineups.forEach(lineup => {
      const row = [];
      row.push(lineup[0].name); // Captain Name
      row.push(lineup[0].salaryCaptain); // Captain Salary
      let totalSalary = lineup[0].salaryCaptain;

      for (let i = 1; i < lineup.length; i++) {
        row.push(lineup[i].id); // Flex player name
        row.push(lineup[i].salaryFlex); // Flex player salary
        totalSalary += lineup[i].salaryFlex;
      }
      row.push(totalSalary); // Total Salary
      csvRows.push(row);
    });

    return csvRows.map(row => row.join(',')).join('\n');
  };

  // Function to download the CSV file
  const downloadCSV = () => {
    const csvData = convertLineupsToCSV();
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'lineups.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    setLineups(generateLineups());
  }, []);

  return (
    <div>
      <h1>Generated Lineups</h1>
      <button onClick={downloadCSV}>Download CSV</button>
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