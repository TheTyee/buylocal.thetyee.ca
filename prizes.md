---
permalink: /prizes/
layout:    default
title:     Prizes
---

<section>

<article>
<div id="prizes" class="main">
<h2 class="heading">Prizes</h2>
	 {% for row in site.data.google_sheet offset: 1%}
    	{% assign counter = 0 %}
      	{% for col in row %}
		
      			{% assign handle = counter %}

      			{% case handle %}
		  		{% when 0 %}
		   			{% assign bizname = col %}
		   			{% assign counter = counter |plus: 1 %}
				{% when 1 %}
		  			{% assign textshort = col %}
		  			{% assign counter = counter |plus: 1 %}
				{% when 2 %}
		   			{% assign textlong = col %}
		   			{% assign counter = counter |plus: 1 %}
		  		{% when 3 %}
		   			{% assign link = col %}
		   			{% assign counter = counter |plus: 1 %}
		     	{% when 4 %}
		  			{% assign image = col %}
		  			{% assign counter = counter |plus: 1 %}
						<div class="single-prize">
						{% if image == '' %}
							<img src="{{site.url}}/ui/img/image-soon.png"/>
						{% else %}
							<img src="{{site.url}}/ui/img/{{ image }}"/>	
						{% endif %}
						
						
						<a href="{{link}}">
							<h4>{{textshort}}</h4> 
						</a>
						<p>{{textlong}}</p>
						</div>
		  		{% else %}
				{% endcase %}
      		{% endfor %}
      {% endfor %}

</div>

<div class="sidebar">
{% include sidebar.html %}
</div>
</article>
</section>

