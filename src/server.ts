import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { ShortUrl } from './models/shortUrl';
import connectDB from './config/database';
import { errorHandler, asyncHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// Connect to database
connectDB();

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
  const shortUrls = await ShortUrl.find().sort({ createdAt: -1 });
  res.render('index', { shortUrls, baseUrl: BASE_URL });
}));

app.post('/shortUrls', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { fullUrl } = req.body;

  if (!fullUrl) {
    res.status(400).json({ error: 'URL is required' });
    return;
  }

  // Validate URL format
  try {
    new URL(fullUrl);
  } catch {
    res.status(400).json({ error: 'Invalid URL format' });
    return;
  }

  // Check if URL already exists
  let shortUrl = await ShortUrl.findOne({ full: fullUrl });

  if (!shortUrl) {
    shortUrl = await ShortUrl.create({ full: fullUrl });
    logger.info(`Created new short URL: ${shortUrl.short} -> ${fullUrl}`);
  }

  res.redirect('/');
}));

app.get('/api/urls', asyncHandler(async (_req: Request, res: Response) => {
  const shortUrls = await ShortUrl.find().sort({ createdAt: -1 });
  res.json(shortUrls);
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
