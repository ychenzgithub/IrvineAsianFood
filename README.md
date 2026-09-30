# 🍜 尔湾及周边亚洲美食地图 (Irvine Asian Food & Market Map)

An interactive, responsive food discovery web app for Asian restaurants, dessert shops, and supermarkets across Irvine and Orange County (Tustin, Costa Mesa, Newport Beach, Santa Ana, Lake Forest).

**🌐 Live site:** https://ychenzgithub.github.io/IrvineAsianFood/

---

## 📋 Table of Contents

- [1. Local Development & Testing](#1-local-development--testing)
  - [Prerequisites](#prerequisites)
  - [Installation & Quick Start](#installation--quick-start)
  - [Environment Configuration](#environment-configuration)
  - [Troubleshooting Port Conflicts](#troubleshooting-port-conflicts)
  - [Testing the Production Build Locally](#testing-the-production-build-locally)
- [2. Server Deployment Guide](#2-server-deployment-guide)
  - [Option A: Modern Static Hosting (Recommended / Free & Fast)](#option-a-modern-static-hosting-recommended--free--fast)
  - [Option B: Traditional Linux VPS with Nginx (Ubuntu / Debian / CentOS)](#option-b-traditional-linux-vps-with-nginx-ubuntu--debian--centos)
  - [Option C: Docker Container Deployment](#option-c-docker-container-deployment)
- [3. Project Structure](#3-project-structure)
- [4. Data Ingestion & Scripts](#4-data-ingestion--scripts)

---

## 1. Local Development & Testing

### Prerequisites
- **Node.js**: Version `18.x` or higher (Download from [nodejs.org](https://nodejs.org/))
- **npm**: Version `9.x` or higher (comes bundled with Node.js)
- **Git**

### Installation & Quick Start

1. **Clone the repository** (if on a new machine):
   ```bash
   git clone https://github.com/ychenzgithub/IrvineAsianFood.git
   cd IrvineAsianFood
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Start the local Vite development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   Open your browser and navigate to:
   ```
   http://localhost:5188
   ```

---

### Environment Configuration

The application uses an optional Google Maps Places API key for real-time live data synchronization and enrichment.

Create a `.env` file in the root directory:
```bash
# .env
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

> **Note**: The client-side application will still function smoothly with pre-bundled static restaurant and supermarket data even without an active API key.

---

### Troubleshooting Port Conflicts

By default, the Vite dev server is configured to run strictly on port `5188`. If you see `Error: Port 5188 is already in use`:

1. **Check which process is using port 5188**:
   ```bash
   lsof -i :5188
   ```
2. **Terminate the previous process (macOS/Linux)**:
   ```bash
   kill -9 <PID>
   ```
   *(Or kill all instances using: `kill -9 $(lsof -t -i :5188)`)*
3. **Change the port** (Optional):
   Modify [vite.config.ts](vite.config.ts):
   ```typescript
   export default defineConfig({
     plugins: [react()],
     server: {
       port: 3000, // or any free port
       host: true,
     },
   });
   ```

---

### Testing the Production Build Locally

Before deploying to a remote server, test the optimized production build:

```bash
# 1. Compile TypeScript & bundle assets with Vite
npm run build

# 2. Preview the built static assets in dist/
npm run preview
```
Open the URL shown in the terminal (usually `http://localhost:4173`) to verify performance and functionality.

---

## 2. Server Deployment Guide

Because this application is built with **Vite + React (SPA)**, the production build outputs 100% static HTML, CSS, JavaScript, and asset files into the `dist/` directory.

---

### Option A: Modern Static Hosting (Recommended / Free & Fast)

The simplest and most reliable way to deploy:

#### 1. Vercel
1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```
2. Deploy directly:
   ```bash
   vercel
   ```
   *(Or connect your GitHub repository in the [Vercel Dashboard](https://vercel.com/))*

#### 2. Cloudflare Pages / Netlify / GitHub Pages
- **Build command**: `npm run build`
- **Output directory**: `dist`
- **Node version**: `18+`

---

### Option B: Traditional Linux VPS with Nginx (Ubuntu / Debian / CentOS)

If deploying to your own cloud server (e.g., AWS EC2, DigitalOcean Droplet, Linode, Aliyun):

#### Step 1: Build the assets on your local machine or server
```bash
npm install
npm run build
```
The compiled files will be located in `/path/to/IrvineAsianFood/dist`.

#### Step 2: Install Nginx
```bash
sudo apt update
sudo apt install nginx -y
```

#### Step 3: Configure Nginx
Create `/etc/nginx/sites-available/irvine-asian-food`:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com; # Replace with your domain or IP

    root /var/www/irvine-asian-food/dist;
    index index.html;

    # Gzip Compression for fast loading
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Single Page App routing fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static assets caching
    location ~* \.(?:ico|css|js|gif|jpe?g|png|woff2?|eot|ttf|svg|webp)$ {
        expires 6M;
        access_log off;
        add_header Cache-Control "public, max-age=15552000, immutable";
    }
}
```

#### Step 4: Enable the site and restart Nginx
```bash
# Link the configuration
sudo ln -s /etc/nginx/sites-available/irvine-asian-food /etc/nginx/sites-enabled/

# Copy the dist folder to the web directory
sudo mkdir -p /var/www/irvine-asian-food
sudo cp -r /path/to/IrvineAsianFood/dist /var/www/irvine-asian-food/

# Test Nginx syntax and restart
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 5: Enable Free SSL with Let's Encrypt (Certbot)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

### Option C: Docker Container Deployment

If your team uses Docker:

#### 1. Create a `Dockerfile`:
```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 2. Build and run the container:
```bash
# Build Docker image
docker build -t irvine-asian-food .

# Run on port 80 (or 5188)
docker run -d -p 80:80 --name irvine-food-map irvine-asian-food
```

---

## 3. Project Structure

```
IrvineAsianFood/
├── dist/                   # Production build output
├── scripts/                # Python & Node crawling/enrichment scripts
│   ├── fetch_google_places.py    # Google Maps Places API (New) crawler
│   ├── recalibrate_all_places.py # Coordinate & data correction
│   └── merge_full_database.py    # Data merge pipeline
├── src/
│   ├── components/         # React components (MapView, SidebarList, Modals)
│   ├── data/               # Bundled datasets (initialPlaces.ts, plazas.ts, etc.)
│   ├── hooks/              # Custom React hooks (useGeolocation, usePlacesData)
│   ├── types/              # TypeScript type definitions (food.ts)
│   ├── App.tsx             # Main App layout & state
│   ├── main.tsx            # React entry point
│   └── index.css           # Tailwind & custom CSS
├── index.html              # HTML shell
├── package.json            # Dependencies & npm scripts
├── tailwind.config.js      # Tailwind styling configuration
└── vite.config.ts          # Vite configuration
```

---

## 4. Data Ingestion & Scripts

To refresh or expand store data directly using Google Maps Places API:

```bash
# Set your Google Maps API key
export GOOGLE_MAPS_API_KEY="your_api_key"

# Run the ingestion script
python3 scripts/fetch_google_places.py
```
This updates [src/data/google_places_high_rated.json](src/data/google_places_high_rated.json), which can be merged into the map using the in-app **Web Sync** tool.
