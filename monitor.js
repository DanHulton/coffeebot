var respawn = require('respawn');

var monitor = respawn(['node', 'bot.js'], {
    env: {ENV_VAR:'test'},
    cwd: '.',
    maxRestarts: 10,
    sleep: 1000,
});

monitor.start();