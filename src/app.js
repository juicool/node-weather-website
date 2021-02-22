const express = require('express')
const request = require('request')
const path = require('path')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

//define paths for express config
const publicDirectoryPath = path.join(__dirname,'../public')
const viewsPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')


//setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views',viewsPath)
hbs.registerPartials(partialsPath)

//setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('',(req,res)=>{
    res.render('index',{
        title: 'Weather',
        name: 'Juilee Kulkarni'
    })
})

app.get('/about',(req,res)=>{
    res.render('about',{
        title:'About me',
        name:'Juilee Kulkarni'
    })
})

app.get('/help',(req,res)=>{
    res.render('help',{
        message: 'This is a help message',
        title: 'Help page',
        name: 'Juilee Kulkarni'
    })
})

//app.com/weather
app.get('/weather',(req,res)=>{
    if(!req.query.address){
        return res.send({
            error:'An address term is required'
        })
    }
    geocode(req.query.address,(error,{latitude,longitude,location}={})=>{
        if(error){
            return res.send({
                error
            })
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if(error){
                return res.send({
                    error
                })
            }
            res.send({
                location,
                address: req.query.address,
                forecast: forecastData
            })
        })
    })
   

    
})


app.get('/products',(req,res)=>{
    if(!req.query.search)
    {
        return res.send({
            error:'A search term is required'
        })
    }
    
    console.log(req.query.search)
    res.send({
        products:[]
    })
})


app.get('/help/*',(req,res)=>{
    res.render('404',{
        title:'404',
        name: 'Juilee Kulkarni',
        errorMessage: 'Help article not found.'
    })
})


app.get('*',(req,res)=>{
    res.render('404',{
        title:'404',
        name: 'Juilee Kulkarni',
        errorMessage: 'Page not found.'
    })
    })


app.listen(port, () =>{
    console.log('Listening on port '+port)
})