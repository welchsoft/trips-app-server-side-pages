const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
var server = require('http').createServer(app)

// npm install express-session --save
var session = require('express-session')

// io is socket.io instance
var io = require('socket.io').listen(server)

// importing the Trip class from trip.js file
const Trip = require('./trip')
// importing the User class from user.js file
const User = require('./user')

// setting up middleware to use the session
app.use(session({
  secret: 'doge',
  resave: false,
  saveUninitialized: false
}))

let users = []
let trips = []

var bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// setting up the javascript file as a static resource
// http://localhost:3000/client.js
// http://localhost:3000/image1.png
app.use(express.static('public'))

// setting the templating engine to use mustache
app.engine('handlebars',exphbs())
// setting the mustache pages directory
app.set('views','./views')
// set the view engine to mustache
app.set('view engine','handlebars')

app.get('/',function(req,res){
  res.render('login')
})

function validateLogin(req,res,next) {

  if(req.session.username !== undefined) {
    next()
  } else {
    res.redirect('/')
  }

}

app.all('/Session/*',validateLogin,function(req,res,next){
  next()
})

app.get('/Session/home',function(req,res){
  res.render('Session/home',{username : req.session.username})
})


app.get('/errorPage',function(req,res){
  res.render('errorPage')
})

app.post('/',function(req,res){

  if(req.body.login){

    let found = users.map(function(user) {return user.userName}).indexOf(req.body.username)
    if(found == -1){
      console.log('invalid user')
      res.redirect('/errorPage')
      return
    }
    found = users.map(function(user) {return user.password}).indexOf(req.body.password)
    if(found == -1){
      console.log('invalid password')
      res.redirect('/errorPage')
      return
    }

    let username = req.body.username
    let password = req.body.password

    // validate that the user name and password is correct

    // checking if the session object exists, if so then create a username property
    if(req.session) {
      req.session.username = username
      // setting the expiration date of the cookies so we can
      // come back later even if we close the browser
      var hour = 3600000
      req.session.cookie.expires = new Date(Date.now() + hour)
      req.session.cookie.maxAge = hour

      // go to the home page
      res.redirect('/Session/home')
      return
    }

  }

  if(req.body.register){
    let found = users.map(function(user) {return user.userName}).indexOf(req.body.username)
    if(found == -1){
      newUser = new User(req.body.username, req.body.password)
      users.push(newUser)
    }
    else{
      console.log('user already exists')
      res.redirect('/errorPage')
      return
    }
    console.log(users.length)
    res.redirect('/')
  }

//  res.render('home',{username : req.session.username})

})

app.get('/Session/addTrips',function(req,res){
  res.render('Session/addTrips')
})

app.get('/Session/MYtrips',function(req,res){

  // render the mustache page called trips
  res.render('Session/MYtrips',{user : users.find(function (user) { return user.userName === req.session.username })})
})

app.post('/deleteTrip',function(req,res){

  let tripId = req.body.tripId
  // give me all the trips where the tripId is
  // not the one passed in the request
  users.find(function (user) { return user.userName === req.session.username }).userTrips = (users.find(function (user) { return user.userName === req.session.username }).userTrips).filter(function(trip){
    return trip.tripId != tripId
  })

  res.redirect('/Session/MYtrips')

})

// create a post route for /trips
app.post('/Session/createTrip',function(req,res){

  let trip = new Trip(req.body.title,req.body.imageURL,req.body.dateOfDeparture, req.body.dateOfReturn)

  // adding a new object into trips array
  users.find(function (user) { return user.userName === req.session.username }).addTrip(trip)
  // render the mustache page called trips
  res.redirect('/Session/MYtrips')

})

app.get('/trips',function(req,res){
  res.render('trips', {userList: users})
})

io.on('connection',function(socket){
  console.log('USER IS CONNECTED!!!')

  // creating a channel called chat
  socket.on('chat',function(message){
    // send back the server response to the user
    io.emit('chat',message)
  })

})

app.get('/Session/chat', function(req,res){
  res.render(__dirname + '/views/Session/chat.handlebars',{user : users.find(function (user) { return user.userName === req.session.username })})
})



// get the guid
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}


server.listen(3000, () => console.log('Example app listening on port 3000!'))
