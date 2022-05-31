
import { _decorator, Component, Node, Prefab, instantiate, UITransform, UITransformComponent, Label, Animation, Color } from 'cc';
import { moveControll } from './moveControll';
const { ccclass, property } = _decorator;

@ccclass('slotControll')
export class slotControll extends Component {

  @property(Node)
  content1: Node;

  @property(Node)
  content2: Node;

  @property(Prefab)
  item: Prefab;

  private contentHeight = 0;

  // 原始數字
  get numbers() {
    const nums = [];
    for (let i = 1; i <= Math.ceil(this.getTotalCount()); i++) {
      nums.push(i);
    }
    return nums;
  }

  // 打亂後的
  randomArr: number[] = [];

  /** 勝利機率 數字越大號碼重複越多 */
  private _victoryOdds = 1;

  get victoryOdds() {
    return this._victoryOdds;
  }
  set victoryOdds(n) {
    this._victoryOdds = n > 4 ? 4 : n;
  }

  getTotalCount() {
    return this.contentHeight / (this.victoryOdds * 100);
  }

  resetArr() {
    this.randomArr = [];
    for (let x = 0; x < this.victoryOdds; x++) {
      this.randomArr.push(...this.numbers)
    }
  }

  onLoad() {
    this.contentHeight = this.content1.getComponent(UITransform).contentSize.height;
    this.initLabel();
    this.resetArr();
    this.updateNumber();
  }

  start() {
  }

  setStart(stopDelay: number, cb?: Function) {
    const ani1 = this.content1.getComponent(moveControll);
    const ani2 = this.content2.getComponent(moveControll);
    ani1.setStart();
    ani2.setStart();

    setTimeout(() => {
      this.resetColor();
    }, 500);

    this.resetArr();
    this.randomSort();
    this.updateNumber(true);
    this.getSlotNumbers();

    setTimeout(() => {
      this.setStop();
      setTimeout(() => {
        if (cb) cb();
      }, 1250);
    }, stopDelay);

    this.victoryOdds++;
  }

  /** 取得顯示的4個號碼 */
  getSlotNumbers() {
    return this.randomArr.slice(0, 4);
  }

  setStop() {
    const ctrl1 = this.content1.getComponent(moveControll);
    ctrl1.setStop();
    const ctrl2 = this.content2.getComponent(moveControll);
    ctrl2.setStop();
  }

  randomSort() {
    this.randomArr.sort(() => 0.5 - Math.random());
  }

  updateNumber(useDelay: boolean = false) {
    const { length } = this.content1.children;
    for (let i = useDelay ? 4 : 0; i < length; i++) {
      this.setLabelStr(this.content1.children[i], this.randomArr[i]);
      this.setLabelStr(this.content2.children[i], this.randomArr[i]);
    }
    if (useDelay) {
      setTimeout(() => {
        for (let i = 0; i < 4; i++) {
          this.setLabelStr(this.content1.children[i], this.randomArr[i]);
          this.setLabelStr(this.content2.children[i], this.randomArr[i]);
        }
      }, 400);
    }
  }

  setLabelStr(node: Node, str: number | string) {
    const _str = `0${str}`;
    node.getComponent(Label).string = _str.substring(_str.length - 2);
  }

  initLabel() {
    for (let i = 0; i < 16; i++) {
      this.content1.addChild(this.getNewNode(i));
      this.content2.addChild(this.getNewNode(i));
    }
  }

  getNewNode(i: number) {
    const node = instantiate(this.item);
    node.setPosition(0, (-1 * this.contentHeight / 2 + 50) + i * 100);
    return node;
  }

  resetColor() {
    this.content1.children.forEach(item => {
      item.getComponent(Label).color = Color.WHITE;
    });
    this.content2.children.forEach(item => {
      item.getComponent(Label).color = Color.WHITE;
    });
  }

  setColor(num: number, color: Readonly<Color>) {
    const fn = (item: Node) => {
      const inum = parseInt(item.getComponent(Label).string, 10) || 0;
      if (inum === num) {
        const lb = item.getComponent(Label);
        lb.color = color;
        const ani = item.getComponent(Animation);
        ani.play();
      }
    }
    this.content1.children.forEach(fn);
    this.content2.children.forEach(fn);
  }

}
