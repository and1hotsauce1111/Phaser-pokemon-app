import InitMapScene from './maps/InitMapScene.js';
import WildScene from './maps/WildScene.js';
import BattleScene from './battle/BattleScene.js';
import BattleMenu from './battle/BattleMenu.js';
import TextScene from './battle/TextScene.js';
import AttackScene from './battle/AttackMenu.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
    },
  },
  scene: [
    InitMapScene,
    WildScene,
    BattleScene,
    BattleMenu,
    TextScene,
    AttackScene,
  ],
};

const game = new Phaser.Game(config);

window.GameObjects = {
  // 決定誰的回合
  whosTurn: 'player',
  isEndBattle: false,
  wildPokemon: {},
  playerPokemonTeam: []
}