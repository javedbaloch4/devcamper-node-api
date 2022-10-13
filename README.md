# devcamper-node-api

Dev Camper Project NodeJS

## Postman Environment

Setup Postman Environment

- Create Postman Account
- Create new Enviroment (eye-icon)
  - Name `devcamper`
  - Variable - `URL`
  - Initial Value `http://localhost:5000`
  - How to use it - {{URL}}/api/v1/bootcamps
- Create a New Collection

  - Name - DevCamper API
  - Description - BackendAPI for the ....
  - Create a folder inside collection
    - name - Bootcamps
    - description - All APIs Bootcamps
  - Create a request

    - name - Name of the request
    - description - Description of request...

  - Additional Things
    - Add Present for JSON Type for create route


  - Dockers
    - DOCKER FILE - Blue print to build dokcer image
    - IMAGE - Template for running Docker containers
    - CONTAINER - Container is a running process

## API Documentation
https://documenter.getpostman.com/view/13559740/2s83zjsiQg


- ✨Magic ✨

## More on Mac/Linux

Kill Ports
`$ lsof -i tcp:5000`
`$ kill -9 PID`
`npx kill-port 3000 8000 8001`
