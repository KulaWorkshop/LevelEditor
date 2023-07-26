import * as THREE from './js/build/three.module.js';

export let REGULAR_TILE_1,
    REGULAR_TILE_2,
    REGULAR_TILE_3,
    REGULAR_TILE_4,
    SHADOW_TILE_1,
    SHADOW_TILE_2,
    SHADOW_TILE_3,
    EXIT_RED_TILE,
    FIRE_TILE_1,
    ICE_TILE,
    ICE_SHADOW_TILE,
    ITEM_BASE_TILE,
    MOVING_SPIKE_TILE,
    SPIKE_TILE,
    INVISIBLE_TILE_1,
    ACID_TILE,
    TIMER_PAUSE_TILE,
    CRUMBLE_TILE,
    LASER_YELLOW_TILE,
    LASER_BLUE_TILE,
    LASER_GREEN_TILE,
    LASER_RED_TILE,
    MOVING_PLATFORM_TILE_4;

export function InitializeTextures(worldName) {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setPath('textures/tilesets/' + worldName.toUpperCase() + '/');
    REGULAR_TILE_1 = textureLoader.load('REGULAR_TILE_1.png');
    REGULAR_TILE_2 = textureLoader.load('REGULAR_TILE_2.png');
    REGULAR_TILE_3 = textureLoader.load('REGULAR_TILE_3.png');
    REGULAR_TILE_4 = textureLoader.load('REGULAR_TILE_4.png');
    SHADOW_TILE_1 = textureLoader.load('SHADOW_TILE_1.png');
    SHADOW_TILE_2 = textureLoader.load('SHADOW_TILE_2.png');
    SHADOW_TILE_3 = textureLoader.load('SHADOW_TILE_3.png');
    EXIT_RED_TILE = textureLoader.load('EXIT_RED_TILE.png');
    FIRE_TILE_1 = textureLoader.load('FIRE_TILE_1.png');
    ICE_TILE = textureLoader.load('ICE_TILE.png');
    ICE_SHADOW_TILE = textureLoader.load('ICE_SHADOW_TILE.png');
    ITEM_BASE_TILE = textureLoader.load('ITEM_BASE_TILE.png');
    MOVING_SPIKE_TILE = textureLoader.load('MOVING_SPIKE_TILE.png');
    SPIKE_TILE = textureLoader.load('SPIKE_TILE.png');
    INVISIBLE_TILE_1 = textureLoader.load('INVISIBLE_TILE_1.png');
    ACID_TILE = textureLoader.load('ACID_TILE.png');
    TIMER_PAUSE_TILE = textureLoader.load('TIMER_PAUSE_TILE.png');
    CRUMBLE_TILE = textureLoader.load('CRUMBLE_TILE.png');
    LASER_YELLOW_TILE = textureLoader.load('LASER_YELLOW_TILE.png');
    LASER_BLUE_TILE = textureLoader.load('LASER_BLUE_TILE.png');
    LASER_GREEN_TILE = textureLoader.load('LASER_GREEN_TILE.png');
    LASER_RED_TILE = textureLoader.load('LASER_RED_TILE.png');
    MOVING_PLATFORM_TILE_4 = textureLoader.load('MOVING_PLATFORM_TILE_4.png');
}

export async function InitializeSkybox(scene, worldName) {
    worldName = worldName.toUpperCase();
    scene.background = new THREE.CubeTextureLoader()
        .setPath('./textures/skyboxes/')
        .load([
            worldName + '/PositiveZ.jpg',
            worldName + '/NegativeZ.jpg',
            worldName + '/PositiveY.jpg',
            worldName + '/NegativeY.jpg',
            worldName + '/NegativeX.jpg',
            worldName + '/PositiveX.jpg',
        ]);
}

