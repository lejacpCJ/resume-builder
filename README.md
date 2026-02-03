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

## Environment Variables

To run this project, you will need to add the following environment variables to your .env files.

1. **Server Configuration** (`server/.env`):

   | Variable               | Description                                                                    |
   | :--------------------- | :----------------------------------------------------------------------------- |
   | `JWT_SECRET`           | Secret key used for signing JSON Web Tokens (JWT) for user authentication.     |
   | `MONGO_URI`            | Connection string for your MongoDB database.                                   |
   | `IMAGEKIT_PRIVATE_KEY` | Private key for ImageKit, used for image storage and management.               |
   | `GEMINI_API_KEY`       | API key for Google Gemini, enabling AI-powered features.                       |
   | `OPENAI_BASE_URL`      | Base URL for the AI service provider (if using an OpenAI-compatible endpoint). |
   | `GEMINI_MODEL`         | Specific model identifier for the Gemini API (e.g., `gemini-pro`).             |

2. **Client Configuration** (`client/.env`):

   | Variable        | Description                                                          |
   | :-------------- | :------------------------------------------------------------------- |
   | `VITE_BASE_URL` | The base URL of your backend server (e.g., `http://localhost:3000`). |

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

- Node.js (v14 or higher)
- npm
- MongoDB installed locally or a MongoDB Atlas URI

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/lejacpCJ/resume-builder.git
    cd resume-builder
    ```

2.  **Install Server Dependencies:**

    Navigate to the server directory and install dependencies:

    ```bash
    cd server
    npm install
    ```

3.  **Install Client Dependencies:**

    Navigate to the client directory and install dependencies:

    ```bash
    cd ../client
    npm install
    ```

### Running the App

1.  **Start the Server:**

    In the `server` directory, run:

    ```bash
    npm run server
    # or
    npm start
    ```

    The server will start on port 3000 (or the port defined in your environment).

2.  **Start the Client:**

    In the `client` directory, run:

    ```bash
    npm run dev
    ```

    The client will start, typically on `http://localhost:5173`. Open this URL in your browser to view the application.
