<div class="status">
    <div></div>
</div>

<div>
    <span class="timestamp">
        {% if runtime %} {{ runtime }}s {% endif %}
        {{ timestamp }}
    </span>
    <h1>{{ task.name|default(task.command) }}</h1>
    <div class="metadata">
        {% if err.outputType %}
            <span class="outputType">{{ err.outputType }}</span>
        {% endif %}
        {% if err.code %}
            <span class="returnCode">– return code {{ err.code }}</span>
        {% endif %}
    </div>
</div>
<div class="errorMsg">{{ err.msg }}</div>
