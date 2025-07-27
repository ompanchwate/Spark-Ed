import { google } from "googleapis";
import fs from "fs";
import readline from "readline";

const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const CREDENTIALS_PATH = "./credentials.json";
const TOKEN_PATH = "./token.json";

const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf8"));
const { client_secret, client_id, redirect_uris } = credentials.web;

const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline",
  scope: SCOPES,
});

console.log("Authorize this app by visiting:", authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
rl.question("Enter the code from that page: ", async (code) => {
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
  console.log("✅ Token saved to", TOKEN_PATH);
  rl.close();
});
