var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

var shutup = false, shutupClock,count = 0;

var byeResponses = {
    0: 'http://24.media.tumblr.com/707eac01118e23238a3875eb86cbb447/tumblr_myy1wf8IVG1rcny7ko1_250.gif',
    1: '...very well, master.',
    2: 'I believe I\'ve had it with you. Good day.'
}, byeTotal = _.keys(byeResponses).length;

var food = {
    0: 'Mmm... food... I do like a good liverwurst.',
    1: 'Did somebody say food? Master Chachi makes an excellent omelette. Indubitably!',
    2: 'Don\'t talk about food! If Master Dom hears, there\'ll be none left!',
    3: 'Did I hear food? I believe Steak n Shake is open 24 hours!'
}, foodTotal = _.keys(food).length;

var right = {
    0: 'Indubitably, master.',
    1: 'Er, I suppose so.',
    2: 'In all my travels through the Himalayas, I\'ve never encountered a person with logic as sound as that!',
    3: 'Quite so! But what do I know? I\'m not even real. I don\'t even know what a Pop Tart is.'
}, rightTotal = _.keys(right).length;

var insult = {
    0: ' is a booty.',
    1: ' smells like booty.',
    2: ' looks like booty.',
    3: ' has a big booty. Wait, that\'s a compliment...',
    4: ' probably tastes like a donkey booty.',
    5: ', something about you really makes me want to walk into traffic.',
    6: ', can you please stop? Just stop.'
}, insultTotal = _.keys(insult).length;

var compliment = {
    0: ', you have the most beautiful eyes. And booty.',
    1: ' has a booty that is absolutely to die for.',
    2: ' is Miss New Booty. Get it together and bring it back to me.',
    3: ', you rock. Like, honestly. Do you realize how incomplete life would be without you?',
    4: ', I might actually be in love with you. And I\'m not even real, so that means something.'
}, complimentTotal = _.keys(compliment).length;

var mad = {
    0: 'https://33.media.tumblr.com/tumblr_m140vycDbs1rqfhi2o1_400.gif',
    1: 'Whoa, master, please control yourself.'
}, madTotal = _.keys(mad).length;

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
        else options.form.text = name + insult[Math.floor(Math.random() * insultTotal)];
    }
    else if (req.body.text.toLowerCase().match(/^alfred(,)? compliment ([A-z'])+( )?[A-z]*(.)?(!)?$/)) {
        var name = req.body.text.split('compliment ')[1].replace('.', '').replace('!', '');
        if (name === 'me') {
            options.form.text = 'I\'m not programmed to lie.';
        }
        else if (name === 'yourself' || name === 'him' || name === 'her' || name === 'us' || name === 'them') {
            options.form.text = 'I need names, master.';
        }
        else options.form.text = name + compliment[Math.floor(Math.random() * complimentTotal)];
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
