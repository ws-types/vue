const { run } = require("@bigmogician/publisher");
const { config } = require("./pkg");

run({
  ...config
});
