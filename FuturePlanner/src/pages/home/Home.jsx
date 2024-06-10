import './Home.css'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import ReleaseNotes from './Components/ReleaseNotes';

export default function Home() {
    return (
        <div className='Home-Wrapper'>
            <div className='Home-Body'>
                <div className='Home-Title'>
                    <h1>Future course planner</h1>
                    <p>1.0.0</p>
                </div>
                <br></br>
                <p>The future course planner is a website that allows students from the University of Toronto Scarborough and the University of Waterloo to plan out their undergraduate career. The website allows students to plan out their courses for the next few years and see what courses they need to take in order to graduate. The website also allows students to see what courses they have taken and what courses they have left to take in order to graduate.</p>
                <h2>Features</h2>
                <ul>
                    <li>Complete list of offered courses</li>
                    <li>Easy to use drag and drop interface</li>
                    <li>Ability to save and load course plans</li>
                    <li>Prerequisite, corequisite and antirequisite information</li>
                    <li>Fully open source, available at <a href="">repo link here</a></li>
                </ul>
                <h2>Built with</h2>
                <ul>
                    <li>React + Vite</li>
                    <li>Express</li>
                    <li>Postgres</li>
                </ul>
                <Popup trigger={<button className='Release-Notes-Button'>Release notes</button>} modal nested>
                    {close => (
                        <div className='modal'>
                            <ReleaseNotes />
                            <div>
                                <button className='Close-Button' onClick={() => close()}>Close</button>
                            </div>
                        </div>
                    )}
                </Popup>
            </div>
        </div>
        
    )
}