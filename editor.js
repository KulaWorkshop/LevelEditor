import * as THREE from "./js/build/three.module.js";
import { OrbitControls } from "./js/OrbitControls.js";
import { TransformControls } from "./js/TransformControls.js";
import * as UI from "./UIManager.js";
import * as LevelManager from "./LevelManager.js";
import * as TextureManager from "./TextureManager.js";

let worldNames = ["hiro", "hills", "inca", "arctic", "cowboy", "field", "atlantis", "haze", "mars", "hell"];

let scene = new THREE.Scene();

let currentLevel = {
  blocks: new THREE.Group(),
  time: 99,
  secret: false,
  far: false,
};
let blocksPlaced = 0;
let selectedBlockType = 0;
scene.add(currentLevel.blocks);

let selectedAttribute = {
  block: undefined,
  item: undefined,
  side: 0,
  element: undefined,
};

let currentWorld = "HIRO";
UI.InitializeUI();
TextureManager.InitializeSkybox(scene, currentWorld);
TextureManager.InitializeTextures(currentWorld);

let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
let canvas = renderer.domElement;
document.body.appendChild(canvas);

let camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(20, 20, 40);
camera.frustumCulled = false;
let rayCaster = new THREE.Raycaster();
let mousePosition = new THREE.Vector2();

let controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(16.5, 16.5, 16.5);
controls.minDistance = 0;
controls.maxDistance = 500;
controls.update();
controls.addEventListener("change", render);

let control = new TransformControls(camera, renderer.domElement);
control.addEventListener("change", render);
control.setMode("translate");
control.setTranslationSnap(1);
control.addEventListener("dragging-changed", function (event) {
  controls.enabled = !event.value;
});
scene.add(control);

let boundingBox = new THREE.LineSegments(
  new THREE.EdgesGeometry(new THREE.BoxBufferGeometry(34, 34, 34, 1, 1, 1))
);
boundingBox.position.set(16.5, 16.5, 16.5);
scene.add(boundingBox);
let boundingBoxState = 0;

let drag = false;
canvas.addEventListener("pointerdown", () => {
  drag = false;
  outOfBoundsCheck(control.object);
});
canvas.addEventListener("pointermove", () => {
  drag = true;
  outOfBoundsCheck(control.object);
});
canvas.addEventListener("click", (event) => onClick(event));
window.addEventListener("resize", onWindowResize);
window.addEventListener("keydown", (event) => onKeyPress(event));

UI.open.onclick = () => UI.browse.click();
UI.add.onclick = () => addBlock();
UI.remove.onclick = () => removeBlock(control.object);
UI.blocktypes.forEach(
  (element, index) =>
    (element.onclick = () => {
      selectedBlockType = index;
      UI.SetSelectedBlockType(index);
    })
);
UI.boundtypes.forEach(
  (element, index) => (element.onclick = () => setBoundType(index))
);
UI.worlds.forEach(
  (element) => (element.onclick = () => setWorld(element.getAttribute("id")))
);
UI.blockedits.forEach((element) =>
  element.addEventListener("change", () =>
    addItem(
      control.object,
      LevelManager.ReturnItem(element.value),
      element.getAttribute("id")
    )
  )
);

UI.browse.onchange = function () {
  let fileReader = new FileReader();
  if (this.files.length > 0) {
    fileReader.readAsArrayBuffer(this.files[0]);
    fileReader.onloadend = function (event) {
      if (event.target.readyState == FileReader.DONE)
        loadLevel(LevelManager.LoadLevel(event.target.result));
    };
  }
  this.value = "";
};

UI.save.onclick = () => {
  let a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  let url = window.URL.createObjectURL(
    new Blob([new Uint16Array(LevelManager.WriteLevel(currentLevel))], {
      type: "octet/stream",
    })
  );
  a.href = url;
  a.download = "LEVEL.kwl";
  a.click();
  window.URL.revokeObjectURL(url);
};

UI.editblocktype.onchange = () => {
  if (control.object === undefined) return;
  let blockType = parseInt(UI.editblocktype.value);
  control.object.userData["type"] = blockType;
  if (blockType > 4) {
    control.object.userData["items"] = [];
    while (control.object.children.length)
      control.object.remove(control.object.children[0]);
  }
  control.object.material = TextureManager.MapBlockTexture(control.object);
  UI.UpdateMenuDisplay(control.object, currentWorld);
};

UI.options.onclick = () => {
  UI.editleveltime.value = currentLevel.time;
  UI.editsecretlevel.checked = currentLevel.secret;
  UI.editfar.checked = currentLevel.far;
  UI.leveloptions.style.display = "block";
};

UI.blockselects.forEach(
  (element) =>
    (element.onclick = () => {
      UI.blockselects.forEach(
        (element) => (element.classList.remove("selected"))
      );
      element.classList.add("selected")
      UI.UpdateMenuDisplay(control.object, currentWorld);
    })
);

