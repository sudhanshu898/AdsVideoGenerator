import * as Sentry from "@sentry/node"


Sentry.init({
  dsn: "https://6f0faaecded6dca1ecd2c1afe2026709@o4511014051315712.ingest.us.sentry.io/4511014068355074",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});