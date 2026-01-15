import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import { ShortUrl } from './models/shortUrl';
import connectDB from './config/database';
import { errorHandler, asyncHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import { rateLimiter, helmetConfig, corsOptions } from './config/security';
import { validateUrl, sanitizeUrl } from './utils/urlValidator';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// Connect to database
connectDB();

// Security middleware (apply before routes)
app.use(helmetConfig);
app.use(cors(corsOptions));

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Logging middleware
app.use((req: Request, _res: Response, next: () => void) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.get('/', asyncHandler(async (_req: Request, res: Response) => {
  // Limit to most recent 50 URLs for performance
  const shortUrls = await ShortUrl.find().sort({ createdAt: -1 }).limit(50);
  res.render('index', { shortUrls, baseUrl: BASE_URL });
}));

// Apply rate limiting to URL creation
app.post('/shortUrls', rateLimiter, asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { fullUrl } = req.body;

  if (!fullUrl) {
    res.status(400).json({ error: 'URL is required' });
    return;
  }

  // Sanitize and validate URL
  const sanitizedUrl = sanitizeUrl(fullUrl);
  const validation = validateUrl(sanitizedUrl);

  if (!validation.isValid) {
    res.status(400).json({ error: validation.error });
    return;
  }

  // Check if URL already exists
  let shortUrl = await ShortUrl.findOne({ full: sanitizedUrl });

  if (!shortUrl) {
    shortUrl = await ShortUrl.create({ full: sanitizedUrl });
    logger.info(`Created new short URL: ${shortUrl.short} -> ${sanitizedUrl}`);
  }

  res.redirect('/');
}));

app.get('/api/urls', asyncHandler(async (req: Request, res: Response) => {
  // Pagination support
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  const [shortUrls, total] = await Promise.all([
    ShortUrl.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    ShortUrl.countDocuments()
  ]);

  res.json({
    urls: shortUrls,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + shortUrls.length < total
    }
  });
}));

app.get('/api/stats/:shortUrl', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });

  if (!shortUrl) {
    res.status(404).json({ error: 'Short URL not found' });
    return;
  }

  res.json({
    full: shortUrl.full,
    short: shortUrl.short,
    clicks: shortUrl.clicks,
    createdAt: shortUrl.createdAt,
    updatedAt: shortUrl.updatedAt
  });
}));

app.delete('/api/urls/:shortUrl', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await ShortUrl.findOneAndDelete({ short: req.params.shortUrl });

  if (!result) {
    res.status(404).json({ error: 'Short URL not found' });
    return;
  }

  logger.info(`Deleted short URL: ${req.params.shortUrl}`);
  res.json({ message: 'URL deleted successfully' });
}));

app.get('/:shortUrl', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });

  if (!shortUrl) {
    res.status(404).render('404', { shortUrl: req.params.shortUrl });
    return;
  }

  shortUrl.clicks++;
  await shortUrl.save();

  logger.info(`Redirecting ${req.params.shortUrl} to ${shortUrl.full} (${shortUrl.clicks} clicks)`);
  res.redirect(shortUrl.full);
}));

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).render('404', { shortUrl: req.url });
});

// Error handler
app.use(errorHandler);

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`Server is running on ${BASE_URL}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

export default app;