//Level Options
UI.editleveltime.onchange = () => {
  if (UI.editleveltime.value > 510) UI.editleveltime.value = 510;
  if (UI.editleveltime.value < 0) UI.editleveltime.value = 0;
  currentLevel.time = parseInt(UI.editleveltime.value);
};

UI.editsecretlevel.onchange = () =>
  (currentLevel.secret = UI.editsecretlevel.checked);

UI.editfar.onchange = () => (currentLevel.far = UI.editfar.checked);

//Moving Block
UI.editmovingconnection.onclick = () => {
  if (selectedAttribute.block !== undefined) {
    clearAttribute();
    return;
  }
  let movingData = control.object.userData["moving"];
  if (UI.editmovingconnection.innerText == "Detach") {
    movingData.toPosition = new THREE.Vector3();
    UI.UpdateMenuDisplay(control.object, currentWorld);
    UI.DisplayAlert("error-alert", "Detached moving block.");
    return;
  }
  selectedAttribute.block = control.object;
  movingData.startingPosition = new THREE.Vector3(
    BE(control.object.position.x * 2),
    BE((LevelManager.ConvertYPosition(control.object.position.y) - 1) * 2),
    BE(control.object.position.z * 2)
  );
  movingData.fromPosition = new THREE.Vector3(
    control.object.position.x,
    LevelManager.ConvertYPosition(control.object.position.y) - 1,
    control.object.position.z
  );
  movingData.length = parseInt(UI.editmovinglength.value);
  movingData.speed = parseInt(UI.editmovingspeed.value);
  UI.editmovingconnection.innerText = "Cancel";
  UI.DisplayAlert(
    "info-alert",
    "Select another block to attach the moving block to."
  );
};

UI.editmovinglength.onchange = () =>
  (control.object.userData["moving"].length = parseInt(
    UI.editmovinglength.value
  ));

UI.editmovingspeed.onchange = () => {
  if (UI.editmovingspeed.value > 510) UI.editmovingspeed.value = 510;
  if (UI.editmovingspeed.value < 0) UI.editmovingspeed.value = 0;
  control.object.userData["moving"].speed = parseInt(UI.editmovingspeed.value);
};

//Flashing Block
UI.editflashingindex.onchange = () =>
  (control.object.userData["flashing"].index = parseInt(
    UI.editflashingindex.value
  ));

//Laser Block
UI.editlaserconnection.onclick = () => {
  if (selectedAttribute.block !== undefined) {
    clearAttribute();
    return;
  }
  let laserData = control.object.userData["laser"];
  if (UI.editlaserconnection.innerText == "Detach") {
    laserData.toPosition = new THREE.Vector3();
    control.object.material = TextureManager.MapBlockTexture(control.object);
    UI.UpdateMenuDisplay(control.object, currentWorld);
    UI.DisplayAlert("error-alert", "Detached laser.");
    return;
  }
  selectedAttribute.block = control.object;
  laserData.fromPosition = new THREE.Vector3(
    control.object.position.x,
    LevelManager.ConvertYPosition(control.object.position.y) - 1,
    control.object.position.z
  );
  UI.editlaserconnection.innerText = "Cancel";
  UI.DisplayAlert("info-alert", "Select another block to attach the laser to.");
};

UI.editlasercolor.onchange = () => {
  control.object.userData["laser"].color = parseInt(UI.editlasercolor.value);
  control.object.material = TextureManager.MapLaserTexture(control.object);
  UI.UpdateMenuDisplay(control.object, currentWorld);
};

UI.editlaserenabled.onchange = () =>
  (control.object.userData["laser"].enabled = parseInt(
    UI.editlaserenabled.value
  ));

UI.editlaserpower.onclick = () => {
  if (selectedAttribute.block !== undefined) {
    clearAttribute();
    return;
  }
  selectedAttribute.block = control.object;
  selectedAttribute.element = UI.editlaserpower;
  UI.editlaserpower.innerText = "Cancel";
  UI.DisplayAlert(
    "info-alert",
    "Select another block to attach the laser power to."
  );
};

//Transporter
UI.edittransporterconnection.onclick = () => {
  if (selectedAttribute.block !== undefined) {
    clearAttribute();
    return;
  }
  let sideIndex = 0;
  UI.blockselects.forEach((element, index) => {
    if (element.classList.contains("selected"))
      sideIndex = index;
  });
  if (UI.edittransporterconnection.innerText == "Detach") {
    control.object.userData["items"][sideIndex].toPosition = 65535;
    UI.UpdateMenuDisplay(control.object, currentWorld);
    UI.DisplayAlert("error-alert", "Detached transporter connection.");
    return;
  }
  selectedAttribute.block = control.object;
  selectedAttribute.item = control.object.userData["items"][sideIndex];
  selectedAttribute.side = sideIndex;
  UI.edittransporterconnection.innerText = "Cancel";
  UI.DisplayAlert(
    "info-alert",
    "Select another block to attach the transporter to."
  );
};