export function MapBlockTexture(block) {
    function CreateSideTexture(item) {
        switch (item.id) {
            case 1:
                return new THREE.MeshBasicMaterial({
                    map: FIRE_TILE_1,
                });
            case 2:
                return new THREE.MeshBasicMaterial({
                    map: ICE_TILE,
                });
            case 3:
                let texture = new THREE.MeshBasicMaterial({
                    map: INVISIBLE_TILE_1,
                    opacity: 0.5,
                    transparent: true,
                });
                texture.blending = THREE['AdditiveBlending'];
                return texture;
            case 4:
                return new THREE.MeshBasicMaterial({
                    map: ACID_TILE,
                });
            case 5:
            case 9:
            case 10:
                return new THREE.MeshBasicMaterial({
                    map: ITEM_BASE_TILE,
                });
            case 7:
                return new THREE.MeshBasicMaterial({
                    map: EXIT_RED_TILE,
                });
            case 8:
                return new THREE.MeshBasicMaterial({
                    map: TIMER_PAUSE_TILE,
                });
            case 11:
                return new THREE.MeshBasicMaterial({
                    map: MOVING_SPIKE_TILE,
                });
            case 12:
                return new THREE.MeshBasicMaterial({
                    map: SPIKE_TILE,
                });
            case 31:
            case 32:
            case 33:
            case 34:
            case 35:
            case 36:
            case 37:
            case 38:
                if (block.userData['type'] == 1)
                    return new THREE.MeshBasicMaterial({
                        map: FIRE_TILE_1,
                    });
                if (block.userData['type'] == 2)
                    return new THREE.MeshBasicMaterial({
                        map: ICE_SHADOW_TILE,
                    });
                if (block.userData['type'] == 3) {
                    let texture = new THREE.MeshBasicMaterial({
                        map: INVISIBLE_TILE_1,
                        opacity: 0.5,
                        transparent: true,
                    });
                    texture.blending = THREE['AdditiveBlending'];
                    return texture;
                }
                if (block.userData['type'] == 4)
                    return new THREE.MeshBasicMaterial({
                        map: ACID_TILE,
                    });
                else
                    return new THREE.MeshBasicMaterial({
                        map: SHADOW_TILE_1,
                    });
            case 43:
            case 44:
            case 45:
            case 46:
            case 47:
                if (block.userData['type'] == 1)
                    return new THREE.MeshBasicMaterial({
                        map: FIRE_TILE_1,
                    });
                if (block.userData['type'] == 2)
                    return new THREE.MeshBasicMaterial({
                        map: ICE_SHADOW_TILE,
                    });
                if (block.userData['type'] == 3) {
                    let texture = new THREE.MeshBasicMaterial({
                        map: INVISIBLE_TILE_1,
                        opacity: 0.5,
                        transparent: true,
                    });
                    texture.blending = THREE['AdditiveBlending'];
                    return texture;
                }
                if (block.userData['type'] == 4)
                    return new THREE.MeshBasicMaterial({
                        map: ACID_TILE,
                    });
                else
                    return new THREE.MeshBasicMaterial({
                        map: SHADOW_TILE_2,
                    });
            default:
                if (block.userData['type'] == 1)
                    return new THREE.MeshBasicMaterial({
                        map: FIRE_TILE_1,
                    });
                if (block.userData['type'] == 2)
                    return new THREE.MeshBasicMaterial({
                        map: ICE_TILE,
                    });
                if (block.userData['type'] == 3) {
                    let texture = new THREE.MeshBasicMaterial({
                        map: INVISIBLE_TILE_1,
                        opacity: 0.5,
                        transparent: true,
                    });
                    texture.blending = THREE['AdditiveBlending'];
                    return texture;
                }
                if (block.userData['type'] == 4)
                    return new THREE.MeshBasicMaterial({
                        map: ACID_TILE,
                    });
                else
                    return new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    });
        }
    }
    function MapMaterial(item) {
        if (item != undefined && item.id != 0 && item.id != 30) return CreateSideTexture(item);
        switch (block.userData['type']) {
            case 0:
                switch (Math.floor(Math.random() * 4 + 1)) {
                    case 1:
                        return new THREE.MeshBasicMaterial({
                            map: REGULAR_TILE_1,
                        });
                    case 2:
                        return new THREE.MeshBasicMaterial({
                            map: REGULAR_TILE_2,
                        });
                    case 3:
                        return new THREE.MeshBasicMaterial({
                            map: REGULAR_TILE_3,
                        });
                    case 4:
                        return new THREE.MeshBasicMaterial({
                            map: REGULAR_TILE_4,
                        });
                }
            case 1:
                return new THREE.MeshBasicMaterial({
                    map: FIRE_TILE_1,
                });
            case 2:
                return new THREE.MeshBasicMaterial({
                    map: ICE_TILE,
                });
            case 3:
                let texture = new THREE.MeshBasicMaterial({
                    map: INVISIBLE_TILE_1,
                    opacity: 0.5,
                    transparent: true,
                });
                texture.blending = THREE['AdditiveBlending'];
                return texture;
            case 4:
                return new THREE.MeshBasicMaterial({
                    map: ACID_TILE,
                });
            case 5:
                return new THREE.MeshBasicMaterial({
                    map: MOVING_PLATFORM_TILE_4,
                });
            case 6:
                return new THREE.MeshBasicMaterial({
                    map: CRUMBLE_TILE,
                });
            case 7:
                switch (Math.floor(Math.random() * 4 + 1)) {
                    case 1:
                        return new THREE.MeshBasicMaterial({
                            map: REGULAR_TILE_1,
                            opacity: 0.5,
                            transparent: true,
                        });
                    case 2:
                        return new THREE.MeshBasicMaterial({
                            map: REGULAR_TILE_2,
                            opacity: 0.5,
                            transparent: true,
                        });
                    case 3:
                        return new THREE.MeshBasicMaterial({
                            map: REGULAR_TILE_3,
                            opacity: 0.5,
                            transparent: true,
                        });
                    case 4:
                        return new THREE.MeshBasicMaterial({
                            map: REGULAR_TILE_4,
                            opacity: 0.5,
                            transparent: true,
                        });
                }
            case 8:
                return new THREE.MeshBasicMaterial({
                    map: LASER_YELLOW_TILE,
                });
            default:
                return new THREE.MeshBasicMaterial({
                    map: REGULAR_TILE_1,
                });
        }
    }
    if (block.userData['items'].length > 0)
        return [
            MapMaterial(block.userData['items'][1]),
            MapMaterial(block.userData['items'][4]),
            MapMaterial(block.userData['items'][0]),
            MapMaterial(block.userData['items'][5]),
            MapMaterial(block.userData['items'][2]),
            MapMaterial(block.userData['items'][3]),
        ];
    else return [MapMaterial(), MapMaterial(), MapMaterial(), MapMaterial(), MapMaterial(), MapMaterial()];
}

