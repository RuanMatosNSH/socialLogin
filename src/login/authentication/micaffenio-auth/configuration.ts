const configuration = {
  httpModule: {
    timeout: parseInt(process.env['HTTP_TIMEOUT'] || '60000'),
    maxRedirects: parseInt(process.env['HTTP_MAX_REDIRECTS'] || '5'),
    baseUrl: process.env['US_BASE_URL_MICAFFENIO'] || '',
    username: process.env['US_USERNAME'] || '',
    password: process.env['US_PASSWORD'] || '',
  },
};

export default () => configuration;
