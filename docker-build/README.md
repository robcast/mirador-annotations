# Node.js build environment in Docker

You can run the Node.js/Webpack build and development server in a Docker container using this configuration.

## Requirements

* [Docker](https://docs.docker.com/desktop/)
* [docker-compose](https://docs.docker.com/compose/install/)

## Run

In the `mirador-annotations` working directory run
```
docker-compose -f docker-build/docker-compose.yml up -d
```

This will build a local Docker image containing Node.js, install all requirements and run the development server using `npm start`.

You can see the running application at http://localhost:3000

The running container mounts the mirador-annotations working directory, any changes should be reflected by the development server immediately.

## Stop or restart development server

```
docker-compose -f docker-build/docker-compose.yml stop
```

Stops the developement server process.

```
docker-compose -f docker-build/docker-compose.yml restart
```

Restarts the process.

## Build deployable Javascript

You can basically pass any command-line to the docker-compose `node` service using `run`:

```
docker-compose -f docker-build/docker-compose.yml run node npm run build
```

will run `npm run build` in the Docker container and produce deployable files in the `demo/dist` directory.

## Tips

* Make sure that your working directory does not contain a `node_modules` directory or a `package-lock.json` file when you build the container for the first time.
