# snips-action-mpd

## Introduction

Nodejs version of Snips Walkman Music Assistant demo. It handles Snips dialogue output, converts structured date to some specific commands to control a target music player. 

## Requirements

This project is based on [mpd](https://www.musicpd.org/) and a Javascript library [mpc.js](https://github.com/hbenl/mpc-js-node).

## Make it work

#### Setup

To install the dependencies, builds the action and creates the config.ini file, run the following command:

```sh
sh setup.sh
```

#### Run

For dev mode:

```sh
npm run dev
```

For prod mode:

```sh
# 1) Lint, transpile and test.
npm start
# 2) Run the action.
node action-snips.js
```

#### Debug

In the `action-snips.js` file:

```js
// Uncomment this line to print everything
debug.enable(name + ':*')
```