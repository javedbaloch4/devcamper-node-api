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

- ✨Magic ✨

Kill Port or multiple ports
`npx kill-port 3000 8000 8001`

More on Mac/Linux
`$ lsof -i tcp:5000`
`$ kill -9 PID`
