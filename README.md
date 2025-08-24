# SirupateyAI

![SirupateyAI Logo](https://via.placeholder.com/200x200?text=SirupateyAI)

## 🚀 Overview

SirupateyAI is an intelligent educational assistant platform designed to enhance the learning experience for students through artificial intelligence. This repository contains the frontend implementation that interfaces with our [fastapi-student-assistant-mongo](https://github.com/PraTha830/fastapi-student-assistant-mongo) backend service.

## 🌟 Features

- **Personalized Learning**: AI-driven content tailored to individual student needs and learning styles
- **Intelligent Tutoring**: Step-by-step guidance through complex topics and problems
- **Progress Tracking**: Comprehensive analytics to monitor student performance and growth
- **Smart Content Recommendations**: Customized learning resources based on student performance
- **Natural Language Interaction**: Human-like conversation interface for an engaging learning experience
- **Multi-platform Support**: Accessible across various devices and platforms

## 🔧 Technology Stack

### Frontend
- **Framework**: React.js 
- **Styling**: Tailwind CSS / Styled Components / Material UI
- **API Integration**: Fetch API


### Backend
Our backend service is built with FastAPI and MongoDB. For more details, check out the [fastapi-student-assistant-mongo]([https://github.com/PraTha830/fastapi-student-assistant-mongo](https://github.com/Diglet7781/fastapi-student-assistant-mongo/) repository.

## Backend: fastapi-student-assistant-mongo

The [fastapi-student-assistant-mongo](https://github.com/Diglet7781/fastapi-student-assistant-mongo/) repository hosts our powerful backend service that powers SirupateyAI's intelligent features.

### Key Backend Features

- **FastAPI Framework**: High-performance, easy-to-use framework for building APIs with Python
- **MongoDB Integration**: NoSQL database for flexible data storage and efficient querying
- **RESTful API Design**: Well-structured endpoints for all frontend-backend communications
- **JWT Authentication**: Secure token-based authentication system
- **AI Integration**: Connections to machine learning models for educational content analysis
- **Student Data Management**: Comprehensive storage and retrieval of student information and progress
- **Asynchronous Processing**: Non-blocking operations for improved performance under load
- **Comprehensive Documentation**: Auto-generated API documentation with Swagger UI

### Backend Architecture

The backend follows a modular architecture:
- **Routers**: API endpoint definitions organized by domain
- **Models**: Pydantic models for data validation and MongoDB schemas
- **Services**: Business logic implementation
- **Utils**: Helper functions and utilities
- **Middleware**: Request/response processing components
- **AI Engine**: Integration with machine learning models for educational content processing

### Backend Installation

For developers who want to run the complete stack locally:

```bash
# Clone the backend repository
git clone https://github.com/PraTha830/fastapi-student-assistant-mongo.git
cd fastapi-student-assistant-mongo

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit the .env file with your MongoDB connection string and other configurations

# Run the backend server
uvicorn app.main:app --reload
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14.0 or higher)
- npm or yarn
- Access to the backend API (locally or deployed)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/PraTha830/sirupateyAi.git
cd sirupateyAi
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Configure environment variables:
```bash
cp .env.example .env
```
Edit the `.env` file and set the API endpoint to your backend service.

4. Start the development server:
```bash
npm run dev
# or
yarn start
```

## 🔄 API Integration

SirupateyAI connects to our FastAPI backend service to handle:
- User authentication and authorization
- Student data and progress tracking
- AI-powered content generation and recommendations
- Learning analytics and performance metrics

See the [API Documentation](https://github.com/PraTha830/fastapi-student-assistant-mongo#api-documentation) for detailed information on available endpoints.

## 🧪 Testing

Run tests to ensure everything is working correctly:

```bash
npm test
# or
yarn test
```

## 📊 Project Structure

```
sirupateyAi/
├── public/           # Static files
├── src/
│   ├── assets/       # Images, fonts, etc.
│   ├── components/   # Reusable UI components
│   ├── contexts/     # React contexts
│   ├── hooks/        # Custom hooks
│   ├── pages/        # Main application pages
│   ├── services/     # API and external services
│   ├── styles/       # Global styles
│   ├── utils/        # Helper functions
│   ├── App.js        # Main application component
│   └── index.js      # Entry point
├── .env              # Environment variables
├── package.json      # Dependencies and scripts
└── README.md         # Project documentation
```

## 🔒 Security

- All API requests are authenticated using JWT tokens
- User data is encrypted in transit and at rest
- Regular security audits are performed on both frontend and backend code

## 🤝 Contributing

We welcome contributions from the community! Please follow these steps to contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

The MIT License is a permissive open-source license that allows anyone to use, modify, distribute, and even sell your code with minimal restrictions. The only requirements are that they include the original copyright notice and disclaimer in any copies or substantial portions of the software. This license is popular in the open-source community because it provides legal protection for the creator while encouraging collaboration and widespread use.

## 📞 Contact

PraTha830 - [GitHub Profile](https://github.com/PraTha830)

Project Link: [https://github.com/PraTha830/sirupateyAi](https://github.com/PraTha830/sirupateyAi)

## 🙏 Acknowledgements

- [FastAPI](https://fastapi.tiangolo.com/)
- [MongoDB](https://www.mongodb.com/)
- [React.js](https://reactjs.org/)
- [OpenAI](https://openai.com/) for AI assistance
- All contributors and supporters of this project
