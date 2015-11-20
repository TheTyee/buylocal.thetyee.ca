/* App JS */
// Libraries concatenated & compressed by by jekyll-assets pipeline
//= require jquery.js
//= require modernizr.js
//= require bootstrap.js
//= require underscore.js
//= require backbone.js
//= require backbone.paginator.js


// ===================================================================
// Utilities
// ===================================================================

App.updateMeta = function(model) {

    var title = model.get('businessName');
   // var place = model.get('businessLocation');
    //var image = model.get('image');
    var path  = model.get('id');
    var domain = 'https://develop.buylocal.thetyee.ca/letters/#!/show/';
    var url = domain + path
    //var url =  domain + path;

        $('title').remove();
        $('meta[property="og:title"]').remove();
        $('meta[property="DC.title"]').remove();
        $('meta[property="description"]').remove();
        $('meta[property="DC.description"]').remove();
        $('meta[property="og:description"]').remove();
        $('meta[property="og:image"]').remove();
        $('meta[property="og:image:url"]').remove();
        $('meta[property="og:url"]').remove();
        $("head").append('<title>' + title + '</title>');
        $("head").append('<meta property="og:title" content="Check out my holiday greeting to ' + title + '!">');
        $("head").append('<meta property="og:description" content="Read my holiday greeting for ' + title + ' and complete your own for a chance to win.">');
        $("head").append('<meta property="og:url" content=" ' + url + '">');

    
};

// ===================================================================
// Business List
// ===================================================================


App.Business = Backbone.Model.extend({
    defaults: {
        "businessName": "",
        "businessLocation": "",
        "businessUrl": ""
    },
    initialize: function(){
    },
    parse: function(response, options) {
        var d = response;

        return {
            "businessName": d.business_name,
            "businessLocation": d.business_city,
            "businessUrl": d.business_url
        };
    },
});
App.Businesses = Backbone.Collection.extend({
    model: App.Business,
    url: App.apiUrl + '/api/v1/businesses',
    parse: function(response, options) {
        return response.data.businesses;
    }

});
App.businesses = new App.Businesses();

