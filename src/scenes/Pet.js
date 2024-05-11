var pet;
var cursors;
var states;
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
// feedPet(Pet, food) {
//     food.destroy();
//     // code pour nourrir l'animal de compagnie
// }
}

export class Pet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'pet');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        // Ajoutez ici d'autres propriétés et méthodes pour votre animal de compagnie
    }
    preload() {
        this.load.image('BG', 'assets/backgroung.png');
        this.load.image('ground', 'assets/platform2.png');
        this.load.image('Pink_Monster', 'assets/Pink_Monster/Pink_Monster.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('Pink_Monster_Idle', 'assets/Pink_Monster/Pink_Monster_Idle_4.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('Pink_Monster_Run', 'assets/Pink_Monster/Pink_Monster_Run_6.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('Pink_Monster_Jump', 'assets/Pink_Monster/Pink_Monster_Jump_8.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('Pink_Monster_Walk', 'assets/Pink_Monster/Pink_Monster_Walk_6.png', { frameWidth: 32, frameHeight: 32 });
    }
    create(){
        pet = this.physics.add.sprite(512, 700, 'Pink_Monster_Idle').setScale(3);
        pet.setBounce(0.2);
        pet.setCollideWorldBounds(true);
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
       
    }

    update(){
        aiControl();
    }

    // ajouter des méthodes spécifiques à votre animal de compagnie ici
    states = {
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
    }    
}