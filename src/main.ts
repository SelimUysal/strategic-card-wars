import './styles/main.css';
import { Game } from './core/Game';
import { MAPS } from './data/maps';
import { MapId } from './types';
import { MapGenerator } from './world/MapGenerator';
import { ResourceNodes } from './world/ResourceNodes';
import { Terrain } from './world/Terrain';

// GEÇİCİ TEST KANCASI: Adım 4 harita çizim ve doğrulama testi
const app = document.getElementById('app');
if (app) {
  const canvas = document.createElement('canvas');
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';
  app.appendChild(canvas);

  const game = new Game(canvas);

  // URL adres çubuğunda ?debugmap=<mapId> kontrolü (örnek: ?debugmap=tuna_gecidi)
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const debugMapId = urlParams.get('debugmap');

    if (debugMapId && MAPS[debugMapId as MapId]) {
      const mapDef = MAPS[debugMapId as MapId];
      const randomSeed = Math.floor(Math.random() * 1000000);
      const gameMap = MapGenerator.generate(mapDef, randomSeed);

      // SPEC S4: Harita doğrulaması
      MapGenerator.validateMap(gameMap, mapDef);

      // SPEC S5: Zemin çizimi
      const terrain = new Terrain(gameMap);
      game.getSceneManager().getScene().add(terrain.getGroup());

      // SPEC S6: Kaynak noktaları çizimi ve simülasyon sistemine kaydı
      const resourceNodes = new ResourceNodes(gameMap);
      game.getSceneManager().getScene().add(resourceNodes.getGroup());
      game.registerSystem(resourceNodes);

      // Kamera sınırları ve ortak alana odaklanma
      game.getCameraController().setBounds(gameMap.width, gameMap.height);
      const commonCenter = gameMap.getCommonAreaCenter();
      game.getCameraController().focusOn(commonCenter.x, commonCenter.y);
    }
  }

  game.start();
}
