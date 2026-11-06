import { CameraController } from './CameraController';
import { EventManager } from './EventManager';
import { GameLoop, UpdatableSystem } from './GameLoop';
import { MatchPhaseManager } from './MatchPhaseManager';
import { SceneManager } from './SceneManager';
import { TimeManager } from './TimeManager';

export class Game {
  private eventManager: EventManager;
  private timeManager: TimeManager;
  private matchPhaseManager: MatchPhaseManager;
  private sceneManager: SceneManager;
  private cameraController: CameraController;
  private gameLoop: GameLoop;

  constructor(canvas: HTMLCanvasElement) {
    this.eventManager = new EventManager();
    this.timeManager = new TimeManager(this.eventManager);
    this.matchPhaseManager = new MatchPhaseManager(
      this.timeManager,
      this.eventManager
    );
    this.sceneManager = new SceneManager(canvas);
    this.cameraController = new CameraController(canvas);
    this.gameLoop = new GameLoop(this.timeManager, this.matchPhaseManager);

    // Pencere yeniden boyutlanmasında kamerayı güncelle
    this.sceneManager.onResize((width: number, height: number) => {
      this.cameraController.resize(width, height);
    });

    // Her karede kamera kontrollerini güncelle ve sahneyi çiz
    this.gameLoop.addFrameListener((realDt: number) => {
      this.cameraController.update(realDt);
    });

    this.gameLoop.setRenderCallback(() => {
      this.sceneManager.render(this.cameraController.getCamera());
    });
  }

  public registerSystem(system: UpdatableSystem): void {
    this.gameLoop.registerSystem(system);
  }

  public startMatchClock(): void {
    this.timeManager.setMatchRunning(true);
    this.matchPhaseManager.startMatch();
  }

  public endMatchClock(): void {
    this.timeManager.setMatchRunning(false);
  }

  public start(): void {
    this.gameLoop.start();
  }

  public stop(): void {
    this.gameLoop.stop();
  }

  public getEventManager(): EventManager {
    return this.eventManager;
  }

  public getTimeManager(): TimeManager {
    return this.timeManager;
  }

  public getMatchPhaseManager(): MatchPhaseManager {
    return this.matchPhaseManager;
  }

  public getSceneManager(): SceneManager {
    return this.sceneManager;
  }

  public getCameraController(): CameraController {
    return this.cameraController;
  }

  public getGameLoop(): GameLoop {
    return this.gameLoop;
  }

  public destroy(): void {
    this.gameLoop.stop();
    this.cameraController.destroy();
    this.sceneManager.destroy();
    this.timeManager.destroy();
    this.eventManager.clear();
  }
}
