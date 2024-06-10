import { useState } from "react"
import './Signup.css'

export default function Signup(){
    const [signupValues, setSignupValues] = useState({username: '', password: ''})
    const [error, setError] = useState('')

    function handleSignupForm(event){
        const {name, value} = event.target
        setSignupValues({...signupValues, [name]: value})
    }
    
    
    async function handleSignupSubmit(event){
        event.preventDefault()
        fetch('http://localhost:3000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signupValues),
            credentials: "include"
        }).then(response => response.json()).then(data => {
            if(data.message) {
                window.location.pathname = '/login'
            }
            if(data.error) setError(data.error)
        }).catch(err => console.log(err))
    }
    return (
    <div className="signup-Wrapper">
        <div className="signup">
            <h1 className="signup-title">Signup</h1>
            <p>{error}</p>
            <form className="signup-form" onSubmit={handleSignupSubmit}>
                <label htmlFor="signup-username">Username</label>
                <br />
                <input type="username" id="signup-username" name="username" onChange={handleSignupForm}/>
                <br />
                <label htmlFor="signup-password">Password</label>
                <br />
                <input type="password" id="signup-password" name="password" onChange={handleSignupForm}/>
                <br />
                <p>By signing up you agree to our <a href="/termspolicies">terms and policies</a></p>
                <p><a href="/login">Login</a></p>
                <button type="submit">Signup</button>
            </form>
        </div>
    </div>)
}