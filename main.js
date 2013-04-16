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
  
  APP.ProjectsView = Backbone.View.extend({
    
    template: _.template($('#projects-template').html()),
    
    events: {
      'click .view-demo' : 'viewDemo'
    },
    
    render: function() {
      console.log("rendering projects");
      var that = this;
      $.getJSON('data/projects.json', function(data) {
        console.log(data);
        that.$el.html(that.template(data));
      });
    },
    
          
    viewDemo : function () {
      console.log('click');
      this.$el.find('.demo').slideToggle();
    }
  });
  
  APP.AppView = Backbone.View.extend({
    
    el: $('#app'),
    
    initialize: function() {
      this.listenTo(APP.appRouter, 'route', function(route) {
        if (route === 'about' || route === 'resume' || route == 'projects') {
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
    },
    
    projects: function() {
      var Projects = new APP.ProjectsView({el: $content});
      Projects.render();
    }
  });
    
  APP.AppRouter = Backbone.Router.extend({
    
    routes: {
      ''         : 'about',
      'resume'   : 'resume',
      'projects' : 'projects', 
    },
    
    about: function() {
      APP.appView.about();
    },
    
    resume: function() {
      APP.appView.resume();
    },
    
    projects: function() {
      APP.appView.projects();
    }
    
  });
    
  APP.appRouter = new APP.AppRouter();
  APP.appView = new APP.AppView();
  
  Backbone.history.start();

});