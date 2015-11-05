---
permalink: /about/
layout:    default
title:     About
---



<script>
  $.doctop({
    url: 'https://docs.google.com/document/d/1Azy7Aoi6-899S8SLAnGndM3R2Pt7lnMHdUmNzHcEXhc/pub',
    archieml: true,
    cache: false,
    callback: function(d){
        console.log(d.copy.archie);
        view = d.copy.archie;
        console.log(d.copy.archie);
        view.content = d.copy.archie.content.replace(/(\r\n|\n|\r)/gm, "<br />");
        template = $('#template').html();
        Mustache.parse(template);   // optional, speeds up future uses
        rendered = Mustache.render(template, view);
        $('#about-copy').html(rendered);
    }
  });
</script>



<script id="template" type="x-tmpl-mustache">

{% raw %}
<dl>

<h2 class="heading">{{{hed}}}</h2>
<p>{{{content}}}</p>

</dl>
{% endraw %}
</script>
<section>
    <article>
    <div id="about-copy" class="main"></div>
    <div class="sidebar">
        {% include sidebar.html %}
    </div>
</article>
</section>