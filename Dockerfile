FROM docker.io/library/node:14

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Expose the port defined in server.js
EXPOSE 4500

# Start things up
CMD [ "node", "server.js" ]
