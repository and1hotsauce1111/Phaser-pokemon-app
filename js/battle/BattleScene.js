import { eventsCenter } from '../EventsCenter.js';

export default class BattleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BattleScene' });
    this.wildPokemonInfo = {};
    this.wildPokemonName = '';
  }

  preload() {
    // remove the cache
    const texturesList = this.textures.list;
    if (texturesList['hp-bar']) {
      this.textures.remove('hp-bar');
    }
    if (texturesList['opponent-pokemon-sprite']) {
      this.textures.remove('opponent-pokemon-sprite');
    }
    if (texturesList['player-pokemon-sprite']) {
      this.textures.remove('player-pokemon-sprite');
    }

    // 背景圖
    this.load.image(
      'battle-background',
      '/assets/images/battle-background.png',
    );

    // Hp / Exp Bar
    this.load.image('battle-bar', '/assets/images/battle-bar.png');
    this.load.image(
      'opponent-battle-bar',
      '/assets/images/opponent-battle-bar.png',
    );
    this.load.image('hp-bar', '/assets/images/hp_bar.png');

    // 判斷顯示第幾代pokemon sprites
    const wildPokemonGen =
      this.wildPokemonInfo.sprites.versions['generation-v']['black-white']['animated'];
    const playerPokemonGen = this.playerPokemonTeam[0].sprites.versions['generation-v']['black-white']['animated'];

    if (wildPokemonGen) {
      this.load.image('opponent-pokemon-sprite', wildPokemonGen.front_shiny);
    } else {
      this.load.image(
        'opponent-pokemon-sprite',
        this.wildPokemonInfo.sprites.front_default,
      );
    }

    if (playerPokemonGen) {
      this.load.image('player-pokemon-sprite', playerPokemonGen.back_shiny);
    } else {
      // tempt player pokemon sprite => TODO: 替換成玩家列表的
      this.load.image(
        'player-pokemon-sprite',
        this.playerPokemonGen.sprites.back_default,
      );
    }
  }

  async create() {
    // 添加過場動畫
    await this.openingScene();

    // 添加站戰鬥畫面背景
    const background = this.add
      .image(400, 300, 'battle-background')
      .setScale(1.5);
    // Battle menu background
    this.menuBackground = this.add.graphics();
    this.menuBackground.setDepth(10);
    this.menuBackground.fillStyle(0xdf4b27, 1);
    this.menuBackground.fillRoundedRect(0, 488, 800, 112, 16);

    this.menuBackground.fillStyle(0x62aba4, 1);
    this.menuBackground.fillRoundedRect(25, 488, 750, 112, 16);

    // 添加開場對話
    this.scene.run('TextScene', {
      fromScene: 'BattleScene',
      text: `你遭遇了野生的${this.wildPokemonName}!`,
    });

    /**
     * 預設顯示第一個 
     * 顯示玩家hp / exp */
    this.playerHp = this.add.image(1000, 420, 'battle-bar').setAlpha(0);
    this.playerHpBar = this.add
      .image(975, 415, 'hp-bar')
      .setAlpha(0)
      .setOrigin(0)
      .setScale(1.3);
    // 實際顯示 = hp百分比 * 147
    this.playerMaxHp = this.playerPokemonTeam[0].maxHp;
    this.playerCurrentHp = this.playerPokemonTeam[0].currentHp;
    this.playerHpBar.displayWidth = 147 * (this.playerCurrentHp / this.playerMaxHp);
    this.playerExpBar = this.add
      .image(925, 465, 'hp-bar')
      .setAlpha(0)
      .setOrigin(0)
      .setScale(0.8);
    this.playerExpBar.displayWidth = 0;

    // 添加移入動畫
    // hpbarX = hp - 15 ; expbarX = hp - 65
    this.tweens.add({
      targets: this.playerHp,
      x: 600,
      alpha: 1,
      duration: 900,
      ease: 'Sine.easeInOut',
    });
    this.tweens.add({
      targets: this.playerHpBar,
      x: 585,
      alpha: 1,
      duration: 900,
      ease: 'Sine.easeInOut',
    });
    this.tweens.add({
      targets: this.playerExpBar,
      x: 535,
      alpha: 1,
      duration: 900,
      ease: 'Sine.easeInOut',
    });
    // 玩家pokemon名字／等級
    this.playerName = this.add.text(1000, 380, this.playerPokemonName, {
      font: '18px monospace',
      color: '#666',
    });
    this.playerLevel = this.add.text(1000, 380, 'Lv 5', {
      font: '16px monospace',
      color: '#666',
    });
    this.tweens.add({
      targets: this.playerName,
      x: 495,
      alpha: 1,
      duration: 950,
      delay: 100,
      ease: 'Sine.easeInOut',
    });
    this.tweens.add({
      targets: this.playerLevel,
      x: 690,
      alpha: 1,
      duration: 950,
      delay: 100,
      ease: 'Sine.easeInOut',
    });
    // 玩家pokemon
    this.add.image(180, 420, 'player-pokemon-sprite').setScale(3.5);


    /** 顯示對手hp */
    this.opponentHp = this.add
      .image(-500, 200, 'opponent-battle-bar')
      .setAlpha(0);
    this.opponentHpBar = this.add
      .image(-535, 206, 'hp-bar')
      .setOrigin(0)
      .setScale(1.2);
    this.opponentMaxHp = this.wildPokemonInfo.maxHp;
    this.opponentCurrentHp = this.wildPokemonInfo.currentHp;
    this.opponentHpBar.displayWidth =
      143 * (this.opponentCurrentHp / this.opponentMaxHp);
    this.tweens.add({
      targets: this.opponentHp,
      x: 250,
      alpha: 1,
      duration: 1000,
      ease: 'Sine.easeInOut',
    });
    this.tweens.add({
      targets: this.opponentHpBar,
      x: 215,
      alpha: 1,
      duration: 1000,
      ease: 'Sine.easeInOut',
    });
    // 對手pokemon名字／等級
    this.opponentName = this.add.text(-500, 175, this.wildPokemonName, {
      font: '18px monospace',
      color: '#666',
    });
    this.opponentLevel = this.add.text(-500, 175, 'Lv 5', {
      font: '16px monospace',
      color: '#666',
    });
    this.tweens.add({
      targets: this.opponentName,
      x: 120,
      alpha: 1,
      duration: 950,
      delay: 100,
      ease: 'Sine.easeInOut',
    });
    this.tweens.add({
      targets: this.opponentLevel,
      x: 310,
      alpha: 1,
      duration: 950,
      delay: 100,
      ease: 'Sine.easeInOut',
    });

    // 對手pokemon
    this.opponentPokemon = this.add
      .image(-500, 250, 'opponent-pokemon-sprite')
      .setScale(1.8)
      .setAlpha(0.5);
    this.tweens.add({
      targets: this.opponentPokemon,
      x: 630,
      alpha: 1,
      duration: 900,
      ease: 'Sine.easeInOut',
    });


    /** 跨Scene間的資料傳遞 */
    eventsCenter.on('update-opponent-hp', this.updateOpponentHp, this);
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      eventsCenter.off('update-opponent-hp', this.updateOpponentHp, this);
    });
  }

  update() {}

  updateOpponentHp() {
    // 先跑傷害的動畫, onComplete後扣hp
    this.tweens.add({
      targets: this.opponentPokemon,
      alpha: 0,
      yoyo: true,
      duration: 300,
      repeat: 1,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        const opponentCurrentHp = window.GameObjects.wildPokemon.currentHp;
        this.opponentHpBar.displayWidth =
          143 * (opponentCurrentHp / this.opponentMaxHp);
        // 添加玩家Menu
        this.scene.run('BattleMenu');
      },
    });
  }

  init() {
    const wildPokemon = window.GameObjects.wildPokemon;
    const playerPokemonTeam = window.GameObjects.playerPokemonTeam;
    if (Object.keys(wildPokemon)) {
      this.wildPokemonInfo = wildPokemon;
      this.wildPokemonName = this.wildPokemonInfo.zh_Hant_name || this.wildPokemonInfo.name;
    }
    if (playerPokemonTeam.length) {
      this.playerPokemonTeam = playerPokemonTeam;
      this.playerPokemonName = playerPokemonTeam[0].zh_Hant_name || playerPokemonTeam[0].name;
    }
  }

  openingScene() {
    return new Promise((resolve) => {
      this.opening = this.add.rectangle(400, 300, 1000, 1000, 0x000000);
      // 添加閃爍動畫
      this.tweens.add({
        targets: this.opening,
        alpha: 0.2,
        duration: 500,
        yoyo: true,
        repeat: 1,
        ease: 'Sine.easeInOut',
        onComplete: () => {
          this.opening.destroy();

          // 添加進場動畫
          this.openingTop = this.add.rectangle(400, 300, 800, 600, 0x000000);
          this.openingBottom = this.add.rectangle(400, 300, 800, 600, 0x000000);
          this.openingBottom.angle = 180;
          this.tweens.add({
            targets: this.openingTop,
            height: 0,
            duration: 1000,
          });
          this.tweens.add({
            targets: this.openingBottom,
            height: 0,
            duration: 1000,
            onComplete: () => {
              resolve();
            },
          });
        },
      });
    });
  }
}
