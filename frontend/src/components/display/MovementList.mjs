import React from 'react';
import MovementRow from './MovementRow.mjs';

function MovementList({ movements }) {
    return (
        <table id="movements" className="movements">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Key</th>
                </tr>
            </thead>
            <tbody>
                {movements.map((movement, i) => 
                    <MovementRow 
                        movement={movement} 
                        key={i}
                    />)}
            </tbody>
        </table>
    );
}

export default MovementList;