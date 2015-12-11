function Card() {
    this.cardName = '';
    this.cardEffects = [];
    this.cardBody = '';

    this.playCard = function(targetCard, playerNo, board){
    	window.console.log("Doing a DAMAGE effect!");
    };

    this.createCard = function(playerNo){
    	window.console.log(this);

        this.cardBody = jQuery('<div/>', {
            class: 'card drawn ' + this.cardName.toLowerCase().split(' ').join('_')
        });

        //Add Card text visuals
        jQuery('<div/>', {
            class: 'cardName',
            text: this.cardName
        }).appendTo(this.cardBody);

        jQuery('<div/>', {
            class: 'cardEffects',
            text: this.cardEffects.join([separator = '. ']) + '.'
        }).appendTo(this.cardBody);

        //Closure - add card interaction
        var targetCard = this;
        $(this.cardBody[0]).click(function(){
            targetCard.playCard(targetCard, playerNo, b);
        });

        window.console.log(this.cardBody);
        window.console.log($('.p' + playerNo + '-hand:first'));
        $('.p' + playerNo + '-hand:first').append(this.cardBody);

        $("p").append("<strong>Hello</strong>");
        $(".center").append("<strong>Hello</strong>");
        $(".p1-hand").append("<strong>Hello</strong>");

         window.console.log($(".center"));
    };

}
    