const fetch = require('node-fetch')
fetch('http://localhost:4040/api/tunnels')
    .then(res => res.json())
    .then(json => json.tunnels.find(tunnel => tunnel.proto === 'https'))
    .then(secureTunnel => console.log(secureTunnel.public_url))
    .catch(err => {
        if (err.code === 'ECONNREFUSED') {
            return console.error("Looks like you're not running ngrok.")
        }
        console.error(err)
    })