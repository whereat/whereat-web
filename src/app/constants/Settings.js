module.exports = {
  shareFreq: {
    labels: [
      '5 sec (most accurate)',
      '15 sec',
      '30 sec',
      '1 min',
      '5 min (most battery life)'
    ],
    values: [
      5000,
      15000,
      30000,
      60000,
      300000
    ]
  },
  locTtl: {
    labels: [
      "30 min (most secure)",
      "1 hr",
      "2 hr (most info)"
    ],
    values: [
      1800000,
      3600000,
      7200000
    ]
  }
};
