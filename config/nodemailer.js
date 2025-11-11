import nodemailer from "nodemailer";
import { EMAIL, EMAIL_PASSWORD, EMAIL_HOST } from "./env.js";

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export default transporter;

/* import nodemailer from "nodemailer";
import { EMAIL, EMAIL_PASSWORD } from "./env.js";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD,
  },
});

export default transporter; */
