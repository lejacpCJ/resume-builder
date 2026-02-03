# Resume Builder

A full-stack web application designed to help users create and share professional resumes with the help of AI-powered tools.

## Tech Stack

Client:

- Framework: React + Vite
- Styling: TailwindCSS
- State Management: Redux Toolkit
- Other: Axios, React Router, React Hot Toast, Lucide React

Server:

- Runtime: Node.js
- Framework: Express
- Database: MongoDB
- AI Integration: OpenAI API
- Utilities: ImageKit (storage), Multer (uploads), JWT (auth)

## Project Structure

The project is organized into two main directories:

- **`client/`**: Contains the React frontend application source code, assets, and build configuration.
- **`server/`**: Contains the Node.js backend API, database connection logic, and route handlers.

## Functionality

- User Authentication: Secure login and registration.
- Dashboard: Manage multiple resumes from a central dashboard.
- Resume Builder: Interactive builder to edit resume sections (Bio, Experience, Education, etc.).
- AI Assistance: AI-powered features for parsing resumes and generating content.
- Live Preview: View and share resumes via unique public links.
