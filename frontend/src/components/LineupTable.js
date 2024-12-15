import React, { useState } from 'react';
// const positionsA = [
//     'QB1A', 'RB1A', 'RB2A', 'RB3A', 'WR1A', 'WR2A', 'WR3A', 'WR4A', 'WR5A', 
//     'TE1A', 'TE2A', 'TE3A', 'K1A', 'DEF1A'
// ];

// const positionsB = [
//   'QB1B', 'RB1B', 'RB2B', 'RB3B', 'WR1B', 'WR2B', 'WR3B', 'WR4B', 'WR5B', 
//   'TE1B', 'TE2B', 'TE3B', 'K1B', 'DEF1B',
// ];

const positionAll = [
    'QB1A', 'RB1A', 'RB2A', 'RB3A', 'WR1A', 'WR2A', 'WR3A', 'WR4A', 'WR5A', 
    'TE1A', 'TE2A', 'TE3A', 'K1A', 'DEF1A',
    'QB1B', 'RB1B', 'RB2B', 'RB3B', 'WR1B', 'WR2B', 'WR3B', 'WR4B', 'WR5B', 
    'TE1B', 'TE2B', 'TE3B', 'K1B', 'DEF1B',
];
function LineupTable({ players, handleDownloadCSV, editingPlayer, editPlayer, savePlayer, setEditingPlayer, duplicatedFlag, setDuplicatedFlag, onSort, onAddHandleLineup, onCheckHandle, handleDeleteLineup }) {

    const [isOpen, setIsOpen] = useState(-1);
    const [position, setPosition] = useState(""); // edited position
    // const [playerPosition, setPlayerPosition] = useState([]); // Position selections
    const toggleCollapse = (index) => () => {
        if(isOpen === index)
            setIsOpen(-1)
        else setIsOpen(index);
    };

    const onClickDownloadCSV = () => {
        handleDownloadCSV()
    }
    
    const onEditPlayer = (_id, totalSalary, position) => {
        setDuplicatedFlag({
            flag: false,
            totalSalary: 0,
            _id: "0"
        });
        editPlayer(_id, totalSalary);
        let lastLetter = position[position.length - 1];
        if (lastLetter === 'A') {
            // setPlayerPosition(positionsA);
        } else {
            // setPlayerPosition(positionsB);
        }
    }

    const handleSave = () => {
        savePlayer(editingPlayer, position);
    };
  
    const handleCancel = () => {
        setEditingPlayer({ _id: "0", totalSalary: 0 });
        setDuplicatedFlag({
            flag: false,
            totalSalary: 0,
            _id: "0"
        });
    }

    const handleChange = (e) => {
        setPosition(e.target.value);
    };

    const handleSort = () => {
        onSort();
    }

    const onAddLineup = () => {
        onAddHandleLineup();
    }

    const handleCheckboxChange = (e) => {
        onCheckHandle(e.target.name);
    }

    return (
      <div className="w-1/2 border p-3 ml-3 h-full">
        <div className='flex justify-between'>
            <button
                onClick={onAddLineup}
                className="px-4 py-2 mb-3 mr-2 bg-blue-500 text-white rounded"
            >
                Add Lineup
            </button>
            <button
                onClick={onClickDownloadCSV}
                className="px-4 py-2 mb-3 mr-2 bg-blue-500 text-white rounded"
            >
                Download CSV
            </button>
            <button
                onClick={handleSort}
                className="px-4 py-2 mb-3 mr-2 bg-green-500 text-white rounded"
            >
                Optimize Lineups
            </button>
        </div>
        { players !== undefined && players.length > 0 ? players.map((player1, index) => (
            <div key={"players"+index} className='border p-3 ml-3'>
                {/* <label class="flex items-center space-x-2">
                    <input type="checkbox" name={index} onChange={handleCheckboxChange} class="form-checkbox h-5 w-5 text-blue-600" />
                    <span class="text-gray-700">Check Me</span>
                </label> */}
                <div className='flex flex-row justify-between collapse-toggle mt-2 p-2 bg-gray-500 text-white rounded cursor-pointer'>
                    <h3 className="font-bold mb-2" onClick={toggleCollapse(index)}>Lineup #{index+1}</h3>
                    <h3 className="font-bold mb-2" onClick={toggleCollapse(index)}>TotalSalary: <span>{player1.totalSalary}</span></h3>
                    <h3 className="font-bold mb-2 text-red-500" onClick={() => handleDeleteLineup(index)}>Delete</h3>
                </div>
                {isOpen === index && <table className="w-full text-center">
                    <thead>
                        <tr>
                        <th className="border p-2">Position</th>
                        <th className="border p-2">Label</th>
                        <th className="border p-2">Player Name</th>
                        <th className="border p-2">Salary</th>
                        <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    
                        {player1 !== undefined && player1.lineup.length > 0 ? player1.lineup.map((player, idx) => (
                        <tr 
                            className={duplicatedFlag.flag && duplicatedFlag.id === player.id && duplicatedFlag.totalSalary === player1.totalSalary ? 'text-red-500' : ''}
                            key={player.id}
                        >
                            <td className="border p-2">{idx===0 ? "Captain" : "Flex"}</td>
                            <td className="border p-2">
                                {editingPlayer._id === player._id && editingPlayer.totalSalary === player1.totalSalary ? (
                                    <div>
                                        <select
                                            name="position"
                                            defaultValue=""
                                            value={position}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded mb-0"
                                            >
                                            <option value="">Select Position</option>
                                            {/* {playerPosition.map(pos => (
                                                <option key={pos} value={pos}>
                                                {pos}
                                                </option>
                                            ))} */}
                                            {positionAll.map(pos => (
                                                <option key={pos} value={pos}>
                                                {pos}
                                                </option>
                                            ))}
                                        </select>
                                        {
                                            duplicatedFlag.flag && (
                                                <p className='text-red-700'>Duplicated Player in the Lineup</p>
                                            )
                                        }
                                    </div>
                                    
                                ) : (
                                    <p>{player.position}</p>
                                )}
                            </td>
                            <td className="border p-2">{idx===0 ? player.name : player.id}</td>
                            <td className="border p-2">{idx===0 ? player.salaryCaptain : player.salaryFlex}</td>
                            <td className="border p-2">
                            {editingPlayer._id === player._id && editingPlayer.totalSalary === player.totalSalary ? (
                                <>
                                <button onClick={handleSave} className="text-green-500 mr-2">Save</button>
                                <button onClick={handleCancel} className="text-red-500 ml-2">Cancel</button>
                                </>
                            ) : (
                                <>
                                <button onClick={() => onEditPlayer(player._id, player1.totalSalary, player.position)} className="text-blue-500 mr-2">Edit</button>
                                </>
                            )}
                            </td>
                        </tr>
                        )): null}
                    </tbody>
                    <tfoot>
                        <tr>
                        <td colSpan="3" className='text-blue-500'>Total</td>
                        <td className='text-blue-500'>{players !== undefined && players.length > 0 && player1.totalSalary}</td>
                        </tr>
                    </tfoot>
                </table>}
            </div>
        )) : <h1>No Lineups!</h1> }         
      </div>
    )

}

export default LineupTable;