var config = require('./config');

var Maki = require('maki');
var openresearch = new Maki(config);

var Passport = require('maki-passport-local');
//var Twitter = require('maki-passport-twitter');
//var LinkedIn = require('maki-passport-linkedin');

var passport = new Passport({
  resource: 'User'
});
/*var twitter = new Twitter({
  resource: 'User'
});*/

openresearch.use(passport);
//openresearch.use(twitter);

openresearch.define('Project', {
  icon: 'briefcase',
  attributes: {
    name: { type: String , max: 240 },
    description: { type: String },
    author: { type: String },
    status: { type: String , enum: ['open', 'closed'] , default: 'open' },
    created: { type: Date , default: Date.now },
    /* costs: {
      review: { token: { type: String , enum: ['review', 'vote'] } },
      attach: { token: { type: String , enum: ['review', 'vote'] } },
      vote: { token: { type: String , enum: ['review', 'vote'] } },
    },
    rules: {
      every: Number,
      get: Number
    } */
  },
  requires: {
    'Topic': {
      filter: function() {
        var project = this;
        return { project: project._id };
      }
    }
  }
});

openresearch.define('Topic', {
  icon: 'file',
  public: false,
  attributes: {
    title: { type: String , max: 240 },
    content: { type: String },
    author: { type: String },
    status: { type: String , enum: ['open', 'closed'] , default: 'open' },
    created: { type: Date , default: Date.now },
    project: { type: String },
  },
  requires: {
    'Comment': {
      filter: function() {
        var topic = this;
        return { topic: topic._id }
      },
      populate: 'user'
    }
  }
});

openresearch.define('Comment', {
  icon: 'comment',
  public: false,
  attributes: {
    created: { type: Date , default: Date.now },
    content: { type: String },
    topic: { type: String },
    user: { type: String },
  },
  handlers: {
    html: {
      create: function(req, res) {
        var review = this;
        res.status(303).redirect('/topics/' + review.topic);
      }
    }
  }
});

openresearch.define('Reaction', {
  icon: 'emoji',
  public: false,
  attributes: {
    score: { type: Number , min: -10 , max: 10 }
  }
});

openresearch.define('User', {
  icon: 'user',
  attributes: {
    
    username: { type: String , required: true , slug: true },
    email: { type: String },
    role: { type: String , enum: ['user', 'admin'], default: 'user' }
  }
});

openresearch.define('File', {
  icon: 'file',
  public: false,
  attributes: {
    name: { type: String , required: true }
  }
});

openresearch.start();
