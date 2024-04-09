import { environment } from "./src/environments/environment";

const proxy = [
  {
    context: "/api",
    target: environment.apiUrl,
    changeOrigin: true,
  },
];

module.exports = proxy;
