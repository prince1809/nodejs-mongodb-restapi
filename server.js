// server.js

// BASE SETUP

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var morgan = require('morgan');

app.use(morgan('dev'));




app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/nodeapp');

var Bear = require('./app/models/bear');

var router = express.Router();

router.use(function(req,res,next){
    
   console.log(req.body);
   next();
});

router.get('/',function(req,res){
    res.json({
        message: 'Welcome Prince'
    });
});


router.route('/bears')
    //create a bear 
            .post(function(req,res){
               
                var bear = new Bear();
                bear.name = req.body.name;
                bear.save(function(err){
                    if(err)
                        res.send(err);
                        
                        res.json({message: 'Beer Created'});
                })
})
        .get(function(req,res){
            Bear.find(function(err,bears){
                if(err)
                    res.send(err);
                res.json(bears);
            });
});

router.route('/bears/:bear_id')
        .get(function(req,res){
            Bear.findById(req.params.bear_id,function(err,bear){
                if(err)
                    res.send(err);
                res.json(bear);
            });
})
        .put(function(req,res){
            Bear.findById(req.params.bear_id,function(err,bear){
                if(err)
                    res.send(err);
                
                bear.name = req.body.name;
                bear.save(function(err){
                    if(err)
                        res.send(err);
                    res.json({message: 'Beer Updated'});
                });
            })
})
        .delete(function(req,res){
            Bear.remove({
                _id: req.params.bear_id
            },function(err,bear){
                if(err)
                    res.send(err);
                res.json({message: 'Successfully deleted'});
            });
});


app.use('/api',router);

app.listen(port);
console.log('Server listening now');

