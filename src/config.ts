import { Axios } from "axios";

const axios: Axios = require("axios").default;

export async function getConfig(settings: any) {
  const response = await axios
        .get(settings.gist, {
            headers: { "Cache-Control": "no-cache" },
        });
    return response.data;
}
