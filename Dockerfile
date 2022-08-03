FROM node:16.15.1

# Create app directory
WORKDIR /erpback

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install --production
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 9090
CMD [ "node", "src/server.js" ]