var nave;
var balas;
var tiempoEntreBalas=400;
var tiempo =0;
var malos;
var timer;
var puntos;
var txtPuntos;
var vidas;
var txtVidas;
var fondoJuego;

var disparo = new Audio('audio/disparo.mp3');
var explosion = new Audio('audio/explosion.mp3');

var Juego={
	preload: function () {
		juego.load.image('nave','img/nave2.png');
		juego.load.image('laser','img/laser.png');
		juego.load.image('malo','img/enemigo.png');
		juego.load.image('bg','img/space2.png');
	},

	create: function(){
		
		fondoJuego=juego.add.tileSprite(0,0,400,540,'bg');
		juego.physics.startSystem(Phaser.Physics.ARCADE);
		nave = juego.add.sprite(juego.width/2, 485, 'nave');
		nave.anchor.setTo(0.5);
		juego.physics.arcade.enable(nave,true);

		balas=juego.add.group();
		balas.enableBody=true;
		balas.setBodyType=Phaser.Physics.ARCADE;
		balas.createMultiple(50, 'laser');
		balas.setAll('anchor.x',0.5);
		balas.setAll('anchor.y',0.5);
		balas.setAll('checkWorldBounds',true);
		balas.setAll('outOfBoundsKill',true);


		malos=juego.add.group();
		malos.enableBody=true;
		malos.setBodyType=Phaser.Physics.ARCADE;
		malos.createMultiple(50, 'malo');
		malos.setAll('anchor.x',0.5);
		malos.setAll('anchor.y',0.5);
		malos.setAll('checkWorldBounds',true);
		malos.setAll('outOfBoundsKill',true);

		timer=juego.time.events.loop(2000,this.crearEnemigo,this);

		//definiendo el puntaje en pantalla
		puntos=0;
		juego.add.text(20,20,"Puntos: ",{font:"14px Arial",fill:"#FFF"});
		txtPuntos=juego.add.text(80,20,"0",{font:"14px Arial", fill:"#FFF"});

		//nombre en pantalla
		juego.add.text(230,515,"Cley Tornero Mondalgo",{font:"12px Arial",fill:"#FFF"});


		//definiendo contador de vidas
		vidas=3;
		juego.add.text(310,20,"Vidas: ",{font:"14px Arial ",fill:"#FFF"});
		txtVidas=juego.add.text(360,20,"3",{font:"14px Arial", fill:"#FFF"});
	},

	update: function(){
		fondoJuego.tilePosition.y+=1;
		nave.rotation=juego.physics.arcade.angleToPointer(nave) + Math.PI/2;
		if (juego.input.activePointer.isDown){
			this.disparar();
		}

		//Agregando colision
		juego.physics.arcade.overlap(balas,malos,this.colision,null,this);

		//definiendo el contador de vidas
		malos.forEachAlive(function(m){
			if(m.position.y>520 && m.position.y < 521)
			{
				vidas -=1;
				txtVidas.text=vidas;
			}
		});
		if (vidas ==0)
		{
			juego.state.start('Terminado');
		}

	},

	disparar: function (){
		if(juego.time.now > tiempo && balas.countDead()>0)
		{
			tiempo=juego.time.now+tiempoEntreBalas;
			var bala=balas.getFirstDead();
			bala.anchor.setTo(0.5);
			bala.reset(nave.x,nave.y);
			bala.rotation=juego.physics.arcade.angleToPointer(bala)+Math.PI/2;
			juego.physics.arcade.moveToPointer(bala,200);
		}
		disparo.play();
	},

	crearEnemigo: function (){
		var enem = malos.getFirstDead();
		var num = Math.floor(Math.random()*10+1);
		enem.reset(num*38,0);
		enem.anchor.setTo(0.5);
		enem.body.velocity.y=100;
		enem.checkWorldBounds=true;
		enem.outOfBoundsKill=true;
	},
	
	colision: function(b,m){
		b.kill();
		m.kill();
		puntos++;
		txtPuntos.text = puntos;
		explosion.play();
		
	}


};


	