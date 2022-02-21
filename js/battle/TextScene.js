import { eventsCenter } from "../EventsCenter.js";

export default class TextScene extends Phaser.Scene {
  constructor() {
    super({ key: "TextScene" });
    this.showText = null;
    this.endText = false;
    this.wildPokemon = {};
    this.completeText = false;
  }

  preload() {
    this.load.image("brush", "/assets/images/brush2.png");
  }

  create(config) {
    this.fromScene = config.fromScene;
    this.gameStatus = config.gameStatus;

    if (Object.keys(window.GameObjects.wildPokemon).length) {
      this.wildPokemon = window.GameObjects.wildPokemon;
    }
    // 預設為玩家隊伍第一隻pokemon
    // TODO: 添加玩家隊伍列表後，更換為玩家當前選擇的pokemon
    if (window.GameObjects.playerPokemonTeam.length) {
      // this.playerCurrentPokemon = window.GameObjects.playerPokemonTeam[0];
      this.playerCurrentPokemon = window.GameObjects.playerPokemonTeam.find(pokemon => pokemon.currentHp > 0);
    }

    if (config.playerAttackEffect) {
      this.playerAttackEffect = config.playerAttackEffect;
    }

    if (config.opponentAttackEffect) {
      this.opponentAttackEffect = config.opponentAttackEffect;
    }

    const textStyle = {
      font: "22px monospace",
      lineSpace: 4,
      color: config.color || "#fff",
    };
    this.showText = config.text;
    this.add
      .text(30, 490, this.showText, textStyle)
      .setAlpha(0.25)
      .setVisible(false);
    this.addText = this.add.text(50, 530, this.showText, textStyle);
    const { lineHeight, lineSpacing, lineWidths } =
      Phaser.GameObjects.GetTextSize(
        this.addText,
        this.addText.getTextMetrics(),
        this.showText.split("\n")
      );
    const totalLineHeight = lineHeight + lineSpacing;

    const pointerColor = config.pointerColor || 0xffffff;
    this.textPointer = this.add.polygon(
      750,
      570,
      [0, 0, 18, 0, 9, 18],
      pointerColor,
    );
    this.tweens.add({
      targets: this.textPointer,
      alpha: 0,
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    this.add
      .grid(
        this.addText.x,
        this.addText.y,
        800,
        110,
        lineHeight,
        totalLineHeight,
        0,
        0,
        0xffffff,
        0.5
      )
      .setOrigin(0, 0)
      .setVisible(false);
    const rt = this.make.renderTexture(
      {
        x: this.addText.x,
        y: this.addText.y,
        width: this.addText.width,
        height: this.addText.height,
      },
      false
    );
    const mask = rt.createBitmapMask();

    this.addText.setMask(mask);

    const path = new Phaser.Curves.Path();

    textStyle.metrics = this.addText.getTextMetrics();

    for (let i = 0, len = lineWidths.length; i < len; i++) {
      const lineWidth = lineWidths[i];
      const y = (i + 0.5) * totalLineHeight;

      path.moveTo(0, y).lineTo(0 + lineWidth, y);
    }

    const graphics = this.add
      .graphics({
        x: this.addText.x,
        y: this.addText.y,
        lineStyle: { color: 0xffffff, alpha: 0.5, width: 5 },
      })
      .setVisible(false);

    path.draw(graphics);

    this.brush = this.add
      .follower(path, 0, 0, "brush")
      .setDisplaySize(48, 48)
      .setAlpha(0.5)
      .setVisible(false)
      .startFollow({
        duration: 200 * this.showText.length,
        ease: "Power2.easeInOut",
        onUpdate: () => {
          rt.draw(this.brush);
        },
        onComplete: () => {
          this.endText = true;
          this.brush.pathTween.timeScale = 1;
        },
      });
  }

  update() {
    this.textToEnd();
  }

  init() {
    this.keyEnter = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );
    this.keySpace = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
  }

  textToEnd() {
    if (
      Phaser.Input.Keyboard.JustDown(this.keyEnter) ||
      Phaser.Input.Keyboard.JustDown(this.keySpace)
    ) {
      // 加速文字動畫進行
      if (!this.endText) {
        // 僅針對文字動畫部分加速
        this.brush.pathTween.timeScale = 10;
        return;
      }

      if (this.fromScene === "SaveMenu") {
        this.updateAction();
      }

      // 延遲顯示menu
      this.timer = this.time.addEvent({
        delay: 300,
        callback: () => {
          this.endText = false;
          this.updateAction();
        },
        callbackScope: this,
      });
    }
  }

  updateAction() {
    const whosTurn = window.GameObjects.whosTurn;
    const isEndBattle = window.GameObjects.isEndBattle;

    // 若為戰鬥開場，text message結束直接顯示 battle menu
    if (this.fromScene === "BattleScene") {
      if (!this.completeText) {
        this.completeText = true;
        this.scene.start("TextScene", {
          fromScene: "BattleScene",
          text: `去吧！${
            this.playerCurrentPokemon.zh_Hant_name ||
            this.playerCurrentPokemon.name
          }!`,
        });

        return;
      }
      // 添加summon pokemon animation
      eventsCenter.emit("play-summonpokemon-anim");
      this.scene.stop("TextScene");
      this.completeText = false;
    }

    // 玩家發動攻擊後
    if (
      whosTurn === "player" &&
      this.fromScene !== "BattleScene" &&
      this.fromScene !== "SaveMenu" &&
      !isEndBattle
    ) {
      // damage_class !== 'status' 時才顯示攻擊效果
      if (this.playerAttackEffect.damageClass === "status") {
        this.scene.stop("TextScene");
        // 對方進攻
        window.GameObjects.whosTurn = "opponent";
        eventsCenter.emit("opponent-attack", this.wildPokemon);
        return;
      }

      this.scene.stop("TextScene");
      // 玩家寶可夢攻擊力比例換算
      const actualPower = this.playerAttackEffect.power * 0.35;
      window.GameObjects.wildPokemon.currentHp -= actualPower;
      eventsCenter.emit("update-opponent-hp");
    }

    // 對手進攻回合
    if (whosTurn === "opponent" && !isEndBattle) {
      if (this.opponentAttackEffect.damageClass === "status") {
        window.GameObjects.whosTurn = "player";
        this.scene.stop("TextScene");
        this.scene.run("BattleMenu");
        return;
      }

      this.scene.stop("TextScene");
      // 玩家寶可夢攻擊力比例換算
      const actualPower = this.opponentAttackEffect.power * 0.35;

      //TODO: 替換成玩家當前選擇的pokemon
      // window.GameObjects.playerPokemonTeam[0].currentHp -= actualPower;
      const targetIndex = window.GameObjects.playerPokemonTeam.findIndex(pokemon => pokemon.currentHp > 0);
      window.GameObjects.playerPokemonTeam[targetIndex].currentHp -= actualPower;
      eventsCenter.emit("update-player-hp");
    }

    // 戰鬥結束
    if (isEndBattle) {
      eventsCenter.emit("end-battle-anim");
    }

    // 關閉存/讀檔訊息
    if (this.fromScene === "SaveMenu") {
      const saveMenu = this.scene.manager.keys['SaveMenu'];

      if (this.gameStatus === 'save') {
        this.scene.stop("TextScene");
        saveMenu.textArea.destroy();
        this.scene.run('SaveMenu');
      }

      if (this.gameStatus === 'load') {
        this.scene.stop("TextScene");
        saveMenu.textArea.destroy();
        saveMenu.loadGame();
      }
    }

    if (this.timer) this.timer.remove();
  }
}
