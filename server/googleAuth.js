import fs from "fs";
import path from "path";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const credentialsPath = path.join(process.cwd(), "credentials.json");

const credentials = JSON.parse(
  fs.readFileSync(credentialsPath, "utf8")
);

const { client_secret, client_id, redirect_uris } = credentials.web;

export const getAuthClient = () => {
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  oAuth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  return oAuth2Client;
};