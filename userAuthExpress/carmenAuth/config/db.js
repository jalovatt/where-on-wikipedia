export default {
    'secret':'my secret',
    'database': process.env.NODE_ENV == 'test' ? 'mongodb://localhost/rest-api-test' : 'mongodb://localhost/rest-api'
  };