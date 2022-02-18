export default class PokemonTeamScene extends Phaser.Scene {
  constructor() {
    super({ key: "PokemonTeamScene" });
  }

  preload() {
    // remove the cache
    const texturesList = this.textures.list;
    if (texturesList["hp-bar"]) {
      this.textures.remove("hp-bar");
    }

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

  update() {}

  init() {
    this.pokemonTeamList = window.GameObjects.playerPokemonTeam;
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
    this.currentUsePokemonLevel = this.add
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

    /** 隊伍列表 */
      // this.pokemonList1 = this.add.graphics();
      // this.pokemonList1.setDepth(12);
      // this.pokemonList1.fillStyle(0xe0e0e0, 1);
      // this.pokemonList1.fillRoundedRect(330, 43, 410, 90, 8);
      // this.pokemonList1.lineStyle(3, 0x666666, 1);
      // this.pokemonList1.strokeRoundedRect(330, 43, 410, 90, 8);

      // this.pokemonList2 = this.add.graphics();
      // this.pokemonList2.setDepth(12);
      // this.pokemonList2.fillStyle(0xe0e0e0, 1);
      // this.pokemonList2.fillRoundedRect(330, 138, 410, 90, 8);
      // this.pokemonList2.lineStyle(3, 0x666666, 1);
      // this.pokemonList2.strokeRoundedRect(330, 138, 410, 90, 8);
    let listY = 43;
    for (let i = 0; i < 5; i++) {
      this[`pokemonList${i+1}Block`] = this.add.graphics();
      this[`pokemonList${i+1}Block`].setDepth(12);
      this[`pokemonList${i+1}Block`].fillStyle(0xe0e0e0, 1);
      this[`pokemonList${i+1}Block`].fillRoundedRect(330, listY, 410, 90, 8);
      this[`pokemonList${i+1}Block`].lineStyle(3, 0x666666, 1);
      this[`pokemonList${i+1}Block`].strokeRoundedRect(330, listY, 410, 90, 8);

      listY += 95;
    }
  }
}
