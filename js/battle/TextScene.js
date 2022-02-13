export default class TextScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TextScene' });
    this.showText = null;
    this.endText = false;
    this.wildPokemon = {};
  }

  preload() {
    this.load.image('brush', '/assets/images/brush2.png');
  }

  create(config) {
    if (Object.keys(window.GameObjects.wildPokemon).length) {
      this.wildPokemon = window.GameObjects.wildPokemon;
    }

    const textStyle = {
      font: '22px monospace',
      lineSpace: 4,
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
        this.showText.split('\n'),
      );
    const totalLineHeight = lineHeight + lineSpacing;

    this.textPointer = this.add.polygon(
      750,
      570,
      [0, 0, 18, 0, 9, 18],
      0xffffff,
    );
    this.tweens.add({
      targets: this.textPointer,
      alpha: 0,
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
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
        0.5,
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
      false,
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
      .follower(path, 0, 0, 'brush')
      .setDisplaySize(48, 48)
      .setAlpha(0.5)
      .setVisible(false)
      .startFollow({
        duration: 200 * this.showText.length,
        ease: 'Power2.easeInOut',
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
      Phaser.Input.Keyboard.KeyCodes.ENTER,
    );
    this.keySpace = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );
  }

  textToEnd() {
    if (
      Phaser.Input.Keyboard.JustDown(this.keyEnter) ||
      Phaser.Input.Keyboard.JustDown(this.keySpace)
    ) {
      // 加速文字動畫進行
      if (!this.endText) {
        this.brush.pathTween.timeScale = 5;
        return;
      }

      // 延遲顯示menu
      this.timer = this.time.addEvent({
        delay: 300,
        callback: () => {
          this.endText = false;
          this.scene.stop('TextScene');
          // 添加玩家Menu
          this.scene.run('BattleMenu');
          this.timer.remove();
        },
        callbackScope: this,
      });
    }
  }
}
