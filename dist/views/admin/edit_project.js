(function() {
  define(['text!templates/admin/edit_project.html', 'text!templates/admin/edit_image.html', 'text!templates/admin/edit_paragraph.html', 'views/load_indicator', 'parse', 'backbone'], function(template, edit_image_template, edit_paragraph_template) {
    return Backbone.View.extend({
      name: 'Project Editor',
      className: 'admin-edit-project',
      tagName: 'main',
      mode: new Backbone.Model,
      contents: new Backbone.Model({
        images: [],
        paragraphs: []
      }),
      content_id: null,
      initialize: function() {
        var dat;
        window.dat = this;
        window.contents = this.contents;
        dat = this;
        this.model.on('change:charities', function() {
          if (!!dat.project_id) {
            dat.edit(dat.project_id);
          }
          return dat.render();
        });
        this.model.on('change:projects', function() {
          if (!!dat.project_id) {
            dat.edit(dat.project_id);
          }
          return dat.render();
        });
        this.contents.on('change:images', function(model) {
          dat.computeSorted();
          return dat.render();
        });
        this.contents.on('change:paragraphs', function(model) {
          dat.computeSorted();
          return dat.render();
        });
        return this.computeSorted();
      },
      computeSorted: function() {
        var images, paragraphs, sorted;
        sorted = [];
        if (!!this.contents.get('images')) {
          images = _.map(this.contents.get('images'), function(image) {
            return {
              type: "Image",
              content: image
            };
          });
          sorted = sorted.concat(images);
        }
        if (!!this.contents.get('paragraphs')) {
          paragraphs = _.map(this.contents.get('paragraphs'), function(paragraph) {
            return {
              type: "Paragraph",
              content: paragraph
            };
          });
          sorted = sorted.concat(paragraphs);
        }
        sorted = sorted.sort(function(a, b) {
          return a.content.get('index') - b.content.get('index');
        });
        this.contents.set('sorted', sorted);
        return window.sorted = this.contents.get('sorted');
      },
      edit: function(id) {
        var dat;
        this.project_id = id;
        if (id === null) {
          return this.initProject();
        } else {
          dat = this;
          _.each(this.model.get('projects'), function(project) {
            if (project.id === id) {
              return dat.project = project;
            }
          });
          if (this.project_id !== this.content_id) {
            return this.queryContent();
          }
        }
      },
      initProject: function(n) {
        var Project;
        if (!!n || !this.newProject) {
          Project = Parse.Object.extend("Project");
          this.newProject = new Project();
          this.newProject.setACL(this.model.get('modelACL'));
        }
        return this.project = this.newProject;
      },
      queryContent: function() {
        var dat;
        if (!this.project) {
          return;
        }
        this.content_id = this.project_id;
        this.contents.set('sorted', null);
        this.contents.set('images', null);
        this.contents.set('paragraphs', null);
        dat = this;
        if (!!this.project && !!this.project.relation('paragraphs')) {
          this.project.relation('paragraphs').query().find({
            success: function(list) {
              return dat.contents.set('paragraphs', list);
            }
          });
        }
        if (!!this.project && !!this.project.relation('images')) {
          return this.project.relation('images').query().find({
            success: function(list) {
              return dat.contents.set('images', list);
            }
          });
        }
      },
      render: function() {
        if (!!this.project) {
          window.project = this.project;
          if (!this.project.id) {
            this.initProject();
          }
          this.$el.html(_.template(template)({
            project: this.project,
            charities: this.model.get('charities'),
            contents: this.contents.get('sorted'),
            edit_image_template: edit_image_template,
            edit_paragraph_template: edit_paragraph_template
          }));
        }
        return this;
      },
      updateSortIndicies: function() {
        return _.each(this.contents.get('sorted'), function(model, index) {
          if (model.content.get('index') !== index) {
            model.content.set('index', index);
            return model.content.save();
          }
        });
      },
      events: {
        'click .expand-button': 'toggleExpand',
        'submit .js-update-project': 'saveProject',
        'click .js-delete-project': 'deleteProject',
        'click .js-add-image': 'addImage',
        'click .js-add-paragraph': 'addParagraph',
        'submit .js-edit-image': 'saveImage',
        'click .js-delete-image': 'deleteImage',
        'submit .js-edit-paragraph': 'saveParagraph',
        'click .js-delete-paragraph': 'deleteParagraph'
      },
      toggleExpand: function(e) {
        return $(e.target).closest('.edit-section').toggleClass('collapsed');
      },
      saveProject: function(e) {
        var dat, isNewProject;
        e.preventDefault();
        isNewProject = !this.project.id;
        this.setProjectAttributes();
        dat = this;
        window.loader.start();
        return this.project.save(null, {
          success: function(project) {
            var imagesRelation, paragraphsRelation;
            console.log('New object created with objectId: ' + project.id);
            if (isNewProject) {
              dat.model.get('projects').push(project);
              Backbone.history.navigate('projects/' + project.id + '/edit');
              imagesRelation = project.relation('images');
              _.each(dat.contents.get('images'), function(model) {
                console.log(model);
                return model.save({
                  success: function(image) {
                    console.log({
                      model: model,
                      project: project
                    });
                    return imagesRelation.add(image);
                  },
                  error: function(image, error) {
                    return console.log('Failed to create new object, with error code: ' + error.message);
                  }
                });
              });
              paragraphsRelation = project.relation('paragraphs');
              _.each(dat.contents.get('paragraphs'), function(model) {
                return model.save({
                  success: function(paragraph) {
                    return paragraphsRelation.add(paragraph);
                  },
                  error: function(paragraph, error) {
                    return console.log('Failed to create new object, with error code: ' + error.message);
                  }
                });
              });
              return project.save({
                success: function() {
                  return window.loader.end();
                },
                error: function() {
                  window.loader.end();
                  return console.log('Failed to create new object, with error code: ' + error.message);
                }
              });
            } else {
              dat.model.trigger('change:projects');
              return window.loader.end();
            }
          },
          error: function(project, error) {
            console.log('Failed to create new object, with error code: ' + error.message);
            return window.loader.end();
          }
        });
      },
      setProjectAttributes: function() {
        this.project.set('charity', this.findCharityById($('select[name="project[charity_id]"]').val()));
        this.project.set('name', $('input[name="project[name]"]').val());
        this.project.set('card_image', $('input[name="project[card_image]"]').val());
        this.project.set('card_desc', $('textarea[name="project[card_desc]"]').val());
        this.project.set('page_image', $('input[name="project[page_image]"]').val());
        return this.project.set('page_desc', $('textarea[name="project[page_desc]"]').val());
      },
      findCharityById: function(id) {
        var result;
        result = null;
        _.each(this.model.get('charities'), function(charity) {
          if (id === charity.id) {
            return result = charity;
          }
        });
        return result;
      },
      deleteProject: function() {
        var dat;
        if (confirm("Are you sure you want to this project?")) {
          window.loader.start();
          dat = this;
          return this.project.destroy({
            success: function(project) {
              var project_index;
              console.log('Successfully deleted Object with id ' + project.id);
              project_index = null;
              _.each(dat.model.get('projects'), function(saved_project, index) {
                if (saved_project.id === project.id) {
                  return project_index = index;
                }
              });
              dat.model.get('projects').splice(project_index, 1);
              Backbone.history.navigate('#/');
              return window.loader.end();
            },
            error: function(project, error) {
              console.error("Error: " + error.code + " " + error.message);
              return window.loader.end();
            }
          });
        }
      },
      addImage: function() {
        var Image, dat, image;
        Image = Parse.Object.extend('Image');
        image = new Image;
        image.set('index', this.contents.get('sorted').length);
        if (!!this.project.id) {
          dat = this;
          window.loader.start();
          return image.save(null, {
            success: function(image) {
              dat.project.relation('images').add(image);
              return dat.project.save(null, {
                success: function() {
                  dat.contents.get('images').push(image);
                  dat.computeSorted();
                  window.loader.end();
                  return dat.render();
                },
                error: function(project, error) {
                  console.error("Error: " + error.code + " " + error.message);
                  return window.loader.end();
                }
              });
            },
            error: function(image, error) {
              console.error("Error: " + error.code + " " + error.message);
              return window.loader.end();
            }
          });
        } else {
          this.contents.get('images').push(image);
          this.computeSorted();
          return this.render();
        }
      },
      addParagraph: function() {
        var Paragraph, dat, paragraph;
        Paragraph = Parse.Object.extend('Paragraph');
        paragraph = new Paragraph;
        paragraph.set('index', this.contents.get('sorted').length);
        if (!!this.project.id) {
          dat = this;
          window.loader.start();
          return paragraph.save(null, {
            success: function(paragraph) {
              dat.project.relation('paragraphs').add(paragraph);
              return dat.project.save(null, {
                success: function() {
                  dat.contents.get('paragraphs').push(paragraph);
                  dat.computeSorted();
                  window.loader.end();
                  return dat.render();
                },
                error: function(project, error) {
                  console.error("Error: " + error.code + " " + error.message);
                  return window.loader.end();
                }
              });
            },
            error: function(paragraph, error) {
              console.error("Error: " + error.code + " " + error.message);
              return window.loader.end();
            }
          });
        } else {
          this.contents.get('paragraphs').push(paragraph);
          this.computeSorted();
          return this.render();
        }
      },
      saveImage: function(e) {
        var $form, dat, image;
        e.preventDefault();
        if (!this.project.id) {
          alert('Save the Project first to save an Image');
          return;
        }
        $form = $(e.target).closest('.js-edit-image');
        image = this.findImageById($(e.target).closest('.edit-content').data('id'));
        this.setImageAttributes(image, $form);
        dat = this;
        window.loader.start();
        return image.save(null, {
          success: function(image) {
            console.log('New object created with objectId: ' + image.id);
            return window.loader.end();
          },
          error: function(image, error) {
            console.log('Failed to create new object, with error code: ' + error.message);
            return window.loader.end();
          }
        });
      },
      deleteImage: function(e) {
        var image;
        if (!this.project.id) {
          return;
        }
        image = this.findImageById($(e.target).closest('.edit-content').data('id'));
        return this.deleteModel('Image', image);
      },
      findImageById: function(id) {
        var result;
        result = null;
        _.each(this.contents.get('images'), function(image) {
          if (id === image.id) {
            return result = image;
          }
        });
        return result;
      },
      setImageAttributes: function(image, $form) {
        image.set('source', $form.find('input[name="source"] ').val());
        image.set('caption', $form.find('input[name="caption"] ').val());
        return image.set('shareable', $form.find('input[name="shareable"] ')[0].checked);
      },
      saveParagraph: function(e) {
        var $form, dat, paragraph;
        e.preventDefault();
        if (!this.project.id) {
          alert('Save the Project first to save an Paragraph');
          return;
        }
        $form = $(e.target).closest('.js-edit-paragraph');
        paragraph = this.findParagraphById($(e.target).closest('.edit-content').data('id'));
        this.setParagraphAttributes(paragraph, $form);
        dat = this;
        window.loader.start();
        return paragraph.save(null, {
          success: function(paragraph) {
            console.log('New object created with objectId: ' + paragraph.id);
            return window.loader.end();
          },
          error: function(paragraph, error) {
            console.log('Failed to create new object, with error code: ' + error.message);
            return window.loader.end();
          }
        });
      },
      deleteParagraph: function(e) {
        var paragraph;
        if (!this.project.id) {
          return;
        }
        paragraph = this.findParagraphById($(e.target).closest('.edit-content').data('id'));
        return this.deleteModel('Paragraph', paragraph);
      },
      findParagraphById: function(id) {
        var result;
        result = null;
        _.each(this.contents.get('paragraphs'), function(paragraph) {
          if (id === paragraph.id) {
            return result = paragraph;
          }
        });
        return result;
      },
      setParagraphAttributes: function(paragraph, $form) {
        paragraph.set('text', $form.find('textarea[name="text"] ').val());
        return paragraph.set('shareable', $form.find('input[name="shareable"] ')[0].checked);
      },
      deleteModel: function(type, model) {
        var dat;
        if (confirm('Deleting ' + type + '. Are you sure?')) {
          dat = this;
          window.loader.start();
          return model.destroy({
            success: function(model) {
              var index, relation;
              relation = dat.contents.get(type.toLowerCase() + 's');
              index = relation.indexOf(model);
              relation.splice(index, 1);
              dat.computeSorted();
              window.loader.end();
              dat.render();
              return dat.updateSortIndicies();
            },
            error: function(model, error) {
              return console.error('Failed to destroy new object, with error code: ' + error.message);
            }
          });
        }
      }
    });
  });

}).call(this);
