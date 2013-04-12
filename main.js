//for now just stick everything in jquery ready

var APP = {};

$(function() {

  var $content = $('#content');

  APP.AboutView = Backbone.View.extend({
    
    template: _.template($('#about-template').html()),
    
    render: function() {
      this.$el.html(this.template());
      return this;
    }
  });
  
  APP.ResumeView = Backbone.View.extend({
    
    template: _.template($('#resume-template').html()),
    
    render: function() {
      this.$el.html(this.template());
      return this;
    }
  });
  
  APP.AppView = Backbone.View.extend({
    
    el: $('#app'),
    
/*
    initialize: function() {
      this.about();
    },
*/
    
    about: function() {
      var About = new APP.AboutView({el: $content});
      About.render();
    },
    
    resume: function() {
      var Resume = new APP.ResumeView({el: $content});
      Resume.render();
    }
  });
    
  APP.AppRouter = Backbone.Router.extend({
    
    routes: {
      ''       : 'about',
      'resume' : 'resume'
    },
    
    about: function() {
      APP.appView.about();
    },
    
    resume: function() {
      console.log("resume received");
      APP.appView.resume();
    }
    
  });
  
  APP.appView = new APP.AppView();
  
  APP.appRouter = new APP.AppRouter();
  
  Backbone.history.start();

});