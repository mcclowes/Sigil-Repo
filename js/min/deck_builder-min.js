$(function(){function a(a,r){var d=a.cardName.toLowerCase(),e=r.cardName.toLowerCase();return e>d?-1:d>e?1:0}function r(){this.cardName="",this.addCard=function(){window.console.log(c),this.cardBody=jQuery("<div/>",{"class":"cardSelector"}),jQuery("<div/>",{"class":this.cardName,text:this.cardName}).appendTo(this.cardBody);var r=this;$(this.cardBody[0]).click(function(){r.cardBody.remove(),delete r});var d=$.inArray(this,c);-1!=d?$(this.cardName,c).length<=4?(r.cardBody.remove(),delete r,"."+this.cardName):window.alert("Card limit reached for this card"):(c.push(this),c.sort(a),$(".cardList:first").append(this.cardBody))}}function d(){this.cardName="",this.cardEffects=[],this.cardImage="",this.cardBody="",this.chooseCard=function(a){window.console.log($(this));var d=new r;d.cardName=a.cardName,d.addCard()},this.createCard=function(){this.cardBody=jQuery("<div/>",{"class":"card drawn spaced "+this.cardName.toLowerCase().split(" ").join("_")}),jQuery("<div/>",{"class":"cardName",text:this.cardName}).appendTo(this.cardBody),jQuery("<div/>",{"class":"cardEffects",text:this.cardEffects.join([separator=". "])+"."}).appendTo(this.cardBody);var a=this;$(this.cardBody[0]).click(function(){a.chooseCard(a)}),$(".cardPool:first").append(this.cardBody)}}function e(){for(var a=0;a<cards.length;a++){var r=new d;r.cardName=cards[a].name,r.cardEffects=cards[a].effects,window.console.log(a+", "+cards[a]+", "+cards[a].effects),r.createCard()}}function t(a){for(var d=0;a>d;d++){var e=new r;e.cardName=a[d],e.addCard()}}var c=[];window.console.log("Starting"),e(),$("#save").click(function(a){for(var r=[],d=0;d<c.length;d++)r.push(c[d].cardName);window.console.log(r),this.href="data:plain/text,"+JSON.stringify(r)}),$("#load").change(function(a){var r=new FileReader;r.onload=function(){var a=r.result;window.console.log(dataUrl);var d=document.getElementById("output");d.src=a};var d=r.readAsText(this.files[0]);t(d)})});