var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var byeResponses = require('./resources/bye.json'), byeTotal = _.keys(byeResponses).length;
var food = require('./resources/food.json'), foodTotal = _.keys(food).length;
var right = require('./resources/right.json'), rightTotal = _.keys(right).length;
var insult = require('./resources/insult.json').single, insultTotal = _.keys(insult).length;
var pinsult = require('./resources/insult.json').plural, pinsultTotal = _.keys(pinsult).length;
var compliment = require('./resources/compliment.json').single, complimentTotal = _.keys(compliment).length;
var pcompliment = require('./resources/compliment.json').plural, pcomplimentTotal = _.keys(pcompliment).length;
var mad = require('./resources/mad.json'), madTotal = _.keys(mad).length;

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

    else if (req.body.text.toLowerCase().match(/lolol/)) options.form.text = 'Out loud out loud!';

    else if (req.body.text.toLowerCase().match(/^alfred(,)? (compliment|insult) ([A-z'( )])+(.)?(!)?$/)) {
        var response, responseLength, split;
        if (req.body.text.toLowerCase().match(/\bcompliment\b/)) {
            split = 'compliment ';
            if (req.body.text.toLowerCase().match(/\band\b/)) {
                response = pcompliment;
                responseLength = pcomplimentTotal;
            }
            else {
                response = compliment;
                responseLength = complimentTotal;
            }
        }
        else {
            split = 'insult ';
            if (req.body.text.toLowerCase().match(/\band\b/)) {
                response = pinsult;
                responseLength = pinsultTotal;
            }
            else {
                response = insult;
                responseLength = insultTotal;
            }
        }

        var name = req.body.text.split(split)[1].replace('.', '').replace('!', '').trim();

        if (name === 'me') {
            options.form.text = 'I\'m not programmed to lie.';
        }
        else if (name === 'yourself' || name === 'I' || name === 'him' || name === 'her' || name === 'us' || name === 'them') {
            options.form.text = 'I need names, master.';
        }
        else {
            if (name.match(/\bmy\b/)) name = name.replace('my', 'your');
            name = name.charAt(0).toUpperCase() + name.substring(1);

            options.form.text = name + response[Math.floor(Math.random() * responseLength)];
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

    res.send();
    setTimeout(function () {
        require('request').post(options);
    }, 1000);
});

app.listen(process.env.PORT || 8666);
