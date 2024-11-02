**GotYou**

GotYou is a social platform designed for connecting with friends,
featuring secure authentication, real-time user activity tracking,
profile customization, and more.

**Features**

-   **Authentication & Authorization**: JWT-based secure login and
    authorization.

-   **Profile Management**: Users can upload profile pictures and update
    their personal details.

-   **Password Management**: Secure password handling with update
    options.

-   **Two-Factor Authentication (2FA)**: Additional time-based OTP
    verification for enhanced security, based on user preferences.

-   **Latest User Activity**: Track and display the most recent activity
    of users.

-   **Rate Limiting**: Protection against spam and abuse using
    express-rate-limit.

-   **Theme Switching**: Light and dark mode options to enhance user
    experience.

**Tech Stack**

-   **Frontend**: React, TailwindCSS for styling, Redux Toolkit for
    state management.

-   **Backend**: Node.js, Express.js.

-   **Database**: MongoDB for storing user data in collections.

-   **Media** : Cloudinary was implemented to store images.

**Folder Structure**

-   backend/: Contains all backend files, managed with Express.js.

-   frontend/: Contains the frontend files, developed with React.

**Getting Started**

**Prerequisites**

-   [Node.js](https://nodejs.org/)

-   [MongoDB](https://www.mongodb.com/)

**Installation**

1.  Clone the repository:

git clone https://github.com/yourusername/gotyou.git

cd gotyou

2.  Install dependencies for both frontend and backend:

cd backend

npm install

cd ../frontend

npm install

**Running the Application**

-   **Backend**: Run the backend server

cd backend

npm start

-   **Frontend**: Run the frontend server

cd frontend

npm start

**Environment Variables**

Configure the following environment variables in a .env file in the
backend folder:

-   PORT: Port number for the server.

-   MONGOURL: MongoDB connection string.

-   JWT_AUTHSECRET: Secret key for JWT access token generation.

-   JWT_REFRESH_SECRET: Secret key for JWT refresh token generation.

-   CLOUD_NAME: Cloudinary cloud name for image upload.

-   CLOUD_API_KEY: Cloudinary API key.

-   CLOUD_API_SECRET: Cloudinary API secret.

-   EMAIL: Email address for notifications or OTP delivery.

-   PASSWORD: Password for the email account.

**Usage**

1.  Register as a new user on the platform.

2.  Login using your credentials and experience enhanced security with
    optional 2FA.

3.  Update your profile information and set a profile picture.

4.  Switch between light and dark themes based on your preference.

**Additional Information**

-   **Security**: User data is protected with JWT tokens, rate limiting,
    and 2FA.

-   **Intuitive UI/UX**: Tailwind CSS provides a mobile-friendly,
    responsive UI.
