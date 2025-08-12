# AI-Powered Productivity Assistant 🤖✨

An intelligent task management system that leverages artificial intelligence to help you organize, prioritize, and complete your tasks more efficiently. Built with modern web technologies and powered by Google's Gemini AI for smart suggestions and insights.

## 🌟 Key Features

### 🤖 AI-Powered Intelligence
- **Smart Task Suggestions**: Get AI-generated task recommendations based on your patterns and preferences using Google's Gemini API
- **Priority Intelligence**: AI automatically calculates task priorities using machine learning algorithms
- **Content Recommendations**: Receive personalized content suggestions to help complete your tasks
- **Natural Language Processing**: Add tasks using natural language (e.g., "Remind me to call mom tomorrow at 3pm")

### 📊 Advanced Analytics Dashboard
- **Productivity Insights**: Visual charts showing your task completion patterns
- **Performance Metrics**: Track completion rates, productivity trends, and efficiency improvements
- **Smart Analytics**: AI-powered insights on your productivity habits

### 🗓️ Smart Calendar Integration
- **Visual Task Calendar**: Beautiful calendar view with drag-and-drop functionality
- **Due Date Intelligence**: AI suggests optimal due dates based on task complexity and your schedule
- **Conflict Detection**: Automatically identifies scheduling conflicts and suggests solutions

### 🔐 Secure Authentication
- **JWT Token Authentication**: Secure login system with token-based authentication
- **User Management**: Individual user accounts with personalized task lists
- **Password Security**: Hashed passwords using industry-standard encryption

### 📱 Modern Web Interface
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Updates**: Live task synchronization across all devices
- **Beautiful UI/UX**: Aurora-themed design with smooth animations and transitions

## 🛠️ Technology Stack

### Backend
- **Flask**: Python web framework for RESTful API
- **SQLAlchemy**: ORM for database management
- **Flask-JWT-Extended**: JWT authentication
- **Flask-CORS**: Cross-origin resource sharing
- **Flask-Migrate**: Database migrations
- **Google Generative AI**: Gemini API integration

### Frontend
- **React**: Modern JavaScript framework
- **Vite**: Fast build tool and dev server
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **CSS3**: Modern styling with animations

### Database
- **SQLite**: Lightweight database for development
- **PostgreSQL**: Production-ready database support

### AI/ML Libraries
- **spaCy**: Natural language processing
- **dateparser**: Intelligent date parsing
- **Google Generative AI**: Gemini model integration

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Google Gemini API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ai-productivity-assistant.git
cd ai-productivity-assistant
```

2. **Backend Setup**
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env file with your Google Gemini API key
```

3. **Frontend Setup**
```bash
cd frontend
npm install
```

4. **Database Initialization**
```bash
# Run migrations
flask db upgrade

# Start the application
python run.py
```

5. **Start Frontend**
```bash
# In another terminal
cd frontend
npm run dev
```

### Environment Variables
Create a `.env` file in the root directory:
```bash
# Backend
SECRET_KEY=your-secret-key
GEMINI_API_KEY=your-google-gemini-api-key
DATABASE_URL=sqlite:///app.db

# Frontend
VITE_BACKEND_URL=http://localhost:5000
```

## 📖 API Documentation

### Authentication Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user info

### Task Management Endpoints
- `GET /tasks` - Get all tasks for authenticated user
- `POST /tasks` - Create new task
- `GET /tasks/:id` - Get specific task
- `PATCH /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

### AI Features Endpoints
- `POST /tasks/:id/suggestions` - Get AI suggestions for task
- `POST /tasks/parse` - Parse natural language task input
- `GET /analytics/dashboard` - Get productivity analytics

## 🎯 Usage Examples

### Adding Tasks
1. **Natural Language**: "Submit project report next Friday at 2pm"
2. **Smart Suggestions**: AI provides 3 actionable subtasks
3. **Priority Calculation**: Automatically calculates priority based on urgency and importance

### Analytics Insights
- **Weekly Reports**: Track productivity trends
- **Completion Rates**: Monitor task completion efficiency
- **Time Analysis**: Understand time spent on different task types

## 🧪 Testing

### Backend Tests
```bash
# Run all tests
python -m pytest

# Run with coverage
python -m pytest --cov=app
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build and run with Docker
docker-compose up --build
```

### Production Deployment
1. **Backend**: Deploy to Heroku, AWS, or DigitalOcean
2. **Frontend**: Deploy to Vercel, Netlify, or GitHub Pages
3. **Database**: Use PostgreSQL for production

## 🤝 Contributing

Contributions are much appreciated! Please see the [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Demo**: [Live Demo](https://ai-productivity-assistant-demo.netlify.app)
- **Documentation**: [Full Documentation](https://docs.ai-productivity-assistant.com)
- **API Reference**: [API Docs](https://api.ai-productivity-assistant.com/docs)
- **Blog**: [Productivity Tips](https://blog.ai-productivity-assistant.com)

