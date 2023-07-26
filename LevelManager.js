import * as THREE from './js/build/three.module.js';

export function LoadLevel(file) {
    let buffer = new Uint16Array(file);
    let level = { blocks: new THREE.Group(), time: 99, secret: false, far: false };
    let levelBlocks = new THREE.Group();
    let currentPosition = new THREE.Vector3(0, 33, 0);
    let currentBlockFileOffset = 0,
        currentItemFileOffset = 39308;
    while (currentBlockFileOffset < 39304) {
        for (let i = 0; i < 34; i++) {
            let blockID = buffer[currentBlockFileOffset];
            if (blockID != 65535) {
                let block = new THREE.Mesh(new THREE.BoxBufferGeometry());
                block.name = levelBlocks.children.length;
                block.userData = {
                    type: 0,
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
                block.position.set(currentPosition.x, currentPosition.y, currentPosition.z);
                if (blockID < 5) block.userData['type'] = blockID;
                else {
                    block.userData['type'] = buffer[currentItemFileOffset - 1];
                    switch (block.userData['type']) {
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                            for (let item = 0; item < 6; item++) {
                                let currentItem = Object();
                                currentItem.id = buffer[currentItemFileOffset];
                                currentItem.rotation = buffer[currentItemFileOffset + 1];
                                currentItem.varient = buffer[currentItemFileOffset + 2];
                                currentItem.state = buffer[currentItemFileOffset + 3];
                                currentItem.power1 = 65535;
                                currentItem.power2 = 65535;
                                if (currentItem.id === 5) {
                                    currentItem.power1 = buffer[currentItemFileOffset + 5];
                                    currentItem.toPosition = buffer[currentItemFileOffset + 6];
                                }
                                if (currentItem.id === 9) {
                                    currentItem.power1 = buffer[currentItemFileOffset + 5];
                                    currentItem.power2 = buffer[currentItemFileOffset + 6];
                                }
                                block.userData['items'].push(currentItem);
                                currentItemFileOffset += 16;
                            }
                            currentItemFileOffset += 32;
                            break;
                        case 5:
                            let movingData = block.userData['moving'];
                            movingData.type = buffer[currentItemFileOffset];
                            movingData.orientation = buffer[currentItemFileOffset + 1];
                            movingData.fromPosition.set(
                                buffer[currentItemFileOffset + 3],
                                buffer[currentItemFileOffset + 5],
                                buffer[currentItemFileOffset + 4]
                            );
                            movingData.toPosition.set(
                                buffer[currentItemFileOffset + 6],
                                buffer[currentItemFileOffset + 8],
                                buffer[currentItemFileOffset + 7]
                            );
                            movingData.length = buffer[currentItemFileOffset + 16];
                            movingData.speed = buffer[currentItemFileOffset + 17];
                            movingData.id = buffer[currentItemFileOffset + 19];
                            movingData.startingPosition.set(
                                buffer[currentItemFileOffset + 118],
                                buffer[currentItemFileOffset + 120],
                                buffer[currentItemFileOffset + 119]
                            );
                            currentItemFileOffset += 128;
                            break;
                        case 7:
                            block.userData['flashing'].index = buffer[currentItemFileOffset + 1];
                            currentItemFileOffset += 128;
                            break;
                        case 8:
                            let laserData = block.userData['laser'];
                            laserData.orientation = buffer[currentItemFileOffset + 1];
                            laserData.enabled = buffer[currentItemFileOffset + 2];
                            laserData.fromPosition.set(
                                buffer[currentItemFileOffset + 3],
                                buffer[currentItemFileOffset + 5],
                                buffer[currentItemFileOffset + 4]
                            );
                            laserData.toPosition.set(
                                buffer[currentItemFileOffset + 6],
                                buffer[currentItemFileOffset + 8],
                                buffer[currentItemFileOffset + 7]
                            );
                            laserData.id = buffer[currentItemFileOffset + 19];
                            laserData.color = buffer[currentItemFileOffset + 21];
                            laserData.power = buffer[currentItemFileOffset + 22];
                            currentItemFileOffset += 128;
                            break;
                        default:
                            currentItemFileOffset += 128;
                    }
                }
                level.blocks.add(block);
            }
            currentBlockFileOffset += 1;
            currentPosition.y--;
        }
        if (currentPosition.z > 32) {
            currentPosition.y = 33;
            currentPosition.z = 0;
            currentPosition.x++;
        } else {
            currentPosition.y = 33;
            currentPosition.z++;
        }
    }
    if (buffer[currentItemFileOffset - 1] === 9) {
        if (buffer[currentItemFileOffset] === 1) level.secret = true;
        if (buffer[currentItemFileOffset + 1] === 1) level.far = true;
        currentItemFileOffset += 128;
    }
    if (buffer[currentItemFileOffset - 1] === 666) level.time = buffer[currentItemFileOffset + 5];
    return level;
}

export function WriteLevel(level) {
    let fileBytes = [];
    let levelBlocks = level.blocks.children;
    let levelAttributes = 0;
    for (let i = 0; i < 39304; i++) fileBytes.push(65535);
    levelBlocks.forEach((block) => {
        if (block.userData['items'].length > 0 || block.userData['type'] > 4) levelAttributes++;
    });
    fileBytes.push(levelBlocks.length);
    fileBytes.push(0);
    if (level.secret) levelAttributes += 1;
    if (level.far) levelAttributes += 1;
    fileBytes.push(levelAttributes);
    let currentPosition = new THREE.Vector3(0, 33, 0);
    let currentBlockFileOffset = 0;
    let currentAttributeIndex = 5;
    while (currentBlockFileOffset < 39304) {
        for (let i = 0; i < 34; i++) {
            levelBlocks.every((block) => {
                if (block.position.x == currentPosition.x && block.position.y == currentPosition.y && block.position.z == currentPosition.z) {
                    switch (block.userData['type']) {
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                            if (block.userData['items'] == 0) fileBytes[currentBlockFileOffset] = block.userData['type'];
                            else {
                                fileBytes[currentBlockFileOffset] = currentAttributeIndex;
                                currentAttributeIndex++;
                                fileBytes.push(block.userData['type']);
                                for (let j = 0; j < block.userData['items'].length; j++) {
                                    let item = block.userData['items'][j];
                                    if (item.id != 0) {
                                        fileBytes.push(item.id);
                                        fileBytes.push(item.rotation);
                                        fileBytes.push(item.varient);
                                        fileBytes.push(item.state);
                                        fileBytes.push(65535);
                                        if (item.id === 5) {
                                            fileBytes.push(item.power1);
                                            fileBytes.push(item.toPosition);
                                        } else if (item.id === 9) {
                                            fileBytes.push(item.power1);
                                            fileBytes.push(item.power2);
                                        } else {
                                            fileBytes.push(65535);
                                            fileBytes.push(65535);
                                        }
                                        fileBytes.push(0);
                                        for (let o = 0; o < 8; o++) fileBytes.push(65535);
                                    } else {
                                        fileBytes.push(0);
                                        fileBytes.push(65535);
                                        fileBytes.push(65535);
                                        fileBytes.push(0);
                                        fileBytes.push(65535);
                                        fileBytes.push(65535);
                                        fileBytes.push(65535);
                                        fileBytes.push(0);
                                        for (let o = 0; o < 8; o++) fileBytes.push(65535);
                                    }
                                }
                                for (let q = 0; q < 28; q++) fileBytes.push(65535);
                                fileBytes.push(block.position.x);
                                fileBytes.push(block.position.z);
                                fileBytes.push(ConvertYPosition(block.position.y + 1));
                            }
                            break;
                        case 5:
                            let movingData = block.userData['moving'];
                            fileBytes[currentBlockFileOffset] = currentAttributeIndex;
                            currentAttributeIndex++;
                            fileBytes.push(block.userData['type']);
                            fileBytes.push(movingData.type);
                            fileBytes.push(movingData.orientation);
                            fileBytes.push(1);
                            fileBytes.push(movingData.fromPosition.x);
                            fileBytes.push(movingData.fromPosition.z);
                            fileBytes.push(movingData.fromPosition.y);
                            fileBytes.push(movingData.toPosition.x);
                            fileBytes.push(movingData.toPosition.z);
                            fileBytes.push(movingData.toPosition.y);
                            for (let o = 0; o < 7; o++) fileBytes.push(65535);
                            fileBytes.push(movingData.length);
                            fileBytes.push(movingData.speed);
                            fileBytes.push(65535);
                            fileBytes.push(currentAttributeIndex - 1);
                            for (let o = 0; o < 98; o++) fileBytes.push(65535);
                            fileBytes.push(movingData.startingPosition.x);
                            fileBytes.push(movingData.startingPosition.z);
                            fileBytes.push(movingData.startingPosition.y);
                            fileBytes.push(256);
                            fileBytes.push(256);
                            fileBytes.push(256);
                            fileBytes.push(block.position.x);
                            fileBytes.push(block.position.z);
                            fileBytes.push(ConvertYPosition(block.position.y + 1));
                            break;
                        case 6:
                            fileBytes[currentBlockFileOffset] = currentAttributeIndex;
                            currentAttributeIndex++;
                            fileBytes.push(block.userData['type']);
                            fileBytes.push(1);
                            for (let o = 0; o < 3; o++) fileBytes.push(0);
                            for (let o = 0; o < 120; o++) fileBytes.push(65535);
                            fileBytes.push(block.position.x);
                            fileBytes.push(block.position.z);
                            fileBytes.push(ConvertYPosition(block.position.y + 1));
                            break;
                        case 7:
                            fileBytes[currentBlockFileOffset] = currentAttributeIndex;
                            currentAttributeIndex++;
                            fileBytes.push(block.userData['type']);
                            fileBytes.push(65535);
                            fileBytes.push(block.userData['flashing'].index);
                            for (let o = 0; o < 122; o++) fileBytes.push(65535);
                            fileBytes.push(block.position.x);
                            fileBytes.push(block.position.z);
                            fileBytes.push(ConvertYPosition(block.position.y + 1));
                            break;
                        case 8:
                            let laserData = block.userData['laser'];
                            fileBytes[currentBlockFileOffset] = currentAttributeIndex;
                            currentAttributeIndex++;
                            fileBytes.push(block.userData['type']);
                            fileBytes.push(2);
                            fileBytes.push(laserData.orientation);
                            fileBytes.push(laserData.enabled);
                            fileBytes.push(laserData.fromPosition.x);
                            fileBytes.push(laserData.fromPosition.z);
                            fileBytes.push(laserData.fromPosition.y);
                            fileBytes.push(laserData.toPosition.x);
                            fileBytes.push(laserData.toPosition.z);
                            fileBytes.push(laserData.toPosition.y);
                            for (let o = 0; o < 7; o++) fileBytes.push(65535);
                            fileBytes.push(1);
                            for (let o = 0; o < 2; o++) fileBytes.push(65535);
                            fileBytes.push(laserData.id);
                            fileBytes.push(65535);
                            fileBytes.push(laserData.color);
                            fileBytes.push(laserData.power);
                            for (let o = 0; o < 101; o++) fileBytes.push(65535);
                            fileBytes.push(block.position.x);
                            fileBytes.push(block.position.z);
                            fileBytes.push(ConvertYPosition(block.position.y + 1));
                            break;
                        default:
                            fileBytes.push(block.userData['type']);
                            for (let o = 0; o < 124; o++) fileBytes.push(65535);
                            break;
                    }
                    return false;
                }
                return true;
            });
            currentBlockFileOffset += 1;
            currentPosition.y--;
        }
        if (currentPosition.z > 32) {
            currentPosition.y = 33;
            currentPosition.z = 0;
            currentPosition.x++;
        } else {
            currentPosition.y = 33;
            currentPosition.z++;
        }
    }

    if (level.secret || level.far) {
        fileBytes.push(9);
        fileBytes.push(level.secret);
        fileBytes.push(level.far);
        for (let o = 0; o < 125; o++) fileBytes.push(0);
    }

    fileBytes.push(666);
    fileBytes.push(20);
    fileBytes.push(13);
    fileBytes.push(17);
    fileBytes.push(65531);
    fileBytes.push(0);
    fileBytes.push(level.time);
    for (let o = 0; o < 121; o++) fileBytes.push(65535);
    return fileBytes;
}

export function ConvertYPosition(yPos) {
    let array = [];
    for (let i = 34; i > -1; i--) array.push(i);
    return array[yPos];
}

export function ConvertBlockCode(level, block, side) {
    let currentPosition = new THREE.Vector3(0, 33, 0);
    let currentIndex = 0;
    let index1 = 0,
        index2 = 0;
    while (currentIndex < 78608) {
        for (let i = 0; i < 34; i++) {
            for (let b = 0; b < level.blocks.children.length; b++) {
                let currentBlock = level.blocks.children[b];
                if (
                    currentBlock.position.x == currentPosition.x &&
                    currentBlock.position.y == currentPosition.y &&
                    currentBlock.position.z == currentPosition.z
                ) {
                    if (currentBlock.userData['type'] > 4 || currentBlock.userData['items'].length > 0) {
                        if (block === currentBlock) {
                            index1 *= 16;
                            index1 += side;
                            if (index1 == 0) index2 *= 16;
                            return (index2 << 8) | index1;
                        } else {
                            index1++;
                            if (index1 > 15) {
                                index1 = 0;
                                index2++;
                            }
                        }
                    }
                }
            }
            currentIndex += 2;
            currentPosition.y--;
        }
        if (currentPosition.z > 32) {
            currentPosition.y = 33;
            currentPosition.z = 0;
            currentPosition.x++;
        } else {
            currentPosition.y = 33;
            currentPosition.z++;
        }
    }
}

export function ReturnItem(itemID) {
    switch (itemID) {
        case '1':
            return { id: 1, rotation: 0, varient: 0, state: 0 };
        case '2':
            return { id: 2, rotation: 0, varient: 0, state: 0 };
        case '3':
            return { id: 3, rotation: 0, varient: 0, state: 0 };
        case '4':
            return { id: 4, rotation: 0, varient: 0, state: 0 };
        case '5':
            return { id: 5, rotation: 0, varient: 0, state: 1, toPosition: 65535, power1: 65535, power2: 65535 };
        case '7':
            return { id: 7, rotation: 0, varient: 0, state: 2 };
        case '8':
            return { id: 8, rotation: 0, varient: 0, state: 0 };
        case '9':
            return { id: 9, rotation: 0, varient: 0, state: 1, power1: 65535 };
        case '10':
            return { id: 10, rotation: 0, varient: 0, state: 1 };
        case '11':
            return { id: 11, rotation: 0, varient: 0, state: 1 };
        case '12':
            return { id: 12, rotation: 0, varient: 0, state: 1 };
        case '26':
            return { id: 26, rotation: 0, varient: 0, state: 2 };
        case '28':
            return { id: 28, rotation: 0, varient: 0, state: 1 };
        case '30':
            return { id: 30, rotation: 0, varient: 0, state: 0 };
        case '31':
            return { id: 31, rotation: 0, varient: 0, state: 1 };
        case '32':
            return { id: 32, rotation: 0, varient: 0, state: 1 };
        case '33':
            return { id: 33, rotation: 0, varient: 0, state: 1 };
        case '34':
            return { id: 34, rotation: 0, varient: 0, state: 1 };
        case '35':
            return { id: 35, rotation: 0, varient: 0, state: 1 };
        case '36a':
            return { id: 36, rotation: 0, varient: 0, state: 1 };
        case '36b':
            return { id: 36, rotation: 0, varient: 1, state: 1 };
        case '36c':
            return { id: 36, rotation: 0, varient: 2, state: 1 };
        case '37a':
            return { id: 37, rotation: 0, varient: 0, state: 1 };
        case '37b':
            return { id: 37, rotation: 0, varient: 1, state: 1 };
        case '37c':
            return { id: 37, rotation: 0, varient: 2, state: 1 };
        case '38':
            return { id: 38, rotation: 0, varient: 0, state: 1 };
        case '42':
            return { id: 42, rotation: 0, varient: 0, state: 1 };
        case '46':
            return { id: 46, rotation: 0, varient: 0, state: 1 };
        case '50':
            return { id: 50, rotation: 0, varient: 0, state: 0 };
        case '51':
            return { id: 51, rotation: 0, varient: 0, state: 0 };
        case '52':
            return { id: 52, rotation: 1, varient: 0, state: 0 };
        case '53':
            return { id: 53, rotation: 0, varient: 0, state: 0 };
        case '56':
            return { id: 56, rotation: 0, varient: 0, state: 0 };
        case '0':
            return { id: 0, rotation: 0, varient: 0, state: 0 };
        default:
            return { id: 0, rotation: 0, varient: 0, state: 0 };
    }
}
