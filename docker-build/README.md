# Node.js build environment in Docker

You can run the Node.js/Webpack build and development server in a Docker container using this configuration.

## Requirements

* [Docker](https://docs.docker.com/desktop/)
* [docker-compose](https://docs.docker.com/compose/install/)

## Run

```
docker-compose -f docker-build up -d
```

This will build a local Docker image containing Node.js, install all requirements and run the development server using `npm start`.

You can see the running application at http://localhost:3000

The running container mounts the mirador-annotations working directory, any changes should be reflected by the development server immediately.

## Stop or restart

```
docker-compose -f docker-build stop
```

Stops the server process.

```
docker-compose -f docker-build restart
```

Restarts the process.

## Tips

* Make sure that your working directory does not contain a `node_modules` directory or a `package-lock.json` file when you build the container for the first time.

