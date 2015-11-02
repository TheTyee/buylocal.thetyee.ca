---
permalink: /prizes/
layout:    default
title:     Prizes
---

<section class="prize-list">


<div class="main short-prize-description">
<h2 class="heading">Prizes</h2>
{% for prize in site.data.prizes %}
	<img src = "{{prize.Image}}" />
	<p><a href="{{prize.Link}}">{{prize.Businessname}}</a></p>
	<p>{{prize.Text_Short}}</p>
	<p>{{prize.Text_Long}}</p>
	<p>{{prize.Link}}</p>
	
{% endfor %}

</div>
<div class="sidebar">
{% include sidebar.html %}
</div>
</section>