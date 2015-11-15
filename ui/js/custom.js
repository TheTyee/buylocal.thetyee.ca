$(document).ready(function(){

    //generate letters on the home page, without any backbone bells and whistles

    $.getJSON( App.apiUrl + '/api/v1/letters', function(data) {


        for (i=0;i<3;++i){	
            indexLetters = data.data.letters[i];
            //console.log(indexLetters);
            html = "<article data-card='"+ indexLetters.entry_id +"' class='card'>";
            html += "<header><p class='dateCreated'>"+indexLetters.date_created+"</p>";
            html +="<a href='https://twitter.com/share?url=http://"+window.apiUrl+"/letters/show/<%= id %>&text=Thank you, "+ indexLetters.business_name+"!&via=TheTyee&hashtags=bcbuylocal ' target='_blank'><i class='fa fa-twitter-square fa-2x'></i></a>";
            html += "<a href='https://www.facebook.com/dialog/send?app_id=441246329398694&name=A Buy Local Thank You to "+ indexLetters.business_name+"&description=test&link=http://"+window.apiUrl+"/letters/show/"+ indexLetters.entry_id +"&redirect_uri=http://buylocal.thetyee.ca/fbr.php' target='_blank'><i class='fa fa-facebook-square fa-2x'></i></a>";
            html += "<a class='email-share' target='_blank' href='mailto:?subject=Buy Local&body=I thought you might like to see this! Read it at http://"+window.apiUrl+"/letters/show/"+ indexLetters.entry_id +"'><i class='fa fa-envelope fa-2x'></i></a></header>";
            html += "<p class='businessName'>Dear "+ indexLetters.business_name+",</p>";
            html += "<p class='loveMessage'>"+indexLetters.letter_text+"</p>";
            html += "<p class='submitterName'>- "+indexLetters.first_name+"</p>";
            html += "<footer><p class='permalink'><small><a href='/letters/#show/"+indexLetters.entry_id+"'>Permalink</a></small></p>";
            html += "</footer></article>";

            $('.index-letter-'+i).html(html);

        }

    });

    //Initialize footer content through tabletop
    var footer_content = 'https://docs.google.com/spreadsheets/d/1OHdC2tYZz--Q3ksP2qk8AzBd8jSNp8qSElsBB3sCsGY/pubhtml';

    function footer_init() {
        var tabletop = Tabletop.init({ 
            key: footer_content, 
            callback: footer_showInfo 
        });
    }

    function footer_showInfo(data, tabletop) {

        all_partners = data.Sheet1.elements;

        $.each(all_partners, function(key, value){
            var template;
            var each_rendered;
            var view;
            view = value;
            template = $('#footer_template').html();
            each_rendered = Mustache.render(template, view);
            //console.log(template);
            $('#footer').append(each_rendered);
        });
    }

    footer_init();

});
