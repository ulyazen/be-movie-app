const config = {
  serverUrl: process.env.SERVER_URL,
  serverPort: process.env.PORT,
  serverDatabase: process.env.SERVER_DB_PROD,
  jwtSecret: process.env.JWT_SECRET,
  googleId: process.env.GOOGLE_CLIENT_ID,
  googleSecret: process.env.GOOGLE_CLIENT_SECRET,
}

export default config
