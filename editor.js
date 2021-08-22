import * as THREE from './js/build/three.module.js'
import { OrbitControls } from './js/OrbitControls.js'
import { TransformControls } from './js/TransformControls.js'

var scene=new THREE.Scene(), 
    renderer = new THREE.WebGLRenderer( { antialias: true } ), 
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 ), 
    orbit = new OrbitControls( camera, renderer.domElement ), 
    transf = new TransformControls( camera, renderer.domElement ), 
    canvas = renderer.domElement, 
    canvasPosition = $(canvas).position(), 
    rayCaster = new THREE.Raycaster(), 
    mousePosition = new THREE.Vector2(), 
    selectedBlock, 
    currentWorldName = "hiro", 
    level=new THREE.Group(), 
    boundingBox = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.BoxBufferGeometry( 34, 34, 34, 1, 1, 1 ))),
    boundingBoxState = true,
    drag = false

function init() {
    
    function indian(dec){
        let temp = dec.toString(16)
        if(temp.length>=4){return [parseInt(temp.substring(0, 2),16),parseInt(temp.substring(2, 4),16)]}
        else if(temp.length===2){return [parseInt(temp,16),0]}
        else if(temp.length===1){return [parseInt(temp,16),0]}
    }

    var saveByteArray = (function () {
        var a = document.createElement("a")
        document.body.appendChild(a)
        a.style = "display: none"
        return function (data, name) {
            var blob = new Blob(data, {type: "octet/stream"}),
                url = window.URL.createObjectURL(blob)
            a.href = url
            a.download = name
            a.click()
            window.URL.revokeObjectURL(url)
        }
    }())

    //Skybox

    scene.background = new THREE.CubeTextureLoader()
        .setPath('./skybox/'+currentWorldName)
        .load([
            '/pos-z.jpg',
            '/neg-z.jpg',
            '/pos-y.jpg',
            '/neg-y.jpg',
            '/neg-x.jpg',
            '/pos-x.jpg'
        ])

    boundingBox.position.set(16.5,16.5,16.5)
    boundingBox.material.transparent = true
    boundingBox.material.opacity = 0.2
    scene.add(boundingBox,level)

    renderer.setPixelRatio( window.devicePixelRatio )
    renderer.setSize( window.innerWidth, window.innerHeight )
    document.body.appendChild(canvas)

    camera.position.set( 16.5, 30, 70 )

    orbit.target.set(16.5,16.5,16.5)
    orbit.minDistance = 0
    orbit.maxDistance = 500
    orbit.update()
    orbit.addEventListener('change',render)

    transf.addEventListener('change',render)
    transf.setMode("translate")
    transf.setTranslationSnap(1)
    transf.addEventListener('dragging-changed', (e)=> {orbit.enabled=!e.value})

    canvas.addEventListener("pointerdown",()=>{drag = false})
    canvas.addEventListener("pointermove",()=>{drag = true})
    
    canvas.addEventListener("click",(e)=>{
        if (!drag){
            e.preventDefault()
            mousePosition.x = ((e.clientX - canvasPosition.left) / canvas.width) * 2 - 1
            mousePosition.y = -((e.clientY - canvasPosition.top) / canvas.height) * 2 + 1
            rayCaster.setFromCamera(mousePosition, camera)
            var intersects = rayCaster.intersectObjects(level.children, true)

            if (intersects.length>0) {
                let flag = false
                for(let i = 0; i < intersects.length;i++){
                    if(intersects[i].object.geometry.type === "BoxGeometry" && !flag) {
                        transf.detach(transf.object)
                        transf.attach(intersects[i].object)
                        updateCommon()
                        flag = true
                    } else if (!flag)transf.detach(transf.object)
                }
            } else transf.detach(transf.object)
            updateCommon()
        }
    })

    // world

    const loader = new THREE.TextureLoader().setPath('textures/' + currentWorldName + '/')

    function loadTx(name){
        return {name:name,texture:loader.load(name)}
    }

    let textureArray = [
        //Tiles
        [
            loadTx('tile1.png'),
            loadTx('tile2.png'),
            loadTx('tile3.png'),
            loadTx('tile4.png')
        ],
        //Special Tiles
        loadTx('fire.png'),      //1 Fire
        loadTx('ice.png'),       //2 Ice
        loadTx('invisible.png'), //3 Invisible
        loadTx('acid.png'),      //4 Acid
        loadTx('crumble.png'),   //5 Crumble
        //Item Shadows
        loadTx('tileItem.png'),  //6 Tile Item
        loadTx('iceItem.png'),   //7 Ice Item
        //Spikes
        loadTx('4spikes.png'),   //8 4 Spikes
        loadTx('12spikes.png'),  //9 12 Spikes
        //Other
        loadTx('timestop.png'),  //10 Time Stop
        loadTx('buttonbase.png'),//11 Button Base
        loadTx('exit.png'),      //12 Exit
        //<2 moving block sides
        [
            loadTx('cyborg1.png'),
            loadTx('cyborg2.png')
        ],
        //>2 moving block sides/end
        [
            loadTx('robotEnd.png'),
            loadTx('robotSide.png')
        ],
        //Lasers
        [
            loadTx('laser1.png'),
            loadTx('laser2.png'),
            loadTx('laser3.png'),
            loadTx('laser4.png')
        ],
    ]

    function generateTexture(posX=0, negX=posX, posY=posX, negY=posX, posZ=posX, negZ=posX){
        function genMat(type){
            let texture, material
            switch(type){
                case 0:
                    texture = textureArray[0][Math.floor(Math.random() * 4)]
                    material = new THREE.MeshBasicMaterial( {map:texture.texture} )
                    material.userData.textureName = texture.name
                    return material
                case 3:
                    texture = textureArray[type]
                    material = new THREE.MeshBasicMaterial( {map:texture.texture,opacity:0.5,transparent:true} )
                    material.blending = THREE["AdditiveBlending"]
                    material.userData.textureName = texture.name
                    return material
                case 16:
                    texture = textureArray[0][Math.floor(Math.random() * 4)]
                    material = new THREE.MeshBasicMaterial( {map:texture.texture,opacity:0.5,transparent:true} )
                    material.userData.textureName = texture.name
                    return material
                default:
                    texture = textureArray[type]
                    material = new THREE.MeshBasicMaterial( {map:texture.texture} )
                    material.userData.textureName = texture.name
                    return material
            }
        }
        return [
            genMat(posX),//Pos X
            genMat(negX),//Neg X
            genMat(posY),//Pos Y
            genMat(negY),//Neg Y
            genMat(posZ),//Pos Z
            genMat(negZ)//Neg Z
        ]
    }

    level.block = {
        add:(vector=null,type=null,block=null)=> {
            if(vector === null && type === null && block === null){
                let temp = new THREE.Mesh(new THREE.BoxBufferGeometry(), generateTexture(selectedBlock))
                if (transf.object !== undefined){
                    temp.position.x = transf.object.position.x
                    temp.position.y = transf.object.position.y
                    temp.position.z = transf.object.position.z
                } else {
                    temp.position.x = 16
                    temp.position.y = 16
                    temp.position.z = 16
                }
                temp.userData = {blockType:"Normal",blockTile:selectedBlock}
                temp.userData.items = {
                    posX:null,
                    negX:null,
                    posY:null,
                    negY:null,
                    posZ:null,
                    negZ:null,
                }
                level.add(temp)
                transf.detach(transf.object)
                transf.attach(temp)
            } else {
                let temp = new THREE.Mesh(new THREE.BoxBufferGeometry(), generateTexture(block))
                temp.position.x = vector.x
                temp.position.y = vector.y
                temp.position.z = vector.z
                temp.userData = {blockType:type,blockTile:block}
                temp.userData.items = {
                    posX:null,
                    negX:null,
                    posY:null,
                    negY:null,
                    posZ:null,
                    negZ:null,
                }
                level.add(temp)
                return temp
            }
            updateCommon()
            document.getElementById('addBlock').blur()
        },
        remove:()=> {
            if (transf.object !== undefined){
                let object = transf.object
                transf.detach(object)
                level.remove(object)
                if(level.children.length > 0) {
                    transf.attach(level.children[level.children.length - 1])
                }
                updateCommon()
            }}}
    level.lastLoaded = null
    level.clear = function() {
        if (transf.object !== undefined){
            transf.detach(transf.object)
            updateCommon()
        }
        while(level.children.length>0){level.remove(level.children[0])}
    }
    level.load = function(levelBytes) {
        function blocksToCoords(block) {
            let positionArray = new THREE.Vector3(0,33,0)
            let atCoord = 0
            while(positionArray.x < 34) {
                while(positionArray.z < 34) {
                    while(positionArray.y > -1) {
                        if ((block/2) == atCoord) {
                            return {x:positionArray.x,y:positionArray.y,z:positionArray.z}
                        } else {
                            positionArray.y--
                            atCoord++
                        }}
                    positionArray.y = 33
                    positionArray.z++
                }
                positionArray.z = 0
                positionArray.x++
            }}
        level.clear()
        let itemArray=[]
        let itemIndex = 0
        if(levelBytes.length>78608){
            let itemAmount = levelBytes[78612]
            for(let i=0;i<itemAmount;i++){
                itemArray.push(new Array())
                for(let xi=0;xi<256;xi++){
                    itemArray[i].push(levelBytes[(i*256)+78614+xi])
                }
            }
        }
        for(let i=0;i<78608;i+=2) {
            switch(levelBytes[i]){
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                    level.block.add(new THREE.Vector3(blocksToCoords(i).x,blocksToCoords(i).y,blocksToCoords(i).z),"Normal",levelBytes[i])
                    break
                case 255:
                    break
                default:
                    if(itemArray[itemIndex][0] === 6){
                        let temp = level.block.add(new THREE.Vector3(blocksToCoords(i).x,blocksToCoords(i).y,blocksToCoords(i).z),"Normal",itemArray[itemIndex][0])
                        changeBlock(temp,"6")
                    } else {
                        let temp = level.block.add(new THREE.Vector3(blocksToCoords(i).x,blocksToCoords(i).y,blocksToCoords(i).z),"Special",itemArray[itemIndex][0])
                        let positions = ["posY","posX","posZ","negZ","negX","negY"]
                        for(let i=0;i<positions.length;i++){
                            if(itemArray[itemIndex][2+(32*i)]!==0){
                                let variantID = ""
                                switch(itemArray[itemIndex][2+(32*i)]){
                                    case 37:
                                        switch(itemArray[itemIndex][6+(32*i)]){
                                            case 0:variantID="c";break
                                            case 1:variantID="b";break
                                            case 2:variantID="a";break
                                        }
                                    case 36:
                                        switch(itemArray[itemIndex][6+(32*i)]){
                                            case 0:variantID="c";break
                                            case 1:variantID="b";break
                                            case 2:variantID="a";break
                                        }
                                }
                                addItem(temp,itemArray[itemIndex][2+(32*i)]+variantID,positions[i])
                            }
                        }
                    }
                    itemIndex++
                    break
            }}}
    level.build = ()=>{
        function coordsToBlocks(bPos) {
            let positionArray = new THREE.Vector3(0,33,0)
            let atCoord = 0
            while(positionArray.x < 34) {
                while(positionArray.z < 34) {
                    while(positionArray.y > -1) {
                        if (positionArray.x === bPos.x && positionArray.y === bPos.y && positionArray.z === bPos.z ) {
                            return atCoord*2
                        } else {
                            positionArray.y--
                            atCoord++
                        }}
                    positionArray.y = 33
                    positionArray.z++
                }
                positionArray.z = 0
                positionArray.x++
            }
        }
        function convertY(y){
            let arr = []
            for(let i = 34; i > -1; i--) arr.push(i)
            return arr[y]
        }
        function generateItem(block){
            let positions = ["posY","posX","posZ","negZ","negX","negY"]
            function partialItem(item,block=null) {
                let temp = []
                if(item===null){
                    if(block===null){
                        temp.push(255)
                        temp.push(255)
                    } else {
                        temp.push(indian(block)[0])
                        temp.push(indian(block)[1])
                    }
                    for(let i=0;i<30;i++){
                        temp.push(255)
                    }
                    temp[2] = 0
                    temp[3] = 0
                    temp[8] = 0
                    temp[9] = 0
                    temp[16] = 0
                    temp[17] = 0
                    return temp
                } else {
                    if(block===null){
                        temp.push(255)
                        temp.push(255)
                    } else {
                        temp.push(indian(block)[0])
                        temp.push(indian(block)[1])
                    }
                    temp.push(indian(item.id)[0])
                    temp.push(indian(item.id)[1])
                    for(let i=0;i<6;i++)temp.push(0)
                    switch(item.id){
                        case 30:
                        case 8:
                        case 51:
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 26:
                        case 56:
                        case 53:
                        case 52:
                        case 50:
                            temp[8]=0
                            break
                        case 7:
                            temp[8]=2
                            break
                        case 37:
                        case 36:
                            temp[6] = indian(item.variant)[0]
                            temp[7] = indian(item.variant)[1]
                            temp[8]=1
                            break
                        default:
                            temp[8]=1
                            break
                    }
                    for(let i=0;i<22;i++){
                        temp.push(255)
                    }
                    temp[16]=0
                    temp[17]=0
                    return temp
                }
            }
            let wholeItem = []
            wholeItem = wholeItem.concat(partialItem(block.userData.items[positions[0]],block.userData.blockTile))
            for(let i=1;i<positions.length;i++){
                wholeItem = wholeItem.concat(partialItem(block.userData.items[positions[i]]))
            }
            for(let i=0;i<64;i++){
                wholeItem.push(255)
            }
            wholeItem[250] = indian(block.position.x)[0]
            wholeItem[251] = indian(block.position.x)[1]
            wholeItem[252] = indian(block.position.z)[0]
            wholeItem[253] = indian(block.position.z)[1]
            wholeItem[254] = indian(convertY(block.position.y+1))[0]
            wholeItem[255] = indian(convertY(block.position.y+1))[1]
            return wholeItem
        }
        let coordOrder = []
        let blocksBase = []
        let orderedMeshes = []
        let itemIndex = 0
        let itemArray = []
        for (let i = 0; i < 78608; i++) {
            blocksBase.push(255)
        }
        for (let i = 0; i < level.children.length; i++) {
            coordOrder.push(coordsToBlocks(level.children[i].position))
        }
        coordOrder.sort(function(a, b){return a-b})
        for (let i = 0; i < level.children.length; i++) {
            orderedMeshes.push([])
        }
        for (let i = 0; i < level.children.length; i++) {
            orderedMeshes[coordOrder.indexOf(coordsToBlocks(level.children[i].position))] = level.children[i]
        }
        for (let i = 0; i < orderedMeshes.length; i++) {
            let coord = coordsToBlocks(orderedMeshes[i].position)
            if (orderedMeshes[i].userData.blockType === "Normal") {
                blocksBase[coord] = orderedMeshes[i].userData.blockTile
                blocksBase[coord + 1] = 0
            } else {
                blocksBase[coord] = itemIndex + 5
                blocksBase[coord + 1] = 0
                itemArray.push(generateItem(orderedMeshes[i]))
                itemIndex+=1
            }
        }
        blocksBase.push(indian(orderedMeshes.length)[0])
        blocksBase.push(indian(orderedMeshes.length)[1])
        blocksBase.push(0)
        blocksBase.push(0)
        blocksBase.push(indian(itemIndex)[0])
        blocksBase.push(indian(itemIndex)[1])
        for(let i=0;i<itemArray.length;i++){
            blocksBase = blocksBase.concat(itemArray[i])
        }
        return blocksBase
    }

    let selectBound = false

    function setSelected(number){
        let ids = [
            'selTile',
            'selFire',
            'selIce',
            'selInvis',
            'selAcid'
        ]
        selectedBlock = number;resetBlockChoice();document.getElementById(ids[number]).classList = "selected"
    }
    
    function setBoundSelect(number){
        let ids = [
            'bound',
            'selBound',
            'noBound'
        ]

        switch(number){
            case 0:
                if(!boundingBoxState) {
                    scene.add( boundingBox )
                    boundingBoxState = true
                }
                selectBound = false
                break
            case 1:
                if(!selectBound){
                    selectBound = true
                }
                updateCommon()
                break
            case 2:
                if(boundingBoxState){
                    scene.remove( boundingBox )
                    boundingBoxState = false
                }
                selectBound = false
                break
        }
        resetBoundChoice();document.getElementById(ids[number]).classList = "selected"
    }

    function updateCommon(){
        gui.attach(transf.object)
        if(transf.object!==undefined&&transf.object.userData.blockType!=="Crumble"){
            transf.object.userData.blockType = "Normal"
            let positions = ["posX","negX","posY","negY","posZ","negZ"]
            for(let i=0;i<positions.length;i++){
                if(transf.object.userData.items[positions[i]]!==null){transf.object.userData.blockType = "Special"}
            }
        }
        if(selectBound){
            if (transf.object === undefined){
                if(boundingBoxState){
                    scene.remove(boundingBox)
                    boundingBoxState = false
                }
            } else {
                if(!boundingBoxState) {
                    scene.add(boundingBox)
                    boundingBoxState = true
                }
            }
        }
    }

    setSelected(0)
    setBoundSelect(0)
    scene.add(transf)

    function resetBlockChoice(){
        document.getElementById('selTile').classList = ""
        document.getElementById('selFire').classList = ""
        document.getElementById('selIce').classList = ""
        document.getElementById('selAcid').classList = ""
        document.getElementById('selInvis').classList = ""
    }

    function resetBoundChoice(){
        document.getElementById('noBound').classList = ""
        document.getElementById('selBound').classList = ""
        document.getElementById('bound').classList = ""
    }


    let gui = {
        block: null,
        updateItem: function(itemSide){
            let image = document.getElementById(itemSide).parentNode.children[1].children[0]
            document.getElementById(itemSide).value = 0
            image.style.display = "none"
            if(gui.block !== null&&gui.block.userData.items[itemSide]!==null){
                let variantID = ""
                let patch = false
                switch(gui.block.userData.items[itemSide].id){
                    case 1:
                        document.getElementById(itemSide).value = 1
                        patch = true
                        break
                    case 2:
                        document.getElementById(itemSide).value = 2
                        patch = true
                        break
                    case 3:
                        document.getElementById(itemSide).value = 3
                        patch = true
                        break
                    case 4:
                        document.getElementById(itemSide).value = 4
                        patch = true
                        break
                    case 11:
                        document.getElementById(itemSide).value = 11
                        patch = true
                        break
                    case 12:
                        document.getElementById(itemSide).value = 12
                        patch = true
                        break
                    case 7:
                        document.getElementById(itemSide).value = 7
                        patch = true
                        break
                    case 8:
                        document.getElementById(itemSide).value = 8
                        patch = true
                        break
                    case 37:
                        switch(gui.block.userData.items[itemSide].variant){
                            case 0:variantID="c";break
                            case 1:variantID="b";break
                            case 2:variantID="a";break
                        }
                        break
                    case 36:
                        switch(gui.block.userData.items[itemSide].variant){
                            case 0:variantID="c";break
                            case 1:variantID="b";break
                            case 2:variantID="a";break
                        }
                        break
                }
                if(!patch){
                    document.getElementById(itemSide).value = gui.block.userData.items[itemSide].id + variantID
                    image.src = "sprites/"+gui.block.userData.items[itemSide].id+variantID+".png"
                    image.style.display = "inline"
                }
            }
        },
        attach: function(block){
            if(transf.object === undefined){
                gui.block=null
                document.getElementById("itemBar").style.filter = "grayscale(1)"
                document.getElementById("itemBar").style.display = "none"
                return null
            }
            document.getElementById("itemBar").style.filter = "grayscale(0)"
            document.getElementById("itemBar").style.display = "block"
            gui.block = block
            let blockChoice = document.getElementById("blockChoice").children
            blockChoice[2].value = block.userData["blockTile"]
            let mainBlock = ""
            switch(block.userData["blockTile"]){
                case 0:mainBlock="tile1";break
                case 1:mainBlock="fire";break
                case 2:mainBlock="ice";break
                case 3:mainBlock="invisible";break
                case 4:mainBlock="acid";break
                case 6:mainBlock="crumble";break
            }
            blockChoice[1].style.backgroundImage = "url('./textures/" + currentWorldName + "/"+mainBlock+".png')"
            let averageBlock = document.getElementById("averageBlock").children
            for(let i=0;i<averageBlock.length;i++){
                averageBlock[i].children[1].style.backgroundImage = "url('./textures/" + currentWorldName + "/"+block.material[i].userData.textureName+"')"
            }
            gui.updateItem("posX")
            gui.updateItem("negX")
            gui.updateItem("posY")
            gui.updateItem("negY")
            gui.updateItem("posZ")
            gui.updateItem("negZ")
        }
    }

    function addItem(block,itemID,itemSide){
        if(block.userData.blockType === "Normal"||block.userData.blockType === "Special"){
            if(block.userData.items[itemSide] !== null) {
                block.remove(block.getObjectByName(itemSide))
            }
            
            if(itemID === "0"){
                block.userData.items[itemSide] = null
                return
            }
            let itemLoader = new THREE.TextureLoader()
            itemLoader.setPath("sprites/")
            function generateSprite(item) {
                function genMaterial(file) {
                    let temp = itemLoader.load(file)
                    return new THREE.SpriteMaterial({map:temp})
                }
                return new THREE.Sprite(genMaterial(item))
            }

            block.userData.items[itemSide] = {
                id:parseInt(itemID)
            }
            let patch = false
            switch(itemID){
                case "37a":block.userData.items[itemSide].variant = 2;break
                case "37b":block.userData.items[itemSide].variant = 1;break
                case "37c":block.userData.items[itemSide].variant = 0;break
                case "36a":block.userData.items[itemSide].variant = 2;break
                case "36b":block.userData.items[itemSide].variant = 1;break
                case "36c":block.userData.items[itemSide].variant = 0;break
                case "1":case "2":case "3":case "4":case "12":case "11":case "8":patch=true;break
            }

            block.userData["blockType"] = "Special"

            if(!patch){
                let temp = generateSprite(itemID + ".png")

                switch(itemSide) {
                    case "posX":temp.position.x +=1;break
                    case "negX":temp.position.x -=1;break
                    case "posY":temp.position.y +=1;break
                    case "negY":temp.position.y -=1;break
                    case "posZ":temp.position.z +=1;break
                    case "negZ":temp.position.z -=1;break
                    default:break
                }
                temp.name = itemSide
                
                if(temp !== undefined){block.add(temp)}
                switch(itemID){case"7":updateBlockMaterials(block)}
            } else {
                updateBlockMaterials(block)
            }
        }
        updateBlockMaterials(block)
    }

    function changeBlock(block,newBlock) {
        switch(newBlock){
            case "6":
                block.userData.blockTile = parseInt(newBlock)
                block.userData.blockType = "Crumble"
                break
            default:
                block.userData.blockTile = parseInt(newBlock)
                break
        }
        updateBlockMaterials(block)
        updateCommon()
    }


    let fileInput = document.getElementById("browseOpen");
    fileInput.onchange = function () {
        var reader = new FileReader();
        var fileByteArray = [];
        reader.readAsArrayBuffer(this.files[0]);
        reader.onloadend = function (evt) {
            if (evt.target.readyState == FileReader.DONE) {
            var arrayBuffer = evt.target.result,
                array = new Uint8Array(arrayBuffer);
            for (var i = 0; i < array.length; i++) {
                fileByteArray.push(array[i]);
                }
            }
            level.load(fileByteArray)
            level.lastLoaded = fileByteArray
            document.getElementById("browseOpen").value=null;
        }
    }
    
    function updateBlockMaterials(block){
        let positions = ["posX","negX","posY","negY","posZ","negZ"]
        let temp = block.userData.blockTile
        let blockthang = {
            posX:temp,
            negX:temp,
            posY:temp,
            negY:temp,
            posZ:temp,
            negZ:temp
        }
        if(block.userData.blockType === "Special"){
            for(let i=0;i<positions.length;i++){
                if(block.userData.items[positions[i]]!==null){
                    switch(block.userData.items[positions[i]].id){
                        case 1:case 2:case 3:case 4:blockthang[positions[i]] = block.userData.items[positions[i]].id;break
                        case 11:blockthang[positions[i]] = 8;break
                        case 12:blockthang[positions[i]] = 9;break
                        case 7:blockthang[positions[i]] = 12;break
                        case 8:blockthang[positions[i]] = 10;break
                        case 26:case 30:break
                        default:if(block.userData.blockTile===0){console.log("why the fuck");blockthang[positions[i]] = 6;}break
                    }
                }
            }
            block.material = generateTexture(blockthang.posX,blockthang.negX,blockthang.posY,blockthang.negY,blockthang.posZ,blockthang.negZ,)
        } else if(block.userData.blockType === "Crumble"){
            block.material = generateTexture(5)
        } else if(block.userData.blockType === "Normal"){
            block.material = generateTexture(blockthang.posX)
        }
        gui.attach(block)
    }

    

    document.getElementById("posX").onchange = ()=>{
        addItem(transf.object,document.getElementById("posX").value,"posX")
        updateBlockMaterials(transf.object)
        gui.updateItem("posX")
    }
    document.getElementById("negX").onchange = ()=>{
        addItem(transf.object,document.getElementById("negX").value,"negX")
        updateBlockMaterials(transf.object)
        gui.updateItem("negX")
    }
    document.getElementById("posY").onchange = ()=>{
        addItem(transf.object,document.getElementById("posY").value,"posY")
        updateBlockMaterials(transf.object)
        gui.updateItem("posY")
    }
    document.getElementById("negY").onchange = ()=>{
        addItem(transf.object,document.getElementById("negY").value,"negY")
        updateBlockMaterials(transf.object)
        gui.updateItem("negY")
    }
    document.getElementById("posZ").onchange = ()=>{
        addItem(transf.object,document.getElementById("posZ").value,"posZ")
        updateBlockMaterials(transf.object)
        gui.updateItem("posZ")
    }
    document.getElementById("negZ").onchange = ()=>{
        addItem(transf.object,document.getElementById("negZ").value,"negZ")
        updateBlockMaterials(transf.object)
        gui.updateItem("negZ")
    }

    //Onclicks
    document.getElementById('openLevel').onclick = ()=> {document.getElementById("browseOpen").click()}
    document.getElementById('bound').onclick = ()=> {setBoundSelect(0)}
    document.getElementById('selBound').onclick = ()=> {setBoundSelect(1)}
    document.getElementById('noBound').onclick = ()=> {setBoundSelect(2)}
    document.getElementById('selTile').onclick = ()=> {setSelected(0)}
    document.getElementById('selFire').onclick = ()=> {setSelected(1)}
    document.getElementById('selIce').onclick = ()=> {setSelected(2)}
    document.getElementById('selInvis').onclick = ()=> {setSelected(3)}
    document.getElementById('selAcid').onclick = ()=> {setSelected(4)}
    document.getElementById('exportLevel').onclick = ()=> {saveByteArray([new Uint8Array(level.build())],'LEVEL')}
    document.getElementById('addBlock').onclick = ()=> {level.block.add()}
    document.getElementById('subBlock').onclick = ()=> {level.block.remove()}

    let blockSelect = document.getElementById('blockSelect');
    blockSelect.onchange = function(){
        if(gui.block !== null){
            changeBlock(gui.block,this.value)
        }
    }

    window.addEventListener( 'resize', onWindowResize )
    
    //Keypresses
    window.addEventListener( 'keydown', function ( event ) {
        document.activeElement.blur()
        if(event.altKey) {
            switch (event.keyCode){
                case 49:setBoundSelect(0);break
                case 50:setBoundSelect(1);break
                case 51:setBoundSelect(2);break
                case 191:
                    console.log("This is the testing key!")
                    console.log(camera.position)
                    break
                case 82:
                    if(event.shiftKey){
                        if(level.lastLoaded !== null){
                            if(confirm("Would you like to reload last loaded level?")){
                                level.load(level.lastLoaded)
                            }
                        }
                    }
            }
        } else if (event.ctrlKey) {
            switch(event.keyCode){
                case 79:fileInput.click();break//O
                case 69:case 191:saveByteArray([new Uint8Array(level.build())],'LEVEL');break//E,Forward Slash
                case 82:
                    if(event.shiftKey){break}
                    level.load(level.build())
                    break
                case 8:
                    if(event.shiftKey){
                        if(confirm("Would you like to clear the level?")){
                            level.clear()
                        }
                    }
            }
        } else {
            switch (event.keyCode) {
                case 49:
                    setSelected(0)
                    break
                case 50:
                    setSelected(1)
                    break
                case 51:
                    setSelected(2)
                    break
                case 52:
                    setSelected(3)
                    break
                case 53:
                    setSelected(4)
                    break
                case 8: //Backspace
                case 46: // Delete
                case 88: // X
                    level.block.remove()
                    break
                case 191: // Forward Slash
                    if(transf.object!==undefined){
                        console.log("You have pressed the DEV KEY, here's the current block!")
                        console.log(transf.object)
                    }else{
                        console.log("You have pressed the DEV KEY, here's the current level group!")
                        console.log(level)
                    }
                    break
                case 65: // A
                case 32: // Spacebar
                    level.block.add()
                    break
                case 96: // Numpad 0
                    if (transf.object !== undefined){
                        orbit.target.set(transf.object.position.x,transf.object.position.y,transf.object.position.z)
                        orbit.update()
                    } else {
                        orbit.target.set(16.5,16.5,16.5)
                        orbit.update()
                    }
                    break
            }
        }
        

    } )
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth,window.innerHeight)
}

function animate() {requestAnimationFrame(animate);render()}
function render() {renderer.render(scene,camera)}

init()
animate()