import fs from "fs";
import { google } from "googleapis";

const CREDENTIALS_PATH = "./credentials.json";
const TOKEN_PATH = "./token.json";

export async function getAuthClient() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf8"));
  const { client_secret, client_id, redirect_uris } = credentials.web;

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  const token = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));
  oAuth2Client.setCredentials(token);

  return oAuth2Client;
}
