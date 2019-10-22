FROM node:alpine

ENV ASSET_NAME="vApp31"

RUN mkdir -p /Server
WORKDIR /Server

COPY . .

RUN npm install
RUN ls -a
RUN chmod +x entrypoint.sh

EXPOSE 8000

LABEL vf-OS.author="lyon2"
LABEL vf-OS.name="vApp31"
LABEL vf-OS.description="Pilot 3 - vApp31"
LABEL vf-OS=true
LABEL vf-OS.frontendUri=/login.html
LABEL vf-OS.icon=img/2.png
LABEL vf-OS.urlprefixReplace=true

CMD ["npm", "start"]
