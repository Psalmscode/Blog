const mongoose = require('mongoose');
require('dotenv').config();

// Import Post model
const Post = require('./server/models/post');

const posts = [
    {
        title: "Mastering Async/Await in JavaScript: From Callbacks to Promises",
        content: `Async/await has revolutionized the way we handle asynchronous operations in JavaScript. In this comprehensive guide, we'll explore how to transition from callback hell to clean, readable asynchronous code.

## Understanding the Evolution

JavaScript's asynchronous handling has evolved significantly:
- **Callbacks**: The original approach, often leading to callback hell
- **Promises**: Introduced a better structure with .then() chaining
- **Async/Await**: Modern syntax that makes async code look synchronous

## Why Async/Await?

Async/await provides several advantages:
- **Readability**: Code looks like synchronous code, easier to understand
- **Error Handling**: Use traditional try/catch blocks
- **Debugging**: Easier to step through with browser DevTools
- **Maintainability**: Less nesting and more structured flow

## Practical Examples

\`\`\`javascript
// Before: Callback Hell
function fetchUserData(userId, callback) {
  getUser(userId, (err, user) => {
    if (err) callback(err);
    else {
      getPosts(user.id, (err, posts) => {
        if (err) callback(err);
        else callback(null, { user, posts });
      });
    }
  });
}

// After: Async/Await
async function fetchUserData(userId) {
  try {
    const user = await getUser(userId);
    const posts = await getPosts(user.id);
    return { user, posts };
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
\`\`\`

## Advanced Patterns

### Parallel Execution with Promise.all()
\`\`\`javascript
async function fetchMultipleUsers(userIds) {
  const users = await Promise.all(
    userIds.map(id => getUser(id))
  );
  return users;
}
\`\`\`

### Handling Errors Gracefully
\`\`\`javascript
async function fetchWithFallback(url) {
  try {
    const data = await fetch(url);
    return await data.json();
  } catch (error) {
    console.warn('Primary fetch failed, using cache');
    return getCachedData();
  }
}
\`\`\`

## Best Practices

1. **Always use try/catch** for error handling
2. **Use Promise.all()** for parallel operations
3. **Avoid creating unnecessary promises** with new Promise()
4. **Remember async functions always return promises**
5. **Don't forget await** - forgetting it defeats the purpose

Mastering async/await will significantly improve your JavaScript code quality and productivity.`,
        createdAt: new Date(),
    },
    {
        title: "React Hooks Deep Dive: Building Complex State Management",
        content: `React Hooks have transformed how we write components. Let's explore advanced patterns and best practices for building scalable state management.

## Core Concepts

Hooks are functions that let you "hook into" React state and lifecycle features. The most common hooks are:
- **useState**: Manage component state
- **useEffect**: Handle side effects
- **useContext**: Access context values
- **useReducer**: Complex state logic

## useState vs useReducer

For simple state, useState is perfect. For complex state with multiple sub-values:

\`\`\`javascript
// Complex state with useReducer
const initialState = { count: 0, error: null };

function reducer(state, action) {
  switch(action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>
        Increment
      </button>
    </div>
  );
}
\`\`\`

## Custom Hooks Pattern

Create reusable logic with custom hooks:

\`\`\`javascript
// Custom hook for API calls
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [url]);

  return { data, loading, error };
}

// Usage
function App() {
  const { data, loading } = useFetch('/api/posts');
  return loading ? <div>Loading...</div> : <div>{data}</div>;
}
\`\`\`

## Performance Optimization

### useCallback for Memoization
\`\`\`javascript
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
\`\`\`

### useMemo for Expensive Calculations
\`\`\`javascript
const memoizedValue = useMemo(() => {
  return expensiveCalculation(a, b);
}, [a, b]);
\`\`\`

## Common Pitfalls

1. Missing dependencies in useEffect
2. Creating new objects/functions in render
3. Not cleaning up subscriptions
4. Misunderstanding hook rules

Hooks enable cleaner, more reusable React code when used correctly.`,
        author: "React Expert",
        createdAt: new Date(),
    },
    {
        title: "Node.js Performance Optimization: Scaling Your Applications",
        content: `Building fast Node.js applications requires understanding performance optimization techniques. This guide covers everything from profiling to clustering.

## Identifying Bottlenecks

The first step is measuring. Use built-in tools:

\`\`\`javascript
// Using Node's built-in profiler
const v8Profiler = require('v8');

const profiler = v8Profiler.startProfiling('app');

// Your code here

const profile = profiler.stopProfiling();
profile.export((err, result) => {
  require('fs').writeFileSync('profile.json', result);
});
\`\`\`

## Clustering for Multi-Core Systems

\`\`\`javascript
const cluster = require('cluster');
const os = require('os');
const http = require('http');

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker) => {
    console.log(\`Worker \${worker.process.pid} died\`);
  });
} else {
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Hello World');
  }).listen(3000);
}
\`\`\`

## Caching Strategies

### In-Memory Caching
\`\`\`javascript
const cache = new Map();

function getCachedData(key) {
  if (cache.has(key)) {
    return cache.get(key);
  }
  
  const data = expensiveOperation();
  cache.set(key, data);
  
  // Expire after 1 hour
  setTimeout(() => cache.delete(key), 3600000);
  
  return data;
}
\`\`\`

## Database Query Optimization

- Use indexes on frequently queried fields
- Implement pagination for large datasets
- Use aggregation pipelines for complex queries
- Monitor slow queries

## Memory Management

1. Monitor heap usage
2. Avoid memory leaks with proper cleanup
3. Use streaming for large files
4. Implement garbage collection tuning

## Benchmarking Best Practices

- Test under realistic load
- Measure both throughput and latency
- Profile CPU and memory usage
- Use tools like Apache Bench or Artillery

Proper optimization can increase application throughput by 10-100x.`,
        author: "Performance Guru",
        createdAt: new Date(),
    },
    {
        title: "MongoDB Aggregation Pipeline: Advanced Data Analysis",
        content: `MongoDB's aggregation pipeline is a powerful tool for data transformation and analysis. Let's explore advanced techniques for complex queries.

## Pipeline Basics

The aggregation pipeline processes documents through stages:

\`\`\`javascript
db.orders.aggregate([
  { $match: { status: 'completed' } },
  { $group: { _id: '$userId', total: { $sum: '$amount' } } },
  { $sort: { total: -1 } }
])
\`\`\`

## Common Stages

### $match - Filter documents
\`\`\`javascript
{ $match: { category: 'electronics', price: { $gt: 100 } } }
\`\`\`

### $group - Aggregate values
\`\`\`javascript
{
  $group: {
    _id: '$category',
    avgPrice: { $avg: '$price' },
    count: { $sum: 1 }
  }
}
\`\`\`

### $lookup - Join collections
\`\`\`javascript
{
  $lookup: {
    from: 'users',
    localField: 'userId',
    foreignField: '_id',
    as: 'userDetails'
  }
}
\`\`\`

## Advanced Example: Sales Analysis

\`\`\`javascript
db.sales.aggregate([
  {
    $match: {
      date: { $gte: new Date('2024-01-01') }
    }
  },
  {
    $group: {
      _id: '$category',
      totalRevenue: { $sum: '$amount' },
      avgOrderValue: { $avg: '$amount' },
      orderCount: { $sum: 1 }
    }
  },
  {
    $project: {
      category: '$_id',
      totalRevenue: 1,
      avgOrderValue: { $round: ['$avgOrderValue', 2] },
      orderCount: 1,
      _id: 0
    }
  },
  {
    $sort: { totalRevenue: -1 }
  }
])
\`\`\`

## Performance Tips

1. Use $match early to reduce documents
2. Create indexes on frequently matched fields
3. Limit $lookup joins when possible
4. Use $project to include only needed fields
5. Test aggregations with explain()

## Real-World Use Cases

- Sales reporting and analytics
- Time-series data analysis
- Complex data transformations
- Data validation and cleaning
- Customer segmentation

Master the aggregation pipeline for powerful data analysis capabilities.`,
        author: "Database Expert",
        createdAt: new Date(),
    },
    {
        title: "Express.js Middleware: Building Robust API Layers",
        content: `Middleware is the backbone of Express.js applications. This guide covers building custom middleware for authentication, logging, and error handling.

## Understanding Middleware Flow

Middleware functions process requests sequentially:

\`\`\`javascript
app.use((req, res, next) => {
  console.log('Request received');
  next(); // Pass to next middleware
});

app.use((req, res, next) => {
  console.log('Second middleware');
  next();
});
\`\`\`

## Authentication Middleware

\`\`\`javascript
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Usage
app.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Protected route', user: req.user });
});
\`\`\`

## Logging Middleware

\`\`\`javascript
function loggingMiddleware(req, res, next) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(\`\${req.method} \${req.path} - \${res.statusCode} (\${duration}ms)\`);
  });
  
  next();
}
\`\`\`

## Error Handling Middleware

\`\`\`javascript
// Must have 4 parameters to be treated as error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      status: err.status || 500
    }
  });
});
\`\`\`

## Middleware Composition

\`\`\`javascript
const authMiddleware = require('./middleware/auth');
const validationMiddleware = require('./middleware/validation');

app.post('/api/posts',
  authMiddleware,
  validationMiddleware('title', 'content'),
  (req, res) => {
    // Handler logic
  }
);
\`\`\`

## Best Practices

1. Keep middleware focused and reusable
2. Order middleware correctly (general to specific)
3. Always call next() or send response
4. Use error-handling middleware at the end
5. Document middleware dependencies

Proper middleware design creates scalable, maintainable APIs.`,
        author: "API Architect",
        createdAt: new Date(),
    },
    {
        title: "WebSockets vs REST APIs: Real-Time Communication Guide",
        content: `Real-time applications require different approaches than traditional REST APIs. Let's compare WebSockets and REST APIs for real-time communication.

## REST APIs: Request-Response Model

\`\`\`javascript
// Client polls server regularly
setInterval(async () => {
  const response = await fetch('/api/notifications');
  const data = await response.json();
  displayNotifications(data);
}, 5000); // Check every 5 seconds
\`\`\`

**Pros:**
- Stateless, easy to scale
- Works with all HTTP clients
- Familiar to most developers

**Cons:**
- Polling overhead
- Latency in updates
- Server resource intensive

## WebSockets: Bidirectional Communication

\`\`\`javascript
// Server
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    // Broadcast to all clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

// Client
const ws = new WebSocket('ws://localhost:8080');

ws.onopen = () => {
  ws.send('Hello Server!');
};

ws.onmessage = (event) => {
  console.log('Message from server:', event.data);
};
\`\`\`

**Pros:**
- True real-time bidirectional communication
- Lower latency
- Reduced server overhead

**Cons:**
- Stateful connections
- More complex to scale horizontally
- Fallback needed for older browsers

## Using Socket.io for Enhanced WebSockets

\`\`\`javascript
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Listen for events
  socket.on('send_message', (data) => {
    // Broadcast to all users
    io.emit('receive_message', data);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
\`\`\`

## When to Use Each

**Use REST APIs for:**
- CRUD operations
- Stateless interactions
- File uploads/downloads
- Simple polling scenarios

**Use WebSockets for:**
- Chat applications
- Live notifications
- Collaborative tools
- Real-time dashboards
- Multiplayer games

## Hybrid Approach

Combine both for optimal performance:
- Use REST for initial data loading
- Use WebSockets for real-time updates
- Fallback to polling if WebSockets unavailable

Choose the right communication model for your application needs.`,
        author: "Web Architect",
        createdAt: new Date(),
    },
    {
        title: "TypeScript for JavaScript Developers: Type Safety Benefits",
        content: `TypeScript adds static typing to JavaScript, catching errors before runtime. Learn how to leverage TypeScript for safer, more maintainable code.

## Why TypeScript?

JavaScript's dynamic typing can lead to runtime errors. TypeScript solves this:

\`\`\`typescript
// JavaScript - No error until runtime
function add(a, b) {
  return a + b;
}
add('5', 10); // Returns '510' instead of 15

// TypeScript - Caught at compile time
function add(a: number, b: number): number {
  return a + b;
}
add('5', 10); // Error: Argument of type 'string' is not assignable to parameter of type 'number'
\`\`\`

## Basic Types

\`\`\`typescript
const name: string = 'John';
const age: number = 30;
const isActive: boolean = true;
const data: any = 'flexible';

// Arrays
const numbers: number[] = [1, 2, 3];
const items: Array<string> = ['a', 'b'];

// Union types
const status: 'active' | 'inactive' = 'active';

// Optional properties
interface User {
  id: number;
  name: string;
  email?: string;
}
\`\`\`

## Interfaces and Types

\`\`\`typescript
interface Product {
  id: number;
  title: string;
  price: number;
  description?: string;
}

type ProductWithRating = Product & {
  rating: number;
};

class Store {
  products: Product[] = [];
  
  addProduct(product: Product): void {
    this.products.push(product);
  }
  
  getProduct(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }
}
\`\`\`

## Generics for Reusability

\`\`\`typescript
function getFirstItem<T>(items: T[]): T | null {
  return items.length > 0 ? items[0] : null;
}

interface Response<T> {
  success: boolean;
  data: T;
}

async function fetchUsers(): Promise<Response<User[]>> {
  const response = await fetch('/api/users');
  return response.json();
}
\`\`\`

## Integration with Express

\`\`\`typescript
import express, { Request, Response } from 'express';

app.post('/api/posts', (req: Request, res: Response) => {
  const { title, content }: { title: string; content: string } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  
  res.json({ success: true });
});
\`\`\`

## Benefits Summary

- **Early error detection** through static analysis
- **Better IDE support** with autocomplete and refactoring
- **Improved code documentation** through types
- **Easier refactoring** with compiler warnings
- **Team collaboration** with clearer contracts

## Common Patterns

1. Use strict mode: \`"strict": true\` in tsconfig.json
2. Enable noImplicitAny
3. Use explicit return types
4. Leverage interfaces for contracts
5. Use generics for flexibility

TypeScript significantly improves code quality and developer experience.`,
        author: "TypeScript Advocate",
        createdAt: new Date(),
    },
    {
        title: "Docker Containerization: Deploying Node.js Applications",
        content: `Docker enables consistent application deployment across environments. Learn how to containerize your Node.js applications for seamless deployment.

## Creating a Dockerfile

\`\`\`dockerfile
# Use official Node.js runtime
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "app.js"]
\`\`\`

## Optimized Multi-Stage Build

\`\`\`dockerfile
# Build stage
FROM node:18 as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package*.json ./
EXPOSE 3000
CMD ["node", "dist/app.js"]
\`\`\`

## Docker Compose for Multiple Services

\`\`\`yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGO_URL=mongodb://db:27017/blogdb
      - NODE_ENV=production
    depends_on:
      - db
    volumes:
      - ./logs:/app/logs

  db:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  nginx:
    image: nginx:latest
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf

volumes:
  mongo-data:
\`\`\`

## Best Practices

1. **Use specific base image versions** (node:18-alpine)
2. **Minimize layer count** with combined RUN commands
3. **Order commands by change frequency** (dependencies first)
4. **Use .dockerignore** to exclude unnecessary files
5. **Run as non-root user** for security

\`\`\`dockerfile
RUN groupadd -r appuser && useradd -r -g appuser appuser
USER appuser
\`\`\`

## Common Docker Commands

\`\`\`bash
# Build image
docker build -t my-blog:1.0 .

# Run container
docker run -p 3000:3000 -e NODE_ENV=production my-blog:1.0

# Use Docker Compose
docker-compose up -d

# View logs
docker logs <container_id>

# Execute command in container
docker exec -it <container_id> /bin/sh
\`\`\`

## Environment Configuration

\`\`\`dockerfile
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV
ENV PORT=3000
\`\`\`

## Health Checks

\`\`\`dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \\
  CMD node healthcheck.js
\`\`\`

Docker ensures consistency between development and production environments.`,
        author: "DevOps Engineer",
        createdAt: new Date(),
    },
    {
        title: "RESTful API Design: Best Practices and Patterns",
        content: `Building well-designed REST APIs requires understanding HTTP principles and design patterns. This guide covers REST best practices.

## RESTful Principles

- **Client-Server**: Separation of concerns
- **Stateless**: Each request contains all information
- **Cacheable**: Responses should define themselves as cacheable
- **Uniform Interface**: Consistent API design
- **Layered System**: Transparent layers for scalability

## Resource-Oriented Design

\`\`\`javascript
// Good: Resource-oriented
GET    /api/posts          // Get all posts
POST   /api/posts          // Create new post
GET    /api/posts/:id      // Get specific post
PUT    /api/posts/:id      // Update post
DELETE /api/posts/:id      // Delete post

// Bad: Action-oriented
GET    /api/getPosts
POST   /api/createPost
GET    /api/getPost?id=1
POST   /api/updatePost
POST   /api/deletePost
\`\`\`

## Status Codes

\`\`\`javascript
// Success responses
200 OK              // Request successful
201 Created         // Resource created
204 No Content      // Successful but no response body

// Client errors
400 Bad Request     // Invalid request
401 Unauthorized    // Authentication required
403 Forbidden       // Authenticated but no permission
404 Not Found       // Resource doesn't exist
409 Conflict        // Request conflicts with current state

// Server errors
500 Server Error    // Unexpected error
503 Service Unavailable // Server temporarily unavailable
\`\`\`

## Versioning Strategy

\`\`\`javascript
// URL-based versioning
GET /api/v1/posts
GET /api/v2/posts

// Header-based versioning
GET /api/posts
Accept: application/vnd.myapi.v2+json

// Query parameter
GET /api/posts?version=2
\`\`\`

## Response Format

\`\`\`javascript
// Success response
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Post Title",
    "content": "..."
  }
}

// Error response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
\`\`\`

## Pagination

\`\`\`javascript
GET /api/posts?page=1&limit=10

Response:
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "pages": 15
  }
}
\`\`\`

## Filtering and Sorting

\`\`\`javascript
GET /api/posts?category=tech&status=published&sort=-date

// Implementation
app.get('/api/posts', (req, res) => {
  let query = Post.find();
  
  if (req.query.category) {
    query = query.where('category', req.query.category);
  }
  
  if (req.query.sort) {
    query = query.sort(req.query.sort);
  }
  
  query.exec((err, posts) => {
    res.json(posts);
  });
});
\`\`\`

## Rate Limiting

\`\`\`javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
\`\`\`

Well-designed APIs are easier to use, maintain, and scale.`,
        author: "API Designer",
        createdAt: new Date(),
    },
    {
        title: "Security Best Practices: Protecting Your Web Applications",
        content: `Web security is critical for protecting user data. This guide covers essential security practices for web applications.

## Authentication & Password Security

\`\`\`javascript
// Use bcrypt for password hashing
const bcrypt = require('bcrypt');

async function registerUser(email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  // Store hashedPassword in database
}

async function loginUser(email, password) {
  const user = await User.findOne({ email });
  const isValid = await bcrypt.compare(password, user.password);
  return isValid;
}
\`\`\`

## HTTPS and SSL/TLS

\`\`\`javascript
// Always use HTTPS in production
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem')
};

https.createServer(options, app).listen(443);
\`\`\`

## CORS Configuration

\`\`\`javascript
const cors = require('cors');

// Restrict CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
\`\`\`

## Input Validation & Sanitization

\`\`\`javascript
const validator = require('validator');

function validateUserInput(data) {
  if (!validator.isEmail(data.email)) {
    throw new Error('Invalid email');
  }
  
  if (data.password.length < 8) {
    throw new Error('Password too weak');
  }
  
  return {
    email: validator.normalizeEmail(data.email),
    password: data.password
  };
}
\`\`\`

## Protection Against Common Attacks

### SQL Injection Prevention
\`\`\`javascript
// Use parameterized queries
const user = await User.findOne({ email: userInput });

// NOT: "SELECT * FROM users WHERE email = '" + userInput + "'"
\`\`\`

### XSS Prevention
\`\`\`javascript
// Sanitize HTML output
const sanitizeHtml = require('sanitize-html');

const cleanContent = sanitizeHtml(userInput);
\`\`\`

### CSRF Token
\`\`\`javascript
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: false });

app.post('/api/posts', csrfProtection, (req, res) => {
  // Process request
});
\`\`\`

## Secure Headers

\`\`\`javascript
const helmet = require('helmet');

app.use(helmet()); // Adds security headers

// Customize as needed
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"]
  }
}));
\`\`\`

## Environment Variables

\`\`\`javascript
// Never expose secrets
require('dotenv').config();

const dbPassword = process.env.DB_PASSWORD;
const apiKey = process.env.API_KEY;

// Use .env.example for template
\`\`\`

## Rate Limiting

\`\`\`javascript
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 attempts per 15 minutes
  message: 'Too many login attempts'
});

app.post('/login', loginLimiter, loginHandler);
\`\`\`

## Logging & Monitoring

\`\`\`javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

logger.info('User login attempt', { userId, timestamp });
\`\`\`

## Security Checklist

- ✅ Use HTTPS always
- ✅ Hash passwords with bcrypt
- ✅ Validate all inputs
- ✅ Use parameterized queries
- ✅ Implement CORS properly
- ✅ Add security headers
- ✅ Implement rate limiting
- ✅ Regular security updates
- ✅ Monitor logs for suspicious activity
- ✅ Keep dependencies updated

Security is an ongoing process, not a one-time implementation.`,
        author: "Security Expert",
        createdAt: new Date(),
    },
    {
        title: "Testing Node.js Applications: Unit, Integration & E2E Tests",
        content: `Comprehensive testing ensures application reliability. Learn testing strategies for Node.js applications.

## Unit Testing with Jest

\`\`\`javascript
// math.js
function add(a, b) {
  return a + b;
}

// math.test.js
const add = require('./math');

describe('Math Operations', () => {
  test('adds two numbers correctly', () => {
    expect(add(2, 3)).toBe(5);
  });

  test('adds negative numbers', () => {
    expect(add(-2, 3)).toBe(1);
  });
});
\`\`\`

## Testing Express Routes

\`\`\`javascript
const request = require('supertest');
const app = require('./app');
const Post = require('./models/post');

jest.mock('./models/post');

describe('POST /api/posts', () => {
  test('creates a new post', async () => {
    Post.create.mockResolvedValue({
      _id: '123',
      title: 'Test',
      content: 'Test content'
    });

    const response = await request(app)
      .post('/api/posts')
      .send({ title: 'Test', content: 'Test content' });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Test');
  });
});
\`\`\`

## Integration Testing

\`\`\`javascript
const request = require('supertest');
const app = require('./app');
const mongoose = require('mongoose');

describe('Integration Tests', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_MONGO_URL);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('full user registration flow', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({
        email: 'test@example.com',
        password: 'Password123'
      });

    expect(response.status).toBe(201);
    expect(response.body.token).toBeDefined();
  });
});
\`\`\`

## E2E Testing with Puppeteer

\`\`\`javascript
const puppeteer = require('puppeteer');

describe('User Journey', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('user can create and view a post', async () => {
    // Navigate to home
    await page.goto('http://localhost:3000');

    // Login
    await page.click('[data-testid="login-btn"]');
    await page.type('[data-testid="email"]', 'test@example.com');
    await page.type('[data-testid="password"]', 'password');
    await page.click('[data-testid="submit"]');

    // Create post
    await page.click('[data-testid="new-post"]');
    await page.type('[data-testid="title"]', 'Test Post');
    await page.type('[data-testid="content"]', 'Test content');
    await page.click('[data-testid="publish"]');

    // Verify post appears
    const title = await page.$eval('h1', el => el.textContent);
    expect(title).toBe('Test Post');
  });
});
\`\`\`

## Test Configuration

\`\`\`javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testTimeout: 10000,
  setupFilesAfterEnv: ['./jest.setup.js']
};
\`\`\`

## Mocking and Spies

\`\`\`javascript
test('calls external API', async () => {
  const mockFetch = jest.spyOn(global, 'fetch')
    .mockResolvedValue({
      json: () => ({ data: 'test' })
    });

  const result = await fetchData();

  expect(mockFetch).toHaveBeenCalledWith('http://api.example.com');
  expect(result).toEqual({ data: 'test' });

  mockFetch.mockRestore();
});
\`\`\`

## Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

\`\`\`bash
npm test -- --coverage
\`\`\`

## Testing Best Practices

1. Test behavior, not implementation
2. Keep tests focused and independent
3. Use descriptive test names
4. Mock external dependencies
5. Test error cases, not just happy paths
6. Maintain test data
7. Run tests in CI/CD pipeline

Comprehensive testing significantly reduces bugs and increases confidence.`,
        author: "QA Engineer",
        createdAt: new Date(),
    },
    {
        title: "GraphQL vs REST: Choosing Your API Architecture",
        content: `Both GraphQL and REST have their strengths. Understand when to use each for optimal API design.

## REST API Characteristics

\`\`\`javascript
// Multiple endpoints for different resources
GET    /api/users/1
GET    /api/users/1/posts
GET    /api/users/1/posts/123
GET    /api/users/1/friends

// Response
{
  "id": 1,
  "name": "John",
  "email": "john@example.com",
  "posts": [
    { "id": 1, "title": "Post 1" },
    { "id": 2, "title": "Post 2" }
  ]
}
\`\`\`

## GraphQL Query

\`\`\`graphql
query {
  user(id: 1) {
    id
    name
    email
    posts(limit: 10) {
      id
      title
      content
    }
    friends {
      id
      name
    }
  }
}
\`\`\`

## GraphQL Implementation

\`\`\`javascript
const { graphql, buildSchema } = require('graphql');

const schema = buildSchema(\`
  type Query {
    user(id: Int!): User
    posts(limit: Int): [Post]
  }

  type User {
    id: Int
    name: String
    email: String
    posts: [Post]
  }

  type Post {
    id: Int
    title: String
    content: String
    author: User
  }
\`);

const root = {
  user: ({ id }) => getUserById(id),
  posts: ({ limit }) => getPosts(limit)
};

// Client query
graphql(schema, query, root).then(result => {
  console.log(result);
});
\`\`\`

## Comparison Table

| Aspect | REST | GraphQL |
|--------|------|---------|
| Learning Curve | Simple | Moderate |
| Over-fetching | Yes | No |
| Under-fetching | Yes | No |
| Caching | Easy (HTTP cache) | Complex |
| Versioning | Required | Not needed |
| Real-time | WebSocket | Subscriptions |
| Best for | Simple CRUD | Complex nested data |

## REST Advantages

- Simple to understand and implement
- Excellent browser caching
- Standard HTTP methods and status codes
- Easier to monitor with standard tools
- Great for simple resources

## GraphQL Advantages

- Fetch exactly what you need
- Single query for complex data
- Strong type system
- No versioning needed
- Better for mobile clients

## When to Use REST

- Simple CRUD operations
- Public APIs with simple access patterns
- When caching is critical
- Team not familiar with GraphQL
- Standard REST requirements

## When to Use GraphQL

- Complex, nested data structures
- Multiple client types with different needs
- Real-time requirements
- Internal APIs with complex queries
- Mobile-first applications

## Hybrid Approach

\`\`\`javascript
// Use both in same application
app.use('/api/v1', restRoutes);
app.use('/graphql', graphqlEndpoint);

// GraphQL for complex queries
// REST for simple operations
\`\`\`

Choose the API architecture that best fits your application requirements.`,
        author: "API Specialist",
        createdAt: new Date(),
    },
    {
        title: "Building Progressive Web Apps: Offline-First Development",
        content: `Progressive Web Apps combine the best of web and native apps. Learn how to build offline-first PWAs.

## Service Workers Basics

\`\`\`javascript
// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

// sw.js - Service Worker
const CACHE_NAME = 'v1';
const urls = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/js/app.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urls);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
\`\`\`

## Offline Storage with IndexedDB

\`\`\`javascript
// Open database
const request = indexedDB.open('myDB', 1);

request.onupgradeneeded = (event) => {
  const db = event.target.result;
  const store = db.createObjectStore('posts', { keyPath: 'id' });
  store.createIndex('title', 'title', { unique: false });
};

// Save data
function savePost(post) {
  const db = indexedDB.open('myDB');
  const transaction = db.transaction(['posts'], 'readwrite');
  transaction.objectStore('posts').add(post);
}

// Retrieve data
function getPosts() {
  const db = indexedDB.open('myDB');
  const transaction = db.transaction(['posts'], 'readonly');
  return transaction.objectStore('posts').getAll();
}
\`\`\`

## Web App Manifest

\`\`\`json
{
  "name": "Blog App",
  "short_name": "Blog",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/images/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/images/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
\`\`\`

## Offline-First Sync

\`\`\`javascript
// Queue operations when offline
class SyncQueue {
  constructor() {
    this.queue = [];
    this.online = navigator.onLine;
    window.addEventListener('online', () => this.sync());
  }

  add(operation) {
    this.queue.push(operation);
    if (this.online) {
      this.sync();
    }
  }

  async sync() {
    while (this.queue.length > 0) {
      const operation = this.queue.shift();
      try {
        await operation();
      } catch (error) {
        this.queue.unshift(operation);
        break;
      }
    }
  }
}
\`\`\`

## Push Notifications

\`\`\`javascript
// Request permission
Notification.requestPermission().then((permission) => {
  if (permission === 'granted') {
    navigator.serviceWorker.getRegistration().then((registration) => {
      registration.showNotification('Blog Post Published', {
        content: 'New post is available',
        icon: '/images/icon.png',
        badge: '/images/badge.png'
      });
    });
  }
});

// Handle notification click
self.addEventListener('push', (event) => {
  const data = event.data.json();
  self.registration.showNotification(data.title, data.options);
});
\`\`\`

## PWA Advantages

- Works offline
- App-like experience
- Fast loading
- Install on home screen
- Automatic updates

## Testing PWA Features

- Test offline functionality
- Verify service worker caching
- Check manifest validity
- Test push notifications
- Validate performance metrics

Progressive Web Apps provide app-like experiences on the web.`,
        author: "Web Developer",
        createdAt: new Date(),
    },
    {
        title: "Machine Learning Integration: AI in Web Applications",
        content: `Integrate machine learning models into web applications for intelligent features.

## TensorFlow.js Basics

\`\`\`javascript
// Load pre-trained model
const model = await tf.loadLayersModel(
  'https://example.com/model/model.json'
);

// Make predictions
const inputData = tf.tensor2d([[1, 2, 3, 4]]);
const predictions = model.predict(inputData);
predictions.print();
\`\`\`

## Building a Recommendation System

\`\`\`javascript
// Content-based recommendation
function getRecommendations(userItem, allItems) {
  const similarities = allItems.map(item => ({
    item,
    similarity: calculateSimilarity(userItem, item)
  }));

  return similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5)
    .map(s => s.item);
}

function calculateSimilarity(item1, item2) {
  // Using TF-IDF or cosine similarity
  const vec1 = tf.tensor1d(item1.features);
  const vec2 = tf.tensor1d(item2.features);
  
  const dotProduct = tf.sum(tf.mul(vec1, vec2));
  const norm1 = tf.norm(vec1);
  const norm2 = tf.norm(vec2);
  
  return dotProduct.dataSync()[0] / 
    (norm1.dataSync()[0] * norm2.dataSync()[0]);
}
\`\`\`

## Sentiment Analysis

\`\`\`javascript
const use = require('@tensorflow-models/universal-sentence-encoder');

async function analyzeSentiment(text) {
  const model = await use.load();
  const embeddings = await model.embed([text]);
  
  // Compare with known sentiments
  const positive = await model.embed(['great', 'excellent', 'amazing']);
  const negative = await model.embed(['bad', 'terrible', 'awful']);
  
  const scores = embeddings.array().then((embedArray) => {
    // Calculate similarity scores
  });
  
  return scores;
}
\`\`\`

## Node.js Integration with Python

\`\`\`javascript
const { spawn } = require('child_process');

async function runPythonModel(input) {
  return new Promise((resolve, reject) => {
    const python = spawn('python', ['ml_model.py', JSON.stringify(input)]);
    
    let result = '';
    python.stdout.on('data', (data) => {
      result += data.toString();
    });
    
    python.on('close', (code) => {
      if (code === 0) {
        resolve(JSON.parse(result));
      } else {
        reject(new Error('Python script failed'));
      }
    });
  });
}
\`\`\`

## Real-Time Image Recognition

\`\`\`javascript
const mobilenet = require('@tensorflow-models/mobilenet');
const tf = require('@tensorflow/tfjs');

async function classifyImage(imageElement) {
  const model = await mobilenet.load();
  const predictions = await model.classify(imageElement);
  
  return predictions.map(p => ({
    class: p.className,
    probability: (p.probability * 100).toFixed(2) + '%'
  }));
}
\`\`\`

## Practical Applications

- **Recommendation engines**: Suggest posts, products
- **Spam detection**: Classify comments and messages
- **Image analysis**: Tag images automatically
- **Sentiment analysis**: Understand user feedback
- **Predictive analytics**: Forecast trends
- **Chatbots**: AI-powered conversations

## Performance Considerations

1. Use quantized models for smaller size
2. Cache model predictions
3. Use Web Workers for heavy computations
4. Load models asynchronously
5. Monitor memory usage

## ML Model Deployment

\`\`\`bash
# Convert Python model to TensorFlow.js
tensorflowjs_converter --input_format keras model.h5 ./web_model
\`\`\`

Machine learning can significantly enhance user experience and provide intelligent insights.`,
        author: "ML Engineer",
        createdAt: new Date(),
    },
    {
        title: "Microservices Architecture: Building Scalable Systems",
        content: `Microservices enable building scalable, maintainable systems. Learn microservices design patterns.

## Monolith vs Microservices

**Monolithic Architecture:**
- Single codebase
- Shared database
- Tightly coupled
- Single deployment unit

**Microservices Architecture:**
- Independent services
- Service-specific databases
- Loose coupling
- Independent deployment

## Service Communication

### Synchronous (REST/gRPC)
\`\`\`javascript
// User Service calls Order Service
async function createOrder(userId, items) {
  const user = await fetch(\`/api/users/\${userId}\`);
  const order = {
    userId,
    items,
    total: items.reduce((sum, item) => sum + item.price, 0)
  };
  
  return fetch('/api/orders', {
    method: 'POST',
    content: JSON.stringify(order)
  });
}
\`\`\`

### Asynchronous (Message Queue)
\`\`\`javascript
const amqp = require('amqplib');

// Publisher
async function publishOrder(order) {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  
  await channel.assertQueue('orders');
  channel.sendToQueue('orders', Buffer.from(JSON.stringify(order)));
}

// Subscriber
async function subscribeToOrders() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  
  await channel.assertQueue('orders');
  channel.consume('orders', (msg) => {
    const order = JSON.parse(msg.content.toString());
    processOrder(order);
    channel.ack(msg);
  });
}
\`\`\`

## Service Discovery

\`\`\`javascript
// With Consul
const Consul = require('consul');

const consul = new Consul({
  host: 'localhost'
});

// Register service
await consul.agent.service.register({
  id: 'user-service-1',
  name: 'user-service',
  address: 'localhost',
  port: 3001,
  check: {
    http: 'http://localhost:3001/health',
    interval: '10s'
  }
});

// Discover service
const services = await consul.health.service({
  service: 'user-service',
  passing: true
});
\`\`\`

## API Gateway Pattern

\`\`\`javascript
const express = require('express');
const httpProxy = require('express-http-proxy');

const app = express();

// Route to different services
app.use('/api/users', httpProxy('http://user-service:3001'));
app.use('/api/orders', httpProxy('http://order-service:3002'));
app.use('/api/products', httpProxy('http://product-service:3003'));

// Add authentication at gateway
app.use((req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'No token' });
  next();
});
\`\`\`

## Data Consistency: Saga Pattern

\`\`\`javascript
// Orchestration approach
async function createOrderSaga(order) {
  try {
    // Step 1: Reserve inventory
    const inventory = await reserveInventory(order.items);
    
    // Step 2: Process payment
    const payment = await processPayment(order.total);
    
    // Step 3: Create order
    const result = await createOrder(order);
    
    return result;
  } catch (error) {
    // Compensating transactions
    if (inventory) await releaseInventory(inventory.id);
    if (payment) await refundPayment(payment.id);
    throw error;
  }
}
\`\`\`

## Monitoring & Logging

\`\`\`javascript
const winston = require('winston');
const prometheus = require('prom-client');

// Centralized logging
const logger = winston.createLogger({
  transports: [
    new winston.transports.HTTP({
      host: 'logging-service',
      port: 3000
    })
  ]
});

// Metrics collection
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'status_code']
});

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    httpRequestDuration
      .labels(req.method, req.route.path, res.statusCode)
      .observe(duration);
  });
  next();
});
\`\`\`

## Deployment with Docker Compose

\`\`\`yaml
version: '3.8'

services:
  api-gateway:
    build: ./api-gateway
    ports:
      - "3000:3000"
    depends_on:
      - user-service
      - order-service

  user-service:
    build: ./services/user
    environment:
      - MONGO_URL=mongodb://db:27017/users

  order-service:
    build: ./services/order
    environment:
      - MONGO_URL=mongodb://db:27017/orders

  db:
    image: mongo:6.0
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
\`\`\`

## Microservices Challenges

- Network latency
- Data consistency
- Distributed debugging
- Testing complexity
- Deployment overhead

## When to Use Microservices

- Large, complex applications
- Multiple teams working independently
- Different scaling requirements per service
- Technology diversity needed

Microservices enable building scalable systems at the cost of increased complexity.`,
        author: "System Architect",
        createdAt: new Date(),
    },
    {
        title: "Continuous Integration & Deployment: Automating Your Workflow",
        content: `CI/CD automates testing and deployment, improving code quality and release velocity.

## GitHub Actions Setup

\`\`\`yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      mongodb:
        image: mongo:6.0
        options: >-
          --health-cmd mongosh
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
    - uses: actions/checkout@v2

    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'

    - name: Install dependencies
      run: npm install

    - name: Run tests
      run: npm test
      env:
        MONGO_URL: mongodb://localhost:27017/test

    - name: Generate coverage report
      run: npm run coverage

    - name: Upload coverage
      uses: codecov/codecov-action@v2
      with:
        files: ./coverage/lcov.info
\`\`\`

## Deployment Pipeline

\`\`\`yaml
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
    - uses: actions/checkout@v2

    - name: Build Docker image
      run: docker build -t myapp:$GITHUB_SHA .

    - name: Push to registry
      run: |
        echo DOCKER_PASSWORD | docker login -u DOCKER_USERNAME --password-stdin
        docker tag myapp:$GITHUB_SHA DOCKER_USERNAME/myapp:latest
        docker push DOCKER_USERNAME/myapp:latest

    - name: Deploy to production
      run: |
        curl -X POST DEPLOY_WEBHOOK \\
          -H "Content-Type: application/json" \\
          -d '{
            "image": "DOCKER_USERNAME/myapp:latest",
            "version": "$GITHUB_SHA"
          }'
\`\`\`

## GitLab CI Configuration

\`\`\`yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  image: node:18
  services:
    - mongo:6.0
  script:
    - npm install
    - npm test
    - npm run coverage
  coverage: '/Lines\\s+:\\s(\\d+\\.\\d+)/'

build:
  stage: build
  image: docker:20.10.16
  services:
    - docker:20.10.16-dind
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA

deploy_production:
  stage: deploy
  image: alpine:latest
  script:
    - apk add --no-cache curl
    - curl -X POST $DEPLOY_WEBHOOK -d "version=$CI_COMMIT_SHA"
  only:
    - main
\`\`\`

## Jenkins Pipeline

\`\`\`groovy
pipeline {
    agent any

    stages {
        stage('Install') {
            steps {
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
                junit 'test-results.xml'
                publishHTML([
                    reportDir: 'coverage',
                    reportFiles: 'index.html',
                    reportName: 'Coverage Report'
                ])
            }
        }

        stage('Build') {
            steps {
                sh 'docker build -t myapp:BUILD_NUMBER .'
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh 'docker push myapp:BUILD_NUMBER'
                sh 'kubectl set image deployment/app app=myapp:BUILD_NUMBER'
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
\`\`\`

## CI/CD Best Practices

1. **Fast feedback**: Quick test execution
2. **Fail fast**: Catch errors early
3. **Automate everything**: Reduce manual steps
4. **Deploy frequently**: Small, frequent releases
5. **Monitor closely**: Track deployment metrics
6. **Rollback strategy**: Quick recovery plans

## Pipeline Stages

\`\`\`
Commit → Test → Build → Stage → Deploy → Monitor
   ↓       ↓      ↓       ↓      ↓        ↓
 Code    Unit   Image  Smoke   Prod   Alerts
Check   Tests  Build  Tests
\`\`\`

## Continuous Monitoring

\`\`\`yaml
monitoring:
  health-checks:
    - endpoint: /health
      interval: 30s
  metrics:
    - response-time
    - error-rate
    - cpu-usage
  alerts:
    - metric: error_rate
      threshold: 5%
\`\`\`

CI/CD pipelines enable rapid, reliable software delivery.`,
        author: "DevOps Specialist",
        createdAt: new Date(),
    },
    {
        title: "API Rate Limiting & Throttling: Protecting Your Infrastructure",
        content: `Rate limiting protects APIs from abuse and ensures fair resource usage among clients.

## Token Bucket Algorithm

\`\`\`javascript
class TokenBucket {
  constructor(capacity, refillRate) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillRate = refillRate;
    this.lastRefillTime = Date.now();
  }

  allowRequest(tokens = 1) {
    this.refill();
    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }
    return false;
  }

  refill() {
    const now = Date.now();
    const timePassed = (now - this.lastRefillTime) / 1000;
    const tokensToAdd = timePassed * this.refillRate;
    
    this.tokens = Math.min(
      this.capacity,
      this.tokens + tokensToAdd
    );
    this.lastRefillTime = now;
  }
}

// Usage
const bucket = new TokenBucket(100, 10); // 100 capacity, 10 req/sec

app.use((req, res, next) => {
  if (bucket.allowRequest()) {
    next();
  } else {
    res.status(429).json({ error: 'Too many requests' });
  }
});
\`\`\`

## Express Rate Limiter Middleware

\`\`\`javascript
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('redis');

const redisClient = redis.createClient();

// Create limiter
const limiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:'
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs
  message: 'Too many requests, please try again later.',
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false
});

// Apply to all routes
app.use(limiter);

// Stricter limit for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true
});

app.post('/login', loginLimiter, loginHandler);
\`\`\`

## User-Based Rate Limiting

\`\`\`javascript
const userLimits = new Map();

function getUserLimit(userId) {
  if (!userLimits.has(userId)) {
    userLimits.set(userId, new TokenBucket(1000, 100));
  }
  return userLimits.get(userId);
}

app.use((req, res, next) => {
  const bucket = getUserLimit(req.user.id);
  
  if (bucket.allowRequest()) {
    next();
  } else {
    res.status(429).json({ error: 'Rate limit exceeded' });
  }
});
\`\`\`

## Tiered Rate Limiting

\`\`\`javascript
const tierLimits = {
  free: { requests: 100, window: 3600 }, // 100/hour
  pro: { requests: 1000, window: 3600 }, // 1000/hour
  enterprise: { requests: Infinity, window: 0 }
};

function getUserTier(user) {
  return user.subscription?.tier || 'free';
}

app.use((req, res, next) => {
  const tier = getUserTier(req.user);
  const limit = tierLimits[tier];
  
  if (limit.requests === Infinity) {
    return next();
  }

  const key = \`rate:\${req.user.id}:\${Math.floor(Date.now() / (limit.window * 1000))}\`;
  
  redis.incr(key, (err, count) => {
    if (count === 1) {
      redis.expire(key, limit.window);
    }

    res.set('X-RateLimit-Limit', limit.requests);
    res.set('X-RateLimit-Remaining', Math.max(0, limit.requests - count));

    if (count > limit.requests) {
      return res.status(429).json({ error: 'Rate limit exceeded' });
    }

    next();
  });
});
\`\`\`

## Advanced Patterns

### Sliding Window

\`\`\`javascript
async function allowRequest(clientId, limit, window) {
  const key = \`sliding:\${clientId}\`;
  const now = Date.now();
  const windowStart = now - window * 1000;

  // Remove old entries
  await redis.zremrangebyscore(key, 0, windowStart);

  // Count requests in window
  const count = await redis.zcard(key);

  if (count < limit) {
    await redis.zadd(key, now, \`\${now}-\${Math.random()}\`);
    return true;
  }

  return false;
}
\`\`\`

### Distributed Rate Limiting with Redis

\`\`\`javascript
const script = \`
  local key = KEYS[1]
  local limit = tonumber(ARGV[1])
  local window = tonumber(ARGV[2])
  
  local current = redis.call('incr', key)
  if current == 1 then
    redis.call('expire', key, window)
  end
  
  if current <= limit then
    return 1
  else
    return 0
  end
\`;

app.use((req, res, next) => {
  const key = \`rate:\${req.ip}\`;
  
  redis.eval(script, 1, key, 100, 60, (err, result) => {
    if (result === 1) {
      next();
    } else {
      res.status(429).json({ error: 'Rate limited' });
    }
  });
});
\`\`\`

## Response Headers

\`\`\`
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 42
X-RateLimit-Reset: 1640001234
Retry-After: 60
\`\`\`

Rate limiting is essential for API stability and fair resource sharing.`,
        author: "Infrastructure Engineer",
        createdAt: new Date(),
    },
    {
        title: "Database Indexing: Optimizing Query Performance",
        content: `Proper database indexing dramatically improves query performance. Learn indexing strategies for MongoDB and SQL databases.

## Index Types

### Single Field Index
\`\`\`javascript
// Create index on email field
db.users.createIndex({ email: 1 });

// Queries that benefit:
db.users.findOne({ email: 'user@example.com' });
db.users.find({ email: { $regex: '^admin' } });
\`\`\`

### Compound Index
\`\`\`javascript
// Index multiple fields
db.orders.createIndex({ userId: 1, date: -1 });

// Benefits queries with both fields
db.orders.find({ userId: 123, date: { $gte: new Date('2024-01-01') } });

// Also benefits queries with just the first field
db.orders.find({ userId: 123 });
\`\`\`

### Text Index
\`\`\`javascript
// Full-text search index
db.posts.createIndex({ title: 'text', content: 'text' });

// Full-text search queries
db.posts.find({ $text: { $search: 'mongodb nodejs' } });

// With relevance scoring
db.posts.find(
  { $text: { $search: 'mongodb' } },
  { score: { $meta: 'textScore' } }
).sort({ score: { $meta: 'textScore' } });
\`\`\`

### Geospatial Index
\`\`\`javascript
// Store coordinates
db.locations.insert({
  name: 'Coffee Shop',
  coordinates: { type: 'Point', coordinates: [-122.4194, 37.7749] }
});

// Create geospatial index
db.locations.createIndex({ coordinates: '2dsphere' });

// Find nearby locations
db.locations.find({
  coordinates: {
    $near: {
      $geometry: { type: 'Point', coordinates: [-122.42, 37.77] },
      $maxDistance: 5000 // 5km
    }
  }
});
\`\`\`

## Index Analysis

### Using explain()
\`\`\`javascript
// Analyze query performance
const explanation = db.users.find({ email: 'test@example.com' }).explain('executionStats');

console.log({
  executionStages: explanation.executionStats.executionStages.stage,
  docsExamined: explanation.executionStats.totalDocsExamined,
  docsReturned: explanation.executionStats.nReturned,
  executionTime: explanation.executionStats.executionStages.executionTimeMillis
});

// COLLSCAN = Full collection scan (slow)
// IXSCAN = Index scan (fast)
\`\`\`

## Indexing Strategy

\`\`\`javascript
// Identify slow queries using profiler
db.setProfilingLevel(1, { slowms: 100 }); // Log queries > 100ms

// View slow queries
db.system.profile.find({ millis: { $gt: 100 } }).pretty();

// Create indexes for frequent queries
db.posts.createIndex({ userId: 1, createdAt: -1 });

// Monitor index usage
db.posts.aggregate([{ $indexStats: {} }]);
\`\`\`

## Index Best Practices

### ESR Rule (Equality, Sort, Range)
\`\`\`javascript
// Query: find all published posts by author, sorted by date, created after date X
// Query: db.posts.find({
//   published: true,
//   author: 'John',
//   createdAt: { $gte: new Date('2024-01-01') }
// }).sort({ createdAt: -1 })

// Index (Equality, Sort, Range):
db.posts.createIndex({
  published: 1,    // Equality
  createdAt: -1,   // Sort
  author: 1        // Range
});
\`\`\`

## Sparse and Partial Indexes

\`\`\`javascript
// Sparse index: only index documents with the field
db.users.createIndex({ phone: 1 }, { sparse: true });

// Partial index: only index documents matching criteria
db.orders.createIndex(
  { status: 1 },
  { partialFilterExpression: { status: 'completed' } }
);
\`\`\`

## Index Maintenance

\`\`\`javascript
// List all indexes
db.users.getIndexes();

// Remove index
db.users.dropIndex('email_1');

// Remove all indexes (except _id)
db.users.dropIndexes();

// Rebuild indexes
db.users.reIndex();
\`\`\`

## Common Indexing Mistakes

1. **Over-indexing**: Too many indexes slow down writes
2. **Unused indexes**: Monitor with $indexStats
3. **Wrong field order**: Affects query efficiency
4. **Indexing low-cardinality fields**: Minimal benefit
5. **Not analyzing query plans**: Guess and check approach

## Performance Impact Example

\`\`\`
Without index: 1000ms (scanned 1,000,000 docs)
With index: 5ms (scanned 100 docs)

200x performance improvement!
\`\`\`

Proper indexing is crucial for database performance at scale.`,
        author: "Database Admin",
        createdAt: new Date(),
    }
];

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');

        // Clear existing posts
        await Post.deleteMany({});
        console.log('Cleared existing posts');

        // Insert new posts
        const result = await Post.insertMany(posts);
        console.log(`Successfully inserted ${result.length} posts`);

        await mongoose.connection.close();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
