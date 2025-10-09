# 🚀 Quick Start Guide for ShortURL

## What's New? 🎉

Your URL shortener has been completely transformed with:
- ✅ **TypeScript** - Fully typed for better code quality
- ✅ **Modern UI** - Beautiful, responsive design with gradient effects
- ✅ **Enhanced Features** - Click tracking, URL validation, copy-to-clipboard
- ✅ **API Endpoints** - RESTful API for programmatic access
- ✅ **Docker Support** - Easy deployment with Docker Compose
- ✅ **Open Source Ready** - MIT License with full documentation
- ✅ **Production Ready** - Error handling, logging, and environment config

## 🏃‍♂️ Running the Application

### Option 1: Development Mode (Recommended for testing)

1. **Start MongoDB** (if not already running):
   ```bash
   # macOS with Homebrew
   brew services start mongodb-community

   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:7.0
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   ```
   http://localhost:5000
   ```

### Option 2: Production Build

```bash
npm run build
npm start
```

### Option 3: Docker (Easiest - Includes MongoDB)

```bash
docker-compose up -d
```

This starts both the app and MongoDB automatically!

## 📝 Testing the Application

1. **Create a short URL**:
   - Enter a long URL in the form (e.g., `https://www.github.com/Vaporjawn/ShortURL`)
   - Click "Shrink"
   - Your shortened URL will appear in the table

2. **Use the short URL**:
   - Click on the short URL badge or visit it directly
   - It will redirect to your original URL
   - Click count will increment

3. **Copy to clipboard**:
   - Click the copy button next to any short URL
   - Paste anywhere you need it!

## 🔧 API Endpoints

### Create Short URL
```bash
curl -X POST http://localhost:5000/shortUrls \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "fullUrl=https://github.com/Vaporjawn"
```

### Get All URLs
```bash
curl http://localhost:5000/api/urls
```

### Get URL Statistics
```bash
curl http://localhost:5000/api/stats/YOUR_SHORT_CODE
```

### Delete URL
```bash
curl -X DELETE http://localhost:5000/api/urls/YOUR_SHORT_CODE
```

## 🎨 What Changed?

### Before
- Plain JavaScript
- Basic Bootstrap UI
- Limited error handling
- No API
- No Docker support

### After
- **TypeScript** with strict type checking
- **Modern gradient UI** with animations
- **Comprehensive error handling** and logging
- **Full RESTful API** with JSON responses
- **Docker & Docker Compose** support
- **Copy-to-clipboard** functionality
- **URL validation** before shortening
- **Duplicate prevention** (same URL reuses short code)
- **Professional documentation** (README, CONTRIBUTING)
- **MIT License** for open source

## 📁 New Project Structure

```
ShortURL/
├── src/                          # TypeScript source code
│   ├── config/
│   │   └── database.ts          # MongoDB connection
│   ├── middleware/
│   │   └── errorHandler.ts      # Error handling
│   ├── models/
│   │   └── shortUrl.ts          # URL model with validation
│   ├── utils/
│   │   └── logger.ts            # Logging utility
│   └── server.ts                # Main application
├── views/
│   ├── index.ejs                # Modern homepage
│   └── 404.ejs                  # Error page
├── dist/                        # Compiled JavaScript (auto-generated)
├── .env                         # Environment variables
├── docker-compose.yml           # Docker orchestration
├── Dockerfile                   # Container definition
├── README.md                    # Full documentation
├── CONTRIBUTING.md              # Contribution guide
├── LICENSE                      # MIT License
└── tsconfig.json               # TypeScript config
```

## 🔐 Environment Variables

Edit `.env` to configure:

```env
PORT=5000                        # Server port
NODE_ENV=development             # Environment (development/production)
MONGODB_URI=mongodb://localhost:27017/urlShortener
BASE_URL=http://localhost:5000   # Your base URL
```

## 🛠️ Available Scripts

- `npm run dev` - Start with hot reload
- `npm run build` - Build TypeScript
- `npm start` - Run production server
- `npm run lint` - Check code quality
- `npm run lint:fix` - Fix linting issues
- `npm run clean` - Remove build files

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Start MongoDB
brew services start mongodb-community

# Or use Docker
docker run -d -p 27017:27017 mongo:7.0
```

### Port Already in Use
Change `PORT` in `.env` to a different port (e.g., 3000, 8080)

### TypeScript Errors
```bash
npm run clean
npm run build
```

## 🚀 Deploying to Production

### Using Docker (Recommended)
```bash
docker-compose up -d
```

### Manual Deployment
1. Set `NODE_ENV=production` in `.env`
2. Update `BASE_URL` with your domain
3. Run `npm run build`
4. Use `npm start` with a process manager like PM2

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://your-mongo-host:27017/urlShortener
BASE_URL=https://yourdomain.com
```

## 📊 Next Steps

1. ✅ Test the application locally
2. ✅ Try the API endpoints
3. ✅ Customize the UI colors/theme
4. ✅ Deploy to production
5. ✅ Star the repo on GitHub!
6. Consider adding:
   - User authentication
   - Custom short codes
   - QR code generation
   - Analytics dashboard

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## 📄 License

MIT License - see [LICENSE](LICENSE) file.

---

**Made with ❤️ by Victor Williams**

Questions? Check out the [full README.md](README.md) or open an issue on GitHub!
