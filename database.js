//jshint esversion:6
const mysql =  require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(bodyParser.json());

//CONNECT THE DATABASE
let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "tahfifa"
  });
  con.connect();


//GET REQUESTS 

//GET THE BARBER'S SERVICES
app.get("/barber/services/:barberId",(req,res)=>{
const barberId = req.params.barberId;

con.query("SELECT id, duration , name, price from service where service.barber_id = ?",[barberId],(err, result, fields)=>{
    if (err) res.send(err);
    res.send(result);


});


});



//GET THE BARBER'S Working Time
app.get("/barber/hours/:barberId",(req,res)=>{
  const barberId = req.params.barberId;
  
  con.query("SELECT day , SUBSTRING(debut,1,5) as start , SUBSTRING(finish,1,5) as end , barber_id from worktime where barber_id = ?",[barberId],(err, result, fields)=>{
      if (err) res.send(err);
      res.send(result);
  
  
  });
  
  
  });


//GET THE BARBER'S BOOKINGS
app.get("/bookings/barberBookings/:barberId",(req,res)=>{

  const barberId = req.params.barberId;
  
  const query = "SELECT CAST(date AS char) as date,SUBSTRING(date_booking,1,10) as bookingDate,SUBSTRING(start,1,5) as start,SUBSTRING(booking.end,1,5)as end,client_id as clientId,barber_id as barberId , status  from booking WHERE status = 'confirmée' AND barber_id = ? "
  
  con.query(query,[barberId],(err,result,fields)=>{
      if(err) res.send(err);
  
      res.send(result);
  
  });
  
  
  
  });


  //GET THE BARBER'S Information
app.get("/barber/:barberId",(req,res)=>{

  const barberId = req.params.barberId;
  
  const query = "SELECT phone , address , name ,surname , wilaya ,region from barber WHERE id = ? "
  
  con.query(query,[barberId],(err,result,fields)=>{
      if(err) res.send(err);
  
      res.send(result);
  
  });
  
  
  
  });



//GET THE CLIENT'S BOOKINGS

app.get("/clientbookings/:clientId",(req,res)=>{

  const clientId = req.params.clientId;

  const query = "SELECT booking.amount , booking.id ,CAST(booking.date AS char) as date,CAST(booking.date_booking AS char) as bookingDate,SUBSTRING(booking.start,1,5) as start,SUBSTRING(booking.end,1,5)as end,booking.client_id as clientId,booking.barber_id as barberId , booking.status, booking.duration as bookingDuration , service.name , service.price , service.duration  as serviceDuration from booking INNER JOIN composition on composition.booking_id = booking.id  INNER JOIN service on  service.id = composition.service_id   WHERE client_id = ? "
  
  con.query(query,[clientId],(err,result,fields)=>{
      if(err) res.send(err);
  
      res.send(result);
  
  });
  
  
  
  });



//POST REQUESTS 

  //ADD A NEW BOOKING TO THE DATABASE   
  app.post("/clientbookings/addbooking",(req,res)=>{

const services = req.body.services.map(e=>e.id);
bookingDate =  req.body.bookingDate.substring(0,11)+req.body.start+":00.000Z" ;
let composition = [];

    con.query(
      "INSERT INTO booking (amount ,date,date_booking,duration,start,end,status,client_id,barber_id) VALUES (?,?, ?, ?, ?, ?, ?,?,?)"
      
    ,[
     req.body.amount,
     req.body.date,
     req.body.bookingDate, 
     req.body.duration,
     req.body.start,
     req.body.end,
     req.body.status,
     req.body.clientId,
     req.body.barberId,
   ],
    
    (err,result,fields)=>{
      if (err){
        console.log(err);
         res.send(err);
     
     }else { 

       console.log("success");
//////////////////////////////////////////////////////////////////
      services.forEach(service => {
          composition.push([result.insertId,service])
      });
       con.query(
        "INSERT INTO composition (booking_id , service_id) VALUES ?" 
      ,[composition] , (err,result,fields)=>{
        if(err) console.log(err)
        else console.log("success")

     });
///////////////////////////////////////////////////////////////////////////
       res.send("success");
 
      }
       
   });
 
  });

      
///////////////////////////////////////////////////////////////////////////

//cancel Booking

