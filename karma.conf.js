module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'browserify'],
    files: [
      //'test/setup.js',
      'src/**/*.js',
      'src/**/*.jsx'
    ],
    preprocessors: {
      'test/setup.js': ['browserify'],
      'src/**/*.js': ['browserify'],
      'src/**/*.jsx': ['browserify']
    },
    browserify: {
      bare: true,
      debug: true
    },
    reporters: ['spec'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_DEBUG,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });
};
