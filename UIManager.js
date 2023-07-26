import * as THREE from './js/build/three.module.js';

export let save = document.getElementById('export');
export let open = document.getElementById('open');
export let options = document.getElementById('options');
export let leveloptions = document.getElementById('level-options');
export let editleveltime = document.getElementById('edit-level-time');
export let editsecretlevel = document.getElementById('edit-secret-level');
export let editfar = document.getElementById('edit-far');
export let browse = document.getElementById('browse');
export let add = document.getElementById('add');
export let remove = document.getElementById('remove');
export let regular = document.getElementById('regular');
export let fire = document.getElementById('fire');
export let ice = document.getElementById('ice');
export let invisible = document.getElementById('invisible');
export let acid = document.getElementById('acid');
export let showbounds = document.getElementById('show-bounds');
export let selectionbounds = document.getElementById('selection-bounds');
export let nobounds = document.getElementById('no-bounds');
export let hiro = document.getElementById('hiro');
export let hills = document.getElementById('hills');
export let inca = document.getElementById('inca');
export let arctic = document.getElementById('arctic');
export let cowboy = document.getElementById('cowboy');
export let field = document.getElementById('field');
export let atlantis = document.getElementById('atlantis');
export let haze = document.getElementById('haze');
export let mars = document.getElementById('mars');
export let hell = document.getElementById('hell');
export let blockbar = document.getElementById('block-bar');
export let blocktype = document.getElementById('block-type');
export let blockgroup = document.getElementById('block-group');
export let optiongroup = document.getElementById('option-group');
export let selectPY = document.getElementById('selectPY');
export let selectPX = document.getElementById('selectPX');
export let selectPZ = document.getElementById('selectPZ');
export let selectNZ = document.getElementById('selectNZ');
export let selectNX = document.getElementById('selectNX');
export let selectNY = document.getElementById('selectNY');
export let editblocktype = document.getElementById('edit-block-type');
export let editPY = document.getElementById('editPY');
export let editPX = document.getElementById('editPX');
export let editPZ = document.getElementById('editPZ');
export let editNZ = document.getElementById('editNZ');
export let editNX = document.getElementById('editNX');
export let editNY = document.getElementById('editNY');
export let blocksideselections = document.getElementById('block-side-selections');
export let selectsidePX = document.getElementById('select-side-px');
export let selectsideNX = document.getElementById('select-side-nx');
export let selectsidePY = document.getElementById('select-side-py');
export let selectsideNY = document.getElementById('select-side-ny');
export let selectsidePZ = document.getElementById('select-side-pz');
export let selectsideNZ = document.getElementById('select-side-nz');
export let editmovingconnection = document.getElementById('edit-moving-connection');
export let editmovinglength = document.getElementById('edit-moving-length');
export let editmovingspeed = document.getElementById('edit-moving-speed');
export let editflashingindex = document.getElementById('edit-flashing-index');
export let editlaserconnection = document.getElementById('edit-laser-connection');
export let editlasercolor = document.getElementById('edit-laser-color');
export let editlaserenabled = document.getElementById('edit-laser-enabled');
export let editlaserpower = document.getElementById('edit-laser-power');
export let edittransporterconnection = document.getElementById('edit-transporter-connection');
export let edittransportercolor = document.getElementById('edit-transporter-color');
export let edittransporterenabled = document.getElementById('edit-transporter-enabled');
export let edittransporterrotation = document.getElementById('edit-transporter-rotation');
export let edittransporterpower = document.getElementById('edit-transporter-power');
export let editbuttoncolor = document.getElementById('edit-button-color');
export let editbuttonenabled = document.getElementById('edit-button-enabled');
export let editbuttonpower1 = document.getElementById('edit-button-power-1');
export let editbuttonpower2 = document.getElementById('edit-button-power-2');
export let editplayerspawnrotation = document.getElementById('edit-player-spawn-rotation');
export let editarrowrotation = document.getElementById('edit-arrow-rotation');
export let editslowstarrotation = document.getElementById('edit-slow-star-rotation');
export let edittirerotation = document.getElementById('edit-tire-rotation');
export let editfaststarrotation = document.getElementById('edit-fast-star-rotation');
export let editmovingspikeindex = document.getElementById('edit-moving-spike-index');
export let editcaptivatorindex = document.getElementById('edit-captivator-index');
export let blocktypes = [regular, fire, ice, invisible, acid];
export let boundtypes = [showbounds, selectionbounds, nobounds];
export let worlds = [hiro, hills, inca, arctic, cowboy, field, atlantis, haze, mars, hell];
export let blockselects = [selectPY, selectPX, selectPZ, selectNZ, selectNX, selectNY];
export let blockedits = [editPY, editPX, editPZ, editNZ, editNX, editNY];
export let blocksides = [selectsidePY, selectsidePX, selectsidePZ, selectsideNZ, selectsideNX, selectsideNY];