export function MapLaserTexture(block) {
    let fromPosition = block.userData['laser'].fromPosition;
    let toPosition = block.userData['laser'].toPosition;
    let laserTexture;
    switch (block.userData['laser'].color) {
        case 0:
            laserTexture = LASER_YELLOW_TILE;
            break;
        case 1:
            laserTexture = LASER_BLUE_TILE;
            break;
        case 2:
            laserTexture = LASER_GREEN_TILE;
            break;
        case 3:
            laserTexture = LASER_RED_TILE;
            break;
        default:
            laserTexture = LASER_YELLOW_TILE;
            break;
    }
    if (block.userData['laser'].swapped) {
        if (fromPosition.x != toPosition.x) {
            if (toPosition.x > fromPosition.x)
                return [
                    new THREE.MeshBasicMaterial({
                        map: laserTexture,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                ];
            else
                return [
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: laserTexture,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                ];
        } else if (fromPosition.y != toPosition.y) {
            if (toPosition.y > fromPosition.y)
                return [
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: laserTexture,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                ];
            else
                return [
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: laserTexture,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                ];
        } else {
            if (toPosition.z > fromPosition.z)
                return [
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: laserTexture,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                ];
            else
                return [
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: laserTexture,
                    }),
                ];
        }
    } else {
        if (fromPosition.x != toPosition.x) {
            if (toPosition.x > fromPosition.x)
                return [
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: laserTexture,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                ];
            else
                return [
                    new THREE.MeshBasicMaterial({
                        map: laserTexture,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                ];
        } else if (fromPosition.y != toPosition.y) {
            if (toPosition.y > fromPosition.y)
                return [
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: laserTexture,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                ];
            else
                return [
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: laserTexture,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: laserTexture,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                ];
        } else {
            if (toPosition.z > fromPosition.z)
                return [
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: laserTexture,
                    }),
                ];
            else
                return [
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: laserTexture,
                    }),
                    new THREE.MeshBasicMaterial({
                        map: REGULAR_TILE_1,
                    }),
                ];
        }
    }
}
