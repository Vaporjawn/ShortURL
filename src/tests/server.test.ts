import request from 'supertest';
import app from '../server';

// Mock the model's methods
const mockCreate = jest.fn();
const mockFindOne = jest.fn();

// We need to tell Jest what to return when `create` is called
mockCreate.mockResolvedValue({
  full: 'https://example.com',
  short: 'abcde',
  clicks: 0,
});
mockFindOne.mockResolvedValue(null);

// Replace the actual implementation with our mock
jest.mock('../models/shortUrl', () => ({
  ShortUrl: {
    create: (obj: { full: string }) => mockCreate(obj),
    findOne: (obj: { full: string }) => mockFindOne(obj),
  },
}));

describe('URL Shortener', () => {
  beforeEach(() => {
    // Clear mocks before each test
    mockCreate.mockClear();
    mockFindOne.mockClear();
  });

  it('should create a new short URL when it does not exist', async () => {
    const res = await request(app)
      .post('/shortUrls')
      .send({ fullUrl: 'https://example.com' });

    expect(mockFindOne).toHaveBeenCalledWith({ full: 'https://example.com' });
    expect(mockCreate).toHaveBeenCalledWith({ full: 'https://example.com' });
    expect(res.statusCode).toEqual(302);
    expect(res.header.location).toBe('/');
  });

  it('should not create a new short URL if it already exists', async () => {
    // Arrange: findOne will return an existing URL
    mockFindOne.mockResolvedValue({
      full: 'https://example.com',
      short: 'abcde',
      clicks: 5,
    });

    const res = await request(app)
      .post('/shortUrls')
      .send({ fullUrl: 'https://example.com' });

    expect(mockFindOne).toHaveBeenCalledWith({ full: 'https://example.com' });
    expect(mockCreate).not.toHaveBeenCalled();
    expect(res.statusCode).toEqual(302);
    expect(res.header.location).toBe('/');
  });
});
