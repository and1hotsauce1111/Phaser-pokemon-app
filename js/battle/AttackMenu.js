export default class AttackMenu extends Phaser.Scene {
  constructor() {
    super({ key: 'AttackMenu' });
    this.wildPokemon = {};
    this.pokemonName = '';
  }

  preload() {}

  create() {
    if (Object.keys(window.GameObjects.wildPokemon).length) {
      this.wildPokemon = window.GameObjects.wildPokemon;
      this.pokemonName = this.wildPokemon.zh_Hant_name || this.wildPokemon.name;
    }
    this.createMenu();
  }

  update() {
    this.updateSelectMenu();
    this.updateAction();
  }

  init() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyEnter = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER,
    );
    this.keySpace = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );
    this.keyEsc = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ESC,
    );
  }

  createMenu() {
    // 右側顯示當前PP和攻擊類型
    this.rightMenu = this.add.graphics();
    this.rightMenu.fillStyle(0xffffff, 1);
    this.rightMenu.fillRoundedRect(485, 491, 315, 108, 16);
    this.rightMenu.strokeRoundedRect();
    // menu border style
    this.rightMenu.lineStyle(5, 0x8388a4, 1);
    this.rightMenu.strokeRoundedRect(485, 491, 315, 108, 16);

    this.PPText = this.add.text(550, 510, 'PP: 20/20', {
      font: '25px monospace',
      color: '#666',
    });
    this.AttackTypeText = this.add.text(550, 550, '類型/火系', {
      font: '25px monospace',
      color: '#666',
    });

    // 左側招式列表
    this.leftMenu = this.add.graphics();
    this.leftMenu.fillStyle(0xffffff, 1);
    this.leftMenu.fillRoundedRect(3, 491, 485, 108, 16);
    this.leftMenu.strokeRoundedRect();
    this.leftMenu.lineStyle(5, 0x8388a4, 1);
    this.leftMenu.strokeRoundedRect(3, 491, 485, 108, 16);

    // pokemon 招式
    this.firstMove = this.add.text(45, 510, 'TELEPORT', {
      font: '25px monospace',
      color: '#666',
    });

    this.secondMove = this.add.text(300, 510, 'REFLECT', {
      font: '25px monospace',
      color: '#666',
    });

    this.thirdMove = this.add.text(45, 560, 'DISABLE', {
      font: '25px monospace',
      color: '#666',
    });

    this.fourthMove = this.add.text(300, 560, 'PSYBEAM', {
      font: '25px monospace',
      color: '#666',
    });

    this.menuPointer = this.add.polygon(
      30,
      525,
      [0, 0, 0, 20, 10, 10],
      0x636363,
    );

    this.currentSelectedMove = 'TELEPORT';
  }

  updateAction() {
    if (Phaser.Input.Keyboard.JustDown(this.keyEsc)) {
      this.scene.stop('AttackMenu');
      this.scene.run('BattleMenu');
    }
    if (Phaser.Input.Keyboard.JustDown(this.keyEnter) || Phaser.Input.Keyboard.JustDown(this.keySpace)) {
      this.scene.stop('AttackMenu');
      this.scene.stop('BattleMenu');
      this.scene.run('TextScene', { text: `${this.pokemonName}使用了${this.currentSelectedMove}!`});
    }
  }

  updateSelectMenu() {
    // 使用Phaser.Input.Keyboard.JustDown 避免多次觸發keypress event
    if (Phaser.Input.Keyboard.JustDown(this.cursors.left) || Phaser.Input.Keyboard.JustDown(this.keyA)) {
      if (this.currentSelectedMove === 'TELEPORT' || this.currentSelectedMove === 'DISABLE') return;
      if (this.currentSelectedMove === 'REFLECT') {
        this.menuPointer.setPosition(30, 525);
        this.currentSelectedMove = 'TELEPORT';
      }
      if (this.currentSelectedMove === 'PSYBEAM') {
        this.menuPointer.setPosition(30, 575);
        this.currentSelectedMove = 'DISABLE';
      }
    }
    if (Phaser.Input.Keyboard.JustDown(this.cursors.right) || Phaser.Input.Keyboard.JustDown(this.keyD)) {
      if (this.currentSelectedMove === 'REFLECT' || this.currentSelectedMove === 'PSYBEAM') return;
      if (this.currentSelectedMove === 'TELEPORT') {
        this.menuPointer.setPosition(275, 525);
        this.currentSelectedMove = 'REFLECT';
      }
      if (this.currentSelectedMove === 'DISABLE') {
        this.menuPointer.setPosition(275, 575);
        this.currentSelectedMove = 'PSYBEAM';
      }
    }
    if (Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.keyW)) {
      if (this.currentSelectedMove === 'TELEPORT' || this.currentSelectedMove === 'REFLECT') return;
      if (this.currentSelectedMove === 'DISABLE') {
        this.menuPointer.setPosition(30, 525);
        this.currentSelectedMove = 'TELEPORT';
      }
      if (this.currentSelectedMove === 'PSYBEAM') {
        this.menuPointer.setPosition(275, 525);
        this.currentSelectedMove = 'REFLECT';
      }
    }
    if (Phaser.Input.Keyboard.JustDown(this.cursors.down) || Phaser.Input.Keyboard.JustDown(this.keyS)) {
      if (this.currentSelectedMove === 'DISABLE' || this.currentSelectedMove === 'PSYBEAM') return;
      if (this.currentSelectedMove === 'TELEPORT') {
        this.menuPointer.setPosition(30, 575);
        this.currentSelectedMove = 'DISABLE';
      }
      if (this.currentSelectedMove === 'REFLECT') {
        this.menuPointer.setPosition(275, 575);
        this.currentSelectedMove = 'PSYBEAM';
      }
    }
  }
}
