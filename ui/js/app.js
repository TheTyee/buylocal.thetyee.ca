/* App JS */
// Libraries concatenated & compressed by by jekyll-assets pipeline
//= require jquery.js
//= require modernizr.js
//= require bootstrap.js
//= require underscore.js
//= require backbone.js

window.App = {};

App.Card = Backbone.Model.extend({
    defaults: {
        "businessName": "",
        "businessLocation": "",
        "businessUrl": "",
        "loveMessage": ""
    },
    parse: function(response, options) {
        var d = response.data.letters;
        return {
            "id": d.entry_id,
            "businessName": d.business_name,
            "businessLocation": d.business_city,
            "businessUrl": d.business_url,
            "dateCreated": d.date_created,
            "loveMessage": ""
        };
    },
    urlRoot: '/api/v1/letters',
    initialize: function(){
    }
});

App.Cards = Backbone.Collection.extend({
    model: App.Card,
    url: '/api/v1/letters',
    initialize: function() {
    }
});

App.cards = new App.Cards();

App.CardView = Backbone.View.extend({
    events: {

    },
    initialize: function () {

    },
    template: _.template("<li data-card='<%= id %>' class='card'><%= dateCreated %><br /><a href='https://twitter.com/share?url=http://localhost:4000/letters/show/<%= id %>&text=Thank you, <%= businessName %>!&via=TheTyee&hashtags=bcbuylocal' target='_blank'><i class='fa fa-twitter-square fa-2x'></i></a><a href='https://www.facebook.com/dialog/send?app_id=441246329398694&name=A Buy Local Thank You to <%= businessName %>&description=test&link=http://localhost:4000/letters/show/<%= id %>&redirect_uri=http://buylocal.thetyee.ca/fbr.php' target='_blank'><i class='fa fa-facebook-square fa-2x'></i></a><a class='email-share' target='_blank' href='mailto:?subject=Buy Local&body=I thought you might like to see this! Read it at http://localhost:4000/letters/show/<%= id %>'><i class='fa fa-envelope fa-2x'></i></a><br /><a href='/letters/#show/<%= id %>'>Permalink</a><br />Dear <%= businessName %><br />...</li>"),
    render: function() {
        this.$el.html(this.template(this.model.attributes));
        return this;
    }
});

App.CardDetailView = Backbone.View.extend({
    el: '#letter',
    events: {
        "click .show-list": "showList"
    },

    initialize: function () {

    },
    template: _.template( $('#tpl_cardDetailView').html() ),
    render: function() {
        this.$el.show();
        this.$el.html(this.template(this.model.attributes));
        return this;
    },
    hide: function() {
        this.$el.hide();
    },
    showList: function() {
        App.router.navigate('#', { trigger: true } );
    }
});


App.CardsListView = Backbone.View.extend({
    collection: App.cards,
    el: '#letters',
    events: {
        "click .card": "showCard"
    },
    initialize: function () {

    },
    template: _.template("<ul class='letters'></ul>"),
    render: function () {
        this.$el.show();
        this.el.innerHTML = this.template();
        var ul = this.$el.find("ul");
        this.collection.forEach(function (card) {
            ul.append(new App.CardView({
                model: card
            }).render().el);
        });
        return this;
    },
    showCard: function(event) {
        var el = $(event.currentTarget);
        var cardId = el.data("card");
        App.router.navigate('/show/' + cardId, { trigger: true } );
    },
    hide: function() {
        this.$el.hide();
    }
});

App.router = Backbone.Router.extend({
    routes: {
        "":            "lettersList",
        "show/:id":    "letterShow"
    },
    lettersList: function() {
        console.log('Default route / Card list');
        App.cardsListView = new App.CardsListView();
        App.cardsListView.render();
        if ( App.cardDetailView ) {
            // Hide it
            App.cardDetailView.hide();
        }
    },
    letterShow: function(id) {
        var card = App.cards.get(id);
        // TODO Fix this silliness
        // If the card is accessed directly
        // it's probably not in the initial collection
        if (_.isUndefined(card) ) {
            // Thus it needs to be fetched from the server
            card = new App.Card({ "id": id });
            // Which is async, thus we need to render after we have the data
            card.fetch({
                "success": function() {
                    App.cardDetailView = new App.CardDetailView({ model: card });
                    App.cardDetailView.render();
                }
            });
        } else { // The card *is* in the collection, so just render the view
            App.cardDetailView = new App.CardDetailView({ model: card });
            App.cardDetailView.render();
        }
        if ( App.cardsListView ) {
            // Hide the list?
            App.cardsListView.hide();
        }
    }
});

$(function(){
    App.cards.fetch({ 
        "success": function(collection, response, options){ 
            App.router = new App.router();
            Backbone.history.start();
        }, 
        "error": function(error) {
            // Oh noes!

        } 
    });
});
