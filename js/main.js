	import {$} from "../library/jquery-4.0.0.slim.module.min.js";
	var p = $('#play');
	var o = $('#options');
	var s = $('#saves');
	var e = $('#exit');
	var sc = $('#scores');
    p.on('click', 
    function(){
        let alias = prompt("Quin és el teu àlies?");
		sessionStorage.alias=alias || "Anònim";
		sessionStorage.removeItem('score');
		let mode = prompt("Quin mode vols jugar? (1 o 2)", "1");
		sessionStorage.mode=mode;
		if (mode === "2") {
			let opt = JSON.parse(localStorage.options || '{}');
			let startLevel=1;
			if (opt.difficulty === 'normal') startLevel = 3;
			if (opt.difficulty === 'hard') startLevel = 5;
			sessionStorage.mode2Level = startLevel;
		}
		console.log(alias);
        sessionStorage.removeItem('load');
        window.location.assign("./html/game.html");
    });

    o.on('click', 
    function(){
        window.location.assign("./html/options.html");
    });

    s.on('click', 
    function(){
        let to_load = localStorage.save;
        fetch('../php/load.php', {
            method: "POST",
            body: JSON.stringify({}),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => response.json())
        .then(json => to_load = (!json.error)?JSON.stringify(json.save): localStorage.save)
        .catch (err => {
            console.error(err);
            console.warn("La partida s'intentarà carregar de local");
        });

        if (!to_load) {
            alert("No hi ha cap partida a carregar");
            return;
        }
        sessionStorage.load = to_load;
        window.location.assign("./html/game.html");
    });

    e.on('click', 
    function(){
        console.warn("No es pot sortir!");
    });
	
	sc.on('click', function() {
    let ranking = JSON.parse(localStorage.ranking || "[]");
    if (ranking.length === 0) {
        alert("Encara no hi ha puntuacions!");
        return;
    }
	let text = "TOP 10\n";
	ranking.forEach((p, i) => {
        text += `${i + 1}. ${p.alias}: ${p.score} punts\n`;
    });
    
    alert(text);
});