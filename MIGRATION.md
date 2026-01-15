# Migration Notes

## Legacy JavaScript Files

The following legacy JavaScript files exist from the original implementation:
- `server.js` (root directory)
- `models/shortUrl.js` (models directory)

These files are **deprecated** and should not be used. The application now runs entirely on TypeScript code in the `src/` directory.

### Safe Removal

Once you've verified the TypeScript version works correctly, you can safely remove these files:

```bash
rm server.js
rm models/shortUrl.js
```

## Major Changes from v1.x to v2.x

### Security Improvements
1. **Replaced shortid with nanoid** - The deprecated shortid library has been replaced with nanoid, which is cryptographically secure and recommended by npm.
2. **Added rate limiting** - 10 requests/minute to prevent abuse
3. **Added Helmet security headers** - CSP, XSS protection, and more
4. **Added CORS support** - Configurable origin restrictions
5. **Enhanced URL validation** - Malicious pattern detection and protocol enforcement

### API Changes
1. **Pagination added to /api/urls** - Now returns paginated results with metadata
   - Old: `GET /api/urls` returned array
   - New: `GET /api/urls?page=1&limit=20` returns object with `urls` and `pagination`

2. **Error responses are now JSON** - More consistent API error handling

### URL Generation Changes
- Short URLs are now 10 characters (nanoid) instead of 7-14 characters (shortid)
- **Backward compatibility**: Existing shortid-based URLs in the database continue to work
- New URLs will use the nanoid format

### Environment Variables
- **New**: `ALLOWED_ORIGINS` - Comma-separated list for CORS configuration

## Database Migration

**No database migration required!** Existing URLs continue to work with both shortid and nanoid formats.

The `short` field in MongoDB accepts both formats:
- Old shortid format: `Hy7xg5fR` (7-14 chars, mixed case with special chars)
- New nanoid format: `V1StGXR8_Z` (10 chars, URL-safe)

## Testing After Upgrade

1. Verify existing short URLs still redirect correctly
2. Create new short URLs and verify they use nanoid format
3. Test API pagination: `curl http://localhost:5000/api/urls?page=1&limit=5`
4. Verify rate limiting: Try creating 11 URLs rapidly
5. Check security headers: `curl -I http://localhost:5000`

## Rollback Plan

If issues occur, you can rollback to the legacy version:

```bash
# Stop current server
# Switch to legacy JavaScript version
npm run start:legacy  # Uses server.js instead of src/server.ts
```

Note: The `start:legacy` script is not included by default. Restore it if needed:

```json
"scripts": {
  "start:legacy": "node server.js"
}
```
