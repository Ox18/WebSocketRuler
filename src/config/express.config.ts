import cookieparser from "cookie-parser";
import express, {
  Application,
  json,
  Request,
  Response,
  urlencoded,
} from "express";
import path from "path";

import exphbs from "express-handlebars";
import sessions from "express-session";
import helmet from "helmet";

import { DAY } from "../consts/other.const";
import adminRouter from "../router/admin.router";
import privateRouter from "../router/private.router";
import publicRouter from "../router/public.router";

import handlebarsConfig from "./handlebars.config";

function initExpress(): Application {
  const app: Application = express();

  app.set("env", "production");

  // Set Template engine to handlebars
  app.engine(
    "hbs",
    exphbs({
      extname: "hbs",
      defaultLayout: "main",
      layoutsDir: "views/layouts",
      partialsDir: "views/partials",
      helpers: handlebarsConfig,
    })
  );
  app.set("view engine", "hbs");
  app.set("port", process.env.PORT || 3000);

  app.use(json());
  app.use(urlencoded({ extended: false }));
  app.use(helmet());
  app.set("trust proxy", 1);

  app.use(
    sessions({
      secret: "websocket",
      saveUninitialized: true,
      cookie: {
        secure: true,
        maxAge: DAY.MILLISECONDS,
      },
      resave: false,
    })
  );
  app.use(cookieparser());

  app.use("/static", express.static(path.join(__dirname, "/../../public")));

  app.use(publicRouter);
  app.use(privateRouter);
  app.use(adminRouter);
  app.use((_req: Request, res: Response) => {
    res.render("404", { layout: false });
  });

  return app;
}

export default initExpress;
