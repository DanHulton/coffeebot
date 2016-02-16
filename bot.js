require('dotenv').load();

var Botkit = require('botkit');

// Bot state info
var state = {
	listenMode: 'FreeListenMode',
	available: 5,
	drinkers: []
};

console.log(process.env.NODE_ENV);

var controller = Botkit.slackbot();
var bot = controller.spawn({
  	token: process.env.SLACK_TOKEN
}).startRTM(function(err, bot, payload) {
  	if (err) {
    	throw new Error('Could not connect to Slack');
  	}
});

// Indicate when connection successful
controller.on('rtm_open', function() {
	console.log('notice: ** BOT ID:  coffeebot  Connected!');
});

// Start a pot!
controller.hears(["([0-9]+) available"], ["direct_mention"], function (bot, message) {
	if ('FreeListenMode' === state.listenMode) {
		state.available  = parseInt(message.match[1]);
		state.listenMode = 'HandsUpMode';

  		bot.reply(message, '' + state.available +  " available, got it.  Okay, who's in?  Hands up!");

		addUserFromMessage(message);
  	} else {
  		bot.reply(message, "Er, there's a pot already on...");
  	}
});

// Get in on that pot!
controller.hears(["o/"], ["ambient"], function (bot, message) {
	if ('HandsUpMode' === state.listenMode) {
		addUserFromMessage(message);
	}
});

// Not enough people interested?  Just finish the pot
controller.hears(["finish"], ["direct_mention"], function(bot, message) {
	if ('HandsUpMode' === state.listenMode) {
		finish(message);
	}
});

// Reset that pot
controller.hears(["reset"], ["direct_mention"], function (bot, message) {
	resetState();
	bot.reply(message, "Okay, nevermind, I guess.  Next time, maybe?");
});

// Add a user to a pot
function addUserFromMessage(message) {
	bot.api.users.info({ user: message.user }, function(err, response) {
		if (err) {
			throw new Error("Could not identify user.");
		}

		var name = response.user.real_name;

		// Already in this batch
		if (state.drinkers.indexOf(name) >= 0) {
			bot.reply(message, "You're already in this round, have no fear.");
			return;
		}

		// None available
		if (state.available === 0) {
			bot.reply(message, "Sorry " + name + ", you didn't make it in.  Next time!");
			return;
		}

		// Add user to list
		state.available--;
		state.drinkers.push(name);

		// Still some left?
		if (state.available > 0) {
			bot.reply(message, name + "'s in, " + state.available + " remaining...");

		// We're out!  Wrap it up!
		} else {
			bot.reply(message, name + "'s in.");
			finish(message);
		}
	});
}

function finish(message) {
	bot.reply(message, "That's it!  Here's who gets coffee:");

	for (var i = 0; i < state.drinkers.length; i++) {
		bot.reply(message, "- " + state.drinkers[i]);
	}

	resetState();
}

function resetState() {
	state.listenMode = 'FreeListenMode';
	state.available  = 0;
	state.drinkers   = [];
}
