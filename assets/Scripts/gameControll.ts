
import { _decorator, Component, Node, Button, Label, Color } from 'cc';
import { slotControll } from './slotControll';
const { ccclass, property } = _decorator;

@ccclass('gameControll')
export class gameControll extends Component {

  @property(Node)
  slot1: Node;
  @property(Node)
  slot2: Node;
  @property(Node)
  slot3: Node;
  @property(Node)
  slot4: Node;
  @property(Node)
  slot5: Node;
  @property(Button)
  btnStart: Button;
  @property(Button)
  btnReset: Button;
  @property(Label)
  game_info: Label;
  @property(Label)
  number_info: Label;
  @property(Label)
  rate_star: Label;

  private _isRuning = false;
  get isRuning() {
    return this._isRuning;
  }
  set isRuning(isRuning) {
    this._isRuning = isRuning;
    this.btnReset.interactable = !isRuning;
    this.btnStart.interactable = !isRuning;
  }

  slotNumbers: Array<number[]> = [];

  slotCtrls: slotControll[] = [];

  start() {
    this.slotCtrls = [
      this.slot1.getComponent(slotControll),
      this.slot2.getComponent(slotControll),
      this.slot3.getComponent(slotControll),
      this.slot4.getComponent(slotControll),
      this.slot5.getComponent(slotControll),
    ];

    this.btnStart.node.on(Node.EventType.TOUCH_END, () => {
      if (this.isRuning) return;
      this.isRuning = true;
      this.startGame();
    });

    this.btnReset.node.on(Node.EventType.TOUCH_END, () => {
      if (this.isRuning) return;
      this.resetGame();
    });

    this.updateGameInfo();

  }

  resetGame() {
    this.slotCtrls.forEach(ctrl => {
      ctrl.victoryOdds = 1;
    });
    this.updateGameInfo();
  }

  startGame() {
    this.updateGameInfo();

    this.setInfoMsg("開獎中");

    this.slotNumbers = [];
    this.slotCtrls.forEach((ctrl, i) => {
      ctrl.setStart(3000 + (i * 1000));
      this.slotNumbers.push(ctrl.getSlotNumbers());
    });

    setTimeout(() => {
      this.onSlotDone();
    }, 8000);

  }

  calcLine() {
    const first = this.slotNumbers[0];
    let isLine = false;
    let lineNumber = -1;
    let numIndex0 = 0, numIndex1 = 0, numIndex2 = 0, numIndex3 = 0, numIndex4 = 0;
    for (numIndex0 = 0; numIndex0 < first.length; numIndex0++) {
      const num = first[numIndex0];
      numIndex1 = this.slotNumbers[1].indexOf(num);
      numIndex2 = this.slotNumbers[2].indexOf(num);
      numIndex3 = this.slotNumbers[3].indexOf(num);
      numIndex4 = this.slotNumbers[4].indexOf(num);
      if (numIndex1 >= 0 && numIndex2 >= 0 && numIndex3 >= 0 && numIndex4 >= 0) {
        lineNumber = num;
        isLine = true;
        break;
      }
    }

    // console.log(numIndex0, numIndex1, numIndex2, numIndex3, numIndex4);

    if (isLine) {
      let str = `0${lineNumber}`;
      str = str.substring(str.length - 2);
      this.setInfoMsg(`恭喜連線 ${str}`);
      this.showLine(lineNumber);
    } else {
      this.setInfoMsg("號碼未連線");
    }
  }

  /** 拉霸停止 */
  onSlotDone() {
    this.calcLine();
    this.isRuning = false;
  }

  setInfoMsg(str: string) {
    this.game_info.string = str;
  }

  updateGameInfo() {
    const ctrl = this.slotCtrls[0];
    // 1. 每區號碼
    const { numbers } = ctrl;
    this.number_info.string = `${numbers.join(",")}`;
    // 2. 連線機率 ☆☆☆☆☆
    let star = (Array(ctrl.victoryOdds).fill("★").join("") + "☆☆☆☆☆").substring(0, 4);
    this.rate_star.string = star;
  }

  /** 顯示連線效果, (變色) */
  showLine(num: number) {
    this.slotCtrls.forEach(ctrl => {
      ctrl.setColor(num, Color.RED);
    });
  }
}