const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const supa = require('@supabase/supabase-js')
const cookieParser = require('cookie-parser')

const app = express()

const saltrounds = 10
const sessionLife = 60000*60 //Right number indicate Minutes

app.use(cors({credentials: true, origin: 'http://localhost:3001'}))
app.use(express.json())
app.use(cookieParser())

//connect to supabase
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = supa.createClient(supabaseUrl, supabaseKey)

const port = process.env.PORT || 3000

//removes all sessions that have exceeded their lifetime
async function removeExpiredSessions(){
    supabase.from('sessionmanager').delete().lt('"sessionDate" + "sessionLife"', Date.now()).then(
        console.log("Deleted expired sessions at "+new Date().toUTCString())
    ).catch(err => console.log(err))
}



//generate a new id that does not exist as stated by the existsFunction
async function getNewId(existsFunction){
    var buf = new BigInt64Array(3);
    crypto.getRandomValues(buf);
    while(await existsFunction(buf[0].toString()+buf[1].toString()+buf[2].toString()).length > 0){ //in the unlikely case that the id already exists in the database, reroll
        crypto.getRandomValues(buf);
    }
    return buf[0].toString()+buf[1].toString()+buf[2].toString()
}

//checks if a timetable exists given the timetabletype, username, and timetablename
async function TimetableExists(timetabletype, username, timetablename){
    const result  = await supabase.from('timetables').select().eq('timetablename', timetablename).eq('timetabletype', timetabletype).eq('username', username)
    return result.data.length > 0
}

//adds a timetable to the database if not already present given the timetabletype, username, timetablename, timetablecontent, timetablenmb, and coursecardnmb
async function addTimetable(timetabletype, username, timetablename, timetablecontent, timetablenmb, coursecardnmb){
    if (await TimetableExists(timetabletype, username, timetablename)){
        return Promise.reject('Timetable already exists!')
    }
    await supabase.from('timetables').insert([{timetablename: timetablename, timetabletype: timetabletype, username: username, timetablecontent: timetablecontent, timetablenmb: timetablenmb, coursecardnmb: coursecardnmb}])
    return Promise.resolve('Timetable added!')
}

//updates a timetable in the database if it exists given the timetabletype, username, timetablename, timetablecontent, timetablenmb, and coursecardnmb
//otherwise, adds the timetable to the database
async function updateTimetable(timetabletype, username, timetablename, timetablecontent, timetablenmb, coursecardnmb){
    if (!await TimetableExists(timetabletype, username, timetablename)){
        await addTimetable(timetabletype, username, timetablename, timetablecontent, timetablenmb, coursecardnmb)
        return Promise.resolve('Timetable updated!')
    }
    await supabase.from('timetables').update({timetablecontent: timetablecontent, timetablenmb: timetablenmb, coursecardnmb: coursecardnmb}).eq('timetablename', timetablename).eq('timetabletype', timetabletype).eq('username', username)
    return Promise.resolve('Timetable updated!')
}

//checks if a user exists given the username
async function checkUserExists(username){
    const result = await supabase.from('users').select().eq('username', username)
    return result.data.length > 0
}

//checks if a session exists given the sessionid
async function checkSessionExists(sessionId){
    const result = await supabase.from('sessionmanager').select().eq('sessionToken', sessionId)
    return result
}

//removes all sessions with the given username
async function removeAllSessionsFromName(username){
    const result = await supabase.from('sessionmanager').delete().eq('username', username)
    return result
}

//checks if a user is logged in given the session token in the post request sessionToken cookie
//returns -1 for user not logged in
//deletes session from database and returns 0 if session expired
//returns 1, session date, and username if logged in
async function checkLoggedInHelper(req){
    const sessionToken = req.cookies.sessionToken
    if (!sessionToken){
        return {code: -1}
    }

    const result = await supabase.from('sessionmanager').select().eq('sessionToken', sessionToken)
    if (!result.data || result.data.length === 0){
        return {code: -1}
    }
    const session = result.data[0]
    if (parseInt(session.sessionDate) + parseInt(session.sessionLife) < Date.now()){
        
        await supabase.from('sessionmanager').delete().eq('sessionToken', sessionToken)
        return {code: 0}
    }
    return {code: 1, logInTime: session.sessionDate, username: session.username}
}

