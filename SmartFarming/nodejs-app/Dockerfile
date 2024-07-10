#  Node.js runtime oficial como imagen padre
FROM node:15-slim

# Directorio de trabajo del contenedor
WORKDIR /app

# Copiar package.json y package-lock.json al directorio de trabajo
COPY package*.json ./

# Dependencias
RUN npm install

# Copiar el resto del codigo de la aplicacion
COPY . .

# Puerto
EXPOSE 3000

# Correr la aplicacion 
CMD ["node", "app.js"]



