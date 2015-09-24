var express = require("express"),
app = express(),
bodyParser = require("body-parser"),
methodOverride = require('method-override'),
morgan = require("morgan"),
db = require("./models");

app.set('view engine', 'ejs');
app.use(morgan('tiny'));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static(__dirname + '/public'));

// !!!!!!!zoo routes!!!!!!!

// index
app.get('/', function(req,res){
  res.redirect("/zoos");
});


app.get('/zoos', function(req,res){
  db.Zoo.find({},
    function (err, zoos) {
      res.render("zoos/index", {zoos:zoos});
    });
});

// new
app.get('/zoos/new', function(req,res){
  res.render("zoos/new");
});

// show
app.get('/zoos/:id', function(req,res){
  db.Zoo.findById(req.params.id).populate('animals').exec(
    function (err, zoo) {
        res.render("zoos/show", {zoo:zoo});
    });
});

// create
app.post('/zoos', function(req,res){
  db.Zoo.create({name:req.body.name, location:req.body.location}, function(err, zoo){
    if(err) {
      console.log(err);
      res.render("zoos/new");
    }
    else {
      res.redirect("/zoos");
    }
  });
});



// update
app.get('/zoos/:id/edit', function(req,res){
  db.Zoo.findById(req.params.id).populate('animals').exec(
     function (err, zoo) {
         res.render("zoos/edit", {zoo:zoo});
     });
});

app.put('/zoos/:id', function(req,res){
 db.Zoo.findByIdAndUpdate(req.params.id, req.body.zoo,
     function (err, zoo) {
       if(err) {
         res.render("zoos/edit");
       }
       else {
         res.redirect("/zoos");
       }
     });
});

// Delete
app.delete('/zoos/:id', function(req,res){
  db.Zoo.findById(req.params.id,
    function (err, zoo) {
      if(err) {
        res.render("zoos/show");
      }
      else {
        zoo.remove();
        res.redirect("/zoos");
      }
    });
});

// !!!!!!!animal routes!!!!!!!

// index
app.get('/zoos/:zoo_id/animals', function(req,res){
  db.Zoo.findById(req.params.zoo_id).populate('animals').exec(function(err,zoo){
    res.render("animals/index", {zoo:zoo});
  });
});

// new
app.get('/zoos/:zoo_id/animals/new', function(req,res){
  db.Zoo.findById(req.params.zoo_id,
    function (err, zoo) {
      res.render("animals/new", {zoo:zoo});
    });
});

// show
app.get('/animals/:id', function(req,res){
  db.Animal.findById(req.params.id)
    .populate('zoo')
    .exec(function(err,animal){
      console.log(animal.zoo);
      res.render("animals/show", {animal:animal});
    });
});

// create
app.post('/zoos/:zoo_id/animals', function(req,res){
  db.Animal.create({name:req.body.name, species:req.body.species, age:req.body.age, photo:req.body.photo}, function(err, animals){
    if(err) {
      console.log(err);
      res.render("animals/new");
    }
    else {
      db.Zoo.findById(req.params.zoo_id,function(err,zoo){
        zoo.animals.push(animals);
        animals.zoo = zoo._id;
        animals.save();
        zoo.save();
        res.redirect("/zoos/"+ req.params.zoo_id +"/animals");
      });
    }
  });
});

// edit
app.get('/animals/:id/edit', function(req,res){
  db.Animal.findById(req.params.id, function(err,animal){
      res.render("animals/edit", {animal:animal});
    });
});

app.put('/animals/:id', function(req,res){
 db.Animal.findByIdAndUpdate(req.params.id, req.body.animal,
     function (err, animal) {
      console.log(animal);
       if(err) {
         res.render("animals/edit");
       }
       else {
         res.redirect("/zoos/" + animal.zoo + "/animals");
       }
     });
});

// DESTROY
app.delete('/animals/:id', function(req,res){
 db.Animal.findByIdAndRemove(req.params.id,
      function (err, animal) {
        if(err) {
          console.log(err);
          res.render("animals/edit");
        }
        else {
          res.redirect("/zoos/" + animal.zoo  + "/animals");
        }
      });
});

// CATCH ALL
app.get('*', function(req,res){
  res.render('errors/404');
});

// START SERVER
app.listen(3000, function(){
  console.log("Server is listening on port 3000");
});