app.patch("/bookings/cancelbooking",(req,res)=>{
  let date = req.body.bookDate.replace("T"," "); 
  
  date = date.replace("Z","")+"000"

  con.query("UPDATE booking SET status = 'annulée' WHERE   booking.client_id = ? AND booking.date = ?",[req.body.clientId,date],
  (err,result,fields)=>{ 

  if (err) {
    res.send(err);
  } else {
    res.send("Success");
  }
  
});
 
});

//CANCEL EXPIRED BOOKINGS
  
app.patch("/bookings/expiredbookings",(req,res)=>{
 console.log(req.body.clientId);

  con.query("UPDATE booking SET status = 'expirée' WHERE SUBSTRING(date_booking,1,15) < NOW()  AND booking.client_id = ? AND status = 'confirmée' ",[req.body.clientId],
  (err,result,fields)=>{ 

  if (err) {
    res.send(err);
  } else {

    res.send("Success");
  }
  
});

});


app.get("/bookings/expired",(req,res)=>{
  console.log(req.body.clientId);
 
   con.query("SELECT CURRENT_TIMESTAMP,start,CAST(date AS char) as date,SUBSTRING(date_booking,1,15) as bookingDate FROM booking WHERE SUBSTRING(date_booking,1,15) > NOW() ",[],
   (err,result,fields)=>{ 
 
   if (err) {
     res.send(err);
   } else {
 
     res.send(result);
   }
   
 });
 
 });
 


/**
   * ************************Client
  */
 /*
    Add New Client
 */ 
app.post('/client/addClient',(req,res)=>{


  con.query('INSERT INTO client (id,phone,password,sex,name,surname,wilaya,region,lang) VALUES(?,?,?,?,?,?,?,?,?)',
  [
    req.body.id,
    req.body.phone,
    req.body.password,
    req.body.sex,
    req.body.name,
    req.body.surname,
    req.body.wilaya,
    req.body.region,
    true,
  ]
  ,
  (err,result,fields)=>{
      if(err) console.log('Query error',err);
      res.send("success");
  });

});

/*
  Fetch All Clients
*/
app.get('/client',(req,res)=>{
   con.query('SELECT * FROM client',(err,result,fields)=>{
     if(err) console.log('Query error',err);
    res.send(result);
   });
});

/*
Fetch one client according to his id
*/  
app.get('/client/:id',(req,res)=>{
con.query('SELECT * FROM client WHERE id= ?',
[
  req.params.id
],
(err,result,fields)=>{
  if(err) console.log('Query error',err);
  res.send(result);
});
});


/*
  Update client password
*/ 
app.patch('/client/updatePassword/:id',(req,res)=>{
  
  con.query('UPDATE client SET password = ? WHERE id= ?',
  [
    req.body.password,
    req.params.id
  ],
  (err,result,fields)=>{
    if(err) console.log('Query error',err);
    res.send("success");
  });
});

/*
  Update Client phone
*/

app.patch('/client/updatePhone/:clientid',(req,res)=>{
  
con.query(`UPDATE client SET id=?,phone=? WHERE id= ?`,
[
  req.body.id,
  req.body.phone,
  req.params.clientid
],
(err,result,fields)=>{
  if(err) console.log('Query error',err);
  res.send("success");
});
});

/*
  Update client
*/ 
app.patch('/client/updateClient/:id',(req,res)=>{
  
con.query('UPDATE client SET name=?,surname=?,email=?,address=?,long=?,lat=?,image=?,wilaya=?,region=?,lang=? WHERE id= ?',
[
  req.body.name,
  req.body.surname,
  req.body.email,
  req.body.address,
  req.body.long,
  req.body.lat,
  req.body.image,
  req.body.wilaya,
  req.body.region,
  req.body.lang,
  req.params.id
],
(err,result,fields)=>{
  if(err) console.log('Query error',err);
  res.send("success");
});
});

/*
  Delete client
*/
app.delete('/client/deleteClient/:id',(req,res)=>{

con.query('DELETE FROM client WHERE id=?',
[
  req.params.id
],
(err,result,fields)=>{
  if(err) console.log('Query error',err);
  res.send("success");
});

});





// Starting our server.
app.listen(3000, () => {
    console.log('Connected');
   });
