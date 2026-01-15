# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are currently supported:

| Version | Supported          |
| ------- | ------------------ |
| 2.x.x   | :white_check_mark: |
| < 2.0   | :x:                |

## Security Features

ShortURL implements multiple security layers:

### 1. Rate Limiting
- **10 requests per minute** per IP address for URL creation
- Prevents denial-of-service (DoS) attacks
- Helps prevent spam and abuse

### 2. URL Validation
- Comprehensive URL format validation
- Protocol enforcement (HTTP/HTTPS only)
- Maximum length check (2048 characters)
- Malicious pattern detection blocking:
  - `javascript:` protocol
  - `data:` protocol
  - `vbscript:` protocol
  - `file:` protocol
  - Script injection patterns
  - Event handler patterns

### 3. Security Headers (Helmet)
- Content Security Policy (CSP)
- X-DNS-Prefetch-Control
- X-Frame-Options
- Strict-Transport-Security
- X-Download-Options
- X-Content-Type-Options
- X-Permitted-Cross-Domain-Policies

### 4. CORS Protection
- Configurable allowed origins
- Method restrictions
- Credential handling

### 5. Input Sanitization
- URL trimming and normalization
- Protocol auto-detection
- Special character handling

## Reporting a Vulnerability

We take the security of ShortURL seriously. If you believe you have found a security vulnerability, please report it to us as described below.

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to:
- **Email**: victor.williams.dev@gmail.com
- **Subject**: [SECURITY] Brief description of the vulnerability

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

Please include the following information:
- Type of vulnerability
- Full paths of affected source file(s)
- Location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

This information will help us triage your report more quickly.

## Security Best Practices for Deployment

### Environment Variables
- Never commit `.env` files to version control
- Use strong, randomly generated values for sensitive configuration
- Rotate credentials regularly

### MongoDB Security
- Enable authentication on MongoDB
- Use strong passwords
- Restrict network access to MongoDB
- Enable TLS/SSL for MongoDB connections
- Regular backups

### Application Deployment
- Always use HTTPS in production
- Keep dependencies up to date
- Run the application with minimal required privileges
- Implement monitoring and alerting
- Regular security audits

### ALLOWED_ORIGINS Configuration
```env
# Development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5000

# Production
ALLOWED_ORIGINS=https://yoursite.com,https://www.yoursite.com
```

## Vulnerability Disclosure Policy

We follow a coordinated disclosure approach:
1. Report received and acknowledged
2. Issue investigated and validated
3. Fix developed and tested
4. Security advisory published
5. Credit given to reporter (unless anonymous request)

## Security Updates

Subscribe to security updates:
- Watch this repository on GitHub
- Check the [Releases](https://github.com/Vaporjawn/ShortURL/releases) page
- Follow [@Vaporjawn](https://github.com/Vaporjawn) on GitHub

## Known Security Considerations

### Short URL Predictability
- 10-character nanoid provides ~10 years to generate 1% probability of collision at 1000 IDs/hour
- URLs are generated using cryptographically secure random generator
- Consider increasing length for high-volume deployments

### Click Tracking Privacy
- Click counts are stored without user identification
- No IP logging by default
- Consider privacy implications for your use case

### Rate Limiting
- Current limit: 10 requests/minute
- May need adjustment based on legitimate usage patterns
- Can be configured in `src/config/security.ts`

## Security Checklist for Production

- [ ] Enable HTTPS (use Let's Encrypt for free certificates)
- [ ] Configure `ALLOWED_ORIGINS` environment variable
- [ ] Enable MongoDB authentication
- [ ] Use strong MongoDB credentials
- [ ] Set `NODE_ENV=production`
- [ ] Regular dependency updates with `npm audit`
- [ ] Configure proper CORS settings
- [ ] Set up monitoring and logging
- [ ] Regular backups of MongoDB data
- [ ] Implement additional rate limiting at reverse proxy level (nginx/Apache)
- [ ] Enable firewall rules
- [ ] Regular security audits

## Dependencies Security

Run security audits regularly:

```bash
npm audit
npm audit fix
```

Automated dependency updates via Dependabot are enabled for this repository.

## License

This security policy is licensed under the same MIT license as the project.
