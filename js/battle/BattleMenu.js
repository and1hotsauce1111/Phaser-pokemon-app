export default class BattleMenu extends Phaser.Scene {
  constructor() {
    super({ key: 'BattleMenu' });
  }

  preload() {}

  create() {
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
    this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  createMenu() {
    // menu style
    this.menu = this.add.graphics();
    this.menu.fillStyle(0xFFFFFF, 1);
    this.menu.fillRoundedRect(485, 491, 315, 108, 16);
    this.menu.strokeRoundedRect()
    // menu border style
    this.menu.lineStyle(5, 0x8388A4, 1);
    this.menu.strokeRoundedRect(485, 491, 315, 108, 16);

    this.fightText = this.add
      .text(550, 510, '戰鬥', { color: '#000' })
      .setFontSize('25px');
    this.pokemonText = this.add
      .text(550, 560, '寶可夢', { color: '#000' })
      .setFontSize('25px');
    this.bagText = this.add
      .text(700, 510, '包包', { color: '#000' })
      .setFontSize('25px');
    this.runText = this.add
      .text(700, 560, '逃走', { color: '#000' })
      .setFontSize('25px');

    this.menuPointer = this.add.polygon(
      533,
      524,
      [0, 0, 0, 20, 10, 10],
      0x636363,
    );
    this.currentSelectedMenu = 'fight';
  }

  endBattle() {
    this.scene.stop('BattleScene');
    this.scene.stop('BattleMenu');
    this.scene.run('WildScene');
    this.input.keyboard.removeAllKeys();
  }

  updateSelectMenu() {
    // 使用Phaser.Input.Keyboard.JustDown 避免多次觸發keypress event
    if (Phaser.Input.Keyboard.JustDown(this.cursors.left) || Phaser.Input.Keyboard.JustDown(this.keyA)) {
      if (this.currentSelectedMenu === 'fight' || this.currentSelectedMenu === 'pokemon') return;
      if (this.currentSelectedMenu === 'bag') {
        this.menuPointer.setPosition(533, 524);
        this.currentSelectedMenu = 'fight';
      }
      if (this.currentSelectedMenu === 'run') {
        this.menuPointer.setPosition(533, 574);
        this.currentSelectedMenu = 'pokemon';
      }
    }
    if (Phaser.Input.Keyboard.JustDown(this.cursors.right) || Phaser.Input.Keyboard.JustDown(this.keyD)) {
      if (this.currentSelectedMenu === 'bag' || this.currentSelectedMenu === 'run') return;
      if (this.currentSelectedMenu === 'fight') {
        this.menuPointer.setPosition(683, 524);
        this.currentSelectedMenu = 'bag';
      }
      if (this.currentSelectedMenu === 'pokemon') {
        this.menuPointer.setPosition(683, 574);
        this.currentSelectedMenu = 'run';
      }
    }
    if (Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.keyW)) {
      if (this.currentSelectedMenu === 'fight' || this.currentSelectedMenu === 'bag') return;
      if (this.currentSelectedMenu === 'pokemon') {
        this.menuPointer.setPosition(533, 524);
        this.currentSelectedMenu = 'fight';
      }
      if (this.currentSelectedMenu === 'run') {
        this.menuPointer.setPosition(683, 524);
        this.currentSelectedMenu = 'bag';
      }
    }
    if (Phaser.Input.Keyboard.JustDown(this.cursors.down) || Phaser.Input.Keyboard.JustDown(this.keyS)) {
      if (this.currentSelectedMenu === 'pokemon' || this.currentSelectedMenu === 'run') return;
      if (this.currentSelectedMenu === 'fight') {
        this.menuPointer.setPosition(533, 574);
        this.currentSelectedMenu = 'pokemon';
      }
      if (this.currentSelectedMenu === 'bag') {
        this.menuPointer.setPosition(683, 574);
        this.currentSelectedMenu = 'run';
      }
    }
  }

  updateAction() {
    if (Phaser.Input.Keyboard.JustDown(this.keyEnter) || Phaser.Input.Keyboard.JustDown(this.keySpace)) {
      if (this.currentSelectedMenu === 'run') {
        this.endBattle();
      }
    }
  }
}
