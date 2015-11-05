---
permalink: /prizes/
layout:    default
title:     Prizes
---

<section>

<article>
<div id="prizes" class="main">
<h2 class="heading">Prizes</h2>
{% for prize in site.data.prizes %}
<div class="single-prize">
	<img src = "{{prize.Image}}" />
	<h3><strong>{{prize.Text_Short}}</strong> from <a href="{{prize.Link}}">{{prize.Businessname}}</a></h3>
	<p>{{prize.Text_Long}}</p>
	</div>
{% endfor %}

</div>
<div class="sidebar">
{% include sidebar.html %}
</div>
</article>
</section>