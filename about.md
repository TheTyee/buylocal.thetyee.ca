---
permalink: /about/
layout:    default
title:     About
---



<script>
  $.doctop({
    url: 'https://docs.google.com/document/d/10nWbn3ZCkaVPSaNZw00IRPKVlPHxKhjJGpEmddtYFVo/pub',
    archieml: true,
    cache: false,
    preserveFormatting: true,
    callback: function(d){
      //  console.log(d.copy);
        view = d.copy;
        allcontent= '';
        //concantenate all the content so I don;t have to deal with it on a line by line basis.
        for (var key in view) {
		  if (view.hasOwnProperty(key)) {
		    //console.log(key + " -> " + view[key]);
		    allcontent += view[key]; 
		  }
		}
		console.log(allcontent);
        //console.log(view);
        //template = $('#template').html();
        //Mustache.parse(template);   // optional, speeds up future uses
        //rendered = Mustache.render(template, view);
        $('#about-copy').html(allcontent);
    }
  });
</script>



<script id="template" type="x-tmpl-mustache">

{% raw %}
<dl>

<h3>{{{hed}}}</h3>
<p>{{{content}}}</p>

</dl>
{% endraw %}
</script>

<section id="about-copy" class="about"></section>