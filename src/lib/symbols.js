import autoRikshaw from '../images/Auto Rikshaw.svg';
import batteryTorch from '../images/Battery Torch.svg';
import broom from '../images/Broom.svg';
import bucket from '../images/Bucket.svg';
import clock from '../images/Clock.svg';
import coconutFarm from '../images/Coconut Farm.svg';
import earsOfCornAndSickle from '../images/Ears of Corn and Sickle.svg';
import elephant from '../images/Elephant.svg';
import hand from '../images/Hand.svg';
import hammerSickleAndStar from '../images/Hammer, Sickle and Star.svg';
import hurricaneLamp from '../images/Hurricane Lamp.svg';
import jackfruit from '../images/Jackfruit.svg';
import ladder from '../images/Ladder.svg';
import lotus from '../images/Lotus.svg';
import manBlowingTurha from '../images/Man blowing Turha.png';
import ring from '../images/Ring.svg';
import scissors from '../images/Scissors.svg';
import telephone from '../images/Telephone.svg';
import television from '../images/Television.svg';
import truck from '../images/Truck.svg';
import twoLeaves from '../images/Two leaves.svg';

const candidateSymbols = {
  'Auto Rikshaw': autoRikshaw,
  'Battery Torch': batteryTorch,
  'Broom': broom,
  'Bucket': bucket,
  'Clock': clock,
  'Coconut Farm': coconutFarm,
  'Ears of Corn and Sickle': earsOfCornAndSickle,
  'Elephant': elephant,
  'Hand': hand,
  'Hammer, Sickle and Star': hammerSickleAndStar,
  'Hurricane Lamp': hurricaneLamp,
  'Jackfruit': jackfruit,
  'Ladder': ladder,
  'Lotus': lotus,
  'Man blowing Turha': manBlowingTurha,
  'Ring': ring,
  'Scissors': scissors,
  'Telephone': telephone,
  'Television': television,
  'Truck': truck,
  'Two leaves': twoLeaves
};

export function getCandidateSymbol(symbolName) {
  const sym = candidateSymbols[symbolName];
  return sym?.src || null;
}
