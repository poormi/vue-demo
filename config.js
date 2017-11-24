module.exports = {
    "development": {
        "servers": {
            "api": "/server/",
        }
    },
    "sit": {
        "servers": {
            "api": "http://github.com/server/",
        }
    },
    "production": {
        servers: {
            "api": "http://github.com/server/",
        }

    }
}[process.env.NODE_ENV || "production"];