UI.edittransportercolor.onclick = () => {
  UI.blockselects.forEach((element, index) => {
    if (element.classList.contains("selected")) {
      control.object.userData["items"][index].varient = parseInt(
        UI.edittransportercolor.value
      );
      addItem(
        control.object,
        control.object.userData["items"][index],
        UI.blockedits[index].id
      );
    }
  });
  UI.UpdateMenuDisplay(control.object, currentWorld);
};

UI.edittransporterenabled.onchange = () =>
  UI.blockselects.forEach((element, index) => {
    if (element.classList.contains("selected"))
      control.object.userData["items"][index].state = parseInt(
        UI.edittransporterenabled.value
      );
  });

UI.edittransporterrotation.onchange = () =>
  UI.blockselects.forEach((element, index) => {
    if (element.classList.contains("selected"))
      control.object.userData["items"][index].rotation = parseInt(
        UI.edittransporterrotation.value
      );
  });

UI.edittransporterpower.onclick = () => {
  if (selectedAttribute.block !== undefined) {
    clearAttribute();
    return;
  }
  let sideIndex = 0;
  UI.blockselects.forEach((element, index) => {
    if (element.classList.contains("selected"))
      sideIndex = index;
  });
  selectedAttribute.block = control.object;
  selectedAttribute.item = control.object.userData["items"][sideIndex];
  selectedAttribute.side = sideIndex;
  selectedAttribute.element = UI.edittransporterpower;
  UI.edittransporterpower.innerText = "Cancel";
  UI.DisplayAlert(
    "info-alert",
    "Select another block to attach the transporter power to."
  );
};

//Button
UI.editbuttoncolor.onchange = () => {
  UI.blockselects.forEach((element, index) => {
    if (element.classList.contains("selected")) {
      control.object.userData["items"][index].varient = parseInt(
        UI.editbuttoncolor.value
      );
      addItem(
        control.object,
        control.object.userData["items"][index],
        UI.blockedits[index].id
      );
    }
  });
  UI.UpdateMenuDisplay(control.object, currentWorld);
};

UI.editbuttonenabled.onchange = () =>
  UI.blockselects.forEach((element, index) => {
    if (element.classList.contains("selected"))
      control.object.userData["items"][index].state = parseInt(
        UI.editbuttonenabled.value
      );
  });

UI.editbuttonpower1.onclick = () => {
  if (selectedAttribute.block !== undefined) {
    clearAttribute();
    return;
  }
  let sideIndex = 0;
  UI.blockselects.forEach((element, index) => {
    if (element.classList.contains("selected"))
      sideIndex = index;
  });
  selectedAttribute.block = control.object;
  selectedAttribute.item = control.object.userData["items"][sideIndex];
  selectedAttribute.side = sideIndex;
  selectedAttribute.element = UI.editbuttonpower1;
  UI.editbuttonpower1.innerText = "Cancel";
  UI.DisplayAlert(
    "info-alert",
    "Select another block to attach the button to."
  );
};

UI.editbuttonpower2.onclick = () => {
  if (selectedAttribute.block !== undefined) {
    clearAttribute();
    return;
  }
  let sideIndex = 0;
  UI.blockselects.forEach((element, index) => {
    if (element.classList.contains("selected"))
      sideIndex = index;
  });
  selectedAttribute.block = control.object;
  selectedAttribute.item = control.object.userData["items"][sideIndex];
  selectedAttribute.side = sideIndex;
  selectedAttribute.element = UI.editbuttonpower2;
  UI.editbuttonpower2.innerText = "Cancel";
  UI.DisplayAlert(
    "info-alert",
    "Select another block to attach the button to."
  );
};

//Moving Spike
UI.editmovingspikeindex.onchange = () =>
  UI.blockselects.forEach((element, index) => {
    if (element.classList.contains("selected"))
      control.object.userData["items"][index].varient = parseInt(
        UI.editmovingspikeindex.value
      );
  });

//Player Spawn
UI.editplayerspawnrotation.onchange = () =>
  UI.blockselects.forEach((element, index) => {
    if (element.classList.contains("selected"))
      control.object.userData["items"][index].rotation = parseInt(
        UI.editplayerspawnrotation.value
      );
  });

//Arrow
UI.editarrowrotation.onchange = () =>
  UI.blockselects.forEach((element, index) => {
    if (element.classList.contains("selected"))
      control.object.userData["items"][index].rotation = parseInt(
        UI.editarrowrotation.value
      );
  });

//Slow Star
UI.editslowstarrotation.onchange = () =>
  UI.blockselects.forEach((element, index) => {
    if (element.classList.contains("selected"))
      control.object.userData["items"][index].rotation = parseInt(
        UI.editslowstarrotation.value
      );
  });

//Tire
UI.edittirerotation.onchange = () =>
  UI.blockselects.forEach((element, index) => {
    if (element.classList.contains("selected"))
      control.object.userData["items"][index].rotation = parseInt(
        UI.edittirerotation.value
      );
  });

