var Product = require('../api/product/productModel');
var mongoose = require('mongoose');

var logger = require('./logger');

var products = [
  {
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
        title: 'Gothic Video Game',
        description: 'Awesome Game!!!!',
        price: 10
  },
  {
          imagePath: 'http://eu.blizzard.com/static/_images/games/wow/wallpapers/wall2/wall2-1440x900.jpg',
          title: 'World of Warcraft Video Game',
          description: 'Also awesome? But of course it was better in vanilla ...',
          price: 20
  },
  {
        imagePath: 'https://support.activision.com/servlet/servlet.FileDownload?file=00PU000000Rq6tz',
        title: 'Call of Duty Video Game',
        description: 'Meh ... nah, it\'s okay I guess',
        price: 40
   },
   {
        imagePath: 'https://pmcdeadline2.files.wordpress.com/2014/02/minecraft__140227211000.jpg',
        title: 'Minecraft Video Game',
        description: 'Now that is super awesome!',
        price: 15
    }
];

var createDoc = function(model, doc) {
  return new Promise(function(resolve, reject) {
    new model(doc).save(function(err, saved) {
      return err ? reject(err) : resolve(saved);
    });
  });
};

var cleanDB = function() {
  logger.log('... cleaning the DB');
  var cleanPromises = [Product]
    .map(function(model) {
      return model.remove().exec();
    });
  return Promise.all(cleanPromises);
}

var createProduct = function(data) {

  var promises = products.map(function(prod) {
    return createDoc(Product, prod);
  });

  return Promise.all(promises)
    .then(function(products) {
      return _.merge({products: products}, data || {});
    });
};


cleanDB()
  .then(createProduct)
  .then(logger.log.bind(logger))
  .catch(logger.log.bind(logger));

