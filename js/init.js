import InitMapScene from "./maps/InitMapScene.js";
import WildScene from "./maps/WildScene.js";
import BattleScene from "./battle/BattleScene.js";
import BattleMenu from "./battle/BattleMenu.js";
import TextScene from './battle/TextScene.js';

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
  scene: [InitMapScene, WildScene, BattleScene, BattleMenu, TextScene],
};

const game = new Phaser.Game(config);