//Routes

//check if user is logged in using checkLoggedInHelper
app.get('/checklogin', async (req, res) => {
    const loggedIn = await checkLoggedInHelper(req)
    switch(loggedIn.code){
        case -1:
            res.clearCookie('sessionToken')
            res.send({error: 'Not logged in!'})
            return
        case 0:
            res.clearCookie('sessionToken')
            res.send({error: 'Session expired!'})
            return
        case 1:
            res.send({message: 'Logged in!', logInTime: loggedIn.logInTime, username: loggedIn.username})
            return
    }
})

//sign up given the username and password
app.post('/signup', async (req, res) => {
    const {username, password} = req.body

    if(username === undefined || password === undefined){
        res.status(400).send('Invalid request!')
        return
    }

    if(password.length < 8){ //if password is less than 8 characters, send error
        res.status(400).send({error: 'Password must be at least 8 characters long!'})
        return
    }
    const saltPassword = await bcrypt.genSalt(saltrounds)
    const hashedPassword = await bcrypt.hash(password, saltPassword) //hashpassword first to prevent spam
    if (await checkUserExists(username)){//if user already exists send error
        res.status(400).send({error: 'User already exists!'})
        return
    }
    
    //add user to database and add default timetables
    supabase.from('users').insert([{username: username, password: hashedPassword}]).then(() => {
        return addTimetable('UTSC', username, 'Timetable-1', '[{"Courses":[],"Id":"Container-SideBar","name":"SideBar"}]', 0, 0)
    }).then(() => {
        return addTimetable('UW', username, 'Timetable-1', '[{"Courses":[],"Id":"Container-SideBar","name":"SideBar"}]', 0, 0)
    }).then(() => {
        res.send({message: 'User created!'})
    }).catch((err) => {
        res.status(400).send(err)
    })
})

//if user successfully logs in then add a session to the database and send a cookie with the session token
app.post('/login', async (req, res) => {
    const {username, password} = req.body

    if(username === undefined || password === undefined){
        res.status(400).send('Invalid request!')
        return
    }

    if(req.body.password.length < 8){ //if password is less than 8 characters, send error
        res.status(400).send({error: 'Password must be at least 8 characters long!'})
        return
    }

    const result = await supabase.from('users').select().eq('username', username)
    if (result.data.length === 0){//if user does not exist send error
        res.status(400).send({error: 'User does not exist!'})
        return
    }
    
    const hashedPassword = result.data[0].password
    
    if (await bcrypt.compare(password, hashedPassword)){
        await removeAllSessionsFromName(username)
        //create and add new session id to database
        const sessionId = await getNewId(checkSessionExists)

        await supabase.from('sessionmanager').insert([{sessionToken: sessionId, sessionDate: Date.now(), sessionLife: sessionLife, username: username}])

        //send cookie with session id/token
        res.cookie('sessionToken', sessionId, {httpOnly: true, sameSite: 'none', secure: true})
        
        res.send({message: 'Login successful!'})
    } else {//if password wrong send error
        res.status(400).send({error: 'Incorrect password!'})
    }
})

//log out by deleting session from database and clearing cookie
app.post('/logout', async (req, res) => {
    //permission check
    const loggedIn = await checkLoggedInHelper(req)

    if(loggedIn.code !== 1){
        res.clearCookie('sessionToken')
        res.status(400).send({error: 'Not logged in!'})
        return
    }

    const sessionToken = req.cookies.sessionToken

    await supabase.from('sessionmanager').delete().eq('sessionToken', sessionToken)
    
    res.clearCookie('sessionToken')
    res.send({message: 'Logged out!'})
})

//get timetable by id given the timetabletype and timetablename in req body
app.post('/getTimeTableById', async (req, res) => {
    //permission check
    const loggedIn = await checkLoggedInHelper(req)

    if(loggedIn.code !== 1){
        res.clearCookie('sessionToken')
        res.status(400).send({error: 'Not logged in!'})
        return
    }

    const {TimeTableType, TimeTableName} = req.body

    if(TimeTableType === undefined || TimeTableName === undefined){
        res.status(400).send({error: 'Invalid request!'})
        return
    }

    const username = loggedIn.username

    const result2 = await supabase.from('timetables').select().eq('timetablename', TimeTableName).eq('timetabletype', TimeTableType).eq('username', username)
    
    if (result2.data.length === 0){//if no such timetable send error
        res.status(400).send({error: 'Timetable not found!'})
    }else{
        res.send(result2.data[0])
    }
})

