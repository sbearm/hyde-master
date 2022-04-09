import { Axios } from "axios";
const { randomUUID } = require("crypto");

const axios: Axios = require("axios").default;

export async function getConfig(settings: any) {
  let url = settings.gist + "?cache-bust=" + randomUUID().toString();
  const response = await axios.get(url, {
    headers: { "Cache-Control": "no-cache" },
  });
  return response.data;
}
