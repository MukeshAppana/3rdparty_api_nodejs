const dotenv = require("dotenv").config;
const { config } = require("dotenv");
const express = require("express");
const path = require("path");
const request = require("request");
// const fetch = require("node-fetch");
const {open} = require("sqlite");
const sqlite = require("sqlite3");
const axios = require('axios');
const { response } = require("express");

const app = express();

app.use(express.json())

const port=6000
//const Port = process.env.port;

const dbPath = path.join(__dirname,"employee.db");

var groupData = []
var customer=[]
var final=[]

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite.Database, 
    });
    app.listen(port,()=>{
      console.log("listening on port "+port)
  })
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

var API_URL = 'https://uat-dlp.ashvfinance.com/api/auth/group/members?group_id=ada9d816-8597-4e12-9561-cc6b8ecb2392';

const options = {
  headers:{
    Authorization:'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJtRk9MSkpuMHZQd2cwSVU0ZWM2cmVIUUZ5bEdLeEVCekhLODMtVV9VVE9FIn0.eyJqdGkiOiIyYTM3NDk1Ni1hMDhkLTQzZmItODU2ZC1jMTAzYTgwZjJiYjMiLCJleHAiOjE2NzM5NzMxMTcsIm5iZiI6MCwiaWF0IjoxNjczMzY4MzE3LCJpc3MiOiJodHRwczovL3VhdC1hYS5hc2h2ZmluYW5jZS5jb20vYXV0aC9yZWFsbXMvdHJpYmUzIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6Ijc3YjZiNDRkLTViYWQtNDA5YS1hNGY0LWQxNGRiN2I4OTc3NCIsInR5cCI6IkJlYXJlciIsImF6cCI6Im1pY3JvLWNsaWVudCIsImF1dGhfdGltZSI6MCwic2Vzc2lvbl9zdGF0ZSI6IjFjYzUyNmY2LWQ3MGItNDdlOS05ZjJkLWE4MTVkNzQxN2RhMiIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cHM6Ly91YXQtZGxwLmFzaHZmaW5hbmNlLmNvbSJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJBU0hWX0lUX0FETUlOIiwiYWNjZXNzLW1vZGVsZXIiLCJhY2Nlc3MtYWRtaW4iLCJUUklCRV9BRE1JTiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoiZW1haWwgcHJvZmlsZSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJvcmdhbml6YXRpb24iOiJhc2h2IiwibmFtZSI6IlJhdmkgR29ydGh5IiwicHJlZmVycmVkX3VzZXJuYW1lIjoicmF2aS5nQGFzaHZmaW5hbmNlLmNvbSIsImdpdmVuX25hbWUiOiJSYXZpIiwiZmFtaWx5X25hbWUiOiJHb3J0aHkiLCJlbWFpbCI6InJhdmkuZ0Bhc2h2ZmluYW5jZS5jb20iLCJ1c2VyX2dyb3VwcyI6WyJhZG1pbiIsIkFyZWEgQ3JlZGl0IEhlYWQiLCJCdXNpbmVzcyBIZWFkIiwiQ2hpZWYgRXhlY3V0aXZlIE9mZmljZXIiLCJDaGllZiBSaXNrIE9mZmljZXIiLCJjb2xsZWN0aW9ucyIsImNyZWRpdCIsIkRTQS1zYWxlcyIsImVuZG9yc2VycyIsIklUIEFkbWluIiwiTmF0aW9uYWwgQ3JlZGl0IEhlYWQiLCJvcGVyYXRpb25zIiwib3BzLW1hbmFnZXIiLCJQYXJ0bmVyLUNyZWRpdCIsInBhcnRuZXItT3BlcmF0aW9ucyIsInBhcnRuZXItU2FsZXMiLCJwYXJ0bmVyLVNhbmN0aW9uIDEiLCJwYXJ0bmVyLVNhbmN0aW9uIDIiLCJzYWxlcyIsInNhbmN0aW9uX2F1dGhvcml0eV8xIiwic2FuY3Rpb25fYXV0aG9yaXR5XzIiLCJzYW5jdGlvbl9hdXRob3JpdHlfMyIsInNoaXZhbGlrLW9wcyIsInNoaXZhbGlrLXNhbmN0aW9uIiwic2hvcnQtYmFua2luZyIsIlN0YXRlIEhlYWQiXX0.M7cNF0TmGSlTQOH165-yhihxHMqxz_kzsy_U0kl8rOyEaHeTzqov-m_zWRAWvsDa1q7CI3MPRtx5C3xof8jbDujrt8jmbYTEKJZKvBu91Rnotci-2sRjPt25efsvO5sR94mbbizkkC1-arABacrvjcYMl96HxzyQF06qMkrK-_04JdVHjm7q0IYsO9zznH4KbLMznkjSFoNv8QgKkf0R8P8WcL83asHRk51xMiiNS5izkvFW6jiIiAzk5oSqTxjDBiV0wnETxzCrwtHXQB7GzOyrVOXQ4nwIIV0V_BlGMe4PLfoAYjuFSWaTyOe-qm1-a1BZuYZeXFXucwWBZ3GN8Q'
  }
}

axios.get(`${API_URL}`,options)
.then(response => {
  groupData = response.data;
  console.log(groupData.length)
  console.log(groupData)
  // groupData.forEach(user => {
  //   for(let key in user){
  //     customer.push(`${user[key]}`)
  //     console.log(customer)
  //   }
  // })
}).catch((err) => {
  console.log(err);
});

app.post("/data/",async(request,response)=>{
  // const userDetails = request.body;
  const{user_key,ui_name,group_id,group_name} = request.body;
  const addUserQuery = `
  INSERT INTO 
  data(key,name,Group_id,department)
  VALUES
    (
      '${user_key}',
      '${ui_name}',
      '${group_id}',
      '${group_name}');`;
  const dbResponse = await db.run(addUserQuery);
  response.send("Data insertion completed")
});

app.get("/home/",(request,response)=>{
  response.send("Team needs update of project status")
})

app.get("/users/",async(request,response)=>{
  const getUserData = 'SELECT * FROM data;';
  const datatable = await db.get(getUserData);
  response.send(datatable);
})

app.post("/users/:groupdata[group_id]",async(request,response)=>{
  axios.get(`${API_URL}`,options)
  .then(response => {
    groupData = response.data;
    console.log(groupData.length)
    console.log(groupData)
  // groupData.forEach(user => {
  //   for(let key in user){
  //     customer.push(`${user[key]}`)
  //     console.log(customer)
  //   }
  // })
  }).catch((err) => {
  console.log(err);
  });
  const groupData = request.params; 
  const  updateUserQuery= INSERT INTO data(key) 
})
