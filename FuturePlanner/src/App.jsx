import Navbar from './Navbar/Navbar'
import Home from './pages/home/Home'
import Scarb from './pages/utsc/Utsc'
import Uw from './pages/uwaterloo/Waterloo'
import About from './pages/about/About'
import Login from './pages/login/Login'
import StillThere from './pages/login/StillThere'
import Signup from './pages/login/Signup'
import TermsPolicies from './pages/terms and policies/TermsPolicies'
import Credits from './pages/credits/Credits'
import { useInterval } from './CustomHooks/useInterval'

import { useEffect, useState, useRef } from 'react'

function App() {
    const [ToRender, SetToRender] = useState()

    function SetToRenderHelper(MainContent){
        SetToRender(x => (<div>
            {x}
            {MainContent}
        </div>))
    }

    const [LoggedInTime, SetLoggedInTime] = useState(0)

    const TimeOutTime = 60000 * 5;
    const [TimedOut, SetTimedOut] = useState(false)
    const TimeOutTimer = useRef();

    function deleteUser(){
        fetch('http://localhost:3000/deleteuser', {
            method: 'GET',
            credentials: 'include'
        }).then((response) => {
            return response.json()
        }).then((data) => {
            window.location.href = '/login'
            localStorage.clear()
            console.log(data)
        }).catch((err) => {
            console.log(err)
        })
    }

    function logOut(){
        fetch('http://localhost:3000/logout', {
            method: 'POST',
            credentials: 'include'
        }).then((response) => {
            return response.json()
        }).then((data) => {
            window.location.href = '/login'
            localStorage.clear()
            console.log(data)
        }).catch((err) => {
            console.log(err)
        })
    }

    function TimeOutListenerFunction(){
        clearTimeout(TimeOutTimer.current);
        SetTimedOut(false)
        TimeOutTimer.current = setTimeout(() => {
            SetTimedOut(true);
        }, TimeOutTime);
    }

    useEffect(() => {
        SetTimedOut(false)
        TimeOutTimer.current = setTimeout(() => {
            SetTimedOut(true);
            
        }, TimeOutTime);
        window.addEventListener('mousedown', TimeOutListenerFunction);

        return () => {
            window.removeEventListener('mousedown', TimeOutListenerFunction);
            clearTimeout(TimeOutTimer.current);
        }
    }, []);

    async function intervalFunction(logInTime){
        if(!logInTime) return

        const timeSinceLogIn = parseInt(Date.now()) - parseInt(logInTime)

        if(timeSinceLogIn > 60000*30 && !TimedOut){ //if the time since log in is greater than 30 minutes and not currently timed out then refresh the session
            fetch('http://localhost:3000/refreshSession', {
                method: 'GET',
                credentials: 'include'
            }).then((response) => {
                return response.json()
            }).then((data) => {
                SetLoggedInTime(data.logInTime)
            }).catch((err) => {
                console.log(err)
            })
        }
    }

    const checkForSessionRefreshIntervalTime = 30000 //time in milliseconds to check if the session needs to be refreshed
    useInterval(()=>{intervalFunction(LoggedInTime)} , LoggedInTime ? checkForSessionRefreshIntervalTime : null)
    
    useEffect(() => {
        fetch('http://localhost:3000/checklogin', {
            method: 'GET',
            credentials: 'include'
        }).then((response) => {
            return response.json()
        }).then((loggedIn) => {
            if(loggedIn.logInTime){
                SetLoggedInTime(loggedIn.logInTime)
            }
            if(window.location.pathname !== '/login' && window.location.pathname !== '/signup' && window.location.pathname !== '/termspolicies' && loggedIn.error!==undefined){
                window.location.href = '/login'
                localStorage.clear()
                return 
            }else if((window.location.pathname === '/login' || window.location.pathname === '/signup') && loggedIn.message === 'Logged in!'){
                window.location.href = '/'
                return 
            }
            SetToRender()
            if(loggedIn.message === 'Logged in!') {
                SetToRender(<Navbar myUsername={loggedIn.username} logOut={logOut} deleteUser={deleteUser}/>)
            }

            switch (window.location.pathname) {
                case '/':
                    SetToRenderHelper(<Home />)
                    return
                case '/uoft':
                    SetToRenderHelper(<Scarb />)
                    return
                case '/uw':
                    SetToRenderHelper(<Uw />)
                    return
                case '/about':
                    SetToRenderHelper(<About />)
                    return
                case '/login':
                    SetToRenderHelper(<Login />)
                    return
                case '/signup':
                    SetToRenderHelper(<Signup />)
                    return
                case '/credits':
                    SetToRenderHelper(<Credits />)
                    return
                case '/termspolicies':
                    SetToRenderHelper(<TermsPolicies />)
                    return
                default:
                    SetToRenderHelper(<Home />)
            }
            
        }).catch((err) => {
            console.log(err)
        })
    }, [])

    return (
        <>
            {ToRender}
            {(TimedOut && LoggedInTime) ? <StillThere /> : ''}
        </>
    )
}

export default App