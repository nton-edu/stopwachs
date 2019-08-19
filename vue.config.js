module.exports = {
  baseUrl: "./"
};
{
  [
    {
      strategyOptions: {
        cacheName: "stopwatchs",
        cacheExpiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 14
        }
      }
    }
  ];
}
