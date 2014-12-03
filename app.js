var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var byeResponses = require('./resources/bye.json'), byeTotal = _.keys(byeResponses).length;
var food = require('./resources/food.json'), foodTotal = _.keys(food).length;
var right = require('./resources/right.json'), rightTotal = _.keys(right).length;
var insult = require('./resources/insult.json').single, insultTotal = _.keys(insult).length;
var pinsult = require('./resources/insult.json').plural, pinsultTotal = _.keys(pinsult).length;
var compliment = require('./resources/compliment.json').single, complimentTotal = _.keys(compliment).length;
var pcompliment = require('.resources/compliment.json').plural, pcomplimentTotal = _.keys(pcompliment).length;
var mad = require('.resources/mad.json'), madTotal = _.keys(mad).length;

var app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

var shutup = false, shutupClock,count = 0;

app.post('/', function (req, res, next) {
    if (req.body.user_id === '174939' || (shutup && req.body.text.toLowerCase() !== 'alfred')) {
        return next();
    }

    var options = {
        url: 'https://api.groupme.com/v3/bots/post',
        method: 'POST',
        form: {
            'bot_id': '23d0b4561b9693e82424f9be63'
        }
    };

    if (req.body.text.toLowerCase() === 'alfred') {
        shutup = false;
        clearTimeout(shutupClock);
        options.form.text = 'Yes?';
    }
    else if (req.body.text.toLowerCase().match(/lolol/))
        options.form.text = 'Out loud out loud!';
    else if (req.body.text.toLowerCase().match(/^alfred(,)? insult ([A-z'])+( )?[A-z]*(.)?(!)?$/)) {
        var name = req.body.text.split('insult ')[1].replace('.', '').replace('!', '');
        if (name === 'me') {
            options.form.text = '...what? What kind of weird junk are you into?';
        }
        else if (name === 'yourself' || name === 'him' || name === 'her' || name === 'us' || name === 'them') {
            options.form.text = 'I need names, master.';
        }
        else if (name.match(/\band\b/)) {
            name = name.charAt(0).toUpperCase() + name.substring(1);
            options.form.text = name + pinsult[Math.floor(Math.random() * pinsultTotal)];
        }
        else {
            if (name.match(/\bmy\b/)) name = name.replace('my', 'your');
            name = name.charAt(0).toUpperCase() + name.substring(1);
            options.form.text = name + insult[Math.floor(Math.random() * insultTotal)];
        }
    }
    else if (req.body.text.toLowerCase().match(/^alfred(,)? compliment ([A-z'( )])+(.)?(!)?$/)) {
        var name = req.body.text.split('compliment ')[1].replace('.', '').replace('!', '');
        if (name === 'me') {
            options.form.text = 'I\'m not programmed to lie.';
        }
        else if (name === 'yourself' || name === 'him' || name === 'her' || name === 'us' || name === 'them') {
            options.form.text = 'I need names, master.';
        }
        else if (name.match(/\band\b/)) {
            name = name.charAt(0).toUpperCase() + name.substring(1);
            options.form.text = name + pcompliment[Math.floor(Math.random() * pcomplimentTotal)];
        }
        else {
            if (name.match(/\bmy\b/)) name = name.replace('my', 'your');
            name = name.charAt(0).toUpperCase() + name.substring(1);
            options.form.text = name + compliment[Math.floor(Math.random() * complimentTotal)];
        }
    }
    else if (req.body.text.toLowerCase().match(/\bfood\b/)) {
        options.form.text = food[Math.floor(Math.random() * foodTotal)];
    }
    else if (req.body.text.toLowerCase().match(/\bmad\b/)) {
        options.form.text = mad[Math.floor(Math.random() * madTotal)];
    }
    else if (req.body.text.toLowerCase().match(/\bwe should (do|go)\b/)) {
        if (!(count++ % 5)) options.form.text = 'What a splendid idea! Count me in! Oh wait, I\'m not real.';
    }
    else if (req.body.text.toLowerCase().match(/\balfred(,)? shut( )?up\b/) || req.body.text.toLowerCase().match(/\bshut( )?up(,)? alfred\b/)) {
        options.form.text = byeResponses[Math.floor(Math.random() * byeTotal)];
        shutup = true;
        shutupClock = setTimeout(function(){shutup = false;}, 3600000);
    }
    else if (req.body.text.toLowerCase().match(/^right(,)? alfred(\?)?/)) {
        options.form.text = right[Math.floor(Math.random() * rightTotal)];
    }
    else return next();


    require('request').post(options);
    return next();
});

app.listen(process.env.PORT || 8666);
