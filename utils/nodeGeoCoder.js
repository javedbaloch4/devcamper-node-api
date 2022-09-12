import NodeGeoCoder from "node-geocoder";

const options = {
    provider: "mapquest",
    httpAdapter: 'https',
    apiKey: "HGVQRGqGtPKFnwQEhP5OOGOfststzdV7",
    formatter: null
}

const geocoder = NodeGeoCoder(options)

export default geocoder