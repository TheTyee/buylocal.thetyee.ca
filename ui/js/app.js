/* App JS */
// Libraries concatenated & compressed by by jekyll-assets pipeline
//= require jquery.js
//= require modernizr.js
//= require bootstrap.js
//= require underscore.js
//= require backbone.js
//= require backbone.paginator.js

App.Card = Backbone.Model.extend({
    defaults: {
        "businessName": "",
        "businessLocation": "",
        "businessUrl": "",
        "loveMessage": ""
    },
    parse: function(response, options) {
        // TODO response parsing is kinda' borked
        // and it would be good to fix it.
        var d;
        if (        _.isUndefined(response.data) ) {
            d = response;
        } else {
            d = response.data.letters;
        }
        return {
            "id": d.entry_id,
            "businessName": d.business_name,
            "businessLocation": d.business_city,
            "businessUrl": d.business_url,
            "dateCreated": d.date_created,
            "loveMessage": d.letter_text
        };
    },
    urlRoot: App.apiUrl + '/api/v1/letters',
    initialize: function(){
    }
});

App.Cards = Backbone.PageableCollection.extend({
    model: App.Card,
    url: App.apiUrl + '/api/v1/letters',
    parse: function(response, options) {
      return response.data.letters;
    },
    initialize: function() {
    },
    // Any `state` or `queryParam` you override in a subclass will be merged with
  // the defaults in `Backbone.PageableCollection` 's prototype.
  state: {

    // You can use 0-based or 1-based indices, the default is 1-based.
    // You can set to 0-based by setting ``firstPage`` to 0.
    firstPage: 1,

    // Set this to the initial page index if different from `firstPage`. Can
    // also be 0-based or 1-based.
    currentPage: 1,

    // Required under server-mode
    totalRecords: 200,
    pageSize: 20
  },

  // You can configure the mapping from a `Backbone.PageableCollection#state`
  // key to the query string parameters accepted by your server API.
  queryParams: {

    // `Backbone.PageableCollection#queryParams` converts to ruby's
    // will_paginate keys by default.
    currentPage: "page",
    pageSize: "limit"
  }
});

App.cards = new App.Cards();

App.CardView = Backbone.View.extend({
    events: {

    },
    initialize: function () {

    },
    template: _.template( $('#tpl_cardView').html() ),
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
        "click .card": "showCard",
        "click li.next": function() { App.cards.getNextPage(); },
        "click li.previous": function() { App.cards.getPreviousPage(); },
        "click li.first": function() { App.cards.getFirstPage(); },
        "click li.last": function() { App.cards.getLastPage(); }
    },
    initialize: function () {
        this.listenTo(this.collection, 'update reset', this.render);
    },
    template: _.template( $('#tpl_cardListView').html() ),
    render: function () {
        this.$el.show();
        this.el.innerHTML = this.template();
        var ul = this.$el.find("ul.letters");
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
        console.log('Card detail');
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

