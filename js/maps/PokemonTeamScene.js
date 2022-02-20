export default class PokemonTeamScene extends Phaser.Scene {
  constructor() {
    super({ key: "PokemonTeamScene" });
    this.isSwitchPokemon = false;
  }

  preload() {
    // remove the cache
    const texturesList = this.textures.list;
    if (texturesList["hp-bar"]) {
      this.textures.remove("hp-bar");
    }

    this.load.image("pokemon-ball", "/assets/images/pokemon-ball.png");
    this.load.image("hand-up", "/assets/images/hand-up.png");

    // Hp / Exp Bar
    this.load.image("hp-bar-container", "/assets/images/battle-bar-menu.png");
    this.load.image("hp-bar", "/assets/images/hp_bar.png");
    // pokemon icons
    for (let i = 0, len = this.pokemonTeamList.length; i < len; i++) {
      const generation =
        this.pokemonTeamList[i].sprites.versions["generation-vii"];
      if (generation.icons) {
        this.load.image(
          `pokemon-icon-${i + 1}`,
          generation.icons.front_default
        );
      } else {
        this.load.image(
          `pokemon-icon-${i + 1}`,
          this.pokemonTeamList[i].sprites.front_default
        );
      }
    }
  }

  create() {
    this.createPokemonTeamList();
  }

  update() {
    this.updateSelected();
  }

  init() {
    this.pokemonTeamList = window.GameObjects.playerPokemonTeam;

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyEnter = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );
    this.keySpace = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.keyEsc = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ESC
    );
  }

  createPokemonTeamList() {
    // grey background1
    this.greyBackground = this.add.graphics();
    this.greyBackground.setDepth(10);
    this.greyBackground.fillStyle(0x666666, 1);
    this.greyBackground.fillRoundedRect(0, 0, 800, 600, 0);

    // green background2
    this.greenBackground = this.add.graphics();
    this.greenBackground.setDepth(11);
    this.greenBackground.fillStyle(0x409894, 1);
    this.greenBackground.fillRoundedRect(50, 30, 700, 540, 24);

    /** 當前使用pokemon */
    this.currentUsePokemonBlock = this.add.graphics();
    this.currentUsePokemonBlock.setDepth(12);
    this.currentUsePokemonBlock.fillStyle(0xe0e0e0, 1);
    this.currentUsePokemonBlock.fillRoundedRect(30, 120, 230, 160, 8);
    this.currentUsePokemonBlock.lineStyle(5, 0x3068f8, 1);
    this.currentUsePokemonBlock.strokeRoundedRect(30, 120, 230, 160, 8);
    // pokemon icon
    this.currentUsePokemonIcon = this.add
      .image(40, 120, "pokemon-icon-1")
      .setScale(5)
      .setDepth(13);
    //名字
    this.currentUsePokemonName = this.add
      .text(
        90,
        170,
        this.pokemonTeamList[0].zh_Hant_name || this.pokemonTeamList[0].name,
        {
          font: "28px monospace",
          color: "#fff",
        }
      )
      .setDepth(13)
      .setShadow(3, 1, "#000", 2, true, true);
    //等級
    this.currentUsePokemonLevel = this.add
      .text(120, 195, `Lv${this.pokemonTeamList[0].level}`, {
        font: "30px monospace",
        color: "#fff",
      })
      .setDepth(13)
      .setShadow(3.5, 1, "#000", 2, true, true);
    // HP
    this.currentUsePokemonHp = this.add
      .image(100, 230, "hp-bar-container")
      .setDepth(13);
    this.currentUsePokemonBar = this.add
      .image(95, 229, "hp-bar")
      .setOrigin(0)
      .setScale(1.2)
      .setDepth(13);
    this.currentUsePokemonHpText = this.add
      .text(
        135,
        240,
        `${this.pokemonTeamList[0].currentHp}/${this.pokemonTeamList[0].maxHp}`,
        {
          font: "30px monospace",
          color: "#fff",
        }
      )
      .setDepth(13)
      .setShadow(3.5, 1, "#000", 2, true, true);

    this.tweens.add({
      targets: this.currentUsePokemonIcon,
      y: 125,
      yoyo: true,
      duration: 300,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    /** 隊伍列表 */
    let listY = 43;
    for (let i = 1; i < 6; i++) {
      this[`pokemonList${i}Block`] = this.add.graphics();
      this[`pokemonList${i}Block`].setDepth(12);
      this[`pokemonList${i}Block`].fillStyle(0xe0e0e0, 1);
      this[`pokemonList${i}Block`].fillRoundedRect(330, listY, 410, 80, 8);
      this[`pokemonList${i}Block`].lineStyle(3, 0x666666, 1);
      this[`pokemonList${i}Block`].strokeRoundedRect(330, listY, 410, 80, 8);

      this.createPokemonInfo(i, listY);

      listY += 95;
    }

    // cancel
    this.add
      .image(600, 540, "pokemon-ball")
      .setDepth(13)
      .setDisplaySize(55, 55);
    this.cancelButton = this.add.graphics();
    this.cancelButton.setDepth(12);
    this.cancelButton.fillStyle(0x7558a0, 1);
    this.cancelButton.fillRoundedRect(600, 520, 120, 35, 16);
    this.cancelButton.lineStyle(5, 0x45475e, 1);
    this.cancelButton.strokeRoundedRect(600, 520, 120, 35, 16);
    this.add
      .text(640, 526, "取消", {
        font: "22px monospace",
        color: "#fff",
        strokeThickness: 1.2,
      })
      .setDepth(12);

    // cursor
    this.createCursor(120, 280, "normal");
    this.currentSelectedPokemonIndex = 0;
  }

  createPokemonInfo(index, y) {
    // pokemon icon
    this[`pokemonIcon${index}`] = this.add
      .image(330, y + 30, `pokemon-icon-${index + 1}`)
      .setScale(4)
      .setDepth(13);
    //名字
    this[`pokemonName${index}`] = this.add
      .text(
        370,
        y + 15,
        this.pokemonTeamList[index].zh_Hant_name ||
          this.pokemonTeamList[index].name,
        {
          font: "28px monospace",
          color: "#fff",
        }
      )
      .setDepth(13)
      .setShadow(3, 1, "#000", 2, true, true);
    //等級
    this[`pokemonLevel${index}`] = this.add
      .text(380, y + 40, `Lv${this.pokemonTeamList[index].level}`, {
        font: "30px monospace",
        color: "#fff",
      })
      .setDepth(13)
      .setShadow(3.5, 1, "#000", 2, true, true);
    // HP
    this[`pokemonHp${index}`] = this.add
      .image(550, y + 25, "hp-bar-container")
      .setDepth(13);
    this[`pokemonHpBar${index}`] = this.add
      .image(545, y + 24, "hp-bar")
      .setOrigin(0)
      .setScale(1.2)
      .setDepth(13);
    this[`pokemonHpBarText${index}`] = this.add
      .text(
        600,
        y + 40,
        `${this.pokemonTeamList[index].currentHp}/${this.pokemonTeamList[index].maxHp}`,
        {
          font: "30px monospace",
          color: "#fff",
        }
      )
      .setDepth(13)
      .setShadow(3.5, 1, "#000", 2, true, true);
  }

  createCursor(x, y, type) {
    if (type === "normal") {
      this.hand = this.add
        .image(x, y, "hand-up")
        .setDepth(14)
        .setDisplaySize(80, 80);
      this.tweens.add({
        targets: this.hand,
        y: y + 5,
        yoyo: true,
        duration: 300,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    }

    if (type === "switch") {
      this.switchHand = this.add
        .image(x, y, "hand-up")
        .setDepth(14)
        .setDisplaySize(80, 80);
      this.tweens.add({
        targets: this.switchHand,
        y: y + 5,
        yoyo: true,
        duration: 300,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    }
  }

  updateSelected() {
    // up
    if (
      Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
      Phaser.Input.Keyboard.JustDown(this.keyW)
    ) {
      if (
        (this.currentSelectedPokemonIndex === 0 && !this.isSwitchPokemon) ||
        (this.currentSelectedPokemonIndex === 1 && !this.isSwitchPokemon)
      ) {
        return;
      }

      if (this.currentSelectedPokemonIndex === 2 && !this.isSwitchPokemon) {
        this.hand.destroy();
        this.createCursor(700, 120, "normal");
        this.currentSelectedPokemonIndex = 1;
        return;
      }

      if (this.switchPokemonIndex === 2 && this.isSwitchPokemon) {
        if (this.switchHand) this.switchHand.destroy();
        this.createCursor(650, 120, "switch");
        this.switchPokemonIndex = 1;
        this.switchPokemonSprite = this[`pokemonIcon1`].texture.key;
        return;
      }

      if (this.currentSelectedPokemonIndex === 3 && !this.isSwitchPokemon) {
        this.hand.destroy();
        this.createCursor(700, 210, "normal");
        this.currentSelectedPokemonIndex = 2;
        return;
      }

      if (this.switchPokemonIndex === 3 && this.isSwitchPokemon) {
        if (this.switchHand) this.switchHand.destroy();
        this.createCursor(650, 210, "switch");
        this.switchPokemonIndex = 2;
        this.switchPokemonSprite = this[`pokemonIcon2`].texture.key;
        return;
      }

      if (this.currentSelectedPokemonIndex === 4 && !this.isSwitchPokemon) {
        this.hand.destroy();
        this.createCursor(700, 300, "normal");
        this.currentSelectedPokemonIndex = 3;
        return;
      }

      if (this.switchPokemonIndex === 4 && this.isSwitchPokemon) {
        if (this.switchHand) this.switchHand.destroy();
        this.createCursor(650, 300, "switch");
        this.switchPokemonIndex = 3;
        this.switchPokemonSprite = this[`pokemonIcon3`].texture.key;
        return;
      }

      if (this.currentSelectedPokemonIndex === 5 && !this.isSwitchPokemon) {
        this.hand.destroy();
        this.createCursor(700, 390, "normal");
        this.currentSelectedPokemonIndex = 4;
        return;
      }

      if (this.switchPokemonIndex === 5 && this.isSwitchPokemon) {
        if (this.switchHand) this.switchHand.destroy();
        this.createCursor(650, 390, "switch");
        this.switchPokemonIndex = 4;
        this.switchPokemonSprite = this[`pokemonIcon4`].texture.key;
        return;
      }

      if (this.currentSelectedPokemonIndex === -1 && !this.isSwitchPokemon) {
        this.hand.destroy();
        this.createCursor(700, 480, "normal");
        this.currentSelectedPokemonIndex = 5;
        return;
      }
    }

    // down
    if (
      Phaser.Input.Keyboard.JustDown(this.cursors.down) ||
      Phaser.Input.Keyboard.JustDown(this.keyS)
    ) {
      if (
        (this.currentSelectedPokemonIndex === 0 && !this.isSwitchPokemon) ||
        (this.currentSelectedPokemonIndex === -1 && !this.isSwitchPokemon)
      ) {
        return;
      }

      if (this.currentSelectedPokemonIndex === 1 && !this.isSwitchPokemon) {
        this.hand.destroy();
        this.createCursor(700, 210, "normal");
        this.currentSelectedPokemonIndex = 2;
        return;
      }

      if (this.switchPokemonIndex === 1 && this.isSwitchPokemon) {
        if (this.switchHand) this.switchHand.destroy();
        this.createCursor(650, 210, "switch");
        this.switchPokemonIndex = 2;
        this.switchPokemonSprite = this[`pokemonIcon2`].texture.key;
        return;
      }

      if (this.currentSelectedPokemonIndex === 2 && !this.isSwitchPokemon) {
        this.hand.destroy();
        this.createCursor(700, 300, "normal");
        this.currentSelectedPokemonIndex = 3;
        return;
      }

      if (this.switchPokemonIndex === 2 && this.isSwitchPokemon) {
        if (this.switchHand) this.switchHand.destroy();
        this.createCursor(650, 300, "switch");
        this.switchPokemonIndex = 3;
        this.switchPokemonSprite = this[`pokemonIcon3`].texture.key;
        return;
      }

      if (this.currentSelectedPokemonIndex === 3 && !this.isSwitchPokemon) {
        this.hand.destroy();
        this.createCursor(700, 390, "normal");
        this.currentSelectedPokemonIndex = 4;
        return;
      }

      if (this.switchPokemonIndex === 3 && this.isSwitchPokemon) {
        if (this.switchHand) this.switchHand.destroy();
        this.createCursor(650, 390, "switch");
        this.switchPokemonIndex = 4;
        this.switchPokemonSprite = this[`pokemonIcon4`].texture.key;
        return;
      }

      if (this.currentSelectedPokemonIndex === 4 && !this.isSwitchPokemon) {
        this.hand.destroy();
        this.createCursor(700, 480, "normal");
        this.currentSelectedPokemonIndex = 5;
        return;
      }

      if (this.switchPokemonIndex === 4 && this.isSwitchPokemon) {
        if (this.switchHand) this.switchHand.destroy();
        this.createCursor(650, 480, "switch");
        this.switchPokemonIndex = 5;
        this.switchPokemonSprite = this[`pokemonIcon5`].texture.key;
        return;
      }

      if (this.currentSelectedPokemonIndex === 5 && !this.isSwitchPokemon) {
        this.hand.destroy();
        this.createCursor(700, 570, "normal");
        this.currentSelectedPokemonIndex = -1;
        return;
      }
    }

    // right
    if (
      Phaser.Input.Keyboard.JustDown(this.cursors.right) ||
      Phaser.Input.Keyboard.JustDown(this.keyD)
    ) {
      if (this.currentSelectedPokemonIndex !== 0 && !this.isSwitchPokemon)
        return;

      if (!this.isSwitchPokemon) {
        this.hand.destroy();
        this.createCursor(700, 120, "normal");
        this.currentSelectedPokemonIndex = 1;
      } else {
        if (this.switchHand) this.switchHand.destroy();
        this.createCursor(650, 120, "switch");
        this.switchPokemonSprite = this[`pokemonIcon1`].texture.key;
        this.switchPokemonIndex = 1;
      }
    }

    // left
    if (
      Phaser.Input.Keyboard.JustDown(this.cursors.left) ||
      Phaser.Input.Keyboard.JustDown(this.keyA)
    ) {
      if (this.currentSelectedPokemonIndex === 0 && !this.isSwitchPokemon)
        return;

      if (!this.isSwitchPokemon) {
        this.hand.destroy();
        this.createCursor(120, 280, "normal");
        this.currentSelectedPokemonIndex = 0;
      } else {
        if (this.switchHand) this.switchHand.destroy();
        this.createCursor(180, 280, "switch");
        this.switchPokemonSprite = this.currentUsePokemonIcon.texture.key;
        this.switchPokemonIndex = 0;
      }
    }

    // enter/space
    if (
      Phaser.Input.Keyboard.JustDown(this.keySpace) ||
      Phaser.Input.Keyboard.JustDown(this.keyEnter)
    ) {
      if (this.currentSelectedPokemonIndex === -1) {
        this.endEditPokemonTeam();
        return;
      }
      this.isSwitchPokemon = true;

      if (this.currentSelectedPokemonIndex === 0 && !this.switchHand) {
        this.createCursor(180, 280, "switch");
        // find current selected pokemon image index
        // this.currentUsePokemonIcon.texture.key
        // this.switchPokemonSprite = this.currentUsePokemonIcon.texture.key;
        this.switchPokemonIndex = 0;
        return;
      }

      if (this.currentSelectedPokemonIndex === 1 && !this.switchHand) {
        this.createCursor(650, 120, "switch");
        // this.switchPokemonSprite = this[`pokemonIcon1`].texture.key;
        this.switchPokemonIndex = 1;
        return;
      }

      if (this.currentSelectedPokemonIndex === 2 && !this.switchHand) {
        this.createCursor(650, 210, "switch");
        // this.switchPokemonSprite = this[`pokemonIcon2`].texture.key;
        this.switchPokemonIndex = 2;
        return;
      }

      if (this.currentSelectedPokemonIndex === 3 && !this.switchHand) {
        this.createCursor(650, 300, "switch");
        // this.switchPokemonSprite = this[`pokemonIcon3`].texture.key;
        this.switchPokemonIndex = 3;
        return;
      }

      if (this.currentSelectedPokemonIndex === 4 && !this.switchHand) {
        this.createCursor(650, 390, "switch");
        // this.switchPokemonSprite = this[`pokemonIcon4`].texture.key;
        this.switchPokemonIndex = 4;
        return;
      }

      if (this.currentSelectedPokemonIndex === 5 && !this.switchHand) {
        this.createCursor(650, 480, "switch");
        // this.switchPokemonSprite = this[`pokemonIcon5`].texture.key;
        this.switchPokemonIndex = 5;
        return;
      }

      //確定更換隊伍順序
      this.sortPokemonTeam(
        this.currentSelectedPokemonIndex,
        this.switchPokemonIndex
      );
    }

    //關閉選單
    if (Phaser.Input.Keyboard.JustDown(this.keyEsc)) {
      if (!this.isSwitchPokemon) {
        this.endEditPokemonTeam();
      } else {
        this.isSwitchPokemon = false;
        this.switchPokemonIndex = null;
        if (this.switchHand) {
          this.switchHand.destroy();
          this.switchHand = null;
        }
      }
    }
  }

  endEditPokemonTeam() {
    this.input.keyboard.removeAllKeys();

    // 若在戰鬥中則回到BattleMenu
    this.scene.stop("PokemonTeamScene");
    this.scene.run("SaveMenu");
  }

  sortPokemonTeam(originIndex, switchIndex) {
    if (originIndex === switchIndex) {
      // clear cursor
      this.switchHand.destroy();
      this.switchHand = null;
      this.isSwitchPokemon = false;
      return;
    }
    // 當前使用pokemon與列表中pokemon交換
    if (originIndex === 0) {
      this.currentUsePokemonIcon.setTexture(`pokemon-icon-${switchIndex + 1}`);

      const pokemonName =
        this.pokemonTeamList[switchIndex].zh_Hant_name ||
        this.pokemonTeamList[switchIndex].name;
      this.currentUsePokemonName.setText(pokemonName);

      const level = this.pokemonTeamList[switchIndex].level;
      this.currentUsePokemonLevel.setText(`Lv${level}`);

      // HP
      // TODO: reset hp bar display width
      this.currentUsePokemonHpText.setText(
        `${this.pokemonTeamList[switchIndex].currentHp}/${this.pokemonTeamList[switchIndex].maxHp}`
      );

      this.tweens.add({
        targets: this.currentUsePokemonIcon,
        y: 125,
        yoyo: true,
        duration: 300,
        repeat: -1,
        ease: "Sine.easeInOut",
      });

      // switch pokemon
      this[`pokemonIcon${switchIndex}`].setTexture(
        this.currentUsePokemonIcon.texture.key
      );
      const switchName =
        this.pokemonTeamList[0].zh_Hant_name || this.pokemonTeamList[0].name;
      this[`pokemonName${switchIndex}`].setText(switchName);
      const switchLevel = this.pokemonTeamList[0].level;
      this[`pokemonLevel${switchIndex}`].setText(`Lv${switchLevel}`);
      // TODO: reset hp bar display width
      this[`pokemonHpBarText${switchIndex}`].setText(
        `${this.pokemonTeamList[0].currentHp}/${this.pokemonTeamList[0].maxHp}`
      );
    } else if (switchIndex === 0) {
      // 列表中pokemon與使用中的pokemon交換
      this.currentUsePokemonIcon.setTexture(`pokemon-icon-${originIndex + 1}`);
      const pokemonName =
        this.pokemonTeamList[originIndex].zh_Hant_name ||
        this.pokemonTeamList[originIndex].name;
      this.currentUsePokemonName.setText(pokemonName);

      const level = this.pokemonTeamList[originIndex].level;
      this.currentUsePokemonLevel.setText(`Lv${level}`);

      this.currentUsePokemonHpText.setText(
        `${this.pokemonTeamList[originIndex].currentHp}/${this.pokemonTeamList[originIndex].maxHp}`
      );

      this.tweens.add({
        targets: this.currentUsePokemonIcon,
        y: 125,
        yoyo: true,
        duration: 300,
        repeat: -1,
        ease: "Sine.easeInOut",
      });

      this[`pokemonIcon${originIndex}`].setTexture(this.switchPokemonSprite);
      const switchName =
        this.pokemonTeamList[0].zh_Hant_name || this.pokemonTeamList[0].name;
      this[`pokemonName${originIndex}`].setText(switchName);
      const switchLevel = this.pokemonTeamList[0].level;
      this[`pokemonLevel${originIndex}`].setText(`Lv${switchLevel}`);
      // TODO: reset hp bar display width
      this[`pokemonHpBarText${originIndex}`].setText(
        `${this.pokemonTeamList[0].currentHp}/${this.pokemonTeamList[0].maxHp}`
      );
    } else {
      // 列表中的pokemon交換
      this[`pokemonIcon${originIndex}`].setTexture(this.switchPokemonSprite);
      const switchName =
        this.pokemonTeamList[switchIndex].zh_Hant_name ||
        this.pokemonTeamList[switchIndex].name;
      this[`pokemonName${originIndex}`].setText(switchName);
      const switchLevel = this.pokemonTeamList[switchIndex].level;
      this[`pokemonLevel${originIndex}`].setText(`Lv${switchLevel}`);
      // TODO: reset hp bar display width
      this[`pokemonHpBarText${originIndex}`].setText(
        `${this.pokemonTeamList[switchIndex].currentHp}/${this.pokemonTeamList[switchIndex].maxHp}`
      );

      this[`pokemonIcon${switchIndex}`].setTexture(
        `pokemon-icon-${originIndex + 1}`
      );
      const originName =
        this.pokemonTeamList[originIndex].zh_Hant_name ||
        this.pokemonTeamList[originIndex].name;
      this[`pokemonName${switchIndex}`].setText(originName);
      const originLevel = this.pokemonTeamList[originIndex].level;
      this[`pokemonLevel${switchIndex}`].setText(`Lv${originLevel}`);
      // TODO: reset hp bar display width
      this[`pokemonHpBarText${switchIndex}`].setText(
        `${this.pokemonTeamList[originIndex].currentHp}/${this.pokemonTeamList[originIndex].maxHp}`
      );
    }

    // store in window object
    const originPokemon = JSON.parse(
      JSON.stringify(window.GameObjects.playerPokemonTeam[originIndex])
    );
    const switchPokemon = JSON.parse(
      JSON.stringify(window.GameObjects.playerPokemonTeam[switchIndex])
    );
    window.GameObjects.playerPokemonTeam[originIndex] = switchPokemon;
    window.GameObjects.playerPokemonTeam[switchIndex] = originPokemon;

    // clear cursor
    this.switchHand.destroy();
    this.switchHand = null;
    this.isSwitchPokemon = false;
  }
}
