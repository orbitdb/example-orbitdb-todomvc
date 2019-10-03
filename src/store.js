// Configuration for IPFS instance
const ipfsConfig = {
  repo: '/orbitdb/examples/todomvc/ipfs/0.27.0',
  EXPERIMENTAL: {
    pubsub: true,
  },
  config: {
    Addresses: {
      Swarm: [
        // Use IPFS dev signal server
        // Websocket:
        // '/dns4/ws-star-signal-1.servep2p.com/tcp/443/wss/p2p-websocket-star',
        // '/dns4/ws-star-signal-2.servep2p.com/tcp/443/wss/p2p-websocket-star',
        '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
        // WebRTC:
        // '/dns4/star-signal.cloud.ipfs.team/wss/p2p-webrtc-star',
        // Use local signal server
        // '/ip4/0.0.0.0/tcp/9090/wss/p2p-webrtc-star',
      ]
    },
  }
}

// Configuration for the database
const dbConfig = {
  // If database doesn't exist, create it
  create: true,
  // Don't wait to load from the network
  sync: false,
  // Load only the local version of the database
  // localOnly: true,
  // Allow anyone to write to the database,
  // otherwise only the creator of the database can write
  accessController: {
    write: ['*'],
  }
}

const store = async (name) => {
  return new Promise((resolve, reject) => {
    // Create IPFS instance
    const ipfs = new Ipfs(ipfsConfig)

    ipfs.on('error', (e) => console.error(e))
    ipfs.on('ready', async () => {
      try {
        // Create an OrbitDB instance
        const orbitdb = await OrbitDB.createInstance(ipfs)
        // Open (or create) database
        const db = await orbitdb.docstore(name, dbConfig)
        // ToDo: remove this line
        window.db = db
        // Done
        resolve(db)
      } catch (e) {
        reject(e)
      }
    })
  })
}
