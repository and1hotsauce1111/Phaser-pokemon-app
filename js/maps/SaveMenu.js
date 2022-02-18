import Person from "../characters/Person.js";

export default class SaveMenu extends Phaser.Scene {
  constructor() {
    super({ key: "SaveMenu" });
  }

  preload() {}

  create() {
    // menu style
    this.menu = this.add.graphics();
    this.menu.fillStyle(0xffffff, 1);
    this.menu.fillRoundedRect(580, 50, 200, 300, 16);
    this.menu.strokeRoundedRect();
    // menu border style
    this.menu.lineStyle(5, 0x8388a4, 1);
    this.menu.strokeRoundedRect(580, 50, 200, 300, 16);

    this.pokemonListText = this.add
      .text(630, 90, "隊伍列表", { color: "#000" })
      .setFontSize("25px");
    this.itemListText = this.add
      .text(630, 140, "道具", { color: "#000" })
      .setFontSize("25px");
    this.saveText = this.add
      .text(630, 190, "存檔", { color: "#000" })
      .setFontSize("25px");
    this.saveText = this.add
      .text(630, 240, "讀檔", { color: "#000" })
      .setFontSize("25px");
    this.exitText = this.add
      .text(630, 290, "離開", { color: "#000" })
      .setFontSize("25px");

    this.menuPointer = this.add.polygon(
      610,
      100,
      [0, 0, 0, 20, 10, 10],
      0x636363
    );
    this.currentSelectedMenu = "team";
  }

  update() {
    this.updateSelectedMenu();
  }

  init(config) {
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

    if (config.currentMapInfo) {
      this.currentMapInfo = config.currentMapInfo;
    }

    console.log(window.GameObjects);
  }

  updateSelectedMenu() {
    if (
      Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
      Phaser.Input.Keyboard.JustDown(this.keyW)
    ) {
      if (this.currentSelectedMenu === "team") return;
      if (this.currentSelectedMenu === "item") {
        this.menuPointer.setPosition(610, 100);
        this.currentSelectedMenu = "team";
        return;
      }
      if (this.currentSelectedMenu === "save") {
        this.menuPointer.setPosition(610, 150);
        this.currentSelectedMenu = "item";
        return;
      }
      if (this.currentSelectedMenu === "load") {
        this.menuPointer.setPosition(610, 200);
        this.currentSelectedMenu = "save";
        return;
      }
      if (this.currentSelectedMenu === "leave") {
        this.menuPointer.setPosition(610, 250);
        this.currentSelectedMenu = "load";
        return;
      }
    }

    if (
      Phaser.Input.Keyboard.JustDown(this.cursors.down) ||
      Phaser.Input.Keyboard.JustDown(this.keyS)
    ) {
      if (this.currentSelectedMenu === "leave") return;
      if (this.currentSelectedMenu === "team") {
        this.menuPointer.setPosition(610, 150);
        this.currentSelectedMenu = "item";
        return;
      }
      if (this.currentSelectedMenu === "item") {
        this.menuPointer.setPosition(610, 200);
        this.currentSelectedMenu = "save";
        return;
      }
      if (this.currentSelectedMenu === "save") {
        this.menuPointer.setPosition(610, 250);
        this.currentSelectedMenu = "load";
        return;
      }
      if (this.currentSelectedMenu === "load") {
        this.menuPointer.setPosition(610, 300);
        this.currentSelectedMenu = "leave";
        return;
      }
    }

    if (
      Phaser.Input.Keyboard.JustDown(this.keySpace) ||
      Phaser.Input.Keyboard.JustDown(this.keyEnter)
    ) {
      if (this.currentSelectedMenu === "team") {
        this.scene.run('PokemonTeamScene');
      }
      if (this.currentSelectedMenu === "item") {
      }

      if (this.currentSelectedMenu === "save") {
        this.saveGame();
        this.showTextMessage("save");
      }

      if (this.currentSelectedMenu === "load") {
        this.showTextMessage("load");
      }

      if (this.currentSelectedMenu === "leave") {
        this.endEditMenu();
      }
    }

    //關閉選單
    if (Phaser.Input.Keyboard.JustDown(this.keyEsc)) {
      this.endEditMenu();
    }
  }

  endEditMenu() {
    this.input.keyboard.removeAllKeys();

    const initMapActive = this.scene.isPaused("InitMapScene");
    const wildMapActive = this.scene.isPaused("WildScene");

    if (initMapActive) {
      this.scene.stop("SaveMenu");
      this.scene.run("InitMapScene");
    }

    if (wildMapActive) {
      this.scene.stop("SaveMenu");
      this.scene.run("WildScene");
    }
  }

  loadGame() {
    const saveData = window.localStorage.getItem("pokemon-save-data");
    if (!saveData) return;
    // 關閉選單
    this.scene.stop(this);
    // 恢復玩家所在地圖和位置
    const mapInfo = JSON.parse(saveData).currentMapInfo;
    const playerPosition = {
      x: mapInfo.playerX,
      y: mapInfo.playerY,
      direction: mapInfo.playerSprite,
    };

    // restart all scenes
    this.scene.stop(this.currentMapInfo.currentMapScene);
    this.scene.run(mapInfo.currentMap, { playerPosition });
  }

  saveGame() {
    const currentMapInfo = {
      currentMap: this.currentMapInfo.currentMapScene,
      playerX: this.currentMapInfo.player.x || 341.31,
      playerY: this.currentMapInfo.player.y || 1175.91,
      playerSprite:
        this.currentMapInfo.player.frame.name ||
        "player-front-walk.002.png",
    };

    window.GameObjects.currentMapInfo = currentMapInfo;
    localStorage.setItem(
      "pokemon-save-data",
      JSON.stringify(window.GameObjects)
    );
  }

  showTextMessage(type) {
    this.scene.pause("SaveMenu");
    const text = type === "save" ? "存檔" : "讀檔";

    this.textArea = this.add.graphics();
    this.textArea.fillStyle(0xffffff, 1);
    this.textArea.fillRoundedRect(0, 491, 800, 110, 0);
    this.textArea.strokeRoundedRect();
    this.textArea.lineStyle(5, 0x8388a4, 1);
    this.textArea.strokeRoundedRect(0, 491, 800, 110, 0);

    this.scene.run("TextScene", {
      fromScene: "SaveMenu",
      gameStatus: type,
      text: `完成${text}!`,
      color: "#666",
      pointerColor: 0x666666,
    });
    this.scene.bringToTop("TextScene");
  }
}
