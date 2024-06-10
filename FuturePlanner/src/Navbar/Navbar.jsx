import './Navbar.css'
import { useState } from 'react'

export default function Navbar(props) {

    const [SignOutDropdown, SetSignOutDropdown] = useState(false)

    return (
        <nav className='Navbar-Wrapper'>
            <div className='Page-Redirects'>
                <ul>
                    <li>
                        <a href='./'>Home</a>
                    </li>
                    <li>
                        <a href='./uoft'>UofT</a>
                    </li>
                    <li>
                        <a href='./uw'>UW</a>
                    </li>
                    <li>
                        <a href='./about'>About</a>
                    </li>
                    <li>
                        <a href='./credits'>Credits</a>
                    </li>
                    <li>
                        <a href='./termspolicies'>Terms and Policies</a>
                    </li>
                    
                </ul>
            </div>
            <div className='Account'>
                <h4 className='SignIn-Title'>
                    {props.myUsername && `Signed in as ${props.myUsername}`}
                </h4>
                <button className='DeleteAccount-DropDown' onClick={()=>SetSignOutDropdown(x => !x)}>
                    <div className='DeleteAccount-DownArrow' style={SignOutDropdown ? {transform: 'translate(-50%, -50%) rotate(-45deg)'} : {}}>

                    </div>
                </button>
                <div className='SignoutButton-Wrapper' style={{width: SignOutDropdown ? '150px' : 0}}>
                    <button className='Logout-Button' style={{width: "150px"}} onClick={props.deleteUser}>
                        <p>
                            Delete Account
                        </p>
                    </button>
                </div>
                
                <button className='Logout-Button' onClick={props.logOut}>
                    <p>
                        Logout
                    </p>
                </button>
            </div>
        </nav>
    )
}