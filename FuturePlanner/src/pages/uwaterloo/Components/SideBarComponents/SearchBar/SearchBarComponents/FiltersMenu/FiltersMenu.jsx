import './FiltersMenu.css'
import { useState, useEffect } from 'react'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel';

export default function FiltersMenu(params) {
	const PrimaryUWColor = '#FED34C'
    
    return (
        <div className='FilterDiv'>	
            <ul className='FilterList'>
                <li>
					<FormControlLabel control={<Checkbox onClick={params.changeFallFilterFunc} sx={{color: PrimaryUWColor, '&.Mui-checked': {color: PrimaryUWColor,}, padding: 0, margin: 0, marginRight: 1}} />} label="Fall Courses" />	
                </li>
                <li>
					<FormControlLabel control={<Checkbox onClick={params.changeWinterFilterFunc} sx={{color: PrimaryUWColor, '&.Mui-checked': {color: PrimaryUWColor,}, padding: 0, margin: 0, marginRight: 1}} />} label="Winter Courses" />
                </li>
                <li>
					<FormControlLabel control={<Checkbox onClick={params.changeSpringFilterFunc} sx={{color: PrimaryUWColor, '&.Mui-checked': {color: PrimaryUWColor,}, padding: 0, margin: 0, marginRight: 1}} />} label="Spring Courses" />
                </li>
                <li>
					<div className="SubjectSelectUW">
                    	<select onChange={params.changeSubjectFilterFunc}>
							<option value="ALL">All Subjects</option>
							<option value="AFM">Accounting and Financial Management</option>
							<option value="ACTSC">Actuarial Science</option>
							<option value="ASL">American Sign Language</option>
							<option value="ANTH">Anthropology</option>
							<option value="APPLS">Applied Language Studies</option>
							<option value="AMATH">Applied Mathematics</option>
							<option value="ARABIC">Arabic</option>
							<option value="AE">Architectural Engineering</option>
							<option value="ARCH">Architecture</option>
							<option value="ARTS">Arts</option>
							<option value="ARBUS">Arts and Business</option>
							<option value="AVIA">Aviation</option>
							<option value="BIOL">Biology</option>
							<option value="BME">Biomedical Engineering</option>
							<option value="BLKST">Black Studies</option>
							<option value="BASE">Bridge to Academic Success in English</option>
							<option value="BUS">Business (Wilfrid Laurier University)</option>
							<option value="BET">Business, Entrepreneurship and Technology</option>
							<option value="CDNST">Canadian Studies</option>
							<option value="CHE">Chemical Engineering</option>
							<option value="CHEM">Chemistry</option>
							<option value="CHINA">Chinese</option>
							<option value="CMW">Church Music and Worship</option>
							<option value="CIVE">Civil Engineering</option>
							<option value="CLAS">Classical Studies</option>
							<option value="COGSCI">Cognitive Science</option>
							<option value="CO">Combinatorics and Optimization</option>
							<option value="COMM">Commerce</option>
							<option value="COMMST">Communication Studies</option> 
							<option value="CS">Computer Science</option>
							<option value="CFM">Computing and Financial Management</option>
							<option value="COOP">Co-operative Work Term</option>
							<option value="CROAT">Croatian</option>
							<option value="CI">Cultural Identities</option>
							<option value="DAC">Digital Arts Communication</option>
							<option value="DUTCH">Dutch</option>
							<option value="EARTH">Earth Sciences</option>
							<option value="EASIA">East Asian Studies</option>
							<option value="ECON">Economics</option>
							<option value="ECE">Electrical and Computer Engineering</option>
							<option value="ENGL">English</option>
							<option value="EMLS">English for Multilingual Speakers</option>
							<option value="ENVS">Environment</option>
							<option value="ENBUS">Environment and Business</option>
							<option value="ERS">Environment, Resources and Sustainability</option>
							<option value="ENVE">Environmental Engineering</option>
							<option value="FINE">Fine Arts</option>
							<option value="FR">French Studies</option>
							<option value="GSJ">Gender and Social Justice</option>
							<option value="GENE">General Engineering</option>
							<option value="GEOG">Geography and Environmental Management</option>
							<option value="GEOE">Geological Engineering</option>
							<option value="GER">German</option>
							<option value="GERON">Gerontology</option>
							<option value="GBDA">Global Business and Digital Arts</option>
							<option value="GRK">Greek</option>
							<option value="HEALTH">Health</option>
							<option value="HHUM">Health Humanities</option>
							<option value="HIST">History</option>
							<option value="HRM">Human Resources Management</option>
							<option value="HRTS">Human Rights</option>
							<option value="HUMSC">Human Sciences</option>
							<option value="INDENT">Indigenous Entrepreneurship</option>
							<option value="INDG">Indigenous Studies</option>
							<option value="INDEV">International Development</option>
							<option value="INTST">International Studies</option>
							<option value="ITAL">Italian</option>
							<option value="ITALST">Italian Studies</option>
							<option value="JAPAN">Japanese</option>
							<option value="JS">Jewish Studies</option>
							<option value="KIN">Kinesiology</option>
							<option value="INTEG">Knowledge Integration</option>
							<option value="KOREA">Korean</option>
							<option value="LAT">Latin</option>
							<option value="LS">Legal Studies</option>
							<option value="MGMT">Management</option>
							<option value="MSE">Management Science and Engineering</option>
							<option value="MNS">Materials and Nano-Sciences</option>
							<option value="MATBUS">Mathematical Business</option>
							<option value="MATH">Mathematics</option>
							<option value="MTHEL">Mathematics Electives</option>
							<option value="ME">Mechanical Engineering</option>
							<option value="MTE">Mechatronics Engineering</option>
							<option value="MEDVL">Medieval Studies</option>
							<option value="MENN">Mennonite Studies</option>
							<option value="MOHAWK">Mohawk</option>
							<option value="MUSIC">Music</option>
							<option value="NE">Nanotechnology Engineering</option>
							<option value="OPTOM">Optometry</option>
							<option value="PACS">Peace and Conflict Studies</option>
							<option value="PHARM">Pharmacy</option>
							<option value="PHIL">Philosophy</option>
							<option value="PHYS">Physics</option>
							<option value="PLAN">Planning</option>
							<option value="PSCI">Political Science</option>
							<option value="PORT">Portuguese</option>
							<option value="PD">Professional Development</option>
							<option value="PDARCH">Professional Development for Architecture Students</option>
							<option value="PDPHRM">Professional Development for Pharmacy Students</option>
							<option value="PSYCH">Psychology</option>
							<option value="HLTH">Public Health Sciences</option>
							<option value="PMATH">Pure Mathematics</option>
							<option value="REC">Recreation and Leisure Studies</option>
							<option value="RS">Religious Studies</option>
							<option value="RUSS">Russian</option>
							<option value="REES">Russian and East European Studies</option>
							<option value="SCI">Science</option>
							<option value="SCBUS">Science and Business</option>
							<option value="SMF">Sexuality, Marriage, and Family Studies</option>
							<option value="SDS">Social Development Studies</option>
							<option value="SOCWK">Social Work (Social Development Studies)</option>
							<option value="SWREN">Social Work (Bachelor of Social Work)</option>
							<option value="STV">Society, Technology and Values</option>
							<option value="SOC">Sociology</option>
							<option value="SE">Software Engineering</option>
							<option value="SPAN">Spanish</option>
							<option value="STAT">Statistics</option>
							<option value="SI">Studies in Islam</option>
							<option value="SFM">Sustainability and Financial Management</option>
							<option value="SYDE">Systems Design Engineering</option>
							<option value="THPERF">Theatre and Performance</option>
							<option value="UNIV">University</option>
							<option value="VCULT">Visual Culture</option>
							<option value="WKRPT">Work-term Report</option>
                    	</select>
					</div>
                </li>
                <li>	
					<div className="YearSelectUW">
						<select onChange={params.changeYearFilterFunc}>
	                        <option value="ALL">Any Year</option>
    	                    <option value="1">First Year</option>
        	                <option value="2">Second Year</option>
            	            <option value="3">Third Year</option>
                	        <option value="4">Fourth Year</option>
                    	    <option value="5">How many years can u be at utsc lil oz?</option>
                    	</select>
					</div>
                </li>
            </ul>
        </div>
    )
}