let currentTimeouts = [];

export function InitializeUI() {
    const groups = [
        {
            Essentials: [
                { name: 'Player Spawn', id: '30' },
                { name: 'Key', id: '31' },
                { name: 'Fruit', id: '46' },
                { name: 'Exit', id: '7' },
                { name: 'Hidden Exit', id: '26' },
            ],
        },
        {
            Collectables: [
                { name: 'Bronze Coin', id: '37c' },
                { name: 'Blue Coin', id: '37b' },
                { name: 'Gold Coin', id: '37a' },
                { name: 'Red Gem', id: '36c' },
                { name: 'Green Gem', id: '36b' },
                { name: 'Blue Gem', id: '36a' },
            ],
        },
        {
            'Power-Ups': [
                { name: 'Bounce Pill', id: '33' },
                { name: 'Invincibility Pill', id: '34' },
                { name: 'Sunglasses', id: '38' },
                { name: 'Timer Flip', id: '35' },
            ],
        },
        {
            Hazards: [
                { name: 'Lethargy Pill', id: '32' },
                { name: 'Spikes', id: '12' },
                { name: 'Moving Spikes', id: '11' },
            ],
        },
        {
            Mechanical: [
                { name: 'Bounce Pad', id: '10' },
                { name: 'Arrow', id: '28' },
                { warning: true, name: 'Transporter', id: '5' },
                { warning: true, name: 'Button', id: '9' },
            ],
        },
        {
            Enemies: [
                { name: 'Slow Star', id: '50' },
                { name: 'Fast Star', id: '52' },
                { name: 'Tire', id: '51' },
                { name: 'Capture Pod', id: '53' },
                { name: 'Captivator', id: '56' },
                { name: 'Hedgehog', id: '42' },
            ],
        },
        {
            Patches: [
                { name: 'Time Stop Patch', id: '8' },
                { name: 'Fire Patch', id: '1' },
                { name: 'Ice Patch', id: '2' },
                { name: 'Invisible Patch', id: '3' },
                { name: 'Acid Patch', id: '4' },
            ],
        },
    ];
    function fill(element) {
        let elements = [];
        groups.forEach((element, index) => {
            elements.push(document.createElement('optgroup'));
            elements[index].label = Object.keys(element)[0];
            element[Object.keys(element)[0]].forEach((element) => {
                let option = document.createElement('option');
                option.value = element.id;
                option.innerHTML = element.name;
                if (element.warning) option.classList.add('warning');
                elements[index].appendChild(option);
            });
        });
        elements.forEach((e) => element.appendChild(e));
    }
    blockedits.forEach((element) => fill(element));
}

