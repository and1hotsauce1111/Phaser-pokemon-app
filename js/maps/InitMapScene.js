import Person from '../characters/Person.js';
import Pokemon from '../characters/Pokemon.js';

export default class InitMapScene extends Phaser.Scene {
  constructor() {
    // 帶入參數作為InitMapScene的key值
    super({key: 'InitMapScene'});
    this.map = null;
  }

  preload() {
    this.load.image(
      'tiles',
      '/assets/tilesets/tuxmon-sample-32px-extruded.png',
    );
    this.load.tilemapTiledJSON('InitMap', '/assets/tilemaps/init-map.json');

    this.load.atlas(
      'player',
      '/assets/atlas/player.png',
      '/assets/atlas/player.json',
    );
  }

  async create(fromMap) {

    // 判斷是否從其他地圖切換過來，改變player sprite direction
    let playerDirection = 'player-front-walk.002.png'; // default
    if (Object.keys(fromMap).length) {
     playerDirection = 'player-back-walk.002.png';
    }

    this.map = this.make.tilemap({ key: 'InitMap' });

    const tileset = this.map.addTilesetImage('tuxmon-sample-32px-extruded', 'tiles');

    const belowLayer = this.map.createLayer('Below Player', tileset, 0, 0);
    const worldLayer = this.map.createLayer('World', tileset, 0, 0);
    const aboveLayer = this.map.createLayer('Above Player', tileset, 0, 0);

    worldLayer.setCollisionByProperty({ collides: true });

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
      null,
      null,
      playerDirection,
    );

    // 若無存擋則獲取玩家第一隻pokemon
    const pokemon = new Pokemon();
    await pokemon.getPlayerInitPokemon();
    window.GameObjects.playerPokemonTeam.push(pokemon.playerInitPokemon);


    // 添加障礙物
    this.collider = this.physics.add.collider(this.player.sprite, worldLayer);

    // 相機視角
    const camera = this.cameras.main;
    camera.startFollow(this.player.sprite);
    camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
  }

  update(time, delta) {
    this.player.update();
    // 到達特定地點後 切換地圖
    const isChangeMap = this.isChangeMap('Goto Wild');
    if (isChangeMap) {
      this.destroy();
      // 切換地圖
      // this.scene.sleep('InitMapScene').run('WildScene');
      this.scene.run('WildScene');
    }
  }

  destroy() {
    this.map.removeAllLayers();
    this.player.destroy();
    this.collider.world.removeCollider();
  }


  isChangeMap(mapName) {
    // 避免destroy後 找不到player
    if (!this.player.sprite.body) return;

    const changeMapPosition = this.map.findObject('Objects', obj => obj.name === mapName);
    const changeMapPositionX = Math.abs(changeMapPosition.x);
    const changeMapPositionY = Math.abs(changeMapPosition.y);
    const changeMapPositionWidth = Math.abs(changeMapPosition.width);
    const changeMapPositionHeight = Math.abs(changeMapPosition.height);
    const changeMapAreaX = changeMapPositionX + changeMapPositionWidth;
    const changeMapAreaY = changeMapPositionY + changeMapPositionHeight;
    const currentPlayerPositionX = this.player.sprite.body.x;
    const currentPlayerPositionY = this.player.sprite.body.y;
    const inChangeMapAreaX = currentPlayerPositionX >= changeMapPositionX && currentPlayerPositionX <= changeMapAreaX;
    const inChangeMapAreaY = currentPlayerPositionY >= changeMapPositionY && currentPlayerPositionY <= changeMapAreaY;

    if(inChangeMapAreaX && inChangeMapAreaY) return true;

    return false;
  }
}
