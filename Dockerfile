# build environment
FROM node:16-alpine as builder

COPY package.json yarn.lock .yarnrc /tmp/
RUN cd /tmp && yarn install
RUN mkdir -p /home/app && cp -a /tmp/node_modules /home/app/

WORKDIR /home/app
COPY . /home/app
RUN yarn build

# production environment
FROM nginx:1.13.9-alpine
COPY --from=builder /home/app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN ln -sf /dev/stdout /var/log/nginx/access.log && \ 
  ln -sf /dev/stderr /var/log/nginx/error.log  

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]