export function UpdateMenuDisplay(block, world) {
    world = world.toUpperCase();
    function updateItemDisplay(item, side) {
        let image = document.getElementById(side).parentNode.children[1].children[0];
        if (item.id == 0) {
            image.style.display = 'none';
            return;
        }
        switch (item.id) {
            case 1:
                image.src = 'textures/tilesets/' + world + '/FIRE_TILE_1.png';
                break;
            case 2:
                image.src = 'textures/tilesets/' + world + '/ICE_TILE.png';
                break;
            case 3:
                image.src = 'textures/tilesets/' + world + '/INVISIBLE_TILE_1.png';
                break;
            case 4:
                image.src = 'textures/tilesets/' + world + '/ACID_TILE.png';
                break;
            case 7:
                image.src = 'textures/tilesets/' + world + '/EXIT_RED_TILE.png';
                break;
            case 8:
                image.src = 'textures/tilesets/' + world + '/TIMER_PAUSE_TILE.png';
                break;
            case 11:
                image.src = 'textures/tilesets/' + world + '/MOVING_SPIKE_TILE.png';
                break;
            case 12:
                image.src = 'textures/tilesets/' + world + '/SPIKE_TILE.png';
                break;
            default:
                image.src = 'sprites/' + item.id + ReturnItemValueName(item) + '.png';
                break;
        }
        image.style.display = 'inline';
    }
    function updateRotationValues(element, sideIndex) {
        switch (sideIndex) {
            case 0:
                element.getElementsByTagName('option')[0].innerHTML = '+X';
                element.getElementsByTagName('option')[1].innerHTML = '-X';
                element.getElementsByTagName('option')[2].innerHTML = '+Z';
                element.getElementsByTagName('option')[3].innerHTML = '-Z';
                element.getElementsByTagName('option')[0].value = 4;
                element.getElementsByTagName('option')[1].value = 2;
                element.getElementsByTagName('option')[2].value = 1;
                element.getElementsByTagName('option')[3].value = 3;
                break;
            case 1:
                element.getElementsByTagName('option')[0].innerHTML = '+Y';
                element.getElementsByTagName('option')[1].innerHTML = '-Y';
                element.getElementsByTagName('option')[2].innerHTML = '+Z';
                element.getElementsByTagName('option')[3].innerHTML = '-Z';
                element.getElementsByTagName('option')[0].value = 2;
                element.getElementsByTagName('option')[1].value = 4;
                element.getElementsByTagName('option')[2].value = 1;
                element.getElementsByTagName('option')[3].value = 3;
                break;
            case 2:
                element.getElementsByTagName('option')[0].innerHTML = '+X';
                element.getElementsByTagName('option')[1].innerHTML = '-X';
                element.getElementsByTagName('option')[2].innerHTML = '+Y';
                element.getElementsByTagName('option')[3].innerHTML = '-Y';
                element.getElementsByTagName('option')[0].value = 2;
                element.getElementsByTagName('option')[1].value = 4;
                element.getElementsByTagName('option')[2].value = 1;
                element.getElementsByTagName('option')[3].value = 3;
                break;
            case 3:
                element.getElementsByTagName('option')[0].innerHTML = '+X';
                element.getElementsByTagName('option')[1].innerHTML = '-X';
                element.getElementsByTagName('option')[2].innerHTML = '+Y';
                element.getElementsByTagName('option')[3].innerHTML = '-Y';
                element.getElementsByTagName('option')[0].value = 2;
                element.getElementsByTagName('option')[1].value = 4;
                element.getElementsByTagName('option')[2].value = 3;
                element.getElementsByTagName('option')[3].value = 1;
                break;
            case 4:
                element.getElementsByTagName('option')[0].innerHTML = '+Y';
                element.getElementsByTagName('option')[1].innerHTML = '-Y';
                element.getElementsByTagName('option')[2].innerHTML = '+Z';
                element.getElementsByTagName('option')[3].innerHTML = '-Z';
                element.getElementsByTagName('option')[0].value = 4;
                element.getElementsByTagName('option')[1].value = 2;
                element.getElementsByTagName('option')[2].value = 1;
                element.getElementsByTagName('option')[3].value = 3;
                break;
            case 5:
                element.getElementsByTagName('option')[0].innerHTML = '+X';
                element.getElementsByTagName('option')[1].innerHTML = '-X';
                element.getElementsByTagName('option')[2].innerHTML = '+Z';
                element.getElementsByTagName('option')[3].innerHTML = '-Z';
                element.getElementsByTagName('option')[0].value = 2;
                element.getElementsByTagName('option')[1].value = 4;
                element.getElementsByTagName('option')[2].value = 1;
                element.getElementsByTagName('option')[3].value = 3;
                break;
        }
    }
    function updateItemOptionsDisplay() {
        Array.from(document.getElementsByClassName('option')).forEach((element) => {
            element.style.display = 'none';
        });
        let sideIndex;
        blockselects.forEach((element, index) => {
            if (element.classList.contains('selected')) sideIndex = index;
        });
        switch (block.userData['type']) {
            case 5:
                if (block.userData['moving'].toPosition.equals(new THREE.Vector3(0, 0, 0))) editmovingconnection.innerText = 'Attach';
                else editmovingconnection.innerText = 'Detach';
                editmovinglength.selectedIndex = block.userData['moving'].length;
                editmovingspeed.value = block.userData['moving'].speed;
                Array.from(document.getElementsByClassName('moving-option')).forEach((element) => (element.style.display = 'flex'));
                break;
            case 7:
                editflashingindex.selectedIndex = block.userData['flashing'].index;
                Array.from(document.getElementsByClassName('flashing-option')).forEach((element) => (element.style.display = 'flex'));
                break;
            case 8:
                if (block.userData['laser'].toPosition.equals(new THREE.Vector3(0, 0, 0))) editlaserconnection.innerText = 'Attach';
                else editlaserconnection.innerText = 'Detach';
                editlasercolor.selectedIndex = block.userData['laser'].color;
                editlaserenabled.value = block.userData['laser'].enabled;
                Array.from(document.getElementsByClassName('laser-option')).forEach((element) => (element.style.display = 'flex'));
        }

        if (block.userData['items'].length > 0 && sideIndex !== undefined) {
            switch (block.userData['items'][sideIndex].id) {
                case 5:
                    updateRotationValues(edittransporterrotation, sideIndex);
                    if (block.userData['items'][sideIndex].toPosition == 65535) edittransporterconnection.innerText = 'Attach';
                    else edittransporterconnection.innerText = 'Detach';
                    edittransportercolor.value = block.userData['items'][sideIndex].varient;
                    edittransporterenabled.value = block.userData['items'][sideIndex].state;
                    if (block.userData['items'][sideIndex].rotation === 0) edittransporterrotation.value = 1;
                    else edittransporterrotation.value = block.userData['items'][sideIndex].rotation;
                    edittransporterconnection.parentNode.children[1].children[0].src =
                        'sprites/5' + ReturnItemValueName(block.userData['items'][sideIndex]) + '.png';
                    edittransportercolor.parentNode.children[1].children[0].src =
                        'sprites/5' + ReturnItemValueName(block.userData['items'][sideIndex]) + '.png';
                    edittransporterenabled.parentNode.children[1].children[0].src =
                        'sprites/5' + ReturnItemValueName(block.userData['items'][sideIndex]) + '.png';
                    edittransporterrotation.parentNode.children[1].children[0].src =
                        'sprites/5' + ReturnItemValueName(block.userData['items'][sideIndex]) + '.png';
                    edittransporterpower.parentNode.children[1].children[0].src =
                        'sprites/5' + ReturnItemValueName(block.userData['items'][sideIndex]) + '.png';
                    Array.from(document.getElementsByClassName('transporter-option')).forEach((element) => (element.style.display = 'flex'));
                    break;
                case 9:
                    editbuttoncolor.value = block.userData['items'][sideIndex].varient;
                    editbuttonenabled.value = block.userData['items'][sideIndex].state;
                    editbuttoncolor.parentNode.children[1].children[0].src =
                        'sprites/9' + ReturnItemValueName(block.userData['items'][sideIndex]) + '.png';
                    editbuttonenabled.parentNode.children[1].children[0].src =
                        'sprites/9' + ReturnItemValueName(block.userData['items'][sideIndex]) + '.png';
                    editbuttonpower1.parentNode.children[1].children[0].src =
                        'sprites/9' + ReturnItemValueName(block.userData['items'][sideIndex]) + '.png';
                    editbuttonpower2.parentNode.children[1].children[0].src =
                        'sprites/9' + ReturnItemValueName(block.userData['items'][sideIndex]) + '.png';
                    Array.from(document.getElementsByClassName('button-option')).forEach((element) => (element.style.display = 'flex'));
                    break;
                case 11:
                    editmovingspikeindex.value = block.userData['items'][sideIndex].varient;
                    Array.from(document.getElementsByClassName('moving-spike-option')).forEach((element) => (element.style.display = 'flex'));
                    break;
                case 28:
                    updateRotationValues(editarrowrotation, sideIndex);
                    if (block.userData['items'][sideIndex].rotation === 0) editarrowrotation.value = 1;
                    else editarrowrotation.value = block.userData['items'][sideIndex].rotation;
                    Array.from(document.getElementsByClassName('arrow-option')).forEach((element) => (element.style.display = 'flex'));
                    break;
                case 30:
                    updateRotationValues(editplayerspawnrotation, sideIndex);
                    if (block.userData['items'][sideIndex].rotation === 0) editplayerspawnrotation.value = 1;
                    else editplayerspawnrotation.value = block.userData['items'][sideIndex].rotation;
                    Array.from(document.getElementsByClassName('player-spawn-option')).forEach((element) => (element.style.display = 'flex'));
                    break;
                case 50:
                    updateRotationValues(editslowstarrotation, sideIndex);
                    if (block.userData['items'][sideIndex].rotation === 0) editslowstarrotation.value = 1;
                    else editslowstarrotation.value = block.userData['items'][sideIndex].rotation;
                    Array.from(document.getElementsByClassName('slow-star-option')).forEach((element) => (element.style.display = 'flex'));
                    break;
                case 51:
                    updateRotationValues(edittirerotation, sideIndex);
                    if (block.userData['items'][sideIndex].rotation === 0) edittirerotation.value = 1;
                    else edittirerotation.value = block.userData['items'][sideIndex].rotation;
                    Array.from(document.getElementsByClassName('tire-option')).forEach((element) => (element.style.display = 'flex'));
                    break;
                case 52:
                    updateRotationValues(editfaststarrotation, sideIndex);
                    if (block.userData['items'][sideIndex].rotation === 0) editfaststarrotation.value = 1;
                    else editfaststarrotation.value = block.userData['items'][sideIndex].rotation;
                    Array.from(document.getElementsByClassName('fast-star-option')).forEach((element) => (element.style.display = 'flex'));
                    break;
                case 56:
                    editcaptivatorindex.value = block.userData['items'][sideIndex].varient;
                    Array.from(document.getElementsByClassName('captivator-option')).forEach((element) => (element.style.display = 'flex'));
                    break;
            }
        }
    }
    blockedits.forEach((element) => (element.parentNode.children[1].children[0].style.display = 'none'));
    if (block === undefined) {
        blockbar.style.display = 'none';
        return;
    }
    editblocktype.value = block.userData['type'];
    blockbar.style.display = 'flex';
    let blockTexture;
    switch (editblocktype.value) {
        case '0':
            blockTexture = 'REGULAR_TILE_1.png';
            break;
        case '1':
            blockTexture = 'FIRE_TILE_1.png';
            break;
        case '2':
            blockTexture = 'ICE_TILE.png';
            break;
        case '3':
            blockTexture = 'INVISIBLE_TILE_1.png';
            break;
        case '4':
            blockTexture = 'ACID_TILE.png';
            break;
        case '5':
            blockTexture = 'MOVING_PLATFORM_TILE_4.png';
            break;
        case '6':
            blockTexture = 'CRUMBLE_TILE.png';
            break;
        case '7':
            blockTexture = 'REGULAR_TILE_1.png';
            break;
        case '8':
            switch (block.userData['laser'].color) {
                case 0:
                    blockTexture = 'LASER_YELLOW_TILE.png';
                    break;
                case 1:
                    blockTexture = 'LASER_BLUE_TILE.png';
                    break;
                case 2:
                    blockTexture = 'LASER_GREEN_TILE.png';
                    break;
                case 3:
                    blockTexture = 'LASER_RED_TILE.png';
                    break;
                default:
                    blockTexture = 'LASER_YELLOW_TILE.png';
                    break;
            }
            break;
        default:
            blockTexture = 'REGULAR_TILE_1.png';
            break;
    }
    blocktype.children[1].style.backgroundImage = "url('./textures/tilesets/" + world + '/' + blockTexture + "')";
    for (let i = 0; i < blockgroup.children.length; i++)
        blockgroup.children[i].children[1].style.backgroundImage = "url('./textures/tilesets/" + world + '/' + blockTexture + "')";
    
    for (let i = 0; i < optiongroup.children.length; i++)
        optiongroup.children[i].children[1].style.backgroundImage = "url('./textures/tilesets/" + world + '/' + blockTexture + "')";
    
    if (block.userData['items'].length > 0) {
        blockedits.forEach((element, index) => {
            let item = block.userData['items'][index];
            if (item.id === 5 || item.id === 9) element.value = item.id;
            else element.value = item.id + ReturnItemValueName(item);
            updateItemDisplay(item, blockedits[index].getAttribute('id'));
        });
    } else blockedits.forEach((element) => (element.selectedIndex = 0));
    let blocks = document.getElementsByClassName('block');
    if (block.userData['type'] > 4) for (let i = 1; i < blocks.length; i++) blockgroup.style.display = 'none';
    else for (let i = 1; i < blocks.length; i++) blockgroup.style.display = 'flex';
    updateItemOptionsDisplay();
}

