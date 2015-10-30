---
permalink: /prizes/
layout:    default
title:     Prizes
---

<section>


<div class="main-content">

{% for prize in site.data.prizes %}
	<p>{{prize.Businessname}}</p>
	<p>{{prize.Text_Short}}</p>
	<p>{{prize.Text_Long}}</p>
	<p>{{prize.Link}}</p>
	<p>{{prize.Image}}</p>
{% endfor %}

</div>
<div class="sidebar">
{% include sidebar.html %}
</div>
</section>