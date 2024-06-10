import { useState } from 'react'
import './Login.css'

export default function Login(props) {




    const [loginValues, setLoginValues] = useState({username: '', password: ''})
    const [error, setError] = useState('')
    
    function handleLoginForm(event){
        const {name, value} = event.target
        setLoginValues({...loginValues, [name]: value})
    }
    
    async function handleLoginSubmit(event){
        event.preventDefault()
        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginValues),
            credentials: "include",
        }).then(result => result.json()).then(data => {
            if(data.message) {
                window.location.pathname = '/'
            }
            if(data.error) setError(data.error)
        }).catch(err => console.log(err))
    }

    return (
        <div className='login-Wrapper'>
            <div className="login">
                <h1 className="login-title">Login</h1>
                <p>{error}</p>
                <form className="login-form" onSubmit={handleLoginSubmit}>
                    <label htmlFor="login-username">Username</label>
                    <br />
                    <input type="username" id="login-username" name="username" onChange={handleLoginForm}/>
                    <br />
                    <label htmlFor="login-password">Password</label>
                    <br />
                    <input type="password" id="login-password" name="password" onChange={handleLoginForm}/>
                    <br />
                    <p><a href="/signup">Signup</a></p>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    )
}