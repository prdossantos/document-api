FROM node:16 

RUN mkdir -p /usr/src/app  
RUN npm install nodemon -g  

WORKDIR /usr/src/app  
COPY ./package.json /usr/src/app/package.json  
RUN npm install -g  

EXPOSE 8084 

CMD ["npm", "start"] 