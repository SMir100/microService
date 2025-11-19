const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:4200",
  "http://your-frontend-domain.com",
  "https://your-frontend-domain.com"
];

const corsOptions = {
  origin: function (origin, callback) {

    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS blocked: Not allowed by server"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: false,
  optionsSuccessStatus: 200
};

module.exports = corsOptions;
