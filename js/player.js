function Player(number) {
    this.playerNo = number,
    this.deck = [],
    this.hand = [],
    this.active = [],
    this.discard = [],
    this.pieces = [];

    /*this.createDeck= function(player){
        $.getJSON( "js/deck_p" + player + ".json", function( data ) {
            var items = [];
            $.each( data, function( key, val ) {
            items.push( "<li id='" + key + "'>" + val + "</li>" );
            });

            $( "<ul/>", {
            "class": "card ",
            html: items.join( "" )
            }).appendTo( "body" );
        });
        this.deck = items;
    };*/

    this.createDeck = function(){
        var tempDeck = JSON.parse(eval("deck_p" + this.playerNo)); // Replace the eval statement?

        //Create cards
        for (var i = 0; i < tempDeck.length; i++){
            var newCard = new Card();
            newCard.cardName = tempDeck[i];
            
            // Find card description
            for (var j = 0; j < cards.length; j++){
                if (cards[j].name === newCard.cardName){
                    newCard.cardEffects = cards[j].effects;
                }
            }

            this.deck.push(newCard); //Add card into deck
        }

        this.deck = shuffleCards(this.deck); //Shuffle deck
    };

    this.drawCard = function(){
        if (this.deck.length > 0) {
            this.deck[0].createCard(this.playerNo); //Create visuals
            this.hand.push(this.deck[0]); //Copy from deck to hand
            this.deck.splice(0,1); //Remove from deck
        }
    };
}    
