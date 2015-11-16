$(function(){

    var startHandSize = 3,
        maxHandSize = 10;

    // Array shuffle function
    function shuffle(o){
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        
        return o;
    }

    // Card object definition
    function Card() {
        this.cardName = '';
        this.cardEffects = [];
        this.cardImage = '';
        this.cardBody = '';

        //Activates card's effects
        this.playCard = function(targetCard, playerNo, board){
            window.console.log($(this));

            //Regex
            var deal = new RegExp("deal", "i"),
                destroy = new RegExp("destroy", "i"),
                draw = new RegExp("draw", "i"),
                one = new RegExp("a|1", "i"),
                targetSelf = new RegExp("your", "i");
                //= new RegExp("", "i"),

            for (var i = 0; i < this.cardEffects.length; i++){
                window.console.log(this.cardName + ' -> ' + this.cardEffects[i]);
                var effect = this.cardEffects[i].split(' ');

                window.console.log(effect);
                if (effect[0] && effect[0].match(deal)){ // Dealing damage
                    if (effect[1] && effect[1].match(one)){
                        if (effect[4] && effect[4].match(targetSelf)){
                            window.console.log("Target self");
                        }

                        window.console.log("Doing a DAMAGE effect!");

                        $('.box.flipper.opened.flip').click(function() {
                            window.console.log("WOOOOO!!!!!!!!!!!!!");
                            
                            //board.results[this.getAttribute('col')][this.getAttribute('row')] = 0;
                            $('.box.flipper.opened.flip').unbind();
                            //rebind piece placing on square
                            $(this).removeClass('opened');
                            $(this).removeClass('opened-p1');
                            $(this).removeClass('opened-p2');
                            var pieceCoords = $(this).children()[0];
                            board.results[pieceCoords.getAttribute('col')][pieceCoords.getAttribute('row')] = 0;

                            $('.box.flipper:not(.opened)').click(function(){
                                var cols = $(this).children().attr("col");
                                var rows = $(this).children().attr("row");
                                board.playGame(rows,cols);
                            });

                            // Keep this for a method later
                            //board.updateCell(pieceCoords.getAttribute('col'),pieceCoords.getAttribute('row'))


                            //delete this.damage();
                        });

                        window.console.log($('.box.flipper.opened.flip'));

                    } else { //else many

                    }
                } else if (effect[0] && effect[0].match(destroy)){ // Destroying piece
                    if (effect[1] && effect[1].match(one)){

                    } else { //else many

                    }
                } else if (effect[0] && effect[0].match(draw)){ // Drawing cards
                    if (effect[1] && effect[1].match(one)){
                        eval('player' + playerNo).drawCard();
                    } else { //else many
                        for (var i = 0; i < effect[1]; i++) {
                            eval('player' + playerNo).drawCard();
                        }
                    }
                    
                } else {
                    //do nothing
                }
            }
            window.console.log('>> deleting ' + this);
            window.console.log(this);
            this.cardBody.remove();
            delete this;
        };

        this.createCard = function(playerNo){
            this.cardBody = jQuery('<div/>', {
                class: 'card drawn ' + this.cardName.toLowerCase()
            });

            jQuery('<div/>', {
                class: 'cardName',
                text: this.cardName
            }).appendTo(this.cardBody);

            jQuery('<div/>', {
                class: 'cardEffects',
                text: this.cardEffects.join()
            }).appendTo(this.cardBody);

            var targetCard = this; //closure
            $(this.cardBody[0]).click(function(){
                targetCard.playCard(targetCard, playerNo, b);
            });
            
            $('.p' + playerNo + '-hand:first').append(this.cardBody);
        };
    }

    function Piece() {
        this.row = -1,
        this.col = -1,
        this.shieled = false;
    }

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
            // Replace the eval statement?
            var tempDeck = JSON.parse(eval("deck_p" + this.playerNo));

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

                this.deck.push(newCard);
            }

            this.deck = shuffle(this.deck);
        };

        this.drawCard = function(){
            if (this.deck.length > 0) {
                this.deck[0].createCard(this.playerNo);
                this.hand.push(this.deck[0]);
                this.deck.splice(0,1);

                $('.hand').append();
            }

        };
    }

    function Board() {
        this.results = [];
        this.currentPlayer = 0;

        // Create board
        this.initiateBoard = function(){
            for (var i = 0; i < 4; i++){
                this.results[i] = [];
                for (var j = 0; j < 4; j++){
                    var id = i * 4 + j + 1;
                    this.results[i][j] = 0;
                    var $divgrid = $('div').find("[id="+id+"]");
                    $divgrid.attr("col", j );
                    $divgrid.attr("row", i );
                }
            }

            this.currentPlayer = 1;
        };

        // Changes current turn
        this.endTurn = function(){
            if (this.currentPlayer === 1) {
                this.currentPlayer = -1;
                $('.wrapper').removeClass('p1-turn');
                $('.wrapper').addClass('p2-turn');

                //hide hands
                for (var i = 0; i < player1.hand.length; i++) {
                    player1.hand[i].cardBody.addClass('hidden');
                }
                for (var i = 0; i < player2.hand.length; i++) {
                    player2.hand[i].cardBody.removeClass('hidden');
                }
            } else {
                this.currentPlayer = 1;
                $('.wrapper').removeClass('p2-turn');
                $('.wrapper').addClass('p1-turn');

                for (var i = 0; i < player2.hand.length; i++) {
                    player2.hand[i].cardBody.addClass('hidden');
                }
                for (var i = 0; i < player1.hand.length; i++) {
                    player1.hand[i].cardBody.removeClass('hidden');
                }
            }
        };

        // Handle cell click
        this.updateCell = function(row,col){
            if (this.results[row][col] !== 0){
                window.alert("The cell is occupied!");
            } else {

                var piece = new Piece();
                piece.row = row;
                piece.col = col;
                piece.square = $("div").find("[row="+row+"]"+"[col="+col+"]");

                this.results[row][col] = this.currentPlayer;
                piece.square.parent().addClass("opened flip");
                $(piece.square.parent()).unbind();
                
                if (this.currentPlayer === 1){
                    piece.square.parent().addClass("opened-p1");
                    $(player1.pieces).append(piece);
                } else {
                    piece.square.parent().addClass("opened-p2");
                    $(player2.pieces).append(piece);
                    window.console.log(player2.pieces);
                }

                this.endTurn();
            }
        };

        // Return correct piece markerclass
        this.drawMark = function(player){
            return player === 1 ? 'X' : 'O';
        };

        // Calculates number of turns left
        this.turnsLeft = function(){
            var turns_left = 16;
            for (var i = 0; i < 4; i++){
                for (var j = 0; j < 4; j++){
                    if (this.results[i][j] !== 0){
                        turns_left -= 1;
                    }
                }
            }

            return turns_left;
        };

        // Turn execution function
        this.playGame = function(row,col){
            if (this.determineWinner() === undefined){
                this.updateCell(row, col);
            }

            this.gameOver();
        };

        // Checks for game over
        this.gameOver = function(){
            var that = this;
            if (this.determineWinner() !== undefined){
                setTimeout(function(){ 
                    window.alert("The winner is " + that.drawMark(that.determineWinner())); 
                }, 100);
            }
            if (this.turnsLeft() === 0){
                window.alert("Sorry, no more turns!");
            }
        };

        //Calls all win condition checks
        this.determineWinner = function(){
            if (this.checkRows() !== undefined){
                return this.checkRows();
            }
            if (this.checkCols() !== undefined){
                return this.checkCols();
            }
            if (this.checkDiagonals() !== undefined){
                return this.checkDiagonals();
            }
        };

        this.checkRows = function(){
            for (var i = 0; i < 4; i++){
                var sum = this.results[i][0] + this.results[i][1] + this.results[i][2] + this.results[i][3];
                if (sum === 4 || sum === -4){
                    return this.results[i][0];
                }
            }
        };

        this.checkCols = function(){
            for (var i = 0; i < 4; i++){
                var sum = this.results[0][i] + this.results[1][i] + this.results[2][i] + this.results[3][i];
                if (sum === 4 || sum === -4){
                    return this.results[0][i];
                }
            }
        };

        this.checkDiagonals = function(){
            // Right-wards diagonal
            var sum = this.results[0][0] + this.results[1][1] + this.results[2][2] + this.results[3][3];
            if (sum === 4 || sum === -4){
                return this.results[1][1];
            }
            // Left-wards diagonal
            sum = this.results[0][3] + this.results[1][2] + this.results[2][1] + this.results[3][0];
            if (sum === 4 || sum === -4){
                return this.results[1][1];
            }
        };
    }

    var b = new Board();
    b.initiateBoard();

    var player1 = new Player(1);
    var player2 = new Player(2);
    player1.createDeck();
    player2.createDeck();

    for (var i = 0; i < startHandSize; i++) {
        player1.drawCard();
    }
    for (var i = 0; i < startHandSize; i++) {
        player2.drawCard();
    }

    //$(".p1-hand").sortable();
    //$(".p2-hand").sortable();

    $('.box').click(function(){
        var cols = $(this).children().attr("col");
        var rows = $(this).children().attr("row");
        b.playGame(rows,cols);
    });

    // for (var i = 0; i <  player1.hand.length; i++) {
    //     //Give cards clickable function
    //     (function (iCopy) { //remove function creation from loop?
    //         var card = player1.hand[iCopy];
    //         $(card.cardBody[0]).click(function(){
    //             window.console.log(card);
    //             card.playCard(b.currentPlayer, b);
    //         });
    //     }(i));
    // }

    $('#button_wrapper').click(function(){
        location.reload();
    });

});
