var Backbone = require('backbone');
var _ = require('underscore');

module.exports = Backbone.View.extend({
    tagName: 'li',
    template: _.template(
        '<div class="status"> <div></div> </div> <div><h1><%= name %></h1></div>'
    ),

    initialize: function() {
        this.render();
        this.$status = this.$('.status');

        this.listenTo(this.model, 'change:isRunning', this.updateStatus.bind(this));
    },

    updateStatus: function(task) {
        if (task.isRunning) this.$status.removeClass('ok error').addClass('running');
        else {
            if (task.isOK) this.$status.removeClass('running error').addClass('ok');
            else this.$status.removeClass('running ok').addClass('error');
        }
    },

    render: function() {
        this.$el.html(this.template(this.model));
        return this;
    }
});
