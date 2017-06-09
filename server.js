//Ne pas oublier de faire l'installation du module express: npm install express --save
var express = require('express');
var app = express();

app.use(express.static('public'));

/*app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.send(404, 'Page introuvable !');
});*/

//Ne pas oublier de faire l'installation du module ejs: npm install ejs --save
app.set('view engine', 'ejs');

//Ne pas oublier de faire l'installation du module body-parser: npm install body-parser --save
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//Ne pas oublier de faire l'installation du module socket.io: npm install socket.io --save
// Chargement de socket.io
/*var io = require('socket.io').listen(server);

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
    console.log('Un client est connecté !');
});*/

var clientList = new Array();
var action = "";
var clientId = "";

function addClient(id, firstName, lastName, email, phone, image) {
    var success = false;
    var client = new Object();

    if(!checkClientExist(id))
    {
      client.id =id;
    }
    else
    {
        client.id = getNextId();
    }

    client.firstName =firstName;
		client.lastName =lastName;
		client.email =email;
		client.phone =phone;
    client.image = image;
	  
	  clientList.push(client);
	  success = true;

  	return success;
  }

function checkClientExist(id){
	var clientExist = false;

	for(var client in clientList)
	{
	  if(clientList[client].id === id)
	  {
	    clientExist = true;
	  }
	}

	return clientExist;
}

function getNextId()
{
  var maxId = 0;

  //console.log("maxId init " + maxId);
  for(var client in clientList)
	{
    if(maxId < parseInt(clientList[client].id))
    {
	    maxId = clientList[client].id;
      //console.log("maxId for " + maxId);
    }
	}


  maxId++;
  //console.log("maxId end " + maxId);
  return maxId.toString();
}

function updateClient(id, firstName, lastName, email, phone, image) {
	var index = 0;
	var success = false;
  console.log("call update");
	for(var client in clientList)
    {
      if(clientList[client].id === id)
      {
      	clientList[client].firstName =firstName;
		    clientList[client].lastName =lastName;
		    clientList[client].email =email;
		    clientList[client].phone =phone;
        clientList[client].image = image;
        success = true;
      }
      index++;
    }
    return success;
}

function deleteClient(id) {
	var index = 0;
	var success = false;
  console.log("call delete");
	for(var client in clientList)
    {
      console.log("clientList[client].id = " + clientList[client].id);
      console.log("id = " + id);
      if(clientList[client].id === id)
      {
        clientList.splice(index,1);
        console.log("splice ok");
        success = true;
      }
      index++;
    }
    return success;
}

app.get("/read", function (req, res) {
    action="";
    res.render('index', {clientList: clientList, action: action, clientId : clientId});
});

app.post("/action", function (req, res) {
  switch(req.body.action.toUpperCase())
  {
    case "CANCEL":
      clientId = "";
      action = "CANCEL";
      break;

    case "EDIT":
      clientId = req.body.id;
      action = "EDIT";
      break;

    case "UPDATE":
      clientId = req.body.id;
      action = "UPDATE";
      updateClient(req.body.id,req.body.firstName,req.body.lastName,req.body.email,req.body.phone,req.body.image);
      break;
    
    case "DELETE":
      clientId = "";
      action = "DELETE";
      deleteClient(req.body.id);
      break;
    
    case "ADD":
      clientId = "";
      action = "ADD";
      addClient(req.body.addId,req.body.addFirstName,req.body.addLastName,req.body.addEmail,req.body.addPhone,req.body.addImage);
      break;
  }
  res.render('index', {clientList: clientList, action: action, clientId: clientId});
});

app.get("/add", function (req, res) {
  action="ADD";
  addClient(req.query.id,req.query.firstName,req.query.lastName,req.query.email,req.query.phone);
  res.render('index', {clientList: clientList, action: action, clientId: clientId});
});

/*app.post("/add", function (req, res) {
  addClient(req.body.addId,req.body.addFirstName,req.body.addLastName,req.body.addEmail,req.body.addPhone);
  res.render('crm', {clientList: clientList});
});*/

app.get("/update", function (req, res) {
  action="UPDATE";
  updateClient(req.query.id,req.query.firstName,req.query.lastName,req.query.email,req.query.phone);
  res.render('index', {clientList: clientList, action: action, clientId: clientId});
});

app.get("/delete", function (req, res) {
  action="DELETE";
  deleteClient(req.query.id);
  res.render('index', {clientList: clientList, action: action, clientId: clientId});
});

app.listen(8080, function () {
  console.log("Server listening on port 8080");

  addClient("0", "Steve","Job","job@apple.com","0612457845","https://clubsucces.files.wordpress.com/2011/10/steve_jobs.jpg");
  addClient("1", "Bill","Gatesr","gates@microsoft.com","0654453587","https://pbs.twimg.com/profile_images/558109954561679360/j1f9DiJi.jpeg");
  addClient("2", "Michael","Jordan","jojo@hornets.com","0854357845","http://make-me-successful.com/wp-content/uploads/2012/11/michael-jordan.jpg");
});