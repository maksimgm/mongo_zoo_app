var express = require("express"),
  app = express();

var bodyParser = require("body-parser");
var methodOverride = require('method-override');
var morgan = require('morgan');
var db = require("./models");

app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(morgan('tiny'));

// index
app.get("/",function(req,res){
  res.redirect("/zoos");
});

app.get("/zoos",function(req,res){
  db.find({},function(err,zoos){
    res.render("zoos/index",{zoo:zoos});
  });
});

// new
app.get("/zoos/new",function(req,res){
  res.render("zoos/new");
});

// create
app.post("/zoos",function(req,res){
  db.Zoo.create({name:req.body.name,location:req.body.location},function(err,zoo){
    if(err){
      console.log(err);
      res.render("zoos/new");
    }else{
      res.redirect("/zoos");
    }
  });
});
// show
app.get("/zoos/:id",function(req,res){
  db.Zoo.findById(req.params.id)
    .populate("animals")
    .exec(function(err,zoo){
      res.render("zoos/show",{zoo:zoo});
  });
});
// edit
app.get("/zoos/:id/edit",function(req,res){
  db.Zoo.findById(req.params.id,function(err,zoo){
    if(err){
      res.redirect("/zoos/new");
    }else{
      res.render("zoos/edit",{zoo:zoo});
    }
  });
});

app.put("/zoos/:id",function(req,res){
  db.Zoo.findByIdAndUpdate(req.params.id,{name:req.body.name,location:req.body.location},function(err,zoo){
    if(err){
      res.render("zoos/edit");
    }else{
      res.redirect("/zoos");
    }
  });
});
// delete
app.delete("/zoos/:id",function(req,res){
  db.Zoo.findById(req.params.id,function(err,zoo){
    if(err){
      res.redirect("/zoos/show");
    }else{
      zoo.remove();
      res.redirect("/zoos");
    }
  });
});
// index
app.get("/zoos/:zoos_id/animals",function(req,res){
  db.Zoo.findById(req.params.zoos_id).populate("zoos").exec(
    function(err,zoo){
      res.render("animals/new",{animal:animal});
    });
});
// new

// create

// show

// edit

// delete

// catch all
app.get("*",function(req,res){
  res.render("404");
});


app.listen(3000,function(){
  console.log("Got to localhost:3000/");
});