//saves timetable given the timetabletype, timetablename, timetable, nmbTimeTableCards, and nmbCourseCards
app.post('/savetimetable', async (req, res) => {
    const {TimeTableType, TimeTableName, TimeTable, nmbTimeTableCards, nmbCourseCards} = req.body

    const loggedIn = await checkLoggedInHelper(req)

    //check if user is logged in
    //passing this check implies that session token is valid (in the database and not expired)
    if(loggedIn.code !== 1){
        res.clearCookie('sessionToken')
        res.status(400).send({error: 'Not logged in!'})
        return
    }

    if(TimeTableType === undefined || TimeTableName === undefined || TimeTable === undefined || nmbTimeTableCards === undefined || nmbCourseCards === undefined){
        res.status(400).send({error: 'Invalid request!'})
        return
    }

    updateTimetable(TimeTableType, loggedIn.username, TimeTableName, JSON.stringify(TimeTable), nmbTimeTableCards, nmbCourseCards).then(() => {
        res.send({message: 'Timetable saved!'})
    }).catch((err) => {
        res.status(400).send({error: err})
    })
})

//get saved timetables given the username
app.post('/gettimetableNames', async (req, res) => {
    

    //permission check
    const loggedIn = await checkLoggedInHelper(req)
    if(loggedIn.code !== 1){
        res.clearCookie('sessionToken')
        res.status(400).send({error: 'Not logged in!'})
        return
    }

    const username = loggedIn.username

    const result2 = await supabase.from('timetables').select('timetablename').eq('username', username).eq('timetabletype', req.body.TimeTableType)

    res.send(result2.data)
})

//refreshes the session id by creating a new session and deleting the old one both in db and in cookies
app.get('/refreshSession', async (req, res) => {

    
    //permission check
    const loggedIn = await checkLoggedInHelper(req)
    if(loggedIn.code !== 1){
        res.clearCookie('sessionToken')
        res.status(400).send({error: 'Not logged in!'})
        return
    }

    const username = loggedIn.username

    //delete old session and any other sessions that didn't get caught by logout function
    await removeAllSessionsFromName(username)
        
    const sessionId = await getNewId(checkSessionExists)

    const currenttime = Date.now()
    
    await supabase.from('sessionmanager').insert([{sessionToken: sessionId, sessionDate: currenttime, sessionLife: sessionLife, username: username}])
    res.cookie('sessionToken', sessionId, {httpOnly: true, sameSite: 'none', secure: true})
    res.send({message: 'Session refreshed!', logInTime: currenttime})
})

//delete timetable given the timetabletype and timetablename
app.post('/deletetimetable', async (req, res) => {
    const loggedIn = await checkLoggedInHelper(req)
    if(loggedIn.code !== 1){
        res.clearCookie('sessionToken')
        res.status(400).send({error: 'Not logged in!'})
        return
    }

    const username = loggedIn.username

    const {TimeTableName, TimeTableType} = req.body

    if(TimeTableName === undefined || TimeTableType === undefined){
        res.status(400).send({error: 'Invalid request!'})
        return
    }

    await supabase.from('timetables').delete().eq('timetablename', TimeTableName).eq('timetabletype', TimeTableType).eq('username', username)
    res.send({message: 'Timetable deleted!'})
})

//delete user and any information associated with the user in db consequently also logging the user out
app.get('/deleteuser', async (req, res) => {
    const loggedIn = await checkLoggedInHelper(req)
    if(loggedIn.code !== 1){
        res.clearCookie('sessionToken')
        res.status(400).send({error: 'Not logged in!'})
        return
    }

    const username = loggedIn.username
    
    await supabase.from('sessionmanager').delete().eq('sessionToken', username)
    
    await supabase.from('timetables').delete().eq('username', username)
    
    await supabase.from('users').delete().eq('username', username)
    res.send({message: 'User deleted!'})
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
    //call cleanup function every 12 hours
    setInterval(removeExpiredSessions, 60000*60*12)
})