if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// console.log(process.env.CLOUDINARY_KEY)
const express = require('express')
const mongoose = require('mongoose')

mongoose.set('strictQuery', true)
const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('connect-flash')
var expressLayouts = require('express-ejs-layouts')
const path = require('path')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override')

//importing routes from different folder
const userRoutes = require('./routes/users')
const campgroundRoutes = require('./routes/campground')
const reviewRoutes = require('./routes/reviews')

// "mongodb://localhost:27017/yelp-camp"
const mongo_url=process.env.MONGO_URI
// const atlasUrl = 'mongodb://localhost:27017/yelp-camp'
// mongoose.connect(atlasUrl)
mongoose.connect(mongo_url)
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error occured'))

db.once('open', () => {
  console.log('database connection established')
})

const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))
app.use(express.static('public'))

const store = new MongoStore({
  //NAME THIS ASA mongoUrl else get error
  // mongoUrl: 'mongodb://localhost:27017/yelp-camp',
  // mongoUrl:mongo_url,
  mongoUrl:mongo_url,
  secret: 'thisshouldbebettersecret',
  touchAfter: 24 * 60 * 60,
})
store.on('error', function (e) {
  console.log('session store error', e)
})
const sessionConfiguration = {
  store,
  resave: true,
  saveUninitialized: true,
  secret: 'thisshouldbebettersecret',
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
}
app.use(session(sessionConfiguration))
app.use(flash())
// passport use
app.use(passport.initialize())
app.use(passport.session())
// tell passport to how to use LocalStrategy to authenticate
passport.use(new LocalStrategy(User.authenticate()))
// tell passport to how to serialise (store data in sessions in)
// for out User model
passport.serializeUser(User.serializeUser())

// tell passport to how to deserialise (get info from stored session )
passport.deserializeUser(User.deserializeUser())

//  using our routes exporting from different folders

app.use((req, res, next) => {
  // after using this middleware we automatically have refrence to the
  // message relatitudeed to this so we don't have to pass this message to
  // the boilerplatitudee we access the msg as success key
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  // get autometically property in req as user from passport
  res.locals.returnTo = req.returnTo
  res.locals.currentUser = req.user
  next()
})
// using session for flash anall
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: 'thisshouldbebettersecret',
  }),
)

app.get('/', (req, res) => {
  res.render('campgrounds/home')
})

app.set('layout', './layouts/layout')
app.use(expressLayouts)

// using our routes
app.use('/', userRoutes)
app.use('/campground', campgroundRoutes)
app.use('/campground/:id/reviews', reviewRoutes)

app.all('*', (req, res, next) => {
  next(new ExpressError(' 404 ! Page Not Found', 404))
})
//error middleware
app.use((err, req, res, next) => {
  const { status = 500 } = err
  if (!err) err.message = 'Oh No .Something went wrong !!'
  res.status(status).render('error', { err, title: 'error' })
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`app is listening on port number ${port}`)
})
