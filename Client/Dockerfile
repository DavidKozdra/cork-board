FROM node:alpine AS builder
COPY . /build/
RUN cd /build && npm ci --only=production
RUN cd /build && npm run build && mkdir -p /srv && mv ./build /srv

FROM caddy:latest

COPY --from=builder /srv /srv

EXPOSE 2015
CMD ["caddy", "file-server", "--listen", ":2015", "--root", "/srv"]
