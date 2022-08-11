FROM apyecdreg.azurecr.io/apy-nginx:1.0
RUN apk add npm yarn
WORKDIR /
EXPOSE 8080

COPY app/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf
COPY fe_artifacts/startup/docker-entrypoint.sh /docker-entrypoint.sh

WORKDIR /usr/share/nginx/html

RUN npm i -g http-server

RUN  chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]
