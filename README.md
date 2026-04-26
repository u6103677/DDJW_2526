Introducció:

Aquest projecte és el clàssic joc de memory on l'objectiu és trobar cartes iguals. Està pensat per ser senzill de jugar, però amb opcions perquè cada partida sigui diferent. Es pot jugar tant fent servir el ratolí com les tecles de l'ordinador.


Descripció del disseny del joc:

Cartes: Les cartes fetes amb SVG són com les originals dels PNG però amb lleugers canvis als colors

Menús: Totes les opcions necessàries implementades. La de jugar, la de puntuacions per veure el top 10, les opcions i el registre de partides guardades. També hi ha el botó de sortir, però no està implementat.

Modes de joc: 

Mode 1: Un únic nivell que fa servir les opcions seleccionades al menú d’opcions i que guanyes menys punts en funció dels errors.

Mode 2: Conjunt de nivells que es van complicant, tens un màxim de tres vides per nivell i la dificultat del menú d’opcions influeix en la dificultat inicial.


Descripció de la implementació:

El codi està separat en lògica interna i la part visual. Això permet canviar com es veu el joc sense tantes complicacions. Perquè les cartes no surtin en una sola línia, he fet servir el residu % i la divisió per situar-les automàticament en files i columnes de quatre. He mapejat les tecles de direcció perquè sumin o restin posicions a l'índex de la carta seleccionada (+1 o -1 per als costats i +4 o -4 per moure's entre files). L'Enter crida directament la funció de girar carta que ja tenia definida. Finalment, es fa servir el localStorage per guardar dades que no s'han d'esborrar (com el rànquing i les configuracions) i el sessionStorage per a la informació de la partida actual, com el nivell on es troba el jugador al Mode 2.


Conclusions i problemes trobats:

El treball ha estat complicat en certes parts, com era d'imaginar, però un dels contratemps principals que he tingut ha causat problemes degut a que no era un error de codi. El cas era que la web no llegia les modificacions al codi, es quedava amb l'antic, i jo pensava que era que les noves implementacions no funcionaven, per la qual cosa vaig perdre bastant de temps abans d'aconseguir solucionar-ho desactivant una opció de memòria dins l'inspector.
