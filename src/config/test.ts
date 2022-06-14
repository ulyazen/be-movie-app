require('dotenv').config()

const config = {
  serverUrl: 'http://localhost',
  serverPort: 5002,
  serverDatabase: process.env.SERVER_DB_TEST,
  jwtSecret: process.env.JWT_SECRET,
  googleId: process.env.GOOGLE_CLIENT_ID,
  googleSecret: process.env.GOOGLE_CLIENT_SECRET,
}

export default config
