var Backbone = require('backbone');
var swig = require('swig');

module.exports = Backbone.View.extend({
    tagName: 'li',
    template: swig.compile(
        '<div class="status"> <div></div> </div>' +
        '<div>' +
            '<h1>{{ name }}</h1>' +
            '<span class="timestamp"></span>' +
        '</div>' +
        '<div class="errorMsg"></div>'
    ),
    errorTemplate: swig.compile(
        '<div class="metadata">' +
            '{% if err.outputType %} <b class="outputType">{{ err.outputType }}</b>{% endif %}' +
            '{% if err.code %} <b class="returnCode">return code: {{ err.code }}</b> {% endif %}' +
        '</div>' +
        '{{ err.msg }}'
    ),

    initialize: function() {
        this.render();
        this.$error = this.$('.errorMsg');

        this.listenTo(this.model, 'change:isRunning', this.updateStatus.bind(this));
        this.listenTo(this.model, 'error', this.showError.bind(this));
    },

    showError: function(task, errObj) {
        this.$el.addClass('hasError');
        this.$error.html(errObj.msg);
        this.$error.html(this.errorTemplate({ err: errObj }));
    },

    updateStatus: function(task) {
        if (task.lastRunAt instanceof Date) {
            var timestamp = '@' + task.lastRunAt.toTimeString().replace(/ .+/, '');
            this.$('.timestamp').html(timestamp);
        }

        if (task.isRunning) this.$el.removeClass('ok error').addClass('running');
        else {
            if (task.isOK) {
                this.$el.removeClass('hasError');
                this.$el.removeClass('running error').addClass('ok');
                this.$error.html('');
            } else this.$el.removeClass('running ok').addClass('error');
            this.trigger('changeStatus');
        }
    },

    render: function() {
        this.$el.html(this.template(this.model));
        return this;
    }
});
