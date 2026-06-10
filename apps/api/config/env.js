import dotenv from "dotenv";

dotenv.config();

export const env = {
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleBooksApiKey: process.env.GOOGLE_BOOKS_API_KEY,
  jwtSecret: process.env.JWT_SECRET,
  mongoUri: process.env.MONGO_URI,
  port: process.env.PORT || 4000,
};
