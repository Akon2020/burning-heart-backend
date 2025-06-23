import nodemailer from "nodemailer";
import { EMAIL, EMAIL_PASSWORD } from "./env.js";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD,
  },
});

export default transporter;