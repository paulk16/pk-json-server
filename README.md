# pk-json-server
Create a RESTful API in NodeJS from a json file     
Supported verbs: GET, POST, PUT and DELETE   
Enabled CORS   
## Install
```
npm install -g pk-json-server
```
## Database json
create file with extension .json   
example: db.json
```
{
	"/api/v1/frameworks": [
        {
            "id": 1,
            "name": "Angular"
        }, 
        {
            "id": 2,
            "name": "React"
        }, 
        {
            "id": 3,
            "name": "VueJS"
        }
    ]
}
```
## Run
In the terminal execute the following command, by default it will use port 3000:
```
pk-json-server db.json 
```

Change execution port:
```
pk-json-server db.json --port=9090
```

## CRUD
Example of generated URIs:  

GET: http://localhost:3000/api/v1/frameworks   
GET: http://localhost:3000/api/v1/frameworks/1   
POST: http://localhost:3000/api/v1/frameworks   
PUT: http://localhost:3000/api/v1/frameworks/1   
DELETE: http://localhost:3000/api/v1/frameworks/1    



