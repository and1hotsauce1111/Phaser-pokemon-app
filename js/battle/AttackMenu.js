import { eventsCenter } from '../EventsCenter.js';

export default class AttackMenu extends Phaser.Scene {
  constructor() {
    super({ key: 'AttackMenu' });
    this.pokemonInfo = {};
    this.pokemonName = '';
    // this.movePP = {};
  }

  preload() {}

  create() {
    if (window.GameObjects.playerPokemonTeam.length) {
      this.pokemonInfo = window.GameObjects.playerPokemonTeam[0];
      this.pokemonName = this.pokemonInfo.zh_Hant_name || this.pokemonInfo.name;
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

    // 左側招式列表
    this.leftMenu = this.add.graphics();
    this.leftMenu.fillStyle(0xffffff, 1);
    this.leftMenu.fillRoundedRect(3, 491, 485, 108, 16);
    this.leftMenu.strokeRoundedRect();
    this.leftMenu.lineStyle(5, 0x8388a4, 1);
    this.leftMenu.strokeRoundedRect(3, 491, 485, 108, 16);

    // pokemon 招式
    this.firstMoveName =
      this.pokemonInfo.moves[0].names.find(
        (name) => name.language.name === 'zh-Hant',
      ).name || this.pokemonInfo.moves[0].name;
    this.firstMove = this.add.text(45, 510, this.firstMoveName, {
      font: '25px monospace',
      color: '#666',
    });

    // 紀錄招式pp
    this.movePP = window.GameObjects.playerPokemonTeam[0].movePP;
    const damageType = this.pokemonInfo.moves[0].damage_class.name;
    const currentPP = this.movePP[this.firstMoveName];
    const firstMovePP = this.pokemonInfo.moves[0].pp;


    this.PPText = this.add.text(550, 510, `PP: ${currentPP}/${firstMovePP}`, {
      font: '25px monospace',
      color: '#666',
    });
    this.damageTypeText = this.add.text(550, 550, `類型/${damageType}`, {
      font: '25px monospace',
      color: '#666',
    });

    this.secondMoveName =
      this.pokemonInfo.moves[1].names.find(
        (name) => name.language.name === 'zh-Hant',
      ).name || this.pokemonInfo.moves[1].name;
    this.secondMove = this.add.text(300, 510, this.secondMoveName, {
      font: '25px monospace',
      color: '#666',
    });
    if (!this.movePP[this.secondMoveName]) {
      this.movePP[this.secondMoveName] = this.pokemonInfo.moves[1].pp;
    }

    this.thirdMoveName =
      this.pokemonInfo.moves[2].names.find(
        (name) => name.language.name === 'zh-Hant',
      ).name || this.pokemonInfo.moves[2].name;
    this.thirdMove = this.add.text(45, 560, this.thirdMoveName, {
      font: '25px monospace',
      color: '#666',
    });
    if (!this.movePP[this.thirdMoveName]) {
      this.movePP[this.thirdMoveName] = this.pokemonInfo.moves[2].pp;
    }

    this.fourthMoveName =
      this.pokemonInfo.moves[3].names.find(
        (name) => name.language.name === 'zh-Hant',
      ).name || this.pokemonInfo.moves[3].name;
    this.fourthMove = this.add.text(300, 560, this.fourthMoveName, {
      font: '25px monospace',
      color: '#666',
    });
    if (!this.movePP[this.fourthMoveName]) {
      this.movePP[this.fourthMoveName] = this.pokemonInfo.moves[3].pp;
    }

    this.menuPointer = this.add.polygon(
      30,
      525,
      [0, 0, 0, 20, 10, 10],
      0x636363,
    );

    this.currentSelectedMove = this.firstMoveName;
    this.currentSelectedMoveIndex = 0;
  }

  updateAction() {
    if (Phaser.Input.Keyboard.JustDown(this.keyEsc)) {
      this.scene.stop('AttackMenu');
      this.scene.run('BattleMenu');
    }
    if (
      Phaser.Input.Keyboard.JustDown(this.keyEnter) ||
      Phaser.Input.Keyboard.JustDown(this.keySpace)
    ) {

      // PP為0時
      if (this.movePP[this.currentSelectedMove] === 0) return;

      this.scene.stop('AttackMenu');
      this.scene.stop('BattleMenu');

      // 計算攻擊招式效果
      const currentMove = this.pokemonInfo.moves[this.currentSelectedMoveIndex];
      const currentMovePower = currentMove.power;
      const currentMoveAccuracy = currentMove.accuracy;
      const currentMoveDamageClass = currentMove.damage_class.name;

      window.GameObjects.playerPokemonTeam[0].movePP[this.currentSelectedMove] -= 1;

      const playerAttackEffect = {
        power: currentMovePower,
        accuracy: currentMoveAccuracy,
        damageClass: currentMoveDamageClass,
      };

      this.scene.run('TextScene', {
        fromScene: 'AttackMenu',
        text: `${this.pokemonName}使用了${this.currentSelectedMove}!`,
        playerAttackEffect,
      });
    }
  }

  updateSelectMenu() {
    // show right side menu text
    let movePP = null;
    let currentPP = null;
    let damageType = null;
    // 使用Phaser.Input.Keyboard.JustDown 避免多次觸發keypress event
    if (
      Phaser.Input.Keyboard.JustDown(this.cursors.left) ||
      Phaser.Input.Keyboard.JustDown(this.keyA)
    ) {
      if (
        this.currentSelectedMove === this.firstMoveName ||
        this.currentSelectedMove === this.thirdMoveName
      )
        return;

      if (this.currentSelectedMove === this.secondMoveName) {
        this.menuPointer.setPosition(30, 525);
        this.currentSelectedMove = this.firstMoveName;
        this.currentSelectedMoveIndex = 0;

        movePP = this.pokemonInfo.moves[0].pp;
        currentPP = this.movePP[this.firstMoveName];
        damageType = this.pokemonInfo.moves[0].damage_class.name;
      }
      if (this.currentSelectedMove === this.fourthMoveName) {
        this.menuPointer.setPosition(30, 575);
        this.currentSelectedMove = this.thirdMoveName;
        this.currentSelectedMoveIndex = 2;

        movePP = this.pokemonInfo.moves[2].pp;
        currentPP = this.movePP[this.thirdMoveName];
        damageType = this.pokemonInfo.moves[2].damage_class.name;
      }

      this.PPText.text = `PP: ${currentPP}/${movePP}`;
      this.damageTypeText.text = `類型/${damageType}`;
    }

    if (
      Phaser.Input.Keyboard.JustDown(this.cursors.right) ||
      Phaser.Input.Keyboard.JustDown(this.keyD)
    ) {
      if (
        this.currentSelectedMove === this.secondMoveName ||
        this.currentSelectedMove === this.fourthMoveName
      )
        return;
      if (this.currentSelectedMove === this.firstMoveName) {
        this.menuPointer.setPosition(275, 525);
        this.currentSelectedMove = this.secondMoveName;
        this.currentSelectedMoveIndex = 1;

        movePP = this.pokemonInfo.moves[1].pp;
        currentPP = this.movePP[this.secondMoveName];
        damageType = this.pokemonInfo.moves[1].damage_class.name;
      }
      if (this.currentSelectedMove === this.thirdMoveName) {
        this.menuPointer.setPosition(275, 575);
        this.currentSelectedMove = this.fourthMoveName;
        this.currentSelectedMoveIndex = 3;

        movePP = this.pokemonInfo.moves[3].pp;
        currentPP = this.movePP[this.fourthMoveName];
        damageType = this.pokemonInfo.moves[3].damage_class.name;
      }

      this.PPText.text = `PP: ${currentPP}/${movePP}`;
      this.damageTypeText.text = `類型/${damageType}`;
    }

    if (
      Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
      Phaser.Input.Keyboard.JustDown(this.keyW)
    ) {
      if (
        this.currentSelectedMove === this.firstMoveName ||
        this.currentSelectedMove === this.secondMoveName
      )
        return;
      if (this.currentSelectedMove === this.thirdMoveName) {
        this.menuPointer.setPosition(30, 525);
        this.currentSelectedMove = this.firstMoveName;
        this.currentSelectedMoveIndex = 0;

        movePP = this.pokemonInfo.moves[0].pp;
        currentPP = this.movePP[this.firstMoveName];
        damageType = this.pokemonInfo.moves[0].damage_class.name;
      }
      if (this.currentSelectedMove === this.fourthMoveName) {
        this.menuPointer.setPosition(275, 525);
        this.currentSelectedMove = this.secondMoveName;
        this.currentSelectedMoveIndex = 1;

        movePP = this.pokemonInfo.moves[1].pp;
        currentPP = this.movePP[this.secondMoveName];
        damageType = this.pokemonInfo.moves[1].damage_class.name;
      }

      this.PPText.text = `PP: ${currentPP}/${movePP}`;
      this.damageTypeText.text = `類型/${damageType}`;
    }

    if (
      Phaser.Input.Keyboard.JustDown(this.cursors.down) ||
      Phaser.Input.Keyboard.JustDown(this.keyS)
    ) {
      if (
        this.currentSelectedMove === this.thirdMoveName ||
        this.currentSelectedMove === this.fourthMoveName
      )
        return;
      if (this.currentSelectedMove === this.firstMoveName) {
        this.menuPointer.setPosition(30, 575);
        this.currentSelectedMove = this.thirdMoveName;
        this.currentSelectedMoveIndex = 2;

        movePP = this.pokemonInfo.moves[2].pp;
        currentPP = this.movePP[this.thirdMoveName];
        damageType = this.pokemonInfo.moves[2].damage_class.name;
      }
      if (this.currentSelectedMove === this.secondMoveName) {
        this.menuPointer.setPosition(275, 575);
        this.currentSelectedMove = this.fourthMoveName;
        this.currentSelectedMoveIndex = 3;

        movePP = this.pokemonInfo.moves[3].pp;
        currentPP = this.movePP[this.fourthMoveName];
        damageType = this.pokemonInfo.moves[3].damage_class.name;
      }

      this.PPText.text = `PP: ${currentPP}/${movePP}`;
      this.damageTypeText.text = `類型/${damageType}`;
    }
  }
}
