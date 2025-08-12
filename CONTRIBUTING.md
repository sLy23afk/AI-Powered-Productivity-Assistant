# Contributing to AI-Powered Productivity Assistant 🤝

Thank you for your interest in contributing to our AI-Powered Productivity Assistant! This document provides guidelines and instructions for contributing to the project. We welcome contributions from developers of all skill levels.

## 📋 Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Feature Requests](#feature-requests)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Community](#community)

## 🎯 Code of Conduct

### Our Pledge
I pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards
- **Be respectful**: Use inclusive language and be mindful of others' perspectives
- **Be collaborative**: Work together to find the best solutions
- **Be constructive**: Provide helpful feedback and suggestions
- **Be open**: Welcome newcomers and help them get started

## 🚀 Getting Started

### Prerequisites
Before contributing, ensure you have:
- Python 3.8+ installed
- Node.js 16+ installed
- Git installed and configured
- A GitHub account
- Basic knowledge of Flask and React

### Development Environment Setup

1. **Fork the Repository**
   ```bash
   # Visit https://github.com/yourusername/ai-productivity-assistant
   # Click "Fork" button
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ai-productivity-assistant.git
   cd ai-productivity-assistant
   ```

3. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/original-owner/ai-productivity-assistant.git
   ```

## 🔄 How to Contribute

### Types of Contributions We Welcome

#### 🐛 Bug Reports
- Report bugs you find in the application
- Include steps to reproduce the issue
- Provide expected vs actual behavior

#### ✨ Feature Requests
- Suggest new features or improvements
- Explain the use case and benefits
- Consider implementation complexity

#### 📝 Documentation
- Fix typos or improve existing documentation
- Add examples or tutorials
- Translate documentation to other languages

#### 🔧 Code Contributions
- Fix bugs and implement new features
- Improve performance and security
- Refactor code for better maintainability
- Add new tests

## 🛠️ Development Setup

### Backend Development

1. **Create Virtual Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   pip install -r requirements-dev.txt  # Development dependencies
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Database Setup**
   ```bash
   flask db upgrade
   ```

5. **Run Development Server**
   ```bash
   python run.py
   ```

### Frontend Development

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## 📏 Coding Standards

### Python (Backend)
- **Style Guide**: Follow PEP 8
- **Docstrings**: Use Google-style docstrings
- **Type Hints**: Use type annotations where possible
- **Code Formatting**: Use `black` for formatting
- **Linting**: Use `flake8` for linting

### JavaScript/React (Frontend)
- **Style Guide**: Follow Airbnb JavaScript Style Guide
- **Code Formatting**: Use Prettier
- **Linting**: Use ESLint with Airbnb config
- **Component Structure**: Use functional components with hooks

### Git Commit Messages
Follow the conventional commits specification:
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or modifying tests
- `chore`: Maintenance tasks

## 🔄 Pull Request Process

### Before Submitting
1. **Sync with upstream**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write clean, documented code
   - Add tests for new functionality
   - Update documentation if needed

4. **Test your changes**
   ```bash
   # Backend tests
   pytest

   # Frontend tests
   cd frontend && npm test
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

### Submitting Pull Request
1. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Fill out the PR template
   - Link any related issues

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added tests for new functionality
- [ ] Updated documentation

## Screenshots (if applicable)
Add screenshots or GIFs

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

## 🧪 Testing Guidelines

### Backend Testing
```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_models.py

# Run with verbose output
pytest -v
```

### Frontend Testing
```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- TaskForm.test.jsx
```

### Test Writing Guidelines
- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test API endpoints and database interactions
- **End-to-End Tests**: Test complete user workflows
- **Performance Tests**: Test application performance under load

## 📖 Documentation

### Code Documentation
- **Python**: Use Google-style docstrings
- **JavaScript**: Use JSDoc comments
- **README files**: Keep updated with changes

### API Documentation
- **OpenAPI/Swagger**: Auto-generated from code
- **Postman Collection**: Available in `/docs/postman/`
- **API Examples**: Available in `/docs/examples/`

## 🐛 Issue Reporting

### Bug Report Template
When reporting bugs, please include:
1. **Environment**: OS, Python version, Node version
2. **Steps to reproduce**: Detailed steps
3. **Expected behavior**: What should happen
4. **Actual behavior**: What actually happens
5. **Screenshots**: If applicable
6. **Error logs**: Console or server logs

### Feature Request Template
When requesting features, please include:
1. **Use case**: Why is this feature needed?
2. **Proposed solution**: How should it work?
3. **Alternatives**: What other approaches were considered?
4. **Additional context**: Any other relevant information

## 🚀 Feature Development Workflow

### 1. Research & Planning
- Discuss in GitHub Issues
- Create design documents
- Get community feedback

### 2. Implementation
- Follow coding standards
- Write tests
- Update documentation

### 3. Review & Testing
- Code review by maintainers
- Community testing
- Performance testing

### 4. Release
- Merge to main
- Update changelog
- Announce to community

## 🏷️ Issue Labels

I use the following labels:
- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements or additions to documentation
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `priority`: High priority issues
- `wontfix`: This will not be worked on

## 🏆 Recognition

### Contributors
We recognize all contributors through:
- **GitHub Contributors**: Listed in README
- **Release Notes**: Mentioned in changelog
- **Hall of Fame**: Special recognition for significant contributions

### Hall of Fame
Special recognition for:
- **Core Contributors**: Major feature implementations
- **Bug Hunters**: Critical bug fixes
- **Documentation Heroes**: Significant documentation improvements
- **Community Champions**: Helping others and fostering community

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

## 🎉 Thank You!

Thank you for contributing to the AI-Powered Productivity Assistant! Your contributions help make productivity more intelligent and accessible for everyone.

**Happy coding! 🚀**

---

*For questions or clarifications about this guide, please [open an issue](https://github.com/yourusername/ai-productivity-assistant/issues) or reach out to the maintainers.*
