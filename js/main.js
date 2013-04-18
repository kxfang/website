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
  
  APP.PhotographyView = Backbone.View.extend({
    
    template: _.template($('#photography-template').html()),
    
    photos: ['photography/birds.jpg', 'photography/sunset.jpg'],
        
    render: function() {
      this.$el.html(this.template({"photoUrls": this.photos}));  
      $('.carousel-inner > .item:first-child').addClass('active');
      $('#page').animate({'max-width': '1800px'}, 'slow', function() {
        $('#photography-content').fadeToggle('fast');
        $('.carousel').carousel();
      });
      $('footer').css({'display': 'none'});
    }
    
  });
  
  APP.AppView = Backbone.View.extend({
    
    el: $('#app'),
        
    restorePage: function(complete) {
      if ($('#page').css('max-width') !== '800px') {
        $('#page').animate({'max-width': '800px'}, 'slow', function() {
          $('footer').css({'display' : 'block'});
          complete();
        });
        $('#photography-content').animate({'opacity': 0});
      }
      else if (complete) {
        complete();
      }
    },
    
    initialize: function() {
      this.listenTo(APP.appRouter, 'route', function(route) {
        if (route === 'about' || route === 'resume' || route === 'projects' || route === 'photography') {
          $('.nav-v a.selected').removeClass('selected');
          console.log('#nav-' + route);
          $('#nav-' + route + ' a').addClass('selected');
        }
      });
    },
    
    about: function() {
      var About = new APP.AboutView({el: $content});
      this.restorePage(function() {
        About.render();
      });
    },
    
    resume: function() {
      var Resume = new APP.ResumeView({el: $content});
      this.restorePage(function() {
        Resume.render();
      });
    },
    
    projects: function() {
      var Projects = new APP.ProjectsView({el: $content});
      this.restorePage(function() {
        Projects.render();
      });
    },
    
    photography: function() {
      var Photography = new APP.PhotographyView({el: $content});
      Photography.render();
    }
  });
    
  APP.AppRouter = Backbone.Router.extend({
    
    routes: {
      ''            : 'about',
      'resume'      : 'resume',
      'projects'    : 'projects',
      'photography' : 'photography' 
    },
    
    about: function() {
      APP.appView.about();
    },
    
    resume: function() {
      APP.appView.resume();
    },
    
    projects: function() {
      APP.appView.projects();
    },
    
    photography: function() {
      APP.appView.photography();
    }
    
  });
    
  APP.appRouter = new APP.AppRouter();
  APP.appView = new APP.AppView();
  
  Backbone.history.start();

});