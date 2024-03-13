import React from 'react';
import ComposerRow from './ComposerRow.mjs';

function ComposerList({ composers, onDelete, onEdit }) {
    return (
        <table id="composers" className="composers">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Birth Date</th>
                    <th>Death Date</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {composers.map((composer, i) => 
                    <ComposerRow 
                        composer={composer} 
                        key={i}
                        onDelete={onDelete}
                        onEdit={onEdit} 
                    />)}
            </tbody>
        </table>
    );
}

export default ComposerList;