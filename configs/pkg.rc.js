const { run } = require("@bigmogician/publisher");
const { config } = require("./pkg");

run({
  ...config,
  rc: true,
  useStamp: true,
  debug: false
});
