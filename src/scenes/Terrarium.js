import Pet from './pet.js';
var platforms;
var healthText, energyText, foodText, sleepText;
export class Terrarium extends Phaser.Scene {
    constructor() {
        super({ key: 'Terrarium' });
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

    create() {

        this.add.image(512, 512, 'BG');
        platforms = this.physics.add.staticGroup();
        platforms.create(512, 901.5, 'ground').refreshBody();

        this.pet = new Pet(this, 512, 800);
        
        // Créer les textes pour chaque état
        healthText = this.add.text(16, 16, '', { fontSize: '32px', fill: '#999' });
        energyText = this.add.text(16, 64, '', { fontSize: '32px', fill: '#999' });
        foodText = this.add.text(16, 112, '', { fontSize: '32px', fill: '#999' });
        mindsetText = this.add.text(16, 160, '', { fontSize: '32px', fill: '#999' });

        this.physics.add.collider(Pet, platforms);

        // this.input.setDraggable(this.food);

        // this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        //     gameObject.x = dragX;
        //     gameObject.y = dragY;
        // });

        // this.physics.add.overlap(this.pet, this.food, this.feedPet, null, this);
    }

    update() {
        healthText.setText('Santé: ' + pet.stats.health);
        energyText.setText('Énergie: ' + pet.stats.energy);
        foodText.setText('Nourriture: ' + pet.stats.food);
        mindsetText.setText('Mental: ' + pet.stats.mindset);
    }
}