export function SetWorld(name) {
    worlds.forEach((element) => (element.classList.remove('selected')));
    document.getElementById(name).classList.add('selected');
}

export function SetSelectedBlockType(value) {
    blocktypes.forEach((element) => (element.classList.remove('selected')));
    blocktypes[value].classList.add('selected');
}

export function SetSelectedBoundType(value) {
    boundtypes.forEach((element) => (element.classList.remove('selected')));
    boundtypes[value].classList.add('selected');
}

export function DisplayAlert(type, message) {
    if (currentTimeouts.length > 0)
        currentTimeouts.forEach((timeout) => {
            if (timeout[0] == type) clearTimeout(timeout[1]);
        });
    let alert = document.getElementById(type);
    alert.innerHTML = "<span class='alert-button'>&times;</span>" + message;
    alert.style.display = '';
    currentTimeouts.push([type, setTimeout(() => (alert.style.display = 'none'), 3000)]);
}

export function RemoveAlert(type) {
    document.getElementById(type).style.display = 'none';
}

export function ReturnItemValueName(item) {
    switch (item.id) {
        case 5:
        case 9:
            if (item.varient == 0) return 'a';
            else if (item.varient == 1) return 'b';
            else if (item.varient == 2) return 'c';
            else return 'd';
        case 36:
        case 37:
            if (item.varient == 0) return 'a';
            else if (item.varient == 1) return 'b';
            else return 'c';
        default:
            return '';
    }
}

Array.from(document.getElementsByClassName('alert')).forEach((element) => (element.onclick = () => (element.style.display = 'none')));
