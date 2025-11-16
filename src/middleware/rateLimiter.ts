import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,           // 1 hour window
  max: 10,                            // limit each IP to 10 login attempts/hour
  message: {
    success: false,
    message: "Too many login attempts. Try again in an hour."
  }
});

export const generalLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,           // 1 hour window
  max: 100,                           // limit user to 100 requests/hr
  message: {
    success: false,
    message: "Rate limit exceeded. Try again later."
  }
});

export const trackLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,      // 24 hours window
  max: 5,                             // limited track operations/day
  message: {
    success: false,
    message: "You already tracked too many times today."
  }
});
