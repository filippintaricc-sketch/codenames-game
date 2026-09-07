var express = require("express");
var router = express.Router();
let data = require("../data/players.js");

let players = [];

router.get("/", (req, res)=>{
    if(req.session.player){
        res.redirect("/home");
        return;
    }
    let error = req.session.error;
    req.session.error = undefined;
    res.render("login", {error});
});

router.post("/", (req, res)=>{
    const {name} = req.body;
    let find = players.find(p=>p===name);
    if(find){
        req.session.error = "Igrac s ovim imenom vec postoji, upisi ponovo";
        res.redirect("/login");
        return;
    }
    req.session.player = name;
    if(!data.host) data.host = name;
    players.push(name);
    res.redirect("/home");
})

module.exports = router;