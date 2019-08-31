#!/usr/bin/env node

const express = require('express'),
    app = express(),
    router = express.Router(),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    fs = require('fs'),
    argv = require('yargs').argv,
    port = argv.port || 3000

app.set('port', port)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(cors())

if(!argv._[0]) throw Error('file.json is required')

let path = './' + argv._[0],
    domain = 'http://localhost',
    routes = [];

const writeFile = (pathFile, data, cb) => {
    const json = JSON.stringify(data);

    fs.writeFile(pathFile, json, 'utf8', (err) => {
        if (err) throw err;
        cb();
    });
}

fs.readFile(path, 'utf8', (err, data) => {
    if(err) throw err

    let json = JSON.parse(data)

    Object.keys(json).forEach(route => {
        routes.push(route);

        router.get(route, (req, res) => {
            res.send(json[route])
        })

        router.get(route + '/:id', (req, res) => {
            let list = json[route];
            let id = req.params["id"];
            let obj = list.find(x => x.id == id);
            if(obj){
                res.send(obj);
            }else{
                res.status(500).send({ message: 'id not found'});
            }
        })

        router.post(route, (req, res) => {
            let obj = req.body;
            obj.id = json[route].length + 1;
            json[route].push(obj);            

            writeFile(path, json, () => {
                res.send({ success: true, message: "ok" });
            })
        })

        router.put(route + '/:id', (req, res) => {
            let id = +req.params["id"];
            let obj = req.body;
            obj.id = id;
            
            let entity = json[route];
            let index = -1;
            for(let i=0; i< entity.length; i++){
                if(entity[i].id === +id){
                    index = i
                    break;
                }
            }

            if(index !== -1){
                json[route][index] = obj;
    
                writeFile(path, json, () => {
                    res.send({ success: true, message: "ok" });
                })
            }else{
                res.status(500).send({ success: false, message: "id not found" })
            }
        })

        router.delete(route + '/:id', (req, res) => {
            let id = req.params["id"];

            let entity = json[route];
            let index = -1;
            for(let i=0; i< entity.length; i++){
                if(entity[i].id === +id){
                    index = i
                    break;
                }
            }

            if(index !== -1){
                json[route].splice(index,1);
    
                writeFile(path, json, () => {
                    res.send({ success: true, message: "ok" });
                })
            }else{
                res.status(500).send({ success: false, message: "id not found" })
            }
        })
    })

    for(let route of routes){
        console.log(`${domain}:${app.get('port')}${route}`)
    }
})

app.use(router)

app.use((req, res) => {
    res.status(404).end('URI not found')
})

app.listen(app.get('port'), (req, res) => {
    console.log(`\nServer init on port: ${app.get('port')}\n`)
})