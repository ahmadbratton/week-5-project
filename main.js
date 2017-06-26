const express = require("express");
const mex = require("mustache-express");
const bodyparser = require("body-parser");
const app = express();
const expressValidator = require("express-validator");
const path = require("path");
const session = require("express-session");
const fs = require("fs")
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
let game_words = words[Math.floor(Math.random()*words.length)];
let letters = game_words.split("");
app.engine("mustache", mex());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "mustache");

let correct_letter = [];
let all_letter = [];
let underscore = [];
let wrong_letter = [];
let error_msg = [];
let guesses = 8;
let filter = [];
let double_error= [];
let double = "already picked that letter try agian";

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use(expressValidator());

app.use(session({
  secret:"nskl",
  resave: false,
  saveUninitialized:false
}));

letters.forEach(function (score) {
  underscore.push("_");
});

function reset() {
  game_words = words[Math.floor(Math.random()*words.length)];
   letters = game_words.split("");
   correct_letter = [];
   all_letter = [];
   underscore = [];
   wrong_letter = [];
   error_msg = [];
  guesses = 8;
  letters.forEach(function (score) {
    underscore.push("_");
  });
}

app.get("/", function (req , res) {

  res.render("index", {words: underscore, correct: all_letter, right: correct_letter , guesses: guesses });

});




app.get("/loser", function (req , res) {
res.render("loser", {full_word: game_words});
});

app.get("/winner", function (req , res) {
res.render("winner");
});

app.post("/", function (req, res) {
  let matching=false;
  for (var i = 0; i < letters.length; i++) {
    if (req.body.letters === letters[i]) {
      underscore[i] = letters[i]
      matching = true;
    }
  }


  for (var i = 0; i < all_letter.length; i++) {
  if ( all_letter[i] === req.body.letters ) {
    res.render("index", {words: underscore, correct: all_letter, right: correct_letter , double: double });
    match = true;
  }

}

if (req.body.letters) {
  all_letter.push(req.body.letters)
}



  req.checkBody("letters", "come'on you can only have one letter my G").isLength({max:1});
  req.checkBody("letters", "you need at least one letter and no numbers").isAlpha();
  let error = req.validationErrors();

if (error) {
  error.forEach(function (errors) {
    error_msg.push(errors.msg);
    matching = true;
  });
  res.render("index", {words: underscore, correct: all_letter, error: error_msg} );
  error_msg = [];
}
if (matching === false){
  guesses = guesses - 1;
}

if (guesses === 0) {
 res.redirect("/loser");
}
else if (underscore.toString() === letters.toString()) {
  res.redirect("/winner");
}


  res.redirect("/");







});

app.post("/loser", function (req, res) {
  req.session.destroy();
  reset();
   res.redirect("/");
});

app.post("/winner", function (req, res) {
  req.session.destroy();
  reset();
   res.redirect("/");
});

console.log(correct_letter);
app.listen(3000, function () {
  console.log("whats up mane");
});
