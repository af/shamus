var Backbone = require('backbone');
var swig = require('swig');

module.exports = Backbone.View.extend({
    tagName: 'li',
    template: swig.compile(
        '<div class="status"> <div></div> </div>' +
        '<div>' +
            '<span class="timestamp">{{ timestamp }}</span>' +
            '<h1>{{ task.name }}</h1>' +
            '<div class="metadata">' +
                '{% if err.outputType %} <span class="outputType">{{ err.outputType }}</span>{% endif %}' +
                '{% if err.code %} <span class="returnCode">return code {{ err.code }}</span> {% endif %}' +
            '</div>' +
        '</div>' +
        '<div class="errorMsg">{{ err.msg }}</div>'
    ),

    initialize: function() {
        this.listenTo(this.model, 'change:isRunning', this.render.bind(this));
    },

    render: function(task) {
        var errObj = !task.isOK && task.lastError;
        var timestamp = null;
        if (task.lastRunAt instanceof Date) {
            timestamp = '@' + task.lastRunAt.toTimeString().replace(/ .+/, '');
            this.$('.timestamp').html(timestamp);
        }

        if (task.isRunning) this.$el.removeClass('ok error').addClass('running');
        else {
            if (task.isOK) this.$el.removeClass('running error').addClass('ok');
            else this.$el.removeClass('running ok').addClass('error');

            this.trigger('changeStatus');

            var ctx = { task: this.model, err: errObj, timestamp: timestamp };
            this.$el.html(this.template(ctx));
        }
    }
});
