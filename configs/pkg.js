const config = {
  rc: false,
  add: 0,
  useYarn: false,
  whiteSpace: "  ",
  debug: false,
  outTransform: json => ({
    ...json,
    main: "index.js",
    types: "index.d.ts",
    scripts: undefined,
    nyc: undefined,
    devDependencies: {
      ...json.devDependencies,
      tslint: undefined,
      typescript: undefined,
      "@bigmogician/publisher": undefined
    }
  })
};

module.exports.config = config;
