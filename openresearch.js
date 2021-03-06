var config = require('./config');

var Maki = require('maki');
var openresearch = new Maki(config);

var Passport = require('maki-passport-local');
//var Twitter = require('maki-passport-twitter');
//var LinkedIn = require('maki-passport-linkedin');

var passport = new Passport({
  resource: 'Person'
});
/*var twitter = new Twitter({
  resource: 'Person'
});*/

openresearch.use(passport);
//openresearch.use(twitter);

openresearch.define('Project', {
  icon: 'briefcase',
  attributes: {
    name: { type: String , max: 240 },
    description: { type: String },
    author: { type: String , ref: 'Person' },
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
    author: { type: String , ref: 'Person' },
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
      populate: 'author'
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
    author: { type: String , ref: 'Person' },
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

openresearch.define('Person', {
  icon: 'user',
  attributes: {
    slug: { type: String },
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

openresearch.define('Index', {
  name: 'Index',
  template: 'index',
  handle: config.service.name + ', ' + config.service.mission,
  description: config.service.description,
  routes: {
    query: '/'
  },
  public: false,
  static: true,
  internal: true,
  requires: {
    'Project': {
      filter: function() {
        return {};
      }
    },
    'Topic': {
      filter: function() {
        return {};
      }
    }
  }
});

openresearch.start();
