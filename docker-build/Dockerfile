FROM node:14

# buildx sets TARGETARCH automatically
ARG TARGETARCH

# ARM64: need to install libpango-dev to build node-canvas
RUN if [ "${TARGETARCH}" = "arm64" ]; then \
    apt-get update -y && apt-get install -y libpango1.0-dev \
    ; fi

ENV MODULES_DIR=/app_node_modules
COPY docker-build/entrypoint.sh /entrypoint.sh

COPY . /app
WORKDIR /app
# bug: need to install phantomjs with --ignore-scripts
RUN npm install phantomjs-prebuilt@2.1.16 --ignore-scripts
# install app
RUN npm install
# save and link back node_modules
RUN mkdir ${MODULES_DIR} && \
    mv node_modules ${MODULES_DIR}/ && \
    mv package-lock.json ${MODULES_DIR} && \
    ln -s ${MODULES_DIR}/* .

EXPOSE 3000
ENTRYPOINT ["/entrypoint.sh"]
CMD ["npm", "start"]
