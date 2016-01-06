$(function(){

    var startHandSize = 2,
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

            //Hide card - should probably delete it here too for card draw reasons
            $(this.cardBody).fadeOut(300); //this is not gonna show unless a time delay is applied on the next part

            //Regex expression definitions
            var deal = new RegExp("deal", "i"),
                destroy = new RegExp("destroy", "i"),
                draw = new RegExp("draw", "i"),
                one = new RegExp("a|1", "i"),
                every = new RegExp("all|every", "i"),
                endTurn = new RegExp("end", "i"),
                targetSelf = new RegExp("your", "i"),
                freeze = new RegExp("freeze", "i"),
                block = new RegExp("block", "i");
                //= new RegExp("", "i"),

            function setupPlay() {
                window.console.log("Restoring piece placements");
                $('.box.flipper:not(.opened)').click(function(){
                    var rows = this.getAttribute('x');
                    var cols = this.getAttribute('y');
                    board.playGame(rows,cols);
                });
            }

            function dealDamage(){
                window.console.log("Doing a DAMAGE effect!");
                $('.box.flipper.opened.flip').click(function() {
                    //board.results[this.getAttribute('col')][this.getAttribute('row')] = 0;
                    $('.box.flipper').unbind();

                    //This doesn't work
                    board.results[this.getAttribute('x')][this.getAttribute('y')] = 0;
                    window.console.log(board.results);

                    //rebind piece placing on square
                    $(this).removeClass('opened');
                    $(this).removeClass('opened-p1');
                    $(this).removeClass('opened-p2');

                    setupPlay();
                    // Keep this for a method later
                    //board.updateCell(pieceCoords.getAttribute('col'),pieceCoords.getAttribute('row'))
                });

            }

            for (var i = 0; i < this.cardEffects.length; i++){
                window.console.log(this.cardName + ' -> ' + this.cardEffects[i]);
                var effect = this.cardEffects[i].split(' ');

                window.console.log(effect);

                if (effect[0] && effect[0].match(endTurn)){
                    board.endTurn();
                } else if (effect[0] && effect[0].match(deal)){ // Dealing damage
                    if (effect[1] && effect[1].match(one)){
                        if (effect[4] && effect[4].match(targetSelf)){
                            window.console.log("Target self");
                        }

                        if (window.Promise) {
                            window.console.log('Promise found');

                            var promise = new Promise(function(resolve, reject) {
                                dealDamage();
                            });

                            promise.then(setupPlay());
                        } else {
                            window.console.log('Promise not available');
                        }

                    } else if (effect[1] && effect[1].match(every)){ // Damage all
                        //damage everything
                    } else { //else damage many
                        for (var i; i < effect[1]; i++){
                            dealDamage();
                            setupPlay();
                        }
                    }
                } else if (effect[0] && effect[0].match(destroy)){ // Destroying piece
                    if (effect[1] && effect[1].match(one)){
                        if (effect[4] && effect[4].match(targetSelf)){
                            window.console.log("Target self");
                        }

                        window.console.log("Destroying one piece");

                        $('.box.flipper.opened.flip').click(function() {
                            //board.results[this.getAttribute('col')][this.getAttribute('row')] = 0;
                            $('.box.flipper').unbind();

                            var pieceCoords = $(this).children()[0];
                            window.console.log(pieceCoords);
                            window.console.log(board.results);
                            //This doesn't work
                            board.results[pieceCoords.getAttribute('col')][pieceCoords.getAttribute('row')] = 0;
                            window.console.log(board.results);

                            //rebind piece placing on square
                            $(this).removeClass('opened');
                            $(this).removeClass('opened-p1');
                            $(this).removeClass('opened-p2');

                            $('.box.flipper:not(.opened)').click(function(){
                                var cols = $(this).children().attr("col");
                                var rows = $(this).children().attr("row");
                                board.playGame(rows,cols);
                            });

                            // Keep this for a method later
                            //board.updateCell(pieceCoords.getAttribute('col'),pieceCoords.getAttribute('row'))
                        });

                        window.console.log($('.box.flipper.opened.flip'));

                    } else if (effect[1] && effect[1].match(every)){ // Destroy all
                        window.console.log('Destroy all pieces');
                        var pieces = $('.box.flipper.opened');

                        $(pieces).removeClass('opened');
                        $(pieces).removeClass('opened-p1');
                        $(pieces).removeClass('opened-p2');

                        for (var i = 0; i < pieces.length; i++){ 
                            board.results[pieces[i].x][pieces[j].y] = 0;
                        }

                        $('.box.flipper:not(.opened)').click(function(){
                            var rows = this.getAttribute('x');
                            var cols = this.getAttribute('y');
                            board.playGame(rows,cols);
                        });
                    } else { //else many

                    }
                } else if (effect[0] && effect[0].match(draw)){ // Drawing cards
                    if (effect[1] && effect[1].match(one)){ // Resolves 'a'
                        if (eval('player' + playerNo).hand.length < maxHandSize){
                            eval('player' + playerNo).drawCard();
                        }
                    } else { //else many
                        for (var i = 0; i < effect[1]; i++) {
                            if (eval('player' + playerNo).hand.length < maxHandSize){
                                eval('player' + playerNo).drawCard();
                            }
                        }
                    }
                }  else if (effect[0] && effect[0].match(freeze)){ // Freeze
                    if (effect[1] && effect[1].match(one)){ // Resolves 'a'
                        window.console.log("Doing a frost... spoopy!");

                        $('.box.flipper:not(.opened)').click(function() {
                            if (board.results[pieceCoords.getAttribute('col')][pieceCoords.getAttribute('row')] == 0){
                                $('.box.flipper').unbind();

                                board.frost[pieceCoords.getAttribute('col')][pieceCoords.getAttribute('row')] = 2;
                                $('.box.flipper').addClass('frost');

                                $('.box.flipper:not(.opened)').click(function(){
                                    var rows = this.getAttribute('x');
                                    var cols = this.getAttribute('y');
                                    board.playGame(rows,cols);
                                });
                            }
                        });

                    } if (effect[1] && effect[1].match(every)){ // Resolves 'all'
                        for (var i = 0; i < 4; i++) {
                            for (var j = 0; j < 4; j++) {
                                if (board.results[i][j] === 0) {
                                    board.frost[i][j] = 2;
                                    $('.box.flipper').addClass('frost');
                                }
                            }
                        }
                    } else { //else many
                        
                    }
                } else {
                    //do nothing
                } 
            }

            this.cardBody.remove();
            delete this;
            
        };

        this.createCard = function(playerNo){
            this.cardBody = jQuery('<div/>', {
                class: 'card drawn ' + this.cardName.toLowerCase().split(' ').join('_')
            });

            jQuery('<div/>', {
                class: 'cardName',
                text: this.cardName
            }).appendTo(this.cardBody);

            jQuery('<div/>', {
                class: 'cardEffects',
                text: this.cardEffects.join([separator = '. ']) + '.'
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
        this.shieled = false; //remove?
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
        this.frost = [];
        this.rock = [];
        this.shields = [];
        this.currentPlayer = 0;

        // Create board
        this.initiateBoard = function(){
            for (var i = 0; i < 4; i++){
                this.results[i] = [];
                this.frost[i] = [];
                this.rock[i] = [];
                this.shields[i] = [];

                for (var j = 0; j < 4; j++){
                    var id = i * 4 + j + 1;

                    this.results[i][j] = 0;
                    this.frost[i][j] = 0;
                    this.rock[i][j] = 0;
                    this.shields[i][j] = 0;
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

                player2.drawCard();

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

                player1.drawCard();
            
            }

            var tiles = $('.box.flipper');
            for (var i = 0; i < 4; i++){
                for (var j = 0; j < 4; j++){
                    if (tiles.x === i && tiles.y === j) {
                        tiles.removeClass('frost');
                    }

                    this.frost[i][j] = (this.frost[i][j] > 0) ? this.frost[i][j] - 1: 0;
                    this.rock[i][j] = (this.rock[i][j] > 0) ? this.rock[i][j] - 1: 0;
                }
            }
        };

        // Handle cell click
        this.updateCell = function(row,col){
            if (this.results[row][col] !== 0 || this.frost[row][col] >= 1 || this.rock[row][col] >= 1){
                window.alert("The cell is occupied!");
            } else {

                var piece = new Piece();
                piece.row = row;
                piece.col = col;
                piece.square = $("div").find("[x="+row+"]"+"[y="+col+"]");

                this.results[row][col] = this.currentPlayer;
                piece.square.addClass("opened flip");
                $(piece.square).unbind();
                
                if (this.currentPlayer === 1){
                    piece.square.addClass("opened-p1");
                    $(player1.pieces).append(piece);
                } else {
                    piece.square.addClass("opened-p2");
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
        var rows = this.getAttribute('x');
        var cols = this.getAttribute('y');
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

    $('#submitButton').click(function(){
        location.reload();
    });

    $('#endTurnButton').click(function(){
        b.endTurn();
    });

});
