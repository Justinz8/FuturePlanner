import './ReleaseNotes.css'

export default function ReleaseNotes() {
    return (
        <div className='Release-Notes-Body'>
            <h3 className='Version-Title'>Version: 1.0.0</h3>
            <h4>Initial release</h4>
            <p className="Version-Date">June 9th, 2024</p>
            <p className='Version-Notes'>Notes</p>
            <ul>
                <li>Added UofT and UW course selection</li>
            </ul>
        </div>
    )
}