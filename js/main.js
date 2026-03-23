	import {$} from "../library/jquery-4.0.0.slim.module.min.js";
	var p = $('#play');
	var o = $('#options');
	var s = $('#saves');
	var e = $('#exit');
    p.on('click', 
    function(){
        let alias = prompt("Quin és el teu àlies?");
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
	