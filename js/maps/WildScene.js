import Person from '../characters/Person.js';
import Pokemon from '../characters/Pokemon.js';

export default class WildScene extends Phaser.Scene {
  constructor() {
    // 帶入參數作為WildScene的key值
    super({ key: 'WildScene' });
    this.map = null;
    this.encounterPokemonRate = 3;
    // match遭遇pokemon機率
    this.matchEncounterPokemonRate = false;
  }

  preload() {
    this.load.image(
      'tiles',
      '/assets/tilesets/tuxmon-sample-32px-extruded.png',
    );
    this.load.tilemapTiledJSON('WildMap', '/assets/tilemaps/wild-1.json');

    this.load.atlas(
      'player',
      '/assets/atlas/player.png',
      '/assets/atlas/player.json',
    );
  }

  create() {
    this.map = this.make.tilemap({ key: 'WildMap' });

    this.tileset = this.map.addTilesetImage(
      'tuxmon-sample-32px-extruded',
      'tiles',
    );

    const belowLayer = this.map.createLayer('Below Player', this.tileset, 0, 0);
    const worldLayer = this.map.createLayer('World', this.tileset, 0, 0);
    const aboveLayer = this.map.createLayer('Above Player', this.tileset, 0, 0);

    worldLayer.setCollisionByProperty({ collides: true });
    // this.aboveLayer.setCollisionByProperty({ grass: true });

    // 確保上層圖壓過 worldLayer
    aboveLayer.setDepth(10);

    // 物件起始位置 （玩家起始位置）
    const playerPosition = this.map.findObject(
      'Objects',
      (obj) => obj.name === 'Player Position',
    );

    // 創建玩家
    this.player = new Person(
      this,
      'player',
      playerPosition.x,
      playerPosition.y,
    );

    // 添加障礙物
    this.collider = this.physics.add.collider(this.player.sprite, worldLayer);

    // 相機視角
    const camera = this.cameras.main;
    camera.startFollow(this.player.sprite);
    camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
  }

  update(time, delta) {
    // 到達特定地點後 切換地圖
    const isChangeMap = this.isChangeMap('Goto InitMap');
    if (isChangeMap) {
      // 切換地圖
      this.destroy();
      this.scene.run('InitMapScene', { fromMap: 'WildScene' });
    }

    this.isEncounterPokemon();
    this.player.update();
  }

  destroy() {
    this.map.removeAllLayers();
    this.player.destroy();
    this.collider.world.removeCollider();
  }

  isChangeMap(mapName) {
    // 避免destroy後 找不到player
    if (!this.player.sprite.body) return;

    const changeMapPosition = this.map.findObject(
      'Objects',
      (obj) => obj.name === mapName,
    );
    const changeMapPositionX = Math.abs(changeMapPosition.x);
    const changeMapPositionY = Math.abs(changeMapPosition.y);
    const changeMapPositionWidth = Math.abs(changeMapPosition.width);
    const changeMapPositionHeight = Math.abs(changeMapPosition.height);
    const changeMapAreaX = changeMapPositionX + changeMapPositionWidth;
    const changeMapAreaY = changeMapPositionY + changeMapPositionHeight;
    const currentPlayerPositionX = this.player.sprite.body.x;
    const currentPlayerPositionY = this.player.sprite.body.y;
    const inChangeMapAreaX =
      currentPlayerPositionX >= changeMapPositionX &&
      currentPlayerPositionX <= changeMapAreaX;
    const inChangeMapAreaY =
      currentPlayerPositionY >= changeMapPositionY &&
      currentPlayerPositionY <= changeMapAreaY;

    if (inChangeMapAreaX && inChangeMapAreaY) return true;

    return false;
  }

  async isEncounterPokemon() {
    if (!this.player.sprite.body) return;

    // 判斷是否在野生草地中
    const tileToWorld = this.map.getTilesWithinWorldXY(
      this.player.sprite.x,
      this.player.sprite.y,
      5,
      5,
    );

    if (tileToWorld.length) {
      // 篩選出草地區塊
      const tile = tileToWorld.filter(
        (tile) => Object.keys(tile.properties).length && tile.properties.grass,
      );

      // has tile length 觸發encounter pokemon
      if (tile.length && this.player.isMoving) {
        // 添加flag 避免重複調用
        // this.scene.pause('WildScene');

        // encountered rate 500
        const isEncounter =
          Math.floor(Math.random() * 50) === this.encounterPokemonRate;
        // const isEncounter = true;

        if (isEncounter) {
          // 隨機野生pokemon
          this.scene.pause('WildScene');

          const wildPokemon = new Pokemon();
          await wildPokemon.getWildPokemon();

          // TODO: 添加玩家的pokemon team至battle scene
          this.scene.run('BattleScene', {
            fromScene: this,
            wildPokemon: wildPokemon.wildPokemon,
          });

        } else {
          this.scene.run('WildScene');
        }
      }
    }
  }
}
