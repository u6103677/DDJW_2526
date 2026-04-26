import {$} from "../library/jquery-4.0.0.slim.module.min.js";

var options = function(){
    const default_options = {
        pairs: 2,
		group: 2,
        difficulty: 'normal'
    } 

    var pairs = $('#pairs');
    var difficulty = $('#dif');
    var group = $('#group');
    var savedOptions = localStorage.options && JSON.parse(localStorage.options);
    var options = Object.create(default_options);

    if (savedOptions && savedOptions.pairs)
        options.pairs = savedOptions.pairs;
    if (savedOptions && savedOptions.difficulty)
        options.difficulty = savedOptions.difficulty;
	if (savedOptions && savedOptions.group)
    options.group = savedOptions.group;

    pairs.val(options.pairs);
    difficulty.val(options.difficulty);
	group.val(options.group);

    pairs.on('change', function (){
        options.pairs = pairs.val();
    });
	
	group.on('change', function(){
		options.group = group.val();
	});

    difficulty.on('change', function (){
        options.difficulty = difficulty.val();
    });

    return {
        applyChanges: function(){
			options.pairs = $('#pairs').val();
            options.group = $('#group').val();
			options.difficulty = $('#dif').val();
			let toSave = {	//
				pairs: parseInt(options.pairs),
				group: parseInt(options.group),
				difficulty: options.difficulty
    };
			localStorage.options = JSON.stringify(toSave);
        },
        defaultValues: function(){
            options.pairs = default_options.pairs;
			options.group = default_options.group;
            options.difficulty = default_options.difficulty;
            pairs.val(options.pairs);
			group.val(options.group);
            difficulty.val(options.difficulty);
        }
    }
}();

$('#default').on('click', function(){
    options.defaultValues();
})

$('#apply').on('click', function(){
    options.applyChanges();
    location.assign("../");
});
