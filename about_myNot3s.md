# myNot3s - Secure Note-Taking Application

## Overview
myNot3s is a secure, user-friendly note-taking application built with modern web technologies. It features end-to-end encryption, user authentication, and a clean, responsive interface.

## Tech Stack
- **Frontend**:
  - React.js
  - Tailwind CSS
  - Axios for API calls
  - React Router for navigation

- **Backend**:
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - JWT for authentication
  - Crypto for encryption

## Features
- **User Authentication**:
  - Secure signup and login
  - Password reset functionality
  - Profile management
  - Account deletion

- **Note Management**:
  - Create, read, update, and delete notebooks
  - Real-time content saving
  - End-to-end encryption for note content
  - Responsive layout for all devices

- **Security**:
  - Password hashing with bcrypt
  - JWT-based authentication
  - AES-256-CBC encryption for notebook content
  - Secure password reset mechanism

## Key Achievements
1. **Enhanced Security**:
   - Implemented end-to-end encryption for note content
   - Secure password handling and storage
   - Protected API endpoints

2. **User Experience**:
   - Clean, intuitive interface
   - Responsive design for mobile and desktop
   - Seamless navigation
   - Real-time feedback for user actions

3. **Performance**:
   - Optimized database queries
   - Efficient state management
   - Quick response times

## Technical Challenges & Solutions
1. **Content Encryption**:
   - Challenge: Implementing secure encryption while maintaining usability
   - Solution: Used AES-256-CBC encryption with unique IVs per note

2. **Authentication Flow**:
   - Challenge: Secure but user-friendly auth system
   - Solution: JWT-based authentication with refresh tokens

3. **Mobile Responsiveness**:
   - Challenge: Consistent experience across devices
   - Solution: Tailwind CSS responsive classes and mobile-first design

## Setup and Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```
3. Create `.env` file in server directory with:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ENCRYPTION_KEY=your_32_byte_key
   ENCRYPTION_IV_LENGTH=16
   ```
4. Start the application:
   ```bash
   # Start server (from server directory)
   npm run dev

   # Start client (from client directory)
   npm run dev
   ```

## Future Improvements
- [ ] Collaborative note sharing
- [ ] Rich text editor integration (begun by May 16th 2025)
- [ ] File attachments
- [ ] Dark mode support (done by May 16th 2025)
- [ ] Export/import functionality

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.


## Key security features implemented:

AES-256-CBC Encryption:
1. Industry-standard symmetric encryption
2. 256-bit key length for maximum security
3. CBC mode provides better security than ECB

Unique IV per Content:
1. New random IV for each encryption
2. Prevents pattern recognition in encrypted data
3. Stored alongside encrypted content

Environment Variables:

1. Encryption key stored in .env file
2. Not committed to version control
3. Configurable IV length

Error Handling:
1. Graceful handling of empty content
2. Try-catch block for decryption errors
3. Returns original content if decryption fails

Mongoose Schema Features:
1. Automatic timestamps
2. Custom getters and setters
3. Required fields validation
4. JSON transformation support

This setup ensures that notebook content is always encrypted in the database but transparently decrypted when accessed through the application.

## JWT (JSON Web Token) purpose:
Authentication
1. Verifies that users are who they claim to be
2. Created when user logs in successfully
3. Must be included in subsequent API requests
4. Format: Bearer eyJhbGciOiJIUzI1N... (example)

Stateless Sessions
1. Eliminates need for server-side session storage
2. Contains encoded user information (email in this case)
3. Signed with a secret key (JWT_SECRET)
4. Self-contained and tamper-evident

Authorization Flow
graph LR
    A[User Login] --> B[Server Creates JWT]
    B --> C[Token sent to Client]
    C --> D[Client stores Token]
    D --> E[Token sent with Requests]
    E --> F[Server Verifies Token]

Security Benefits
1. Protected Routes: Only authenticated users can access certain endpoints
2. Tamper Protection: Any modification invalidates the token
3. Expiration: Tokens can be set to expire after a certain time
4. No Session Storage: Reduces server overhead and complexity


