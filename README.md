# Loan Eligibility Simulator

## Overview
A containerized React-based loan eligibility simulator with comprehensive testing, built with Vite, Tailwind CSS, and Docker for consistent deployment across environments.

## Tech Stack
- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Testing**: Jest, React Testing Library
- **Containerization**: Docker, Docker Compose
- **Version Control**: Git, GitHub
- **Language**: JavaScript (JSX)
```

## Quick Start

### Using Docker (Recommended)
```bash
# Clone the repository
git clone https://github.com/yourusername/loan-eligibility-simulator.git
cd loan-eligibility-simulator

# Start with Docker Compose
docker-compose up

# Access the application
# Development: http://localhost:5173
```

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

## Docker Configuration

### Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "5173"
    volumes:
      - ./src:/app/src
      - ./public:/app/public
    environment:
      - NODE_ENV=development
    command: npm run dev
```

### .dockerignore
```
node_modules
npm-debug.log
dist
.git
.gitignore
coverage
*.md
.env
```

## Docker Commands
```bash
# Build the Docker image
docker build -t loan-eligibility-simulator .

# Run the container
docker run -p 5173:80 loan-eligibility-simulator

# Run with Docker Compose (development)
docker-compose up

# Run in detached mode
docker-compose up -d

# Stop containers
docker-compose down

# Rebuild containers
docker-compose up --build

# View logs
docker-compose logs -f

# Run tests in container
docker-compose run app npm test

# Access container shell
docker-compose exec app sh
```

## Testing Configuration

### Why Jest?
Initially attempted Vitest but encountered ES Module conflicts with CSS toolchain (`@csstools/css-calc`). Jest provides:
- Stable CSS mocking via `identity-obj-proxy`
- Better CommonJS/ESM compatibility
- Mature ecosystem for React testing

### Configuration Files

**`jest.config.cjs`**
```javascript
module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  transform: {
    "^.+\\.(js|jsx)$": ["babel-jest", { configFile: "./babel.config.cjs" }],
  },
};
```

**`babel.config.cjs`**
```javascript
module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    ["@babel/preset-react", { runtime: "automatic" }],
  ],
};
```

**`setupTests.js`**
```javascript
import "@testing-library/jest-dom";
```

## Installation

### Prerequisites
- Node.js 18+ (if running locally)
- Docker & Docker Compose (for containerized deployment)
- Git

### Local Setup
```bash
# Clone repository
git clone https://github.com/HlobisileLukhele/loan-eligibility-simulator.git
cd loan-eligibility-simulator

# Install dependencies
npm install

# Install testing dependencies
npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event identity-obj-proxy @babel/preset-env @babel/preset-react babel-jest
```

## Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run tests in Docker
docker-compose run app npm test
```

## Writing Tests

### Basic Component Test
```javascript
import { render, screen } from "@testing-library/react";
import LoanForm from "./LoanForm";

describe("LoanForm", () => {
  it("renders loan application form", () => {
    render(<LoanForm />);
    expect(screen.getByText(/Loan Application Form/i)).toBeInTheDocument();
  });
});
```

### Testing User Interactions
```javascript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

it("handles form submission", async () => {
  const user = userEvent.setup();
  render(<LoanForm />);
  
  await user.type(screen.getByLabelText(/loan amount/i), "50000");
  await user.click(screen.getByRole("button", { name: /submit/i }));
  
  expect(screen.getByText(/success/i)).toBeInTheDocument();
});
```

## Key Features
- ✅ Dockerized development and production environments
- ✅ Form validation with custom validators
- ✅ Mock data for loan eligibility, products, and rates
- ✅ Comprehensive component testing
- ✅ CSS module support with Tailwind
- ✅ API service layer integration
- ✅ Hot module replacement in development

## Development Workflow

### Local Development
```bash
# Start development server
npm run dev

# Run tests in watch mode
npm run test:watch
```

### Docker Development
```bash
# Start containers with hot reload
docker-compose up

# Run tests
docker-compose run app npm test

# Access logs
docker-compose logs -f app
```

### Production Build
```bash
# Build for production
npm run build

# Build Docker image
docker build -t loan-eligibility-simulator:prod .

# Run production container
docker run -p 80:80 loan-eligibility-simulator:prod
```

## Scripts
```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```

## GitHub Workflow

### Branch Strategy
- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches
- `hotfix/*` - Production hotfixes
```

## CI/CD Pipeline

### GitHub Actions Example
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run build

  docker:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker image
        run: docker build -t loan-eligibility-simulator .
```

## Environment Variables
```bash
# .env.example
VITE_API_URL=http://localhost:5173
VITE_APP_NAME=Loan Eligibility Simulator
NODE_ENV=development
```

## Dependencies

### Production
- `react`: ^18.x
- `react-dom`: ^18.x

### Development
- `vite`: ^5.x
- `@vitejs/plugin-react`: ^4.x
- `tailwindcss`: ^3.x
- `jest`: ^29.x
- `@testing-library/react`: ^14.x
- `@testing-library/jest-dom`: ^6.x


### Docker Issues

**Container won't start**
```bash
# Remove old containers and rebuild
docker-compose down
docker-compose up --build
```

**Port already in use**
```bash
# Change port in docker-compose.yml
ports:
  - "5173"
```

### CSS Module Errors
If encountering CSS-related errors, ensure `identity-obj-proxy` is installed and configured in `jest.config.cjs`.

### Jest ESM Issues
Use `.cjs` extension for config files when `package.json` has `"type": "module"`.

### Tests Not Finding Elements
```javascript
render(<Component />);
screen.debug(); // Logs current DOM
```

## Contributing

1. Fork the repository
2. Create feature branch
```bash
   git checkout -b feature/AmazingFeature
```
3. Commit changes
```bash
   git commit -m 'feat: Add AmazingFeature'
```
4. Push to branch
```bash
   git push origin feature/AmazingFeature
```
5. Open Pull Request on GitHub

### Pull Request Guidelines
- Write meaningful commit messages
- Add tests for new features
- Update documentation
- Ensure all tests pass
- Follow code style guidelines

## Testing Best Practices
1. Test user behavior, not implementation
2. Use semantic queries (`getByRole`, `getByLabelText`)
3. Keep tests next to components
4. Mock external dependencies
5. Maintain >80% test coverage

## Deployment

### Docker Hub
```bash
# Tag image
docker tag loan-eligibility-simulator yourusername/loan-eligibility-simulator:latest

# Push to Docker Hub
docker push yourusername/loan-eligibility-simulator:latest

# Pull and run
docker pull HlobisileLukhele/loan-eligibility-simulator:latest
docker run -p 80:80 HlobisileLukhele/loan-eligibility-simulator:latest
```

### Production Deployment
The application can be deployed to:
- AWS ECS/EKS
- Google Cloud Run
- Azure Container Instances
- DigitalOcean App Platform
- Heroku Container Registry

## License
MIT

## Author
Hlobisile Lukhele  
[GitHub Profile](https://github.com/HlobisileLukhele)  
[LinkedIn](https://www.linkedin.com/in/hlobisile-lukhele/)

## Support
For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/HlobisileLukhele/loan-eligibility-simulator/issues)
- Email: jeniselukhele@gmail.com

---

**Last Updated**: February 2026

⭐ Star this repository if you find it helpful!