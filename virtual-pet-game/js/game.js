/// <reference path="./types/index.d.ts" />

const gameScene = new GameScene('game');
const homeScene = new HomeScene('home');
const loadingScene = new LoadingScene('load');

const game = new Phaser.Game({
    width: 360,
    height: 640,
    scene: [ loadingScene, homeScene, gameScene ]
});