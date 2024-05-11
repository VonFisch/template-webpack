// L'animation de saut ne fonctionne pas, le pet ne s'arrète pas ssur idle quand il a moins de 10 d'énergie

// Phaser 3 code
var config = {
    // Phaser rendering engine
    type: Phaser.AUTO,
    // Canvas size
    // width: 1024,
    // height: 1024,
    // Physics engine
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
    // Scene
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// var pet;
var platforms;
// var cursors;
var healthText, energyText, foodText, sleepText;
// Create the game
var game = new Phaser.Game(config);
// Functions
function preload (){
    this.load.image('BG', 'assets/backgroung.png');
    this.load.image('ground', 'assets/platform2.png');
    this.load.image('Pink_Monster', 'assets/Pink_Monster/Pink_Monster.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('Pink_Monster_Idle', 'assets/Pink_Monster/Pink_Monster_Idle_4.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('Pink_Monster_Run', 'assets/Pink_Monster/Pink_Monster_Run_6.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('Pink_Monster_Jump', 'assets/Pink_Monster/Pink_Monster_Jump_8.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('Pink_Monster_Walk', 'assets/Pink_Monster/Pink_Monster_Walk_6.png', { frameWidth: 32, frameHeight: 32 });
    
}   

function create (){
    this.add.image(512, 512, 'BG');
    platforms = this.physics.add.staticGroup();
    platforms.create(512, 901.5, 'ground').refreshBody();

    pet = this.physics.add.sprite(512, 700, 'Pink_Monster_Idle').setScale(3);
    pet.setBounce(0.2);
    pet.setCollideWorldBounds(true);

    pet.stats = {
        health: 100,
        energy: 20,
        food: 100,
        mindset: 100
    };

    // Créer les textes pour chaque état
    healthText = this.add.text(16, 16, '', { fontSize: '32px', fill: '#999' });
    energyText = this.add.text(16, 64, '', { fontSize: '32px', fill: '#999' });
    foodText = this.add.text(16, 112, '', { fontSize: '32px', fill: '#999' });
    mindsetText = this.add.text(16, 160, '', { fontSize: '32px', fill: '#999' });

    this.anims.create({
        key: 'Idle',
        frames: this.anims.generateFrameNumbers('Pink_Monster_Idle', { start: 0, end: 3 }),
        frameRate: 3,
        repeat: -1
    });

    this.anims.create({
        key: 'Walk',
        frames: this.anims.generateFrameNumbers('Pink_Monster_Walk', { start: 0, end: 5 }),
        frameRate: 7,
        repeat: -1
    });

    this.anims.create({
        key: 'Run',
        frames: this.anims.generateFrameNumbers('Pink_Monster_Run', { start: 0, end: 5 }),
        frameRate: 7,
        repeat: -1
    });

    this.anims.create({
        key: 'Jump',
        frames: this.anims.generateFrameNumbers('Pink_Monster_Jump', { start: 0, end: 7 }),
        frameRate: 4
    });
    cursors = this.input.keyboard.createCursorKeys();
    
    this.physics.add.collider(pet, platforms);
}

function update (){
    // Mettre à jour les textes avec les valeurs actuelles des états
    healthText.setText('Health: ' + pet.stats.health);
    energyText.setText('Energy: ' + pet.stats.energy);
    foodText.setText('Food: ' + pet.stats.food);
    mindsetText.setText('Mindset: ' + pet.stats.mindset);
    aiControl();

}

var states = {
    idle: {
        enter: function() {
            pet.setVelocityX(0);
            pet.anims.play('Idle', true);
        },
        execute: function() {
            if (Math.random() < 0.1) {
                changeState('jump');
            } else if (Math.random() < 0.4) {
                changeState('walkLeft');
            } else if (Math.random() < 0.4) {
                changeState('walkRight');
            } else if (Math.random() < 0.1) {
                changeState('idle');
            }
        }
    },
    walkLeft: {
        enter: function() {
            pet.flipX = true;
            pet.setVelocityX(-160);
            pet.anims.play('Walk', true);
        },
        execute: function() {
            if (Math.random() < 0.1) {
                changeState('idle');
            }
        }
    },
    walkRight: {
        enter: function() {
            pet.flipX = false;
            pet.setVelocityX(160);
            pet.anims.play('Walk', true);
        },
        execute: function() {
            if (Math.random() < 0.1) {
                changeState('idle');
            }
        }
    },
    jump: {
        enter: function() {
            pet.setVelocityY(-360);
        },
        execute: function() {
            if (pet.body.onFloor()) {
                changeState('idle');
            }
        }
    }
};

var currentState = 'idle';


function changeState(newState) {
    states[currentState].exit && states[currentState].exit();
    currentState = newState;
    states[currentState].enter();
}

function aiControl() {
    states[currentState].execute();

    // Diminuer l'énergie de pet à chaque déplacement
    pet.stats.energy -= 0.01;
    if (pet.stats.energy < 0) {
        pet.stats.energy = 0;
    }
}
/*function aiControl() {
    // Générer un nombre aléatoire entre 0 et 1
    var random = Math.random();

    // 40% de chance de se déplacer à gauche
    if (random < 0.4) {
        pet.flipX = true;
        pet.setVelocityX(-160);
        pet.anims.play('Walk', true);
    }
    // 50% de chance de se déplacer à droite
    else if (random < 0.9) {
        pet.flipX = false;
        pet.setVelocityX(160);
        pet.anims.play('Walk', true);
    }
    // 2% de chance de sauter
    else if (random < 0.92) {
        pet.setVelocityY(-330);
    }
    // 8% de chance de rester immobile
    else {
        pet.setVelocityX(0);
        pet.anims.play('Idle', true);
    }

    // Diminuer l'énergie de pet à chaque déplacement
    pet.stats.energy -= 0.1;
    if (pet.stats.energy < 0) {
        pet.stats.energy = 0;
    }

    // Arrêter le déplacement après une durée aléatoire entre 1 et 3 secondes
    var duration = Math.random() * 2000 + 1000;
    setTimeout(function() {
        pet.setVelocityX(0);
        pet.anims.play('Idle', true);
    }, duration);
}*/

function getControl(){
    if(cursors.left.isDown && pet.body.touching.down && cursors.up.isUp){
        pet.flipX = true;
        if(cursors.shift.isDown){
            pet.setVelocityX(-360);
            pet.anims.play('Run', true);
        } else {
            pet.setVelocityX(-160);
            pet.anims.play('Walk', true);
        }
    }
    else if(cursors.right.isDown && pet.body.touching.down && cursors.up.isUp){
        pet.flipX = false;
        if(cursors.shift.isDown){
            pet.setVelocityX(360);
            pet.anims.play('Run', true);
        } else {
            pet.setVelocityX(160);
            pet.anims.play('Walk', true);
        }
    }
    else if(cursors.up.isDown && pet.body.touching.down){
        pet.setVelocityY(-400);
        pet.anims.play('Jump', true);
        if (cursors.shift.isDown){
            pet.setVelocityX(360);
            pet.setVelocityY(-500);
        }
    }
    else if(cursors.left.isDown){
        pet.setVelocityX(-160);
        pet.flipX = true;
    }
    else if(cursors.right.isDown){
        pet.setVelocityX(160);
        pet.flipX = false;
    }
    else if (cursors.down.isDown){
        aiControl();
    }
    else{
        pet.setVelocityX(0);
        pet.anims.play('Idle', true);
    }
}