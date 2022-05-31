
import { _decorator, Component, Node, Animation, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('moveControll')
export class moveControll extends Component {

  isStop = false;

  start() {
  }

  onMove1Done() {
    const ani = this.node.getComponent(Animation);
    if (!this.isStop) {
      ani.play("move2")
    }
  }

  onMove2Done() {
    const ani = this.node.getComponent(Animation);
    ani.play(this.isStop ? "moveStop" : "move1")
  }

  setStart() {
    this.isStop = false;
    const ani = this.node.getComponent(Animation);
    const { y } = this.node.getPosition();
    ani.play(y === 600 ? "move1" : "move2");
  }

  setStop() {
    this.isStop = true;
  }
}
