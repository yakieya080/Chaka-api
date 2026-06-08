import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
const app: Express = express();

app.use(
  pinoHttp({
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


export default app;
