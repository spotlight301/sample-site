import React, { useState, useEffect } from 'react';
import { AiOutlineTwitter } from "react-icons/ai";
import { BiLogoFacebook } from "react-icons/bi";
import PlayersTable from './components/PlayersTable';
import LineupTable from './components/LineupTable';

const MAX_SALARY = 50000;
const MAX_LINEUPS = 150;
const MIN_UNIQUE_CAPTAINS = 25;
const LINEUPS_PER_CAPTAIN = Math.floor(MAX_LINEUPS / MIN_UNIQUE_CAPTAINS);

function NFLData() {
  const [players, setPlayers] = useState([]);
  const [duplicatedFlag, setDuplicatedFlag] = useState({ flag: false, totalSalary: 0, _id: "0" });
  const [editingPlayer, setEditingPlayer] = useState({ _id: "0", totalSalary: 0 });
  const [lineups, setLineups] = useState([]);
  const [checkedArrays, setCheckedArrays] = useState([]);
  const [logged, setLogged] = useState(false);
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState(""); 

  const fetchPlayers = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/player/get_players`, {
        method: 'GET', 
      });
      if (!response.ok) throw new Error('Failed to fetch and save DFS slates');
      const result = await response.json();
      setPlayers(result.players);
      setLineups(result.lineups);
    } catch (err) {
      console.error(err);
    } finally {
    }
  };

  const createPlayer = async (player) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/player/create_player`, {
        method: 'POST', 
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            player: player,
          }),
      });
      if (!response.ok) throw new Error('Failed to fetch and save DFS slates');
    } catch (err) {
      console.error(err);
    } finally {
    }
  };
  const removePlayer = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/player/remove_player`, {
        method: 'DELETE', 
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: id,
          }),
      });
      if (!response.ok) throw new Error('Failed to fetch and save DFS slates');
    } catch (err) {
      console.error(err);
    } finally {
    }
  };

  const storeLineups = async (sortedPlayers) => {
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/player/delete_optimize`, {
        method: 'DELETE', 
        headers: {
          'Content-Type': 'application/json',
        }
      });
      for (let i = 0; i < sortedPlayers.length; i++) {
        await fetch(`${process.env.REACT_APP_BACKEND_URL}/player/create_optimize`, {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lineups: sortedPlayers[i],
          }),
        })
      }
    } catch (err) {
      console.error(err);
    } finally {
    }
  };

  const createLineup = async (lineup) => {
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/player/create_lineup`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lineup: lineup,
        }),
      })
    } catch (err) {
      console.error(err);
    } finally {
    }
  }

  const updateLineup = async (lineup) => {
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/player/update_lineup`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lineup: lineup,
        }),
      })
    } catch (err) {
      console.error(err);
    } finally {
    }
  }

  const updateLineups = async (sortedPlayers) => {
    try {
      for (let i = 0; i < sortedPlayers.length; i++) {
        await fetch(`${process.env.REACT_APP_BACKEND_URL}/player/update_optimize`, {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lineups: sortedPlayers[i],
          }),
        })
      }
    } catch (err) {
      console.error(err);
    } finally {
    }
  }

  const removeLineup = async (lineup) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/player/remove_lineup`, {
        method: 'DELETE', 
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lineup: lineup,
          }),
      });
      if (!response.ok) throw new Error('Failed to fetch and save DFS slates');
    } catch (err) {
      console.error(err);
    } finally {
    }
  };
  // Helper function to filter eligible flex players for a lineup
  const filterFlexPlayers = (captainId) => {
    return players.filter(player => player.id !== captainId);
  };

  const generateLineups = () => {
    const sortedPlayers = [...players].sort((a, b) => a.id.localeCompare(b.id)); // Sort players for consistency
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

  const onOptimize = async () => {
    if (lineups.length === 0) {
      const generatedLineups = generateLineups();
      let sortedPlayers = generatedLineups.map((lineup, id) => {
        let totalSalary = lineup.reduce((sum, player, idx) => sum + (idx === 0 ? player.salaryCaptain : player.salaryFlex), 0);
        return { lineup: lineup, totalSalary: totalSalary };
      })
      sortedPlayers.sort((a, b) => b.totalSalary - a.totalSalary);
      setLineups(sortedPlayers);
      await storeLineups(sortedPlayers);
    } else {
      let temp_lineups = lineups;
      for (let i = 0; i < lineups.length; i ++) {
        for (let j = 0; j < lineups[i].lineup.length; j ++) {
          temp_lineups[i].lineup[j].team = players.filter((player) => player.position === temp_lineups[i].lineup[j].position)[0].team;
          temp_lineups[i].lineup[j].name = players.filter((player) => player.position === temp_lineups[i].lineup[j].position)[0].name;
          temp_lineups[i].lineup[j].id = players.filter((player) => player.position === temp_lineups[i].lineup[j].position)[0].id;
          temp_lineups[i].lineup[j].salaryCaptain = players.filter((player) => player.position === temp_lineups[i].lineup[j].position)[0].salaryCaptain;
          temp_lineups[i].lineup[j].salaryFlex = players.filter((player) => player.position === temp_lineups[i].lineup[j].position)[0].salaryFlex;
          if (j === 0) {
            temp_lineups[i].lineup[j].totalSalary = temp_lineups[i].lineup[j].totalSalary - temp_lineups[i].lineup[j].salaryCaptain + players.filter((player) => player.position === temp_lineups[i].lineup[j].position)[0].salaryCaptain;
          } else {
            temp_lineups[i].lineup[j].totalSalary = temp_lineups[i].lineup[j].totalSalary - temp_lineups[i].lineup[j].salaryFlex + players.filter((player) => player.position === temp_lineups[i].lineup[j].position)[0].salaryFlex;
          }
        }
      }
    }
  };

  const addPlayer = async (player) => {
    let team_players = players.filter(man => man.team === player.team)
    if (team_players.length < 14) {
      setPlayers([...players, { ...player }]);
      await createPlayer(player);
    }
  };

  const editPlayer = (_id, totalSalary) => {
    setEditingPlayer({ _id, totalSalary });
  };

  const savePlayer = async (editingplayer, position) => {
    let temp_lineups = lineups;
    let temp_players = players.filter((tem, idx) => tem.position === position);
    for(let i = 0; i < temp_lineups.length; i ++) {
      if(temp_lineups[i].totalSalary === editingplayer.totalSalary) {
        for(let j = 0; j < temp_lineups[i].lineup.length; j ++) {
          if (temp_lineups[i].lineup[j]._id === editingplayer._id) {
            let duplicated_player = temp_lineups[i].lineup.filter(dup => dup.position === position);
            if (duplicated_player.length !== 0) {
              setDuplicatedFlag({
                flag: true,
                totalSalary: temp_lineups[i].totalSalary,
                _id: duplicated_player[0]._id
              });
              return;
            }
            if (j === 0) {
              temp_lineups[i].totalSalary = Number(temp_lineups[i].totalSalary) - Number(temp_lineups[i].lineup[j].salaryCaptain) + Number(temp_players[0].salaryCaptain);
            } else {
              temp_lineups[i].totalSalary = Number(temp_lineups[i].totalSalary) - Number(temp_lineups[i].lineup[j].salaryFlex) + Number(temp_players[0].salaryFlex);
            }
            temp_lineups[i].lineup[j].team = temp_players[0].team;
            temp_lineups[i].lineup[j].name = temp_players[0].name;
            temp_lineups[i].lineup[j].id = temp_players[0].id;
            temp_lineups[i].lineup[j].position = temp_players[0].position;
            temp_lineups[i].lineup[j].salaryCaptain = temp_players[0].salaryCaptain;
            temp_lineups[i].lineup[j].salaryFlex = temp_players[0].salaryFlex;
            temp_lineups[i].lineup[j].totalSalary = temp_lineups[i].totalSalary;
            setDuplicatedFlag({
              flag: false,
              totalSalary: 0,
              _id: "0"
            });
          }
        }
      }
    }
    
    let lineup = [];
    for (let i = 0; i < temp_lineups.length; i++) {
      for (let j = 0; j < temp_lineups[i].lineup.length; j++) {
        if (editingplayer._id === temp_lineups[i].lineup[j]._id) {
          lineup = temp_lineups[i];
          setEditingPlayer({ _id: "0", totalSalary: 0 });
          break;
        }
      }
    }
    setLineups([]);
    await updateLineup(lineup);
    await fetchPlayers();
  };
  const onSort = async () => {
    let temp_lineups = lineups;
    for (let i = 0; i < lineups.length; i ++) {
      let totalSalary = 0;
      for (let j = 0; j < lineups[i].lineup.length; j ++) {
        let player = players.filter((player) => player.position === temp_lineups[i].lineup[j].position)[0];
        if (player !== undefined ) {
          temp_lineups[i].lineup[j].team = player.team;
          temp_lineups[i].lineup[j].name = player.name;
          temp_lineups[i].lineup[j].id = player.id;
          temp_lineups[i].lineup[j].position = player.position;
          if (j === 0) {
            totalSalary += Number(player.salaryCaptain);
            temp_lineups[i].lineup[j].totalSalary = totalSalary;
          } else {
            totalSalary += Number(player.salaryFlex);
            temp_lineups[i].lineup[j].totalSalary = totalSalary;
          }
          temp_lineups[i].lineup[j].salaryCaptain = player.salaryCaptain;
          temp_lineups[i].lineup[j].salaryFlex = player.salaryFlex;
        } else {
          if (j === 0) {
            totalSalary += Number(temp_lineups[i].lineup[j].salaryCaptain);
            temp_lineups[i].lineup[j].totalSalary = totalSalary;
          } else {
            totalSalary += Number(temp_lineups[i].lineup[j].salaryFlex);
            temp_lineups[i].lineup[j].totalSalary = totalSalary;
          }
        }
      }
      temp_lineups[i].totalSalary = totalSalary;
    }
    let temp1_lineups = temp_lineups;
    // temp1_lineups.sort((a, b) => b.totalSalary - a.totalSalary);
    setLineups([...temp1_lineups]);
    await updateLineups(temp1_lineups);
  };
  const generateUniqueRandomString = () => {
    // Get current date and time
    const now = new Date();
    
    // Extract year, month, day, hour, minute, second
    const year = now.getFullYear().toString().padStart(4, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    const second = now.getSeconds().toString().padStart(2, '0');
  
    // Define our character set
    const charSet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  
    // Create a set to store used characters
    const usedChars = new Set();
  
    // Function to get a unique random character
    function getRandomChar() {
      let char;
      do {
        char = charSet[Math.floor(Math.random() * charSet.length)];
      } while (usedChars.has(char));
      usedChars.add(char);
      return char;
    }
  
    // Combine date components and random characters
    let result = '';
    for (let i = 0; i < 20; i++) { // Adjust length as needed
      if (i < 12) {
        result += `${year}${month}${day}${hour}${minute}${second}`;
      } else {
        result += getRandomChar();
      }
    }
  
    return result;
  }

  const onAddHandleLineup = async () => {
    let lineup= [];
    lineup = {
      team: "Team A",
      name: "",
      id: "",
      position: "",
      salaryFlex: 0,
      salaryCaptain: 0,
      totalSalary: 0,
    };
    await createLineup(lineup);
    await fetchPlayers();
  };

  const deletePlayer = async (id, position) => {
    setPlayers(players.filter(player => player.id !== id));
    await removePlayer(id);
  };
  
  const onCheckHandle = (id) => {
    id = Number(id);
    let arrays = checkedArrays;
    if (arrays.includes(id)) {
      arrays = arrays.filter(item => item !== id);
    } else {
      arrays.push(id);
    }
    setCheckedArrays(arrays);
  }
  // Convert the lineups to CSV format
  const convertLineupsToCSV = () => {
    const csvRows = [
      ['CPT', 'FLEX', 'FLEX', 'FLEX', 'FLEX', 'FLEX']
    ];

    // let fitlerA = lineups.filter((_, index) => {
    //   return checkedArrays.includes(index)
    // });

    lineups.forEach(lineup => {
      if (lineup.totalSalary <= MAX_SALARY) {
        const row = [];
          row.push(lineup.lineup[0].name); // Captain Name
          row.push(lineup.lineup[1].id); // Captain Name
          row.push(lineup.lineup[2].id); // Captain Name
          row.push(lineup.lineup[3].id); // Captain Name
          row.push(lineup.lineup[4].id); // Captain Name
          row.push(lineup.lineup[5].id); // Captain Name
          csvRows.push(row);
      }
    });

    return csvRows.map(row => row.join(',')).join('\n');
  };

  const handleDownloadCSV = () => {
    // if (checkedArrays.length === 0) {
    //   return;
    // }
    const csvData = convertLineupsToCSV();
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'lineups.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  const handleDeleteLineup = async (idx) => {
    let temp_lineup = lineups[idx];
    await removeLineup(temp_lineup.lineup);
    fetchPlayers();
  }

  const doLogin = () => {
    if(username === "NFL" && password === "Rocky1357!") {
      setLogged(true);
      window.localStorage.setItem("logged", "true");
    } else {
      setLogged(false);
      window.localStorage.setItem("logged", "false");
    }
  }

  useEffect(() => {
    fetchPlayers();
    let flag = window.localStorage.getItem("logged");
    if (flag === "true") {
      setLogged(true);
    } else {
      setLogged(false);
    }
  }, []);

  return (
    <div className="p-5">
      {logged &&
        <div>
          <div className="flex justify-center mb-6">
            <div className="text-center">
              <h1 className="text-lg font-bold mt-2 mr-12">NFL Information</h1>
            </div>
            <span
              className='absolute top-7 right-20 cursor-pointer text-lg font-bold text-red-500'
              onClick={() => {
                window.localStorage.removeItem("logged");
                setLogged(false);
              }}
            >
              Log out
            </span>
          </div>
          {/* Player Input and Player Table */}
          <div className="flex justify-center">
            {/* Players Table */}
            <div className="">
              <PlayersTable
                tableName="Team A"
                optimizeFlag={false}
                players={players}
                deletePlayer={deletePlayer}
                addPlayer={addPlayer} 
                onOptimize={onOptimize}
              />
              <PlayersTable
                tableName="Team B"
                optimizeFlag={false}
                players={players}
                deletePlayer={deletePlayer}
                addPlayer={addPlayer} 
                onOptimize={onOptimize}
              />
            </div>
            <LineupTable 
              players={lineups}
              handleDownloadCSV={handleDownloadCSV}
              editingPlayer={editingPlayer}
              editPlayer={editPlayer}
              savePlayer={savePlayer}
              setEditingPlayer={setEditingPlayer}
              duplicatedFlag={duplicatedFlag}
              setDuplicatedFlag={setDuplicatedFlag}
              onSort={onSort}
              onAddHandleLineup={onAddHandleLineup}
              onCheckHandle={onCheckHandle}
              handleDeleteLineup={handleDeleteLineup}
            />
          </div>
        </div>
      }
      {!logged &&
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-[400px] h-[280px]">
        <form className="space-y-2">
          <div>
            <label htmlFor="username" className="block text-sm font-medium">Username</label>
            <input 
              type="text" 
              id="username" 
              onChange={(e) => setUserName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium">Password</label>
            <input 
              type="password" 
              id="password" 
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <br />
          <button onClick={doLogin} className="w-full mt-40 bg-indigo-600 py-2 px-4 rounded-md text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Login
          </button>
        </form>
      </div>
    </div>
      }
    </div>
  );
}

export default NFLData;