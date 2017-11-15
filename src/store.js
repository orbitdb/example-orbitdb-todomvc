// Configuration for IPFS instance
const ipfsConfig = {
  repo: '/orbitdb/examples/todomvc/ipfs',
  EXPERIMENTAL: {
    pubsub: true,
  },
  config: {
    Addresses: {
      Swarm: [
        // Use IPFS dev signal server
        '/dns4/star-signal.cloud.ipfs.team/wss/p2p-webrtc-star',
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
  localOnly: true,
  // Allow anyone to write to the database,
  // otherwise only the creator of the database can write
  admin: ['*'],
  write: ['*'],
}

const store = async (name) => {
  return new Promise((resolve, reject) => {
    // Create IPFS instance
    const ipfs = new Ipfs(ipfsConfig)

    ipfs.on('error', (e) => console.error(e))
    ipfs.on('ready', async () => {
      try {
        // Create an OrbitDB instance
        const orbitdb = new OrbitDB(ipfs)
        // Open (or create) database
        const db = await orbitdb.docs(name, dbConfig)
        // Done
        resolve(db)
      } catch (e) {
        reject(e)
      }
    })
  })
}
