function Card(){this.cardName="",this.cardEffects=[],this.cardBody="",this.playCard=function(o,a,d){window.console.log("Doing a DAMAGE effect!")},this.createCard=function(o){window.console.log(this),this.cardBody=jQuery("<div/>",{"class":"card drawn "+this.cardName.toLowerCase().split(" ").join("_")}),jQuery("<div/>",{"class":"cardName",text:this.cardName}).appendTo(this.cardBody),jQuery("<div/>",{"class":"cardEffects",text:this.cardEffects.join([separator=". "])+"."}).appendTo(this.cardBody);var a=this;$(this.cardBody[0]).click(function(){a.playCard(a,o,b)}),window.console.log(this.cardBody),window.console.log($(".p"+o+"-hand:first")),$(".p"+o+"-hand:first").append(this.cardBody),$("p").append("<strong>Hello</strong>"),$(".center").append("<strong>Hello</strong>"),$(".p1-hand").append("<strong>Hello</strong>"),window.console.log($(".center"))}}