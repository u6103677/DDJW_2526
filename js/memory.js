const resources = [
    '../resources/carta1.svg', 
    '../resources/carta2.svg', 
    '../resources/carta3.svg', 
    '../resources/carta4.svg', 
    '../resources/carta5.svg', 
    '../resources/carta6.svg'
];
const back = '../resources/back.svg';

const StateCard = Object.freeze({
  DISABLE: 0,
  ENABLE: 1,
  DONE: 2
});

var game = {
    items: [],
    states: [],
    setValue: null,
    ready: 0,
    lastCard: [],
	groupSize: 2,
    score: 0,
	lives: 3,
    pairs: 2,
    goBack: function(idx){
        this.setValue && this.setValue[idx](back);
        this.states[idx] = StateCard.ENABLE;
    },
    goFront: function(idx){
        this.setValue && this.setValue[idx](this.items[idx]);
        this.states[idx] = StateCard.DISABLE;
    },
    select: function(){
        if (sessionStorage.load){ // Carreguem partida
            let toLoad = JSON.parse(sessionStorage.load);
            this.items = toLoad.items;
            this.states = toLoad.states;
            this.lastCard = toLoad.lastCard;
            this.score = toLoad.score;
            this.pairs = toLoad.pairs;
			this.groupSize = toLoad.groupSize || 2;
			this.delay = toLoad.delay || 1000;
        }
        else{ // Nova partida
			let opt = JSON.parse(localStorage.options || '{}');
			this.groupSize = parseInt(opt.group || 2);
			this.pairs = parseInt(opt.pairs || 2);
			this.delay = 1000;
			if (sessionStorage.mode === "2") {
				let level = parseInt(sessionStorage.mode2Level) || 1;
				this.score = parseInt(sessionStorage.score) || 0;
				this.lives = 3;
				this.pairs = level+1;
				if (this.pairs > 6) {
					this.pairs = 6;
				}
				this.groupSize = 2;
				if (level >=4){
					this.groupSize = 3;
				}
				if (level >=7){
					this.groupSize = 4;
				}
				this.delay = Math.max(1000 - (level * 50), 250);
			}
            this.items = resources.slice();          
            shuffe(this.items);                      
            this.items = this.items.slice(0, this.pairs); 
            let base = this.items.slice();
			for(let i=1; i<this.groupSize; i++) this.items = this.items.concat(base);      
            shuffe(this.items);
            this.states = new Array(this.items.length);
        }
    },
    start: function(){
        this.items.forEach((_,indx)=>{
            if (this.states[indx] === StateCard.DISABLE ||
                this.states[indx] === StateCard.DONE){
                this.ready++;
            }
            else{
                setTimeout(()=>{
                    this.ready++;
                    this.goBack(indx);
                }, 1000 + 100 * indx);
            }
        });
    },
    click: function(indx){
        if (this.states[indx] !== StateCard.ENABLE || this.ready < this.items.length) return;
        this.goFront(indx);
		this.lastCard.push(indx);
		if (this.lastCard.length < this.groupSize) return;
            if (this.lastCard.every(i => this.items[i] === this.items[indx])){
                this.pairs--;
                this.lastCard.forEach( i => this.states[i] = StateCard.DONE);
                if (this.pairs <= 0){
                    alert(`Has guanyat amb ${this.score} punts!!!!`);
                    window.location.assign("../");
                }
            }
            else {
			let temp = [...this.lastCard];
			setTimeout(() => temp.forEach(i => this.goBack(i)), 1000);
                this.score -= 25;
                if (this.score <= 0){
                    alert ("Has perdut");
                    window.location.assign("../");
                }
            }
            this.lastCard = [];
    },
    save: function(){
        let to_save = JSON.stringify({
            items: this.items,
            states: this.states,
            lastCard: this.lastCard,
            score: this.score,
            pairs: this.pairs
        });
        let ret = false;
        fetch('../php/save.php', {
            method: "POST",
            body: to_save,
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => ret = JSON.parse(response))
        .catch (err => console.error(err));

        if (!ret) {
			let nom = prompt("Amb quin nom vols guardar la partida?");
			if (nom) localStorage.setItem("save_" + nom, to_save);
        }
        window.location.assign("../");
    }
}

function shuffe(arr){
    arr.sort(function () {return Math.random() - 0.5});
}

export var gameItems;
export function selectCards() { 
    game.select();
    gameItems = game.items;
}
export function startGame(){ game.start(); }
export function initCard(callback) { 
    if (!game.setValue) game.setValue = [];
    game.setValue.push(callback); 
}

export function clickCard(indx){
    if (game.ready < game.items.length) return;
    game.goFront(indx);
	game.lastCard.push(indx);
    if (game.lastCard.length < game.groupSize) return;
        if (game.lastCard.every(i => game.items[i] === game.items[indx])){
            game.pairs--;
			game.score += 100;
			game.lastCard.forEach(i => game.states[i] = StateCard.DONE);
            if (game.pairs <= 0){
				if (sessionStorage.mode === "2") {
					sessionStorage.mode2Level = (parseInt(sessionStorage.mode2Level) || 1) + 1;
					sessionStorage.score = game.score;
					window.location.reload();
					
				}else{
					alert(`Has guanyat amb ${game.score} punts!!!!`);
					let ranking = JSON.parse(localStorage.ranking || "[]");
					ranking.push({alias: sessionStorage.alias || "Anònim", score: game.score});
					localStorage.ranking = JSON.stringify(ranking.sort((a,b) => b.score - a.score).slice(0, 10));
					window.location.assign("../");
				}
            }
        }
        else {
			let temp = [...game.lastCard];
			setTimeout(() => temp.forEach(i => game.goBack(i)), game.delay);
			if (sessionStorage.mode === "2") {
				game.lives--;
				if (game.lives <= 0) {
					let ranking = JSON.parse(localStorage.ranking || "[]");
					ranking.push({alias: sessionStorage.alias || "Anònim", score: game.score});
					localStorage.ranking = JSON.stringify(ranking.sort((a,b) => b.score - a.score).slice(0, 10));
					alert(`T'has quedat sense vides, puntuacio final: ${game.score}`);
					window.location.assign("../");
				}
			} else {
				game.score -= 25;
                alert ("Has perdut");
                window.location.assign("../");
            }
        }
        game.lastCard = [];
}

function goBack(idx){
    setValue(idx, back);
    clickOn(idx);
}

function goFront(idx){
    setValue(idx, items[idx]);
    clickOff(idx);
}

export function saveGame(){
    game.save();
}