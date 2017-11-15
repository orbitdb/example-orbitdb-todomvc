const store = async (name) => {
  return new Promise((resolve, reject) => {
    // Create IPFS instance
    const ipfs = new Ipfs({
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
    })

    ipfs.on('error', (e) => handleError(e))
    ipfs.on('ready', async () => {
      try {
        const orbitdb = new OrbitDB(ipfs)
        const db = await orbitdb.docs(name, {
          // If database doesn't exist, create it
          create: true,
          // Don't wait to load from the network
          sync: false,
          // Load only the local version of the database, 
          // don't load the latest from the network yet
          localOnly: true,
          // Allow anyone to write to the database,
          // otherwise only the creator of the database can write
          admin: ['*'],
          write: ['*'],
        })
        resolve(db)
      } catch (e) {
        reject(e)
      }
    })
  })
}
