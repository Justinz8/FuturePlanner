import './FiltersMenu.css'
import { useState, useEffect } from 'react'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel';

export default function FiltersMenu(params) {
	const PrimaryUTSCColor = '#25355A'

    return (
        <div  className='FilterDiv'>
            <ul className='FilterList'>
                <li>
					<FormControlLabel control={<Checkbox onClick={params.changeFallFilterFunc} sx={{color: PrimaryUTSCColor, '&.Mui-checked': {color: PrimaryUTSCColor,}, padding: 0, margin: 0, marginRight: 1}} />} label="Fall Courses" />
                </li>
                <li>
					<FormControlLabel control={<Checkbox onClick={params.changeWinterFilterFunc} sx={{color: PrimaryUTSCColor, '&.Mui-checked': {color: PrimaryUTSCColor,}, padding: 0, margin: 0, marginRight: 1}} />} label="Winter Courses" />
                </li>
                <li>
					<FormControlLabel control={<Checkbox onClick={params.changeSummerFilterFunc} sx={{color: PrimaryUTSCColor, '&.Mui-checked': {color: PrimaryUTSCColor,}, padding: 0, margin: 0, marginRight: 1}} />} label="Summer Courses" />
                </li>
                <li>
					<div className="SubjectSelectUTSC">
                    	<select onChange={params.changeSubjectFilterFunc}>
							<option value="ALL">All Subjects</option>
							<option value="AFS">African Studies</option>
							<option value="ANT">Anthropology</option>
							<option value="VPH">Art History and Visual Culture</option>
							<option value="ACM">Arts, Culture and Media</option>
							<option value="VPA">Arts Management</option>
							<option value="AST">Astronomy</option>
							<option value="BIO">Biological Sciences</option>
							<option value="CHM">Chemistry</option>
							<option value="CIT">City Studies</option>
							<option value="CLA">Classical Studies</option>
							<option value="CSC">Computer Science</option>
							<option value="CRT">Curatorial Studies</option>
							<option value="DTS">Diaspora and Transnational Studies</option>
							<option value="MGE">Economics for Management Studies</option>
							<option value="ENG">English</option>
							<option value="EES">Environmental Science</option>
							<option value="EST">Environmental Studies</option>
							<option value="FST">Food Studies</option>
							<option value="FRE">French</option>
							<option value="GGR">Geography</option>
							<option value="GAS">Global Asia Studies</option>
							<option value="GLB">Global Leadership</option>
							<option value="HLT">Health Studies</option>
							<option value="HCS">Historical and Cultural Studies</option>
							<option value="HIS">History</option>
							<option value="IDS">International Development Studies</option>
							<option value="JOU">Journalism</option>
							<option value="ECT">Languages</option> 
							<option value="LIN">Linguistics</option>
							<option value="MGA">Management</option>
							<option value="MAT">Mathematics</option>
							<option value="MDS">Media Studies</option>
							<option value="MUZ">Music and Culture</option>
							<option value="NRO">Neuroscience</option>
							<option value="NME">New Media Studies</option>
							<option value="PMD">Paramedicine</option>
							<option value="PHL">Philosophy</option>
							<option value="PSC">Physical Sciences</option>
							<option value="PHY">Physics and Astrophysics</option>
							<option value="POL">Political Science</option>
							<option value="PSY">Psychology</option>
							<option value="PPG">Public Policy</option>
							<option value="RLG">Religion</option>
							<option value="SOC">Sociology</option>
							<option value="STA">Statistics</option>
							<option value="VPS">Studio Art</option>
							<option value="CTL">Centre for Teaching and Learning</option>
							<option value="THR">Theatre and Performance</option>
							<option value="WST">Women's and Gender Studies</option>`
                    	</select>
					</div>
                </li>
                <li>
					<div className="YearSelectUTSC">
                    	<select onChange={params.changeYearFilterFunc}>
	                        <option value="ALL">Any Year</option>
    	                    <option value="A">First Year</option>
        	                <option value="B">Second Year</option>
            	            <option value="C">Third Year</option>
                	        <option value="D">Fourth Year</option>
                    	    <option value="E">How many years can u be at utsc lil oz?</option>
                    	</select>
					</div>
                </li>
            </ul>
        </div>
    )

}