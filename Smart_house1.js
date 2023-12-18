class SmartComponent {
  #id;
  #name;
  #state;
  static lastId = 0;

  constructor(id, name, state = false) {
    this.#id = SmartComponent.lastId++;
    this.#name = name;
    this.#state = state;
  }

  turnOn() {
    this.changeState(true);
  }

  turnOff() {
    this.changeState(false);
  }

  changeState(newState) {
    this.#state = newState;
    console.log(`${this.#name} state changed to ${newState ? "on" : "off"}.`);
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }

  get state() {
    return this.#state;
  }
}

class Light extends SmartComponent {
  #brightness;

  constructor(id, name, state = false, brightness = 0) {
    super(id, name, state);
    this.#brightness = brightness;
  }

  get brightness() {
    return this.#brightness;
  }

  set brightness(newValue) {
    if (newValue > 100 || newValue < 0)
      throw new RangeError("Brightness must be between 0 and 100");
    this.#brightness = newValue;
  }

  changeBrightness(newBrightness) {
    this.brightness = newBrightness;
    console.log(`${this.name} brightness set to ${newBrightness}.`);
  }
}

class Blind extends SmartComponent {
  #liftLevel;

  constructor(id, name, state = false, liftLevel = 0) {
    super(id, name, state);
    this.#liftLevel = liftLevel;
  }

  lift() {
    this.changeLiftLevel(100);
  }

  lower() {
    this.changeLiftLevel(0);
  }

  changeLiftLevel(newLiftLevel) {
    this.#liftLevel = newLiftLevel;
    console.log(`${this.name} blinds lift level set to ${newLiftLevel}.`);
  }

  getLiftLevel() {
    return this.#liftLevel;
  }
}

class AlarmSystem extends SmartComponent {
  mode;

  constructor(id, name, state = false, mode = "Off") {
    super(id, name, state);
    this.mode = mode;
  }

  changeMode(newMode) {
    this.mode = newMode;
    console.log(`${this.name} mode changed to ${newMode}.`);
  }

  triggerAlarm() {
    if (this.mode === "Armed") {
      console.log(`Alarm activated in ${this.name}!`);
    }
  }
}

class LeaveHome {
  constructor(lights, blinds, alarmSystems) {
    this.lights = lights;
    this.blinds = blinds;
    this.alarmSystems = alarmSystems;
  }

  addBlind(blinds) {
    this.blinds.push(blinds);
  }

  deleteBlindsById(id) {
    this.blinds = this.blinds.filter((blind) => blind.id !== id);
    // const indexToDelete = this.blinds.findIndex((blind) => blind.id === id);
    // this.blinds.splice(indexToDelete, 1);
  }

  addLight(lights) {
    this.lights.push(lights);
  }

  deleteLightsById(id) {
    this.lights = this.lights.filter((light) => light.id !== id);
  }

  execute() {
    this.lights.forEach((light) => {
      if (light.state) {
        light.turnOff();
      }
    });

    // this.blinds
    //   .filter((blind) => blind.getLiftLevel() > 0)
    //   .forEach((blind) => blind.lower());

    this.blinds.forEach((blind) => {
      if (blind.getLiftLevel() > 0) {
        blind.lower();
      }
    });

    this.alarmSystems.forEach((alarmSystem) => {
      if (alarmSystem.mode !== "Armed") {
        alarmSystem.changeMode("Armed");
      }
    });
  }
}

var livingRoomLight = new Light(1, "Living Room Light");
var livingRoomLight = new Light(2, "Living Room Light");
var bedroomBlind = new Blind(3, "Bedroom Blind");
var bedroomBlind = new Blind(4, "Bedroom Blind");
var bedroomLight = new Light(5, "Bed Room Light");
var securityAlarm = new AlarmSystem(6, "Security Alarm");

livingRoomLight.turnOn();
livingRoomLight.changeBrightness(75);

bedroomBlind.lift();
bedroomBlind.changeLiftLevel(50);
bedroomLight.turnOff();

securityAlarm.changeMode("Armed");
securityAlarm.triggerAlarm();
securityAlarm.changeMode("Off");

var homeLeaving = new LeaveHome(
  [livingRoomLight],
  [bedroomBlind],
  [securityAlarm]
);

homeLeaving.execute();

homeLeaving.deleteBlindsById(3);
console.log("Blind with ID 3 deleted.");
homeLeaving.deleteLightsById(livingRoomLight.id);
console.log("Light with ID 1 deleted.");

console.log("Remaining Blinds:");
homeLeaving.blinds.forEach((blind) => {
  console.log(`Blind ID: ${blind.id}, Name: ${blind.name}`);
});
console.log("Remaining Lights:");
homeLeaving.lights.forEach((light) => {
  console.log(`Light ID: ${light.id}, Name: ${light.name}`);
});
console.log(bedroomBlind.liftLevel);
