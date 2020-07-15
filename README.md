# snips-action-music

Snips action code for the Music app

Handles Snips dialogue output, converts structured date to some specific commands to control a target music player.

[![Build Status](https://travis-ci.org/snipsco/snips-action-music.svg?branch=master)](https://travis-ci.org/snipsco/snips-action-music)

## Setup

```sh
# Install the dependencies, builds the action and creates the config.ini file.
sh setup.sh
```

Don't forget to edit the `config.ini` file.

This project is based on [mpd](https://www.musicpd.org/) and a JavaScript library [mpc.js](https://github.com/hbenl/mpc-js-node).

An assistant containing the intents listed below must be installed on your system. Deploy it following [these instructions](https://docs.snips.ai/articles/console/actions/deploy-your-assistant).

To add a second mpd server add in the config file:

mpd_host2=<hostname>
mpd_site_id2=<siteId>

## Run

- Dev mode:

```sh
# Dev mode watches for file changes and restarts the action.
npm run dev
```

- Prod mode:

```sh
# 1) Lint, transpile and test.
npm start
# 2) Compile and run the action.
node action-music.js
```

## Test & Demo cases

This app only supports french 🇫🇷 and english 🇬🇧.

## Debug

In the `src/index.ts` file:

```js
// Uncomment this line to print everything
// debug.enable(name + ':*')
```

## Test

*Requires [mosquitto](https://mosquitto.org/download/) to be installed.*

```sh
npm run test
```

**In test mode, i18n output and http calls are mocked.**

- **http**: mocks are written in `tests/httpMocks/index.ts`
- **i18n**: mocked by `snips-toolkit`, see the [documentation](https://github.com/snipsco/snips-javascript-toolkit#i18n).

## Contributing

Please see the [Contribution Guidelines](https://github.com/snipsco/snips-action-music/blob/master/CONTRIBUTING.md).

## Copyright

This library is provided by [Snips](https://snips.ai) as Open Source software. See [LICENSE](https://github.com/snipsco/snips-action-music/blob/master/LICENSE) for more information.
