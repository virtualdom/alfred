var bodyParser = require('body-parser');
var express = require('express');
var request = require('request');
var S = require('string');
var _ = require('underscore');

var reply = require('./resources/reply.json');
var joke = require('./resources/jokes.json');
var byeTotal = reply.bye.length;
var foodTotal = reply.food.length;
var rightTotal = reply.right.length;
var insultTotal = reply.insult.length;
var complimentTotal = reply.compliment.length;
var madTotal = reply.mad.length;
var jokeTotal = joke.length;

var app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

request.get('http://peoplearenice.blogspot.com/p/compliment-list.html', function (err, r, html) {
    if (err) return next (err);

    html.match(/<span style="font-family: Georgia, 'Times New Roman', serif;">[0-9]+\..+\n/g).forEach(function(line){
        var c = S(line).stripTags().s.trim().replace(/^[0-9]+\. /, '');
        c = c.match(/^I('[a-z]+)?\b/) ? c : c.charAt(0).toLowerCase() + c.substring(1);
        reply.compliment.push(', ' + c);
    });
    complimentTotal = reply.compliment.length;
});

var shutup = {
    '7771805': false,
    '11248555': false,
    '10059220': false,
    '7510782': false
};

var shutupClock = {};
var count = 0;

app.post('/', function (req, res, next) {
    req.body.text = req.body.text.toLowerCase();

    if (req.body.name === 'Alfred' || (shutup[req.body.group_id] && !req.body.text.match(/^alfred[.!?]?$/))) {
        return next();
    }

    if (req.body.text.match(/^alfred[.!?]?$/)) {
        shutup[req.body.group_id] = false;
        clearTimeout(shutupClock[req.body.group_id]);
        req.reply = 'Yes?';
        return next();
    }

    else if (req.body.text.match(/lolol/)) {
        req.reply = 'Out loud out loud!';
        return next();
    }

    else if (req.body.text.match(/alfred(,)? pug me/)) {
        request.get('http://pugme.herokuapp.com/random', function (err, r, b) {
            if (err) return next (err);

            req.reply = JSON.parse(b).pug;
            return next();
        });
    }

    else if (req.body.text.match(/thank(s| you)(,)? alfred[\.!\?]?/)) {
        req.reply = 'You are quite welcome, master.';
        return next();
    }

    else if (req.body.text.match(/i('m| am) [A-z( )]*bored/)) {
        req.reply = 'Shut up, Dom.';
        return next();
    }

    else if (req.body.text.match(/^alfred(,)? (compliment|insult) ([A-z'( )])+(.)?(!)?$/)) {
        var response, responseLength, split;
        if (req.body.text.match(/\bcompliment\b/)) {
            split = 'compliment ';
            response = reply.compliment;
            responseLength = complimentTotal;
        }
        else {
            split = 'insult ';
            response = reply.insult;
            responseLength = insultTotal;
        }

        var name = req.body.text.split(split)[1].replace('.', '').replace('!', '').trim();

        if (name === 'me') {
            req.reply = 'I\'m not programmed to lie.';
        }
        else if (name === 'yourself' || name === 'I' || name === 'him' || name === 'her' || name === 'us' || name === 'them') {
            req.reply = 'I need names, master.';
        }
        else {
            if (name.match(/\bmy\b/)) name = name.replace('my', 'your');
            name = name.charAt(0).toUpperCase() + name.substring(1);

            req.reply = name + response[Math.floor(Math.random() * responseLength)];
        }
        return next();
    }
    else if (req.body.text.match(/\bfood\b/)) {
        req.reply = reply.food[Math.floor(Math.random() * foodTotal)];
        return next();
    }
    else if (req.body.text.match(/^alfred(,)? say .*$/)) {
        var say = req.body.text.split('say ')[1].trim();
        req.reply = say.charAt(0).toUpperCase() + say.substring(1);
        return next();
    }
    else if (req.body.text.match(/^alfred(,)? tell (us |me )?a joke[.!?]?$/)) {
        req.reply = joke[Math.floor(Math.random() * jokeTotal)];;
        return next();
    }
    else if (req.body.text.match(/^alfred(,)? derp .*$/)) {
        var derp = req.body.text.split('derp ')[1].trim();
        request('http://ermahgerd.herokuapp.com/ternslert?value=' + derp, function(e, r, b){
            req.reply = JSON.parse(b).value;
            return next();
        });
    }
    else if (req.body.text.match(/\bmad\b/)) {
        req.reply = reply.mad[Math.floor(Math.random() * madTotal)];
        return next();
    }
    else if (req.body.text.match(/\bwe should (do|go)\b/)) {
        if (!(count++ % 5)) req.reply = 'What a splendid idea! Count me in! Oh wait, I\'m not real.';
        return next();
    }
    else if (req.body.text.match(/\balfred(,)? shut( )?up\b/) || req.body.text.match(/\bshut( )?up(,)? alfred\b/)) {
        req.reply = reply.bye[Math.floor(Math.random() * byeTotal)];
        shutup[req.body.group_id] = true;
        shutupClock[req.body.group_id] = setTimeout(function(){shutup[req.body.group_id] = false;}, 3600000);
        return next();
    }
    else if (req.body.text.match(/^right(,)? alfred(\?)?/)) {
        req.reply = reply.right[Math.floor(Math.random() * rightTotal)];
        return next();
    }
    else if (req.body.text.match(/^alfred(,)? help[.!?]?$/)) {
        req.reply = reply.help;
        return next();
    }
    else return res.send();
});

app.use(function (req, res, next) {
    if (!req.reply) return;

    var options = {
        url: 'https://api.groupme.com/v3/bots/post',
        method: 'POST',
        form: {}
    };

    switch (req.body.group_id) {
        case '7771805': options.form.bot_id = '23d0b4561b9693e82424f9be63'; break;
        case '11248555': options.form.bot_id = 'eeaab94daaef6eff88e1b3b68d'; break;
        case '10059220': options.form.bot_id = '8db834f2d43673052c39a713a2'; break;
        case '7510782': options.form.bot_id = 'dff632a96e9dc15450def517b2'; break;
        default: options.form.bot_id = 'eeaab94daaef6eff88e1b3b68d';
    }

    options.form.text = req.reply;

    setTimeout(function () {
        request.post(options);
    }, 1000);
});

app.listen(process.env.PORT || 8666);
