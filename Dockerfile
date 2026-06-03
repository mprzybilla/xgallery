# ---------- Build-Stage ----------
FROM node:26-alpine AS build

WORKDIR /app

# Abhängigkeiten zuerst (besseres Layer-Caching)
COPY package*.json ./
RUN npm ci

# Quellcode kopieren und produktiv bauen
COPY . .
RUN npm run build

# ---------- Runtime-Stage (NGINX) ----------
FROM nginx:1.27-alpine AS runtime

# Eigene Server-Konfiguration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Gebaute Angular-App ausliefern
COPY --from=build /app/dist/xgallery/browser /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
    CMD wget -qO- http://localhost/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
