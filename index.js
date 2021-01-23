// DEPENDENCIES -- Dependencias a Utilizar.

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
const RequestLog = require('./Models/RequestLog');
const SerieSearch = require('./Models/SerieSearch');
const config = require('./config');
//   APP  ---Instancio las Dependencias 

const app = express();
app.use(bodyParser.json());
app.use(cors());




// Verifico que Funciona la Búsqueda
app.get('/', (req, res) => {
    res.status(200).send({ mensaje: "Funciona" })
})
app.set('trus proxy', true)
//GET Serie

app.get('/:serie', (req, res) => {

    SerieSearch.findOne({name : req.params.serie})
        .then((SerieFinded)=>{
            if(SerieFinded){
                res.status(200).send(SerieFinded)
                const newRequest = new RequestLog({
                    date: new Date(),
                    search: req.params.serie,
                    ip: req.header('x-forwarded-for') || req.connection.remoteAddress,
                    responseFrom: "CACHE"
                })
            }else{
                fetch(`http://api.tvmaze.com/singlesearch/shows?q=${req.params.serie}`)
                .then((res)=>{return res.json()})
                .then((json)=>{
                    if(!json){return res.status(404).send({"Not Founded":"404 Serie Not Founded"})}
                    else{
                        res.status(200).send(json)
                        const newSerie = new SerieSearch({
                            name:json.name,
                            image:{medium:json.image.medium},
                            summary:json.summary,
                            officialSite:json.officialSite
                           })
                           newSerie.save().then((serieSaved)=>{
                               return console.log(serieSaved)
                            }).catch(err=>{ return console.log({"Error guardando serie":err})})
                            const newRequest = new RequestLog({
                                date: new Date(),
                                search: req.params.serie,
                                ip: req.header('x-forwarded-for') || req.connection.remoteAddress,
                                responseFrom:"API"
                            })
                            newRequest.save().then((requestSaved) => {
                                console.log(requestSaved)
                            }).catch(err => { return console.log({ "Error": err }) })
                    }
                })
            }
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
  


  
  

