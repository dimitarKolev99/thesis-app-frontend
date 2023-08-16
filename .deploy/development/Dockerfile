FROM nginx:stable-alpine

EXPOSE 443

COPY dist /usr/share/nginx/html/
COPY config/nginx.conf /etc/nginx/conf.d/default.conf
COPY config/configureEnvironment.sh /usr/share/configureEnvironment.sh

RUN chmod +x /usr/share/configureEnvironment.sh

CMD /usr/share/configureEnvironment.sh $SUPPORT_SAS; nginx -g "daemon off;"
