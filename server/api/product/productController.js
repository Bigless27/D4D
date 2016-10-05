var Product = require('./productModel');
var _ = require('lodash');

exports.params = function(req, res, next, id) {
	Product.findById(id)
		.exec()
		.then(function(user) {
			if (!user) {
				next(new Error('No product'));
			} else {
				req.product = user;
				next();
			}
		}, function(err) {
			next(err);
	});
};


exports.get = function(req, res, next) {
	Product.find({})
		.then(function(products){
			res.json(products)
		}, function(err) {
			next(err);
	})
}



exports.getOne = function(req, res, next) {
	var product = req.product.toJson();
	res.json(product);
};



exports.put = function(req, res, next) {
  var product = req.product;

  var update = req.body;

  _.merge(product, update);


  product.save(function(err, saved) {
    if (err) {
      	next(err)
    } else {
      res.json(saved.toJson());
    }
  }, function(err) {
  	next(err)
  })
};

exports.post = function(req, res, next) {
  var newProduct = req.body

  Product.create(newProduct)
    .then(function(product){
      res.json(product)
    }, function(err) {
      next(err)
    })
};

exports.delete = function(req, res, next) {	
  req.product.remove(function(err, removed) {
    if (err) {
      next(err);
    } else {
      res.json(removed.toJson());
    }
  });
};







