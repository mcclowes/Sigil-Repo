$(function(){

    function Player() {
        this.deck = [];
        this.hand = [];
        this.discard = [];

        this.createDeck= function(player){
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
                window.console.log('changin');
                this.currentPlayer = -1;
                $('.wrapper').removeClass('p1-turn');
                $('.wrapper').addClass('p2-turn');
            } else {
                this.currentPlayer = 1;
                $('.wrapper').removeClass('p2-turn');
                $('.wrapper').addClass('p1-turn');
            }
        };

        // Handle cell click
        this.updateCell = function(row,col){
            window.console.log('Updating cell');
            if (this.results[row][col] !== 0){
                window.alert("The cell is occupied!");
            } else{
                this.results[row][col] = this.currentPlayer;
                window.console.log('row: ' + row +', ' + col);
                var $divgrid = $("div").find("[row="+row+"]"+"[col="+col+"]");
                $divgrid.parent().addClass("opened flip");
                window.console.log('Real player ' + this.currentPlayer);
                if (this.currentPlayer === 1){
                    $divgrid.parent().addClass("opened-p1");
                } else {
                    $divgrid.parent().addClass("opened-p2");
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

    var player1 = new Player();
    var player2 = new Player();
    player1.createDeck(1);
    player2.createDeck(2);

    $(".p1-hand").sortable();
    $(".p2-hand").sortable();

    $('.box').click(function(){
        var cols = $(this).children().attr("col");
        var rows = $(this).children().attr("row");
        b.playGame(rows,cols);
    });

    $('#button_wrapper').click(function(){
        location.reload();
    });

});