App.BusinessView = Backbone.View.extend({
    template: _.template( $('#tpl_businessView').html() ),
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

App.BusinessesListView = Backbone.View.extend({
    collection: App.businesses,
    el: '#business-listing',
    events: {
    },
    initialize: function () {
        this.listenTo(this.collection, 'update reset', this.render);
    },
    template: _.template( $('#tpl_businessListView').html() ),
    render: function () {
        this.el.innerHTML = this.template();
        var target = this.$el.find(".businesses");
        this.collection.forEach(function (business, index) {
            target.append(new App.BusinessView({
                model: business
            }).render().el);
        }, this);
        return this;
    }
});

// ===================================================================
// Promo Cards
// ===================================================================

App.Promo = Backbone.Model.extend({
    defaults: {
        "Badge": "",
        "Business": "",
        "Image": "",
        "Link": "",
        "Text": "",
        "Twitter": ""
    },
    initialize: function(){

    }
});

App.Promos = Backbone.Collection.extend({
    model: App.Promo
});

App.promos = new App.Promos();

App.PromoView = Backbone.View.extend({
    tagName: 'section',
    events: {

    },
    initialize: function () {

    },
    template: _.template( $('#tpl_promoView').html() ),
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

// ===================================================================
// Business Letter Cards
// ===================================================================

App.Card = Backbone.Model.extend({
    defaults: {
        "businessName": "",
        "businessLocation": "",
        "businessUrl": "",
        "loveMessage": "",
        "submitterName": ""
   
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
            "loveMessage": d.letter_text,
            "submitterName": d.first_name,
            "momentDate": ''
        };
    },
    urlRoot: App.apiUrl + '/api/v1/letters',
    initialize: function(){
            //Date delivered is not ISO time and therefore compatible with moment. Set it so we can format it.
            var rawDate = this.get('dateCreated');
            //Trim string to just what I need
            rawDate = rawDate.split(' ', 1);
            //Specify formatting
            var date = moment(rawDate[0]).format("MMMM D, YYYY");            
            //put back what I want.
            this.set('momentDate', date );
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
        pageSize: 18
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
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

App.CardDetailView = Backbone.View.extend({
    el: '#letter',
    events: {
        "click .show-list": "showList"
    },

    initialize: function (options) {

        //console.log(options.model.attributes.businessName);
        //when you get a card, write the meta tags
        var model = options.model
      //  console.log(model);
       // console.log(model.get('businessName'));
        App.updateMeta(model);
        


    },

    template: _.template( $('#tpl_cardDetailView').html() ),
    render: function() {
        this.$el.show();
        this.$el.html(this.template(this.model.toJSON()));
        return this;

    },
    hide: function() {
        this.$el.hide();
    },
    showList: function(card) {
        App.router.navigate('#', { trigger: true } );
    },


});


App.CardsListView = Backbone.View.extend({
    collection: App.cards,
    el: '#letters',
    events: {
        "click .card": "showCard",
        "click li.next": function() { App.cards.getNextPage(); },
        "click li.previous": function() { App.cards.getPreviousPage(); },
        "click li.first": function() { App.cards.getFirstPage(); },
        "click li.last": function() { App.cards.getLastPage(); },
    },
    initialize: function () {
        this.listenTo(this.collection, 'update reset', this.render);
        this.listenTo(App.promos, 'reset', this.render);
        this.on('render', this.afterRender());
    },
    template: _.template( $('#tpl_cardListView').html() ),
    render: function () {
        this.$el.show();
        this.el.innerHTML = this.template();
        var target = this.$el.find(".letters");
        var count = 0;
        this.collection.forEach(function (card, index) {
            target.append(new App.CardView({
                model: card
            }).render().el);
            // TODO
            // This could be re-written
            // Basically, it adds a promo view after every 6th element
            count++;
            if ( count === 6 && App.promos.length > 0 ) { // Only if there are promos
                var promo = App.promos.shift();
                target.append( new App.PromoView({
                    model: promo
                }).render().el);
                // Put the promo back for an infinite list
                App.promos.push(promo);
                count = 0;
            }
        }, this);
        return this;
    },
    afterRender: function() {
        // Not used, but useful! :-)
    },
    showCard: function(event) {
        var el = $(event.currentTarget);
        var cardId = el.data("card");
        App.router.navigate('/!/show/' + cardId, { trigger: true } );
    },
    hide: function() {
        this.$el.hide();
    }
});

// ===================================================================
// Router
// ===================================================================



App.router = Backbone.Router.extend({
    routes: {
        "":            "showList",
        "!/show/:id":    "letterShow"
    },
    showList: function() {
        // For now, only run this function if we're on the /letters page
        var path = window.location.pathname.replace(/[\\\/][^\\\/]*$/, '');
        if ( path == '/letters') {
            console.log('Default route / Card list');
            App.cardsListView = new App.CardsListView();
            App.cardsListView.render();
            if ( App.cardDetailView ) {
                // Hide it
                App.cardDetailView.hide();
            }
        } else if ( path == '/businesses' ) { 
            console.log('Default route / Business list');
            App.businessesListView = new App.BusinessesListView();
            App.businessesListView.render();
        } else { return; }
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

// ===================================================================
// Render the app
// ===================================================================

$(function(){
    Tabletop.init({ 
        key: App.promosUrl, 
        callback: function(data, tabletop) {
        var promoCards = data.Sheet1.elements;
        // Randomize the promos
        promoCards     = _.shuffle(promoCards);
        // Add all the promos at once to a collection
        // & fire the reset event, which re-renders the CardsListView
        App.promos.reset(promoCards);
        var frontPromoModel = App.promos.shift();
        var frontPromo = new App.PromoView({ model: frontPromoModel });
        var frontPromoHTML = frontPromo.render().el;
        $('#vancity-promo').append( frontPromoHTML );
        }
    });
    App.cards.fetch({
        "success": function(collection, response, options){
            App.router = new App.router();
            Backbone.history.start();
        },
        "error": function(error) {
            // Oh noes!

        }
    });
    App.businesses.fetch();
});
