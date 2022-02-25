module.exports = {
  "apps": [
    {
      "name": "movie-store-service-grpc",
      "instances": 1,
      "script": "./movie-store-service/Index.js",
      "watch": true,
      "ignore_watch": [
        "/[\s\S].spec.js$/",
        "node_modules"
      ],
      "exec_mode": "cluster",
      "interpreter_args": "--harmony",
      "error_file": "/var/tmp/netflix/grpc/error.log",
      "min_uptime": 500,
      "max_restarts": 10,
      "restart_delay": 1000
    },
    {
      "name": "user-preferences-service-grpc",
      "instances": 1,
      "script": "./user-preferences-service/Index.js",
      "watch": true,
      "ignore_watch": [
        "/[\s\S].spec.js$/",
        "node_modules"
      ],
      "exec_mode": "cluster",
      "interpreter_args": "--harmony",
      "error_file": "/var/tmp/netflix/grpc/error.log",
      "min_uptime": 500,
      "max_restarts": 10,
      "restart_delay": 1000
    },
    {
      "name": "movie-finder-service-grpc",
      "instances": 1,
      "script": "./movie-finder-service/Index.js",
      "watch": true,
      "ignore_watch": [
        "/[\s\S].spec.js$/",
        "node_modules"
      ],
      "exec_mode": "cluster",
      "interpreter_args": "--harmony",
      "error_file": "/var/tmp/netflix/grpc/error.log",
      "min_uptime": 500,
      "max_restarts": 10,
      "restart_delay": 1000
    },
    {
      "name": "recommender-service-grpc",
      "instances": 1,
      "script": "./recommender-service/Index.js",
      "watch": true,
      "ignore_watch": [
        "/[\s\S].spec.js$/",
        "node_modules"
      ],
      "exec_mode": "cluster",
      "interpreter_args": "--harmony",
      "error_file": "/var/tmp/netflix/grpc/error.log",
      "min_uptime": 500,
      "max_restarts": 10,
      "restart_delay": 1000
    }
  ]
}