---
permalink: /readers-cards/
layout:    default
title:     Readers' Cards
---

<section>
<div class="button-wrapper">
Sort Cards: <button>Alphabetically</button> | <button>By Date</button>
</div>

<div class="main-content">

{% for contest in site.data.contests %}
{% include business_card.html%}
{% endfor %}

</div>
<div class="sidebar">
{% include sidebar.html %}
</div>
</section>