function Game() {
	this.startHandSize = 2,
    this.maxHandSize = 10;

    this.b = new Board();
    this.b.initiateBoard();

	this.player1 = new Player(1),
	this.player2 = new Player(2);
    this.player1.createDeck();
    this.player2.createDeck();

    for (var i = 0; i < this.startHandSize; i++) {
        this.player1.drawCard();
    }
    for (var i = 0; i < this.startHandSize; i++) {
        this.player2.drawCard();
    }

    $('.box').click(function(){
        var rows = this.getAttribute('x');
        var cols = this.getAttribute('y');
        this.b.playGame(rows,cols);
    });

    $('#endTurnButton').click(function(){
        this.b.endTurn();
    });

}

var newGame = new Game();

});