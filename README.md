Here is an API documentation for **Shortify**, a URL shortening service. This documentation covers the various endpoints available for users to interact with, including how to shorten URLs, retrieve the original URLs from short links, and generate QR codes.

---

# Shortify API Documentation

## Overview

Shortify is a simple URL shortening API that allows you to shorten URLs, retrieve the original URLs using shortened links, and generate QR codes for shortened URLs.

## Base URL

The base URL for all API requests is:

```
https://yourdomain.com/api
```

### Content-Type

The API accepts and returns JSON data. All requests should include the `Content-Type: application/json` header.

---

## Endpoints

### 1. **POST /shorturl**

This endpoint shortens a given URL.

#### Request Body

```json
{
  "original_url": "https://www.example.com"
}
```

- `original_url` (string, required): The URL to be shortened. It must be a valid URL (including the protocol `http://` or `https://`).

#### Response

On success:

```json
{
  "original_url": "https://www.example.com",
  "short_url": "abc123"
}
```

- `original_url` (string): The original URL that was shortened.
- `short_url` (string): The generated short URL.

On failure (invalid URL):

```json
{
  "error": "invalid url"
}
```

- `error` (string): An error message if the URL is not valid.

#### Example Request

```bash
curl -X POST https://yourdomain.com/api/shorturl \
  -H "Content-Type: application/json" \
  -d '{"original_url": "https://www.example.com"}'
```

#### Example Response

```json
{
  "original_url": "https://www.example.com",
  "short_url": "abc123"
}
```

---

### 2. **GET /shorturl/{short_url}**

This endpoint retrieves the original URL associated with a shortened URL. It will redirect the user to the original URL.

#### URL Parameter

- `short_url` (string, required): The shortened URL identifier.

#### Response

On success, the user will be redirected to the original URL.

On failure (invalid short URL):

```json
{
  "error": "Short URL not found"
}
```

- `error` (string): An error message if the short URL is not found.

#### Example Request

```bash
curl -X GET https://yourdomain.com/api/shorturl/abc123
```

#### Example Response

The server will redirect the client to the original URL (`https://www.example.com`).

---

### 3. **GET /shorturl/{short_url}/qrcode**

This endpoint generates a QR code for a given shortened URL.

#### URL Parameter

- `short_url` (string, required): The shortened URL identifier.

#### Response

On success:

```json
{
  "qrcode": "data:image/png;base64,...." 
}
```

- `qrcode` (string): The base64-encoded QR code image.

On failure (short URL not found):

```json
{
  "error": "Short URL not found"
}
```

- `error` (string): An error message if the short URL is not found.

#### Example Request

```bash
curl -X GET https://yourdomain.com/api/shorturl/abc123/qrcode
```

#### Example Response

```json
{
  "qrcode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
}
```

---

## Error Handling

The Shortify API returns error messages with appropriate HTTP status codes. Common error responses include:

- **400 Bad Request**: If the URL is not valid or required parameters are missing.
- **404 Not Found**: If the requested short URL does not exist.
- **500 Internal Server Error**: If there is an unexpected issue on the server.

#### Example Error Response

```json
{
  "error": "invalid url"
}
```

---

## Authentication

Shortify API does not require authentication for basic usage. However, you can implement security measures like API keys or OAuth2 based on your needs.

---

## Rate Limiting

Shortify may implement rate limiting to prevent abuse. Each user is allowed a set number of requests per minute/hour. If the rate limit is exceeded, the API will return a **429 Too Many Requests** error.

---

## Example Workflow

1. **Shorten a URL**

   Send a POST request with the original URL.

   Request:
   ```json
   {
     "original_url": "https://www.example.com"
   }
   ```

   Response:
   ```json
   {
     "original_url": "https://www.example.com",
     "short_url": "abc123"
   }
   ```

2. **Access Shortened URL**

   Send a GET request to `/api/shorturl/abc123`. The server will redirect the client to the original URL.

3. **Generate QR Code for Shortened URL**

   Send a GET request to `/api/shorturl/abc123/qrcode` to retrieve a base64-encoded QR code image.

---

## Conclusion

Shortify API is a simple and effective solution for URL shortening, allowing users to easily shorten URLs, retrieve the original URLs using shortened links, and even generate QR codes for sharing.

For more information, feel free to reach out or explore the API further!
