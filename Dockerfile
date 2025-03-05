# Gunakan image Node.js versi terbaru
FROM node:18-alpine

# Tentukan working directory di dalam container
WORKDIR /app

# Copy package.json dan package-lock.json untuk menginstall dependency lebih cepat
COPY package*.json ./

# **Nonaktifkan Husky saat install dependencies**
RUN npm install

# Copy seluruh kode proyek ke dalam container
COPY . .

# Build aplikasi Next.js
RUN npm run build

# Expose port yang digunakan Next.js
EXPOSE 3000

# Jalankan aplikasi
CMD ["npm", "start"]