//Fast Star
UI.editfaststarrotation.onchange = () =>
  UI.blockselects.forEach((element, index) => {
    if (element.classList.contains("selected"))
      control.object.userData["items"][index].rotation = parseInt(
        UI.editfaststarrotation.value
      );
  });

//Captivator
UI.editcaptivatorindex.onchange = () =>
  UI.blockselects.forEach((element, index) => {
    if (element.classList.contains("selected"))
      control.object.userData["items"][index].varient = parseInt(
        UI.editcaptivatorindex.value
      );
  });

UI.blocksides.forEach(
  (element, index) =>
    (element.onclick = () => {
      UI.blocksideselections.style.display = "none";
      if (selectedAttribute.element == UI.editlaserpower) {
        selectedAttribute.block.userData["laser"].power =
          LevelManager.ConvertBlockCode(currentLevel, control.object, index);
        UI.RemoveAlert("info-alert");
        UI.DisplayAlert(
          "success-alert",
          "Successfully attached laser power to block!"
        );
        clearAttribute();
        return;
      }
      switch (selectedAttribute.item.id) {
        case 5:
          if (selectedAttribute.element == UI.edittransporterpower) {
            selectedAttribute.block.userData["items"][
              selectedAttribute.side
            ].power1 = LevelManager.ConvertBlockCode(
              currentLevel,
              control.object,
              index
            );
            UI.RemoveAlert("info-alert");
            UI.DisplayAlert(
              "success-alert",
              "Successfully attached transporter power to block!"
            );
          } else {
            selectedAttribute.block.userData["items"][
              selectedAttribute.side
            ].toPosition = LevelManager.ConvertBlockCode(
              currentLevel,
              control.object,
              index
            );
            UI.RemoveAlert("info-alert");
            UI.DisplayAlert(
              "success-alert",
              "Successfully attached transporter to block!"
            );
          }
          break;
        case 9:
          if (selectedAttribute.element == UI.editbuttonpower1)
            selectedAttribute.block.userData["items"][
              selectedAttribute.side
            ].power1 = LevelManager.ConvertBlockCode(
              currentLevel,
              control.object,
              index
            );
          else
            selectedAttribute.block.userData["items"][
              selectedAttribute.side
            ].power2 = LevelManager.ConvertBlockCode(
              currentLevel,
              control.object,
              index
            );
          UI.RemoveAlert("info-alert");
          UI.DisplayAlert(
            "success-alert",
            "Successfully attached button to block!"
          );
          break;
      }
      clearAttribute();
    })
);

window.onclick = function (event) {
  if (event.target == UI.leveloptions) UI.leveloptions.style.display = "none";
  if (event.target == UI.blocksideselections) {
    UI.blocksideselections.style.display = "none";
    clearAttribute();
    UI.RemoveAlert("info-alert");
    UI.DisplayAlert("error-alert", "Operation cancelled.");
  }
};

function loadLevel(level) {
  control.detach(control.object);
  currentLevel.time = level.time;
  currentLevel.secret = level.secret;
  currentLevel.far = level.far;
  currentLevel.blocks.children = [];
  level.blocks.children.forEach((levelBlock) => {
    let block = new THREE.Mesh(new THREE.BoxBufferGeometry());
    block.position.set(
      levelBlock.position.x,
      levelBlock.position.y,
      levelBlock.position.z
    );
    block.name = blocksPlaced;
    block.userData = levelBlock.userData;
    block.material = TextureManager.MapBlockTexture(block);
    if (block.userData["items"].length > 0)
      block.userData["items"].forEach((item, index) =>
        addSprite(block, item, index)
      );
    if (block.userData["type"] === 8) {
      block.userData["laser"].swapped = false;
      let fromPosition = block.userData["laser"].fromPosition;
      if (
        block.position.x == fromPosition.x &&
        block.position.y == LevelManager.ConvertYPosition(fromPosition.y + 1) &&
        block.position.z == fromPosition.z
      ) {
        block.userData["laser"].swapped = true;
      }
      block.material = TextureManager.MapLaserTexture(block);
    }

    currentLevel.blocks.add(block);
    blocksPlaced++;
  });
  UI.UpdateMenuDisplay(control.object, currentWorld);
  updateBoundingBox();
}

function setWorld(name) {
  TextureManager.InitializeTextures(name);
  TextureManager.InitializeSkybox(scene, name);
  UI.SetWorld(name);
  currentLevel.blocks.children.forEach((block) => {
    if (block.userData["type"] === 8)
      block.material = TextureManager.MapLaserTexture(block);
    else block.material = TextureManager.MapBlockTexture(block);
  });
  UI.UpdateMenuDisplay(control.object, name);
  currentWorld = name;
}

