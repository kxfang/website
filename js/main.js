//for now just stick everything in jquery ready

var APP = {};

$(function() {

  APP.ResumeModel = Backbone.Model.extend({
    urlRoot: 'data/resume.json'
  });
  
  APP.ProjectsModel = Backbone.Model.extend({
    urlRoot: 'data/projects.json'
  });

  var $content = $('#content');
  
  APP.fetchTemplate = function(template, complete) {
    $.get(template, function(data) {
      complete(_.template(data));
    });
  };

  APP.AboutView = Backbone.View.extend({
    
    template: 'templates/about.html',
    
    render: function() {
      var that = this;
      APP.fetchTemplate(this.template, function(t){
        that.$el.html(t());
      });
      return this;
    }
  });
  
  APP.ResumeView = Backbone.View.extend({
    
    template: 'templates/resume.html',
    
    initialize: function() {
      this.model.fetch();
    },
        
    render: function() {
      this.listenTo(this.model, 'change', this.render);
      var that = this;
      APP.fetchTemplate(this.template, function(t) {
        if (that.model.attributes.overview) {          
          that.$el.html(t(that.model.attributes));
        }
      });
      return this;
    }
  });
  
  APP.ProjectsView = Backbone.View.extend({
    
    template: 'templates/projects.html',
    
    initialize: function() {
      this.model.fetch();
    },
    
    render: function() {
      this.listenTo(this.model, 'change', this.render);
      console.log('rendering!');
      var that = this;
      APP.fetchTemplate(this.template, function(t) {
        if (that.model.attributes.projects) {
          that.$el.html(t(that.model.attributes));
        }
      });
      return this;
    }
  });
  
  APP.PhotographyView = Backbone.View.extend({
    
    template: 'templates/photography.html',
    
    photos: ['photography/birds.jpg', 'photography/sunset.jpg'],
    
    loadPhoto: function(index) {
      var img = $('.photo-wrapper img:eq(' + (index % this.photos.length) + ')');
      if (!img.attr('src')) {
        img.attr('src', img.data('lazySrc'));
      }
    },
        
    events: {
      'click .carousel-control.left': 'loadLeft',
      'click .carousel-control.right': 'loadRight'
    },
    
    loadLeft: function() {
      var cur = $('.carousel-inner .item.active').index('.carousel-inner .item');
      this.loadPhoto(cur-1);
    },
    
    loadRight: function() {
      var cur = $('.carousel-inner .item.active').index('.carousel-inner .item');
      this.loadPhoto(cur+1);
    },
            
    render: function() {
      var that = this;
      $('body').css('overflow-y', 'hidden');
      APP.fetchTemplate(this.template, function(t) {
        $.get('data/photos.json', function(data) {
          that.photos = data.photos;
          that.$el.html(t({"photoUrls": that.photos}));  
          $('#photo').bind('slid', function() {
            console.log('Slid!');
            that.loadLeft();
            that.loadRight();
          });
          $('.carousel-inner > .item:first-child').addClass('active');
          that.loadPhoto(0);
          that.loadPhoto(-1);
          that.loadPhoto(1);
          $('#page').animate({'max-width': '1800px'}, 'slow', function() {
            $('#photography-content').fadeToggle('slow');
            $('.carousel').carousel();
          });
          $('footer').css({'display': 'none'});
        });
      });
      return this;
    }
    
  });
  
  APP.AppView = Backbone.View.extend({
    
    el: $('#app'),
        
    restorePage: function(complete) {
      if ($('#page').css('max-width') !== '800px') {
        $('#page').animate({'max-width': '800px'}, 'slow', function() {
          $('footer').css({'display' : 'block'});
          $('body').css('overflow-y', 'scroll');
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
      var Resume = new APP.ResumeView({
                                        el: $content,
                                        model: new APP.ResumeModel()
                                      });
      this.restorePage(function() {
        Resume.render();
      });
    },
    
    projects: function() {
      var Projects = new APP.ProjectsView({
                                            el: $content,
                                            model: new APP.ProjectsModel()
                                          });
      this.restorePage(function() {
        console.log('complete!');
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