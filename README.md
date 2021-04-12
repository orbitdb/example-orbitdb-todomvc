# Example OrbitDB TodoMVC

[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/orbitdb/Lobby) [![Matrix](https://img.shields.io/badge/matrix-%23orbitdb%3Apermaweb.io-blue.svg)](https://riot.permaweb.io/#/room/#orbitdb:permaweb.io) [![Discord](https://img.shields.io/discord/475789330380488707?color=blueviolet&label=discord)](https://discord.gg/v3RNE3M)

> Serverless and collaborative Todo lists

TodoMVC application using [OrbitDB](https://github.com/orbitdb/orbit-db) as a database for the todo list and [IPFS](https://github.com/ipfs/js-ipfs) as the storage and networking. This is an example to demonstrate how OrbitDB enables multi-user, real-time and serverless editing of a dataset.

Status: ***Work in progress***.

**[LIVE DEMO](https://ipfs.io/ipfs/QmVWQMLUM3o4ZFbLtLMS1PMLfodeEeBkBPR2a2R3hqQ337/)**

<p align="centers">
  <img src="https://raw.githubusercontent.com/haadcode/example-orbitdb-todomvc/master/screenshots/Screen%20Shot%202017-11-29%20at%2017.09.31.png" width="50%">
</p>

## Background

This example is based on [React TodoMVC](https://github.com/tastejs/todomvc/tree/master/examples/react).

- Initializing OrbitDB and IPFS happens in [store](https://github.com/haadcode/example-orbitdb-todomvc/blob/master/src/store.js)
- OrbitDB calls happen in [model](https://github.com/haadcode/example-orbitdb-todomvc/blob/master/src/todoModel.js)
- The database and app are hooked together in [app](https://github.com/haadcode/example-orbitdb-todomvc/blob/master/src/app.jsx#L188)

## Install

```sh
git clone <repo>
cd repo/
npm install
npm run build
```

## Usage

```sh
npm start
```

Open your browser at http://127.0.0.1:8080

## Collaborative editing by multiple users

To collaborate on a TODO list, open the same url in *another browser or incognito window*. You should see the TODO lists sync automatically.


## Contribute

We'd be happy have contributions! If you find any issues, have suggestions for new features or would like to improve the project, please open an issue.

For specific guidelines for contributing to this repository, check out the [Contributing guide](CONTRIBUTING.md). For more on contributing to OrbitDB in general, take a look at the [@OrbitDB welcome repository](https://github.com/orbitdb/welcome). Please note that all interactions in @orbitdb fall under our [Code of Conduct](CODE_OF_CONDUCT.md).

## License

[MIT](LICENSE) © 2017-2019 Haja Networks Oy
