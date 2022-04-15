FROM node:alpine AS builder
COPY . /build/
RUN cd /build && npm ci --only=production

FROM node:alpine
ARG CORK_MONGO_IP
ARG SECRET_COOKIE_PASSWORD

ENV CORK_MONGO_IP ${CORK_MONGO_IP}
ENV SECRET_COOKIE_PASSWORD ${SECRET_COOKIE_PASSWORD}

COPY --from=builder /build /srv

RUN echo $SECRET_COOKIE_PASSWORD

EXPOSE 5000
WORKDIR /srv
CMD ["node", "server.js"]
