var Backbone = require('backbone');

module.exports = Backbone.View.extend({
    tagName: 'li',

    initialize: function() {
        this.render();
        this.$status = this.$('.status');
        this.listenTo(this.model, 'change:isRunning', function(task) {
            console.log('in view handler');
            if (task.isRunning) this.$status.removeClass('ok error').addClass('running');
            else {
                if (task.isOK) this.$status.removeClass('running error').addClass('ok');
                else this.$status.removeClass('running ok').addClass('error');
            }
        });
    },

    render: function() {
        // TODO: use template
        this.$el.html('<div class="status"> <div></div> </div>');
        return this;
    }
});
