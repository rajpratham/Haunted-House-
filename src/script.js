import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'

const gui = new dat.GUI()
const scene = new THREE.Scene()   

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000)

const renderer = new THREE.WebGLRenderer({
    canvas : document.querySelector("#webgl")
})

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor('#262837')
camera.position.set(0,0,30)

const textureLoader = new THREE.TextureLoader()

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg')

const house = new THREE.Group()    
scene.add(house)

gui.add(house.position , 'x').min(-3).max(3).step(0.001).name('house-X')
gui.add(house.position , 'y').min(-3).max(3).step(0.001).name('house-Y')
gui.add(house.position , 'z').min(-3).max(3).step(0.001).name('house-Z')

const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4,2.5,4),
    new THREE.MeshStandardMaterial({color : '#ac8e82'})
)
walls.position.y = 1.25
house.add(walls)

const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5,1,4),
    new THREE.MeshStandardMaterial({color : '#b35f45'})
)
roof.position.y = 3
roof.rotation.y = Math.PI * 0.25
house.add(roof)

const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2,2,100,100),
    new THREE.MeshStandardMaterial({
        map : doorColorTexture ,
        transparent : true , 
        alphaMap : doorAlphaTexture ,
        aoMap : doorAmbientOcclusionTexture ,
        displacementMap : doorHeightTexture ,
        displacementScale : 0.1 ,
        metalnessMap : doorMetalnessTexture ,
        normalMap : doorNormalTexture ,
    roughnessMap : doorRoughnessTexture
   })
)

door.geometry.setAttribute('uv2' , new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array , 2)
)

door.position.y =  0.9
door.position.z = 2.01
house.add(door)

const bushGeometry =    new THREE.SphereGeometry(1,16,16)
const bushMaterial =    new THREE.MeshStandardMaterial({color : '#89c854'})

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5,0.5,0.5)
bush1.position.set(0.8,0.2,2.2)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25,0.25,0.25)
bush2.position.set(1.4,0.1,2.1)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4,0.4,0.4)
bush3.position.set(-0.8,0.1,2.2)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15,0.15,0.15)
bush4.position.set(-1,0.05,2.6)

house.add(bush1 , bush2 , bush3 , bush4)

const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxGeometry(0.6,0.8,0.2)
const graveMaterial = new THREE.MeshStandardMaterial({color : '#b2b6b1'})

for (let i = 0; i < 50; i++) 
{
   const angle = Math.random() * Math.PI * 2 
   const radius = 3 + Math.random() * 6
   const x = Math.sin(angle) * radius
   const z = Math.cos(angle) * radius

    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    grave.position.set(x,0.3,z)
    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.rotation.z = (Math.random() - 0.5) * 0.4
    graves.add(grave)
}


const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20,20),
    new THREE.MeshStandardMaterial({color : '#a9c388'})
)
floor.rotation.x = -Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

// const pointLight = new THREE.PointLight(0xffffff)
// pointLight.position.set(85,85,85)
// scene.add(pointLight)

const ambientLight = new THREE.AmbientLight('#b9d5ff' , 0.12)
gui.add(ambientLight , 'intensity').min(0).max(1).step(0.001).name('Ambient Light')
scene.add(ambientLight)

// const lightHelper = new THREE.PointLightHelper(pointLight)
// scene.add(lightHelper)

const moonLight = new THREE.DirectionalLight('#b9d5ff' , 0.12)
moonLight.position.set(4,5,-2)
gui.add(moonLight , 'intensity').min(0).max(1).step(0.001).name('Moon Light')
gui.add(moonLight.position , 'x').min(-5).max(5).step(0.001).name('Moon Light X')
gui.add(moonLight.position , 'y').min(-5).max(5).step(0.001).name('Moon Light Y')
gui.add(moonLight.position , 'z').min(-5).max(5).step(0.001).name('Moon Light Z')
scene.add(moonLight)


const doorLight = new THREE.PointLight('#ff7d46' , 1 , 7)
doorLight.position.set(0,2.2,2.7)
house.add(doorLight)

const fog = new THREE.Fog('#262837' , 1 , 15)
scene.fog = fog

const controls = new OrbitControls(camera, renderer.domElement)
controls.minDistance = 5;
controls.enableDamping = true;
controls.maxDistance = 145;
controls.enablePan = false;
// controls.maxPolarAngle = Math.PI / 2 - 0.05;
controls.update();

function animate(){
    requestAnimationFrame( animate )

    controls.update()

    renderer.render(scene, camera)
}
animate()