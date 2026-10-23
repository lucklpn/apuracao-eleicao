# Estágio 1: Build da aplicação React + Vite
FROM node:22-alpine AS builder

WORKDIR /app

# Copia manifestos de pacotes primeiro para aproveitar cache de camadas do Docker
COPY package.json package-lock.json ./

# Instala dependências
RUN npm ci

# Copia o código fonte
COPY . .

# Compila para produção
RUN npm run build

# Estágio 2: Servidor Web Nginx Alpine de alta performance
FROM nginx:alpine

# Remove configuração padrão do nginx
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copia a configuração customizada do Nginx com proxy para o TSE
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos compilados do builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expõe a porta 80 do container
EXPOSE 80

# Inicia o Nginx
CMD ["nginx", "-g", "daemon off;"]
