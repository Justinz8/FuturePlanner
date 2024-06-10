import React from 'react';
import './FiltersButton.css'

export default function FiltersButton(params) {

    return (
        <button className='FilterButtonUTSC' onClick={params.handler}>{params.label}</button>
    )
}