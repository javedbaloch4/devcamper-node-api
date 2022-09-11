import NodeGeoCoder from "node-geocoder";

const options = {
    provider: "mapquest",
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
}

const geocoder = NodeGeoCoder(options)

export default geocoder