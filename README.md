# ShortURL 🔗

[![CI](https://github.com/Vaporjawn/ShortURL/actions/workflows/ci.yml/badge.svg)](https://github.com/Vaporjawn/ShortURL/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green.svg)](https://www.mongodb.com/)

A modern, free, fast, and open-source URL shortener built with TypeScript, Express, and MongoDB.

## ✨ Features

- 🚀 **Fast & Lightweight** - Built with performance in mind
- 🔒 **Security First** - Rate limiting, CORS, Helmet security headers, and malicious URL detection
- ✅ **Enhanced URL Validation** - Comprehensive validation with protocol checking and pattern detection
- 📊 **Click Tracking** - Track how many times your short URLs are accessed
- 🎨 **Modern UI** - Beautiful, responsive interface with improved UX
- 🔗 **Easy Sharing** - One-click copy to clipboard with visual feedback
- 📱 **Mobile Friendly** - Works seamlessly on all devices
- 🐳 **Docker Support** - Easy deployment with Docker Compose
- 📝 **TypeScript** - Fully typed for better development experience
- 🔄 **Real-time Updates** - See your URLs instantly after shortening
- 🌐 **RESTful API** - Full API with pagination support
- ⚡ **Rate Limited** - Protection against abuse (10 requests/minute)
- 🎯 **SEO Optimized** - Includes robots.txt, sitemap.xml, and meta tags

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vaporjawn/ShortURL.git
   cd ShortURL
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/urlShortener
   BASE_URL=http://localhost:5000
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5000
   ```

4. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

5. **Run the application**

   Development mode with hot reload:
   ```bash
   npm run dev
   ```

   Production mode:
   ```bash
   npm run build
   npm start
   ```

6. **Open your browser**

   Navigate to `http://localhost:5000`

## 🐳 Docker Setup

Run with Docker Compose (includes MongoDB):

```bash
docker-compose up -d
```

This will start both the application and MongoDB in containers.

## 📖 API Documentation

### Create Short URL

**POST** `/shortUrls`

```bash
curl -X POST http://localhost:5000/shortUrls \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "fullUrl=https://example.com/very/long/url"
```

### Get All URLs (with Pagination)

**GET** `/api/urls?page=1&limit=20`

```bash
curl http://localhost:5000/api/urls?page=1&limit=20
```

Response:
```json
{
  "urls": [
    {
      "_id": "...",
      "full": "https://example.com/very/long/url",
      "short": "abc123xyz",
      "clicks": 42,
      "createdAt": "2025-10-08T00:00:00.000Z",
      "updatedAt": "2025-10-08T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasMore": true
  }
}
```

### Get URL Statistics

**GET** `/api/stats/:shortUrl`

```bash
curl http://localhost:5000/api/stats/abc123
```

Response:
```json
{
  "full": "https://example.com/very/long/url",
  "short": "abc123",
  "clicks": 42,
  "createdAt": "2025-10-08T00:00:00.000Z",
  "updatedAt": "2025-10-08T00:00:00.000Z"
}
```

### Delete Short URL

**DELETE** `/api/urls/:shortUrl`

```bash
curl -X DELETE http://localhost:5000/api/urls/abc123
```

### Redirect to Original URL

**GET** `/:shortUrl`

```bash
curl -L http://localhost:5000/abc123
```

This will redirect to the original URL and increment the click counter.

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: EJS templating, Bootstrap 5
- **Security**: Helmet, CORS, Express Rate Limit
- **URL Generation**: Nanoid (secure, URL-friendly IDs)
- **Development**: ts-node-dev, nodemon
- **Code Quality**: ESLint, TypeScript strict mode

## 📁 Project Structure

```
ShortURL/
├── src/
│   ├── config/
│   │   ├── database.ts        # MongoDB connection
│   │   └── security.ts        # Security middleware config
│   ├── middleware/
│   │   └── errorHandler.ts    # Error handling middleware
│   ├── models/
│   │   └── shortUrl.ts        # URL model and schema
│   ├── utils/
│   │   ├── logger.ts          # Logging utility
│   │   └── urlValidator.ts    # URL validation and sanitization
│   └── server.ts              # Main application entry
├── views/
│   ├── index.ejs              # Home page
│   └── 404.ejs                # 404 error page
├── public/
│   ├── favicon.svg            # Site favicon
│   ├── robots.txt             # Search engine directives
│   └── sitemap.xml            # Site structure for SEO
├── dist/                      # Compiled TypeScript output
├── .env.example               # Environment variables template
├── docker-compose.yml         # Docker configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Project dependencies
└── README.md                  # This file
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production server
- `npm run lint` - Lint code with ESLint
- `npm test` - Run tests
- `npm run clean` - Remove build artifacts

### Code Style

This project uses ESLint with TypeScript rules. Run `npm run lint` to check code style.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for more details.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Victor Williams**
- GitHub: [@Vaporjawn](https://github.com/Vaporjawn)
- Email: victor.williams.dev@gmail.com

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/) - Fast, unopinionated web framework
- [MongoDB](https://www.mongodb.com/) - NoSQL database
- [Bootstrap](https://getbootstrap.com/) - CSS framework
- [Nanoid](https://github.com/ai/nanoid) - Secure, URL-friendly unique ID generator
- [Helmet](https://helmetjs.github.io/) - Security middleware for Express

## 📊 Roadmap

- [x] Enhanced URL validation with malicious pattern detection
- [x] Rate limiting to prevent abuse
- [x] Security headers with Helmet
- [x] CORS support for API access
- [x] API pagination
- [x] Improved UX with loading states and keyboard shortcuts
- [ ] User authentication and private URLs
- [ ] Custom short URL aliases
- [ ] QR code generation
- [ ] Analytics dashboard with detailed statistics
- [ ] URL expiration
- [ ] API key authentication
- [ ] Bulk URL shortening
- [ ] URL preview before redirect
- [ ] Custom domains support

## 🐛 Known Issues

None at the moment. Please report issues on the [GitHub Issues](https://github.com/Vaporjawn/ShortURL/issues) page.

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact via email: victor.williams.dev@gmail.com

---

Made with ❤️ by Victor Williams
