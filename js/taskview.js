var fs = require('fs');
var Backbone = require('backbone');
var swig = require('swig');

var templatePath = require('path').resolve(__dirname, 'taskview.swig');
var template = swig.compile(fs.readFileSync(templatePath, 'utf8'));

module.exports = Backbone.View.extend({
    tagName: 'li',
    template: template,

    initialize: function() {
        this.listenTo(this.model, 'change:isRunning', this.render.bind(this));
        this.render(this.model);
    },

    render: function(task) {
        var errObj = !task.isOK && task.lastError;
        var timestamp = '';
        if (task.lastRunAt instanceof Date) {
            timestamp = '@' + task.lastRunAt.toTimeString().replace(/ .+/, '');
            this.$('.timestamp').html(timestamp);
        }

        if (task.isRunning) this.$el.removeClass('ok error').addClass('running');
        else {
            if (task.isOK) this.$el.removeClass('running error').addClass('ok');
            else this.$el.removeClass('running ok').addClass('error');

            this.trigger('changeStatus');

            var ctx = {
                task: this.model,
                err: errObj,
                timestamp: timestamp,
                runtime: this.model.lastRunDuration && (this.model.lastRunDuration / 1000).toFixed(2)
            };
            this.$el.html(this.template(ctx));
        }
    }
});
