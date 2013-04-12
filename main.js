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
      var that = this;
      $.getJSON('data/resume.json', function(data) {
        console.log(data);
        that.$el.html(that.template(data));
      });
      return this;
    }
  });
  
  APP.AppView = Backbone.View.extend({
    
    el: $('#app'),
    
    initialize: function() {
      this.listenTo(APP.appRouter, 'route', function(route) {
        if (route === 'about' || route === 'resume') {
          $('.nav-v a.selected').removeClass('selected');
          console.log('#nav-' + route);
          $('#nav-' + route + ' a').addClass('selected');
        }
      });
    },
    
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
      APP.appView.resume();
    }
    
  });
    
  APP.appRouter = new APP.AppRouter();
  APP.appView = new APP.AppView();
  
  Backbone.history.start();

});