function addBlock() {
  let block = new THREE.Mesh(new THREE.BoxBufferGeometry());
  if (control.object === undefined) block.position.set(16, 16, 16);
  else block.position.copy(control.object.position);
  block.name = blocksPlaced;
  block.userData = {
    type: selectedBlockType,
    items: [],
    moving: {
      startingPosition: new THREE.Vector3(),
      fromPosition: new THREE.Vector3(),
      toPosition: new THREE.Vector3(),
      type: 0,
      orientation: 0,
      length: 1,
      speed: 0,
      id: 0,
    },
    flashing: { index: 0 },
    laser: {
      fromPosition: new THREE.Vector3(),
      toPosition: new THREE.Vector3(),
      swapped: true,
      enabled: 1,
      orientation: 0,
      color: 0,
      power: 65535,
      id: 0,
    },
  };
  block.material = TextureManager.MapBlockTexture(block);
  currentLevel.blocks.add(block);
  control.attach(block);
  blocksPlaced++;
  UI.UpdateMenuDisplay(control.object, currentWorld);
  updateBoundingBox();
}

function removeBlock(block) {
  if (block === undefined) return;
  control.detach(block);
  currentLevel.blocks.remove(block);
  if (currentLevel.blocks.children.length)
    control.attach(
      currentLevel.blocks.children[currentLevel.blocks.children.length - 1]
    );
  UI.UpdateMenuDisplay(control.object, currentWorld);
  updateBoundingBox();
}

function copyBlock(block) {
  if (block === undefined) return;
  let newBlock = block.clone();
  if (control.object === undefined) newBlock.position.set(16, 16, 16);
  else newBlock.position.copy(control.object.position);
  newBlock.name = blocksPlaced;
  currentLevel.blocks.add(newBlock);
  control.attach(newBlock);
  blocksPlaced++;
  UI.UpdateMenuDisplay(control.object, currentWorld);
  updateBoundingBox();
}

function addItem(block, item, side) {
  let sideIndex = 0;
  switch (side) {
    case "editPY":
      sideIndex = 0;
      break;
    case "editPX":
      sideIndex = 1;
      break;
    case "editPZ":
      sideIndex = 2;
      break;
    case "editNZ":
      sideIndex = 3;
      break;
    case "editNX":
      sideIndex = 4;
      break;
    case "editNY":
      sideIndex = 5;
      break;
  }
  while (control.object.children.length)
    control.object.remove(control.object.children[0]);
  for (let i = 0; i < 6; i++) {
    if (i === sideIndex) {
      block.userData["items"][i] = item;
      continue;
    }
    if (block.userData["items"][i] === undefined)
      block.userData["items"][i] = LevelManager.ReturnItem("0");
    addSprite(block, block.userData["items"][i], i);
  }
  addSprite(block, item, sideIndex);
  block.material = TextureManager.MapBlockTexture(block);
  UI.UpdateMenuDisplay(control.object, currentWorld);
}

function addSprite(block, item, side) {
  if (
    item.id < 5 ||
    item.id == 8 ||
    item.id == 11 ||
    item.id == 12 ||
    block.userData["type"] > 4
  )
    return;
  let spriteMap;
  let sprite = new THREE.Sprite();
  let groundOffset = 0.95;
  switch (item.id) {
    case 5:
      if (item.varient == 0)
        spriteMap = new THREE.TextureLoader().load(
          "sprites/" + item.id + "a.png"
        );
      else if (item.varient == 1)
        spriteMap = new THREE.TextureLoader().load(
          "sprites/" + item.id + "b.png"
        );
      else if (item.varient == 2)
        spriteMap = new THREE.TextureLoader().load(
          "sprites/" + item.id + "c.png"
        );
      else
        spriteMap = new THREE.TextureLoader().load(
          "sprites/" + item.id + "d.png"
        );
      groundOffset = 0.65;
      break;
    case 7:
      spriteMap = new THREE.TextureLoader().load("sprites/" + item.id + ".png");
      groundOffset = 0.85;
      break;
    case 9:
      if (item.varient == 0)
        spriteMap = new THREE.TextureLoader().load(
          "sprites/" + item.id + "a.png"
        );
      else if (item.varient == 1)
        spriteMap = new THREE.TextureLoader().load(
          "sprites/" + item.id + "b.png"
        );
      else if (item.varient == 2)
        spriteMap = new THREE.TextureLoader().load(
          "sprites/" + item.id + "c.png"
        );
      else
        spriteMap = new THREE.TextureLoader().load(
          "sprites/" + item.id + "d.png"
        );
      groundOffset = 0.6;
      break;
    case 10:
      spriteMap = new THREE.TextureLoader().load("sprites/" + item.id + ".png");
      groundOffset = 0.65;
      break;
    case 26:
      spriteMap = new THREE.TextureLoader().load("sprites/" + item.id + ".png");
      groundOffset = 0.85;
      break;
    case 28:
      spriteMap = new THREE.TextureLoader().load("sprites/" + item.id + ".png");
      groundOffset = 0.65;
      break;
    case 30:
      spriteMap = new THREE.TextureLoader().load("sprites/" + item.id + ".png");
      groundOffset = 0.75;
      sprite.scale.set(0.9, 0.9, 0.9);
      break;
    case 36:
      if (item.varient == 0)
        spriteMap = new THREE.TextureLoader().load(
          "sprites/" + item.id + "a.png"
        );
      else if (item.varient == 1)
        spriteMap = new THREE.TextureLoader().load(
          "sprites/" + item.id + "b.png"
        );
      else
        spriteMap = new THREE.TextureLoader().load(
          "sprites/" + item.id + "c.png"
        );
      sprite.scale.set(0.7, 0.7, 0.7);
      break;
    case 37:
      if (item.varient == 0)
        spriteMap = new THREE.TextureLoader().load(
          "sprites/" + item.id + "a.png"
        );
      else if (item.varient == 1)
        spriteMap = new THREE.TextureLoader().load(
          "sprites/" + item.id + "b.png"
        );
      else
        spriteMap = new THREE.TextureLoader().load(
          "sprites/" + item.id + "c.png"
        );
      break;
    case 43:
    case 44:
    case 45:
    case 46:
    case 47:
      spriteMap = new THREE.TextureLoader().load("sprites/46.png");
      break;
    case 56:
      spriteMap = new THREE.TextureLoader().load("sprites/" + item.id + ".png");
      groundOffset = 1.3;
      sprite.scale.set(0.8, 0.8, 0.8);
      break;
    default:
      spriteMap = new THREE.TextureLoader().load("sprites/" + item.id + ".png");
      break;
  }
  sprite.material = new THREE.SpriteMaterial({ map: spriteMap });
  switch (side) {
    case 0:
      sprite.position.set(
        sprite.position.x,
        sprite.position.y + groundOffset,
        sprite.position.z
      );
      block.add(sprite);
      break;
    case 1:
      sprite.position.set(
        sprite.position.x + groundOffset,
        sprite.position.y,
        sprite.position.z
      );
      sprite.material.rotation += 1.570796;
      block.add(sprite);
      break;
    case 2:
      sprite.position.set(
        sprite.position.x,
        sprite.position.y,
        sprite.position.z + groundOffset
      );
      sprite.material.rotation += 1.570796;
      block.add(sprite);
      break;
    case 3:
      sprite.position.set(
        sprite.position.x,
        sprite.position.y,
        sprite.position.z - groundOffset
      );
      sprite.material.rotation -= 1.570796;
      block.add(sprite);
      break;
    case 4:
      sprite.position.set(
        sprite.position.x - groundOffset,
        sprite.position.y,
        sprite.position.z
      );
      sprite.material.rotation -= 1.570796;
      block.add(sprite);
      break;
    case 5:
      sprite.position.set(
        sprite.position.x,
        sprite.position.y - groundOffset,
        sprite.position.z
      );
      sprite.material.rotation += 3.14159;
      block.add(sprite);
      break;
  }
}

function outOfBoundsCheck(block) {
  if (block === undefined) return;
  let blockPosition = block.position;

  block.remove(block.getObjectByName("ErrorBox"));
  block.remove(block.getObjectByName("WarningBox"));

  if (
    blockPosition.x > 33 ||
    blockPosition.x < 0 ||
    blockPosition.y > 33 ||
    blockPosition.y < 0 ||
    blockPosition.z > 33 ||
    blockPosition.z < 0
  ) {
    let errorBox = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxBufferGeometry(1, 1, 1, 1, 1, 1)),
      new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 10 })
    );
    errorBox.name = "ErrorBox";
    block.add(errorBox);
    return;
  }

  if (
    blockPosition.x > 32 ||
    blockPosition.x < 1 ||
    blockPosition.y > 32 ||
    blockPosition.y < 1 ||
    blockPosition.z > 32 ||
    blockPosition.z < 1
  ) {
    let warningBox = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxBufferGeometry(1, 1, 1, 1, 1, 1)),
      new THREE.LineBasicMaterial({ color: 0xffff00, linewidth: 10 })
    );
    warningBox.name = "WarningBox";
    block.add(warningBox);
  }
}

function updateBoundingBox() {
  if (boundingBoxState === 1) {
    if (control.object === undefined) scene.remove(boundingBox);
    else scene.add(boundingBox);
  }
}

function setBoundType(value) {
  UI.SetSelectedBoundType(value);
  boundingBoxState = value;
  switch (value) {
    case 0:
      scene.add(boundingBox);
      break;
    case 1:
      updateBoundingBox();
      break;
    case 2:
      scene.remove(boundingBox);
      break;
  }
}

function onClick(event) {
  outOfBoundsCheck(control.object);
  if (drag) return;
  event.preventDefault();
  let rect = renderer.domElement.getBoundingClientRect();
  mousePosition.x =
    ((event.clientX - rect.left) / (rect.width - rect.left)) * 2 - 1;
  mousePosition.y =
    -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;
  rayCaster.setFromCamera(mousePosition, camera);
  let intersects = rayCaster.intersectObjects(
    currentLevel.blocks.children,
    true
  );
  if (intersects.length === 0) {
    control.detach(control.object);
    UI.UpdateMenuDisplay(undefined, currentWorld);
    updateBoundingBox();
    return;
  }
  for (let i = 0; i < intersects.length; i++) {
    if (intersects[i]["object"]["geometry"]["type"] !== "BoxGeometry") continue;
    let block = scene.getObjectByName(intersects[i]["object"]["name"]);
    control.attach(block);
    UI.UpdateMenuDisplay(block, currentWorld);
    //Check if the current attribute is available
    if (selectedAttribute.block !== undefined) {
      switch (selectedAttribute.block.userData["type"]) {
        //If a moving block wants to be connected
        case 5:
          if (selectedAttribute.block === block) return;
          let movingData = selectedAttribute.block.userData["moving"];
          movingData.toPosition = new THREE.Vector3(
            block.position.x,
            LevelManager.ConvertYPosition(block.position.y) - 1,
            block.position.z
          );
          if (movingData.fromPosition.x < movingData.toPosition.x)
            movingData.type = 1;
          if (movingData.fromPosition.y < movingData.toPosition.y)
            movingData.type = 5;
          if (movingData.fromPosition.z < movingData.toPosition.z)
            movingData.type = 2;
          if (movingData.fromPosition.x > movingData.toPosition.x)
            movingData.type = 4;
          if (movingData.fromPosition.y > movingData.toPosition.y)
            movingData.type = 0;
          if (movingData.fromPosition.z > movingData.toPosition.z)
            movingData.type = 3;
          if (movingData.fromPosition.x != movingData.toPosition.x)
            movingData.orientation = 1;
          if (movingData.fromPosition.y != movingData.toPosition.y)
            movingData.orientation = 5;
          if (movingData.fromPosition.z != movingData.toPosition.z)
            movingData.orientation = 2;
          if (
            movingData.fromPosition.x > movingData.toPosition.x ||
            movingData.fromPosition.y > movingData.toPosition.y ||
            movingData.fromPosition.z > movingData.toPosition.z
          )
            [movingData.fromPosition, movingData.toPosition] = [
              movingData.toPosition,
              movingData.fromPosition,
            ];
          control.attach(selectedAttribute.block);
          clearAttribute();
          UI.RemoveAlert("info-alert");
          UI.DisplayAlert(
            "success-alert",
            "Successfully attached moving block to block!"
          );
          break;
        //If a laser block is wanting to be connected
        case 8:
          if (selectedAttribute.element == UI.editlaserpower) {
            if (block.userData["type"] > 4) {
              let blockSide = 0;
              if (block.userData["type"] == 8) blockSide = 6;
              selectedAttribute.block.userData["laser"].power =
                LevelManager.ConvertBlockCode(currentLevel, block, blockSide);
              UI.RemoveAlert("info-alert");
              UI.DisplayAlert(
                "success-alert",
                "Successfully attached laser power to block!"
              );
              clearAttribute();
            } else {
              let blocks =
                UI.blocksideselections.getElementsByClassName("block");
              let blockSelects = [
                UI.selectPX,
                UI.selectNX,
                UI.selectPY,
                UI.selectNY,
                UI.selectPZ,
                UI.selectNZ,
              ];
              for (let j = 0; j < blocks.length; j++) {
                blocks[j].childNodes[3].style.backgroundImage =
                  blockSelects[j].style.backgroundImage;
                blocks[j].childNodes[3].children[0].style.display =
                  blockSelects[j].children[0].style.display;
                blocks[j].childNodes[3].children[0].src =
                  blockSelects[j].children[0].src;
              }
              UI.blocksideselections.style.display = "block";
            }
            break;
          }
          if (selectedAttribute.block === block) return;
          let laserData = selectedAttribute.block.userData["laser"];
          laserData.toPosition = new THREE.Vector3(
            block.position.x,
            LevelManager.ConvertYPosition(block.position.y) - 1,
            block.position.z
          );
          if (laserData.fromPosition.x != laserData.toPosition.x)
            laserData.orientation = 1;
          if (laserData.fromPosition.y != laserData.toPosition.y)
            laserData.orientation = 5;
          if (laserData.fromPosition.z != laserData.toPosition.z)
            laserData.orientation = 2;
          if (
            laserData.fromPosition.x > laserData.toPosition.x ||
            laserData.fromPosition.y > laserData.toPosition.y ||
            laserData.fromPosition.z > laserData.toPosition.z
          ) {
            [laserData.fromPosition, laserData.toPosition] = [
              laserData.toPosition,
              laserData.fromPosition,
            ];
            laserData.swapped = false;
          } else laserData.swapped = true;
          selectedAttribute.block.material = TextureManager.MapLaserTexture(
            selectedAttribute.block
          );
          control.attach(selectedAttribute.block);
          clearAttribute();
          UI.RemoveAlert("info-alert");
          UI.DisplayAlert(
            "success-alert",
            "Successfully attached laser to block!"
          );
          break;
        default:
          //If the selected attribute's item is wanting to be connected
          if (selectedAttribute.item !== undefined) {
            switch (selectedAttribute.item.id) {
              //If the selected attribute's item is a transporter or button
              case 5:
              case 9:
                //If it is a block that doesn't have any items
                if (block.userData["type"] > 4) {
                  let blockSide = 0;
                  switch (selectedAttribute.item.id) {
                    //If it's a transporter that is wanting to connect to this block
                    case 5:
                      //If it's a transporter's power that is wanting to connect to this block
                      if (
                        selectedAttribute.element == UI.edittransporterpower
                      ) {
                        if (block.userData["type"] == 8) blockSide = 6;
                        selectedAttribute.block.userData["items"][
                          selectedAttribute.side
                        ].power1 = LevelManager.ConvertBlockCode(
                          currentLevel,
                          block,
                          blockSide
                        );
                        UI.RemoveAlert("info-alert");
                        UI.DisplayAlert(
                          "success-alert",
                          "Successfully attached transporter power to block!"
                        );
                      }
                      //If it's the transporter's teleportation location that is wanting to connect to this block
                      else {
                        selectedAttribute.block.userData["items"][
                          selectedAttribute.side
                        ].toPosition = LevelManager.ConvertBlockCode(
                          currentLevel,
                          block,
                          0
                        );
                        UI.RemoveAlert("info-alert");
                        UI.DisplayAlert(
                          "success-alert",
                          "Successfully attached transporter to block!"
                        );
                      }
                      break;
                    //If it's a button that is wanting to connect to this block
                    case 9:
                      if (block.userData["type"] == 8) blockSide = 6;
                      if (selectedAttribute.element == UI.editbuttonpower1)
                        selectedAttribute.block.userData["items"][
                          selectedAttribute.side
                        ].power1 = LevelManager.ConvertBlockCode(
                          currentLevel,
                          block,
                          blockSide
                        );
                      else
                        selectedAttribute.block.userData["items"][
                          selectedAttribute.side
                        ].power2 = LevelManager.ConvertBlockCode(
                          currentLevel,
                          block,
                          blockSide
                        );
                      UI.RemoveAlert("info-alert");
                      UI.DisplayAlert(
                        "success-alert",
                        "Successfully attached button to block!"
                      );
                      break;
                  }
                  clearAttribute();
                } else {
                  //If it is a block that you are wanting to connect to, and it has items, then bring up the side select menu
                  let blocks =
                    UI.blocksideselections.getElementsByClassName("block");
                  let blockSelects = [
                    UI.selectPX,
                    UI.selectNX,
                    UI.selectPY,
                    UI.selectNY,
                    UI.selectPZ,
                    UI.selectNZ,
                  ];
                  for (let j = 0; j < blocks.length; j++) {
                    blocks[j].childNodes[3].style.backgroundImage =
                      blockSelects[j].style.backgroundImage;
                    blocks[j].childNodes[3].children[0].style.display =
                      blockSelects[j].children[0].style.display;
                    blocks[j].childNodes[3].children[0].src =
                      blockSelects[j].children[0].src;
                  }
                  UI.blocksideselections.style.display = "block";
                }
                break;
            }
          }
          break;
      }
    }
    UI.UpdateMenuDisplay(control.object, currentWorld);
    updateBoundingBox();
    break;
  }
}

function onKeyPress(event) {
  if (
    document.activeElement == UI.editmovingspeed ||
    document.activeElement == UI.editleveltime
  )
    return;
  document.activeElement.blur();
  switch (event.keyCode) {
    case 32:
    case 65:
      addBlock();
      break;
    case 8:
    case 46:
    case 88:
      removeBlock(control.object);
      break;
    case 67:
      copyBlock(control.object);
      break;
    case 96:
      if (control.object !== undefined) {
        controls.target.set(
          control.object.position.x,
          control.object.position.y,
          control.object.position.z
        );
      } else controls.target.set(16.5, 16.5, 16.5);
      controls.update();
      break;
    case 77:
      selectedTransporter = control.object;
      break;
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.updateProjectionMatrix();
}

window.addEventListener("beforeunload", (event) => {
  event.returnValue = true;
});

selectedBlockType = 0;
UI.SetSelectedBlockType(0);
setBoundType(0);

function BE(val) {
  return ((val & 0xff) << 8) | ((val >> 8) & 0xff);
}
function clearAttribute() {
  selectedAttribute.block =
    selectedAttribute.item =
    selectedAttribute.side =
    selectedAttribute.element =
      undefined;
  UI.editmovingconnection.innerText =
    UI.editlaserconnection.innerText =
    UI.editlaserpower.innerText =
    UI.edittransporterconnection.innerText =
    UI.edittransporterpower.innerText =
    UI.editbuttonpower1.innerText =
    UI.editbuttonpower2.innerText =
      "Attach";
  UI.UpdateMenuDisplay(control.object, currentWorld);
}
function render() {
  renderer.render(scene, camera);
}
function animate() {
  requestAnimationFrame(animate);
  render();
}
animate();

setWorld(worldNames[Math.floor(Math.random()*worldNames.length)])