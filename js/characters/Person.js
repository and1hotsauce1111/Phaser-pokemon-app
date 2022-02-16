export default class Person {
  constructor(scene, person, x, y, direction) {
    this.scene = scene;
    // (x, y) = (341.31, 1175.91) 為預設起始位置
    this.x = x || 341.31;
    this.y = y || 1175.91;
    this.direction = direction || 'player-front-walk.002.png';

    // 玩家移動sprite animations
    const anims = this.scene.anims;
    anims.create({
      key: 'left',
      frames: anims.generateFrameNames('player', {
        prefix: 'player-left-walk.',
        suffix: '.png',
        start: 1,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: 'right',
      frames: anims.generateFrameNames('player', {
        prefix: 'player-right-walk.',
        suffix: '.png',
        start: 1,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: 'front',
      frames: anims.generateFrameNames('player', {
        prefix: 'player-front-walk.',
        suffix: '.png',
        start: 1,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: 'back',
      frames: anims.generateFrameNames('player', {
        prefix: 'player-back-walk.',
        suffix: '.png',
        start: 1,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    // 創建人物sprite
    this.sprite = this.scene.physics.add.sprite(
      this.x,
      this.y,
      person,
      this.direction,
    );

    this.cursors = this.scene.input.keyboard.createCursorKeys();
    // use W,A,S,D
    this.keyA = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.A,
    );
    this.keyS = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.S,
    );
    this.keyD = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.D,
    );
    this.keyW = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.W,
    );
    this.keyEsc = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ESC,
    );

    // 是否移動
    this.isMoving = false;
  }

  update() {
    if (!this.sprite.body) return;

    const speed = 175;
    const cursors = this.cursors;
    const sprite = this.sprite;

    // 移除先前動畫
    sprite.body.setVelocity(0);

    // 水平移動
    if (cursors.left.isDown || this.keyA.isDown) {
      sprite.body.setVelocityX(-speed);
    } else if (cursors.right.isDown || this.keyD.isDown) {
      sprite.body.setVelocityX(speed);
    }

    // 垂直移動
    if (cursors.up.isDown || this.keyW.isDown) {
      sprite.body.setVelocityY(-speed);
    } else if (cursors.down.isDown || this.keyS.isDown) {
      sprite.body.setVelocityY(speed);
    }


    // 控制移動速度
    sprite.body.velocity.normalize().scale(speed);

    // 依據方向鍵觸發相對應動畫
    if (cursors.left.isDown || this.keyA.isDown) {
      sprite.anims.play('left', true);
      this.isMoving = true;
    } else if (cursors.right.isDown || this.keyD.isDown) {
      sprite.anims.play('right', true);
      this.isMoving = true;
    } else if (cursors.up.isDown || this.keyW.isDown) {
      sprite.anims.play('back', true);
      this.isMoving = true;
    } else if (cursors.down.isDown || this.keyS.isDown) {
      sprite.anims.play('front', true);
      this.isMoving = true;
    } else {
      sprite.anims.stop();
      this.isMoving = false;
    }

    // 開啟選單
    if (Phaser.Input.Keyboard.JustDown(this.keyEsc)) {
      const currentMapScene = this.scene.scene.key;
      const initMapActive = this.scene.scene.isActive('InitMapScene');
      const wildMapActive = this.scene.scene.isActive('WildScene');


      const currentMapInfo = {
        player: sprite,
        currentMapScene,
      };
      
      if (initMapActive) {
        this.scene.scene.pause('InitMapScene');
        this.scene.scene.run('SaveMenu', { currentMapInfo });
      }

      if (wildMapActive) {
        this.scene.scene.pause('WildScene');
        this.scene.scene.run('SaveMenu', { currentMapInfo });
      }
    }
  }

  destroy() {
    this.sprite.destroy();
  }
}
