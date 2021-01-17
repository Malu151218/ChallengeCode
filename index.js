// DEPENDENCIES -- Dependencias a Utilizar.

const express = require('express');
const mongoose = require('mongoose');
const fetch = require ('node-fetch');
const config = require('./config.js');
const RequestLog = require('./Models/RequestLog');


//   APP  ---Instancio las Dependencias 
const app = express();

// MIDDLEWARES 

app.use (express.json());

// Verifico que Funciona la Búsqueda

app.get('/', (req, res) => {
    res.status(200).send({ mensaje: "Funciona" })
})


let ip="";
let search="";

// ENDPOINT  --- ingresa la búsqueda

app.get('/search/shows/:search',(req,res)=>{
    search= req.params.search;

    /* VERIFICACION --- ( Petición desde FrontEnd  ----> 
        Esta en nuestra Base de Datos?  si: enviamos el objeto al Forntend)
        no : realizar el request a TVMaze.
     */

    //Caso que NO tenemos en la BD => se realiza la petición a la APi Indicada 

    fetch(`http://api.tvmaze.com/singlesearch/shows?q=${search}`)
    .then(res => res.json())
    .then(result => {
        res.status(200).send({result});
        console.log("Resultado de la busqueda: ");
        console.log(result);
    })
    .catch( error => {
        res.status(404).send({message:"Movie Not Found"});
        console.log(`Movie Not Found: ${req.params.search}`);
        console.log("Error: ", error);
    })
})

//IP --- ( dato que recibimos de la Web)

app.post('/search/shows/ip',(req,res)=>{
    ip= req.body.ip;
    console.log("received web IP:", ip)
    res.status(200).send({ip});

    
// CREO  OBJETO Y GUARDO EN CLUSTER logs (Atlass Compas MONGODB)

    const newRequest = new RequestLog({
        date: new Date(),
        search:search,
        ip:ip,
        responseFrom:"CACHE|API"
    })
    
    newRequest.save().then(function(newRequestCreated){
        console.log("Saved DB logs :")
        console.log(newRequestCreated);
    })
})


// CONNECTION - SETTING - (conexión a Base de Datos y a Servidor)

mongoose.connect(config.atlas_route, (err, res)=> {
    if (err) {
      console.log(`No se pudo establecer la conexión con la base de datos ${config.dbName}` + err)
    } else {
      console.log(`Conectado a la base de datos ${config.dbName}`);
    }
  
    app.listen(config.PORT, ()=> {
      console.log(`Conexión con el servidor establecida en el puerto: ${config.PORT}`);
    })
  })
  
  
  module.exports= {app}

  //prueba 
  

