# coffeebot
Offer and order coffee.

## Setup

Register your bot on slack and take note of your bot token.

Create a .env file in your coffeebot directory with the following in it:

    SLACK_TOKEN=YOUR_BOT_TOKEN_GOES_HERE

Invite your bot to your channel with:

    /invite @coffeebot

Make sure your bot is running on a server by starting it with

    nohup node monitor.js &

## Starting a pot

Assuming you have 6 cups available, type the following in your channel:

    @coffeebot: 6 available

Coffeebot will start a pot and add you to the list.

## Getting in on that pot

Type the following in the channel:

    o/

When all the spots are full, Coffeebot will print out the list of everyone who's in on the current pot and reset.

## Finishing the pot early

Are people taking too long to reply?  Type:

    @coffeebot: finish

Coffeebot will finish the current pot early.

## Resetting Coffeebot

Did you start a pot that nobody seems to want?  Type:

    @coffeebot: reset
