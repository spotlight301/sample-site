import React, { useState } from 'react';

const positionsA = [
    'QB1A', 'RB1A', 'RB2A', 'RB3A', 'WR1A', 'WR2A', 'WR3A', 'WR4A', 'WR5A', 
    'TE1A', 'TE2A', 'TE3A', 'K1A', 'DEF1A'
];

const positionsB = [
  'QB1B', 'RB1B', 'RB2B', 'RB3B', 'WR1B', 'WR2B', 'WR3B', 'WR4B', 'WR5B', 
  'TE1B', 'TE2B', 'TE3B', 'K1B', 'DEF1B'
];

function PlayersTable({ tableName, optimizeFlag, players, deletePlayer, addPlayer, onOptimize }) {
    const [playerPositions, setplayerPositions] = useState(
      tableName === "Team A" ? positionsA : positionsB
    );
    const [newPlayer, setNewPlayer] = useState({
      team: tableName, name: '', id: '', position: '', salaryCaptain: 0, salaryFlex: 0,
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setNewPlayer(prev => ({ ...prev, [name]: value }));
    };
  
    const handleAddPlayer = () => {
      if (newPlayer.name && newPlayer.id && newPlayer.position) {
        addPlayer(newPlayer);
        setNewPlayer({ team: tableName, name: '', id: '', position: '', salaryCaptain: 0, salaryFlex: 0, });
      }
    };
  
    const handleOpenModal = () => {
      if (tableName === "Team A") {
        setplayerPositions(positionsA)
      } else {
        setplayerPositions(positionsB)
      }
      setIsModalOpen(true);
    };
  
    const handleCloseModal = () => {
      setIsModalOpen(false);
    };
  
    const onClickOptimize = () => {
        onOptimize();
    }

    return (
      <div className="w-fully border p-3">
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
              <h2 className="text-2xl font-bold mb-4">Add {newPlayer.team} Player</h2>
              {/* Add Player Form */}
              <div className='flex flex-row'>
                <label className="block mt-2 mb-2 mr-3 text-sm font-medium text-gray-700">
                  Captain Name:
                </label>
                <input name="name" placeholder="Player Name" value={newPlayer.name} onChange={handleChange} className="border p-2 mb-2 w-full" />
              </div>
              <div className='flex flex-row'>
                <label className="block mt-2 mb-2 mr-3 text-sm font-medium text-gray-700">
                  Captian Salary:
                </label>
                <input name="salaryCaptain" type='number' placeholder="Salary as Captain" value={newPlayer.salaryCaptain} onChange={handleChange} className="border p-2 mb-2 w-full" />
              </div>
              <div className='flex flex-row'>
                <label className="block mt-2 mb-2 mr-3 text-sm font-medium text-gray-700">
                  Flex Name:
                </label>
                <input name="id" placeholder="ID" value={newPlayer.id} onChange={handleChange} className="border p-2 mb-2 w-full" />
              </div>
              <div className='flex flex-row'>
                <label className="block mt-2 mb-2 mr-3 text-sm font-medium text-gray-700">
                  Flex Salary:
                </label>
                <input name="salaryFlex" type='number' placeholder="Salary as Flex" value={newPlayer.salaryFlex} onChange={handleChange} className="border p-2 mb-2 w-full" />
              </div>
              <div className='flex flex-row'>
                <label className="block mb-2 mt-2 text-sm font-medium text-gray-700">
                  Position: 
                </label>
                <select
                  name="position"
                  value={newPlayer.position}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mb-4"
                >
                  <option value="">Select Position</option>
                  {playerPositions.map(pos => (
                    // <option key={pos} value={pos} disabled={usedPositions.has(pos)}>
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPlayer}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Add Player
                </button>
              </div>
            </div>
          </div>
        )}
        <div className='flex flex-row justify-between'>
          <h3 className="font-bold mb-2 pl-2 pt-2">{tableName}</h3>
          <div className='flex flex-row'>
            <button
              onClick={handleOpenModal}
              className="px-4 py-2 mb-3 mr-2 bg-blue-500 text-white rounded"
            >
              Add Player
            </button>
            {
                optimizeFlag &&
                <button
                    onClick={onClickOptimize}
                    className="px-4 py-2 mb-3 bg-green-500 text-white rounded"
                >
                    Optimize
                </button>
            }
          </div>
        </div>
        <table className="w-full text-center">
          <thead>
            <tr>
            <th className="border p-2">Label</th>
              <th className="border p-2">Position</th>
              <th className="border p-2">Player Name</th>
              <th className="border p-2">Salary</th>
              <th className="border p-2">Position</th>
              <th className="border p-2">ID</th>
              <th className="border p-2">Salary</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {players.filter((man) => man.team === newPlayer.team).map((player, idx) => {
                if ( player.team !== newPlayer.team) {
                    return 0;
                }
                return (
                    <tr key={player.id}>
                        <td className="border p-1">{player.position}</td>
                        <td className="border p-2">CPT</td>
                        <td className="border p-1">{player.name}</td>
                        <td className="border p-1">{player.salaryCaptain}</td>
                        <td className="border p-2">FLEX</td>
                        <td className="border p-1">{player.id}</td>
                        <td className="border p-1">{player.salaryFlex}</td>
                        <td className="border p-1">
                        <button onClick={() => deletePlayer(player.id, player.position)} className="text-red-500">Delete</button>
                        </td>
                    </tr>
                );
            })}
          </tbody>
        </table>
      </div>
    );
  }

export default PlayersTable;
