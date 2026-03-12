import { Slide } from './slidesData';

export const slidesData1: Record<number, Slide[]> = {
  1: [
    {
      title: "¿Qué es LibGDX y 3D?",
      content: [
        "LibGDX es un framework de desarrollo de juegos multiplataforma basado en Java.",
        "Permite escribir el código una sola vez y desplegarlo en Windows, macOS, Linux, Android, iOS y Web (HTML5)."
      ]
    },
    {
      title: "Framework vs Motor",
      content: [
        "A diferencia de motores como Unity o Unreal, LibGDX es un framework centrado en código.",
        "Esto te da control total sobre la arquitectura de tu juego, ideal para entender cómo funciona un juego desde cero sin depender de interfaces visuales complejas."
      ]
    },
    {
      title: "LibGDX en 3D",
      content: [
        "Aunque LibGDX es muy popular para 2D, tiene una API 3D muy potente y completa.",
        "Soporta carga de modelos (GLTF, OBJ), iluminación, materiales PBR, shaders personalizados y físicas 3D (Bullet)."
      ]
    },
    {
      title: "Librerías Externas: GLTF y Bullet",
      content: [
        "Para trabajar con modelos 3D modernos y físicas avanzadas, usaremos dos librerías externas esenciales:",
        "• gdx-gltf: Permite cargar modelos en formato GLTF/GLB y renderizarlos con materiales PBR (Physically Based Rendering).",
        "• gdx-bullet: Es un wrapper oficial de LibGDX para Bullet Physics, uno de los motores de físicas 3D más populares."
      ]
    },
    {
      title: "Configurando gdx-gltf",
      content: [
        "Para añadir gdx-gltf a tu proyecto, debes modificar el archivo build.gradle en la raíz de tu proyecto.",
        "Añade la dependencia en el bloque 'core' y 'lwjgl3' (o el backend que uses)."
      ],
      code: `// En build.gradle (raíz)\nproject(":core") {\n    dependencies {\n        // ... otras dependencias ...\n        api "com.github.mgsx-dev.gdx-gltf:gltf:2.2.1"\n    }\n}`
    },
    {
      title: "Configurando Bullet Physics",
      content: [
        "Bullet es una extensión oficial, por lo que su configuración es un poco diferente.",
        "Debes añadir las dependencias tanto en el core como en los proyectos específicos de plataforma (desktop, android, etc.) para incluir las librerías nativas (.dll, .so, etc.)."
      ],
      code: `// En build.gradle (raíz)\nproject(":core") {\n    dependencies {\n        api "com.badlogicgames.gdx:gdx-bullet:$gdxVersion"\n    }\n}\n\nproject(":lwjgl3") {\n    dependencies {\n        api "com.badlogicgames.gdx:gdx-bullet-platform:$gdxVersion:natives-desktop"\n    }\n}`
    }
  ],
  2: [
    {
      title: "Estructura del Proyecto",
      content: [
        "Un proyecto de LibGDX se divide en varios módulos (proyectos de Gradle):",
        "• Core: Contiene la lógica principal del juego. Aquí escribiremos el 99% del código.",
        "• Lwjgl3 (Desktop): El lanzador para PC (Windows, Mac, Linux)."
      ]
    },
    {
      title: "Main Class",
      content: [
        "Todo juego en LibGDX implementa la interfaz ApplicationListener o hereda de Game.",
        "La clase Game nos permite manejar múltiples pantallas (Screens)."
      ],
      code: `package io.github.alfosua.exp3d;\n\nimport com.badlogic.gdx.Game;\nimport com.badlogic.gdx.graphics.g2d.SpriteBatch;\nimport com.badlogic.gdx.graphics.g2d.BitmapFont;\nimport com.badlogic.gdx.graphics.glutils.ShapeRenderer;\nimport io.github.alfosua.exp3d.screens.MenuScreen;\n\npublic class Main extends Game {\n    public SpriteBatch batch;\n    public BitmapFont font;\n    public ShapeRenderer shapeRenderer;\n\n    @Override\n    public void create() {\n        batch = new SpriteBatch();\n        font = new BitmapFont();\n        shapeRenderer = new ShapeRenderer();\n        \n        // Inicializamos Bullet aquí\n        com.badlogic.gdx.physics.bullet.Bullet.init();\n\n        this.setScreen(new MenuScreen(this));\n    }\n\n    @Override\n    public void render() {\n        super.render();\n    }\n\n    @Override\n    public void dispose() {\n        batch.dispose();\n        font.dispose();\n        shapeRenderer.dispose();\n        if (screen != null) screen.dispose();\n    }\n}`
    }
  ],
  3: [
    {
      title: "La Clase Base3DScreen",
      content: [
        "Para evitar repetir el código de inicialización de la cámara, las luces y el renderizador en cada ejemplo, crearemos una clase base llamada Base3DScreen.",
        "Todos nuestros ejemplos heredarán de esta clase."
      ]
    },
    {
      title: "Cámara 3D (PerspectiveCamera)",
      content: [
        "En 3D, usamos una PerspectiveCamera. Esta cámara simula la visión humana, donde los objetos más lejanos se ven más pequeños.",
        "Requiere un campo de visión (FOV, típicamente 67 grados), y el ancho y alto de la pantalla."
      ],
      code: `cam = new PerspectiveCamera(67, Gdx.graphics.getWidth(), Gdx.graphics.getHeight());\n// Posición de la cámara en el mundo (X, Y, Z)\ncam.position.set(10f, 10f, 10f);\n// Hacia dónde mira la cámara\ncam.lookAt(0,0,0);\n// Distancia mínima y máxima de renderizado (Clipping planes)\ncam.near = 1f;\ncam.far = 300f;\n// Importante: actualizar la cámara después de cambiar sus propiedades\ncam.update();`
    },
    {
      title: "Entorno e Iluminación (Environment)",
      content: [
        "El objeto Environment almacena la configuración de iluminación global de la escena.",
        "Aquí definimos la luz ambiental (que ilumina todo por igual) y luces direccionales (como el sol)."
      ],
      code: `environment = new Environment();\n// Luz ambiental (ColorAttribute.AmbientLight, R, G, B, A)\nenvironment.set(new ColorAttribute(ColorAttribute.AmbientLight, 0.4f, 0.4f, 0.4f, 1f));\n// Luz direccional (R, G, B, dirX, dirY, dirZ)\nenvironment.add(new DirectionalLight().set(0.8f, 0.8f, 0.8f, -1f, -0.8f, -0.2f));`
    },
    {
      title: "Renderizado Básico (ModelBatch)",
      content: [
        "ModelBatch es la clase encargada de dibujar los modelos 3D en la pantalla, aplicando la cámara y el entorno.",
        "Funciona de manera similar a SpriteBatch en 2D: llamas a begin(), renderizas los objetos, y luego end()."
      ],
      code: `modelBatch = new ModelBatch();\n\n// En el método render:\nmodelBatch.begin(cam);\n// modelBatch.render(instancia, environment);\nmodelBatch.end();`
    },
    {
      title: "Código Completo: Base3DScreen",
      content: [
        "Esta es la clase base completa. Cópiala y pégala en tu proyecto. Maneja la cámara, el batch, la iluminación básica y permite salir con la tecla ESC."
      ],
      code: `package io.github.alfosua.exp3d.screens;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.Input;
import com.badlogic.gdx.InputAdapter;
import com.badlogic.gdx.ScreenAdapter;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.PerspectiveCamera;
import com.badlogic.gdx.graphics.g3d.Environment;
import com.badlogic.gdx.graphics.g3d.ModelBatch;
import com.badlogic.gdx.graphics.g3d.attributes.ColorAttribute;
import com.badlogic.gdx.graphics.g3d.environment.DirectionalLight;
import io.github.alfosua.exp3d.Main;

public abstract class Base3DScreen extends ScreenAdapter {
    protected final Main game;
    protected PerspectiveCamera cam;
    protected ModelBatch modelBatch;
    protected Environment environment;
    protected com.badlogic.gdx.InputMultiplexer multiplexer;

    public Base3DScreen(Main game) {
        this.game = game;
        modelBatch = new ModelBatch();
        environment = new Environment();
        environment.set(new ColorAttribute(ColorAttribute.AmbientLight, 0.4f, 0.4f, 0.4f, 1f));
        environment.add(new DirectionalLight().set(0.8f, 0.8f, 0.8f, -1f, -0.8f, -0.2f));

        cam = new PerspectiveCamera(67, Gdx.graphics.getWidth() > 0 ? Gdx.graphics.getWidth() : 800, Gdx.graphics.getHeight() > 0 ? Gdx.graphics.getHeight() : 600);
        cam.position.set(10f, 10f, 10f);
        cam.lookAt(0,0,0);
        cam.near = 1f;
        cam.far = 300f;
        cam.update();

        multiplexer = new com.badlogic.gdx.InputMultiplexer();
    }

    @Override
    public void show() {
        multiplexer.addProcessor(new InputAdapter() {
            @Override
            public boolean keyDown(int keycode) {
                if (keycode == Input.Keys.ESCAPE) {
                    game.getScreen().dispose();
                    game.setScreen(new MenuScreen(game));
                    return true;
                }
                return false;
            }
        });
        Gdx.input.setInputProcessor(multiplexer);
    }

    @Override
    public void render(float delta) {
        Gdx.gl.glViewport(0, 0, Gdx.graphics.getWidth(), Gdx.graphics.getHeight());
        Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT | GL20.GL_DEPTH_BUFFER_BIT);
    }

    @Override
    public void resize(int width, int height) {
        if (width == 0 || height == 0) return;
        cam.viewportWidth = width;
        cam.viewportHeight = height;
        cam.update();
    }

    @Override
    public void dispose() {
        if (modelBatch != null) modelBatch.dispose();
    }
}`
    }
  ],
  4: [
    {
      title: "Modelos e Instancias",
      content: [
        "En LibGDX, hay una distinción crucial entre Model y ModelInstance.",
        "• Model: Contiene la geometría (vértices, índices) y los materiales. Es pesado y se carga una sola vez.",
        "• ModelInstance: Es una referencia a un Model. Contiene su propia posición, rotación y escala (transform). Puedes tener miles de instancias de un solo modelo."
      ]
    },
    {
      title: "Construyendo un Modelo Básico",
      content: [
        "ModelBuilder es una utilidad para crear modelos simples por código (cajas, esferas, cilindros).",
        "Para crear una caja, necesitamos definir su tamaño, su material (color) y qué atributos de vértice necesitamos (Posición y Normales para que la luz funcione)."
      ],
      code: `ModelBuilder modelBuilder = new ModelBuilder();\n\n// Creamos un material verde\nMaterial material = new Material(ColorAttribute.createDiffuse(Color.GREEN));\n\n// Atributos: Posición (para saber dónde está) y Normal (para calcular la luz)\nlong attributes = VertexAttributes.Usage.Position | VertexAttributes.Usage.Normal;\n\n// Creamos el modelo (ancho, alto, profundidad)\nmodel = modelBuilder.createBox(5f, 5f, 5f, material, attributes);`
    },
    {
      title: "Creando y Transformando la Instancia",
      content: [
        "Una vez que tenemos el Model, creamos un ModelInstance para poder mostrarlo en pantalla.",
        "La propiedad 'transform' de la instancia es una Matrix4 que controla su posición, rotación y escala."
      ],
      code: `// Creamos la instancia a partir del modelo\ninstance = new ModelInstance(model);\n\n// Podemos moverla (traslación)\n// instance.transform.setToTranslation(x, y, z);\n\n// O rotarla en el método render (eje X, Y, Z, grados)\ninstance.transform.rotate(0, 1, 0, 45f * delta);`
    },
    {
      title: "Renderizando la Instancia",
      content: [
        "En el método render, usamos el modelBatch (heredado de Base3DScreen) para dibujar la instancia, pasándole también el entorno (luces)."
      ],
      code: `@Override\npublic void render(float delta) {\n    // Limpia la pantalla (llamando a super.render)\n    super.render(delta);\n\n    // Rotamos la instancia un poco cada frame\n    instance.transform.rotate(0, 1, 0, 45f * delta);\n\n    // Dibujamos\n    modelBatch.begin(cam);\n    modelBatch.render(instance, environment);\n    modelBatch.end();\n}`
    },
    {
      title: "Código Completo: SimpleModelScreen",
      content: [
        "Este ejemplo completo crea un cubo verde y lo rota lentamente en el centro de la pantalla."
      ],
      code: `package io.github.alfosua.exp3d.screens;\n\nimport com.badlogic.gdx.graphics.Color;\nimport com.badlogic.gdx.graphics.VertexAttributes;\nimport com.badlogic.gdx.graphics.g3d.Material;\nimport com.badlogic.gdx.graphics.g3d.Model;\nimport com.badlogic.gdx.graphics.g3d.ModelInstance;\nimport com.badlogic.gdx.graphics.g3d.attributes.ColorAttribute;\nimport com.badlogic.gdx.graphics.g3d.utils.ModelBuilder;\nimport io.github.alfosua.exp3d.Main;\n\npublic class SimpleModelScreen extends Base3DScreen {\n    private Model model;\n    private ModelInstance instance;\n\n    public SimpleModelScreen(Main game) {\n        super(game);\n\n        ModelBuilder modelBuilder = new ModelBuilder();\n        model = modelBuilder.createBox(5f, 5f, 5f, \n                new Material(ColorAttribute.createDiffuse(Color.GREEN)),\n                VertexAttributes.Usage.Position | VertexAttributes.Usage.Normal);\n        \n        instance = new ModelInstance(model);\n    }\n\n    @Override\n    public void render(float delta) {\n        super.render(delta);\n\n        instance.transform.rotate(0, 1, 0, 45f * delta);\n\n        modelBatch.begin(cam);\n        modelBatch.render(instance, environment);\n        modelBatch.end();\n    }\n\n    @Override\n    public void dispose() {\n        // ¡Importante! Liberar la memoria del modelo cuando ya no se usa\n        if (model != null) {\n            model.dispose();\n            model = null;\n        }\n        super.dispose();\n    }\n}`
    }
  ],
  5: [
    {
      title: "Modelos GLTF y PBR",
      content: [
        "GLTF (GL Transmission Format) es el formato estándar moderno para modelos 3D en la web y motores de juegos.",
        "Soporta PBR (Physically Based Rendering), lo que significa que los materiales reaccionan a la luz de forma realista (metálico, rugosidad, etc.)."
      ]
    },
    {
      title: "Introducción a SceneManager",
      content: [
        "La librería gdx-gltf introduce el 'SceneManager'. Es una alternativa más avanzada al ModelBatch tradicional.",
        "SceneManager maneja automáticamente la iluminación PBR, las sombras, los shaders complejos y las animaciones de los modelos GLTF."
      ]
    },
    {
      title: "Configurando SceneManager",
      content: [
        "Creamos el SceneManager, le asignamos nuestra cámara y configuramos una luz direccional (el sol) y luz ambiental."
      ],
      code: `sceneManager = new SceneManager();\nsceneManager.setCamera(cam);\n\n// Luz direccional para PBR\nDirectionalLightEx light = new DirectionalLightEx();\nlight.direction.set(1, -2, -1).nor();\nlight.color.set(Color.WHITE);\nsceneManager.environment.add(light);\n\n// Intensidad de la luz ambiental\nsceneManager.setAmbientLight(1f);`
    },
    {
      title: "Cargando un Modelo GLB",
      content: [
        "En el constructor de nuestra pantalla, usamos GLBLoader para cargar archivos .glb (la versión binaria de GLTF).",
        "Luego creamos una 'Scene' (el equivalente a ModelInstance en gdx-gltf) y la añadimos al SceneManager."
      ],
      code: `// Cargar el asset desde el constructor\nsceneAsset = new GLBLoader().load(Gdx.files.internal("Duck.glb"));\n\n// Crear una escena a partir del asset\nscene = new Scene(sceneAsset.scene);\n\n// Añadir la escena al manager para que se renderice\nsceneManager.addScene(scene);`
    },
    {
      title: "Renderizando con SceneManager",
      content: [
        "En el método render, actualizamos el SceneManager (para procesar animaciones si las hubiera) y luego llamamos a render().",
        "También debemos actualizar el viewport del SceneManager cuando la ventana cambia de tamaño."
      ],
      code: `@Override\npublic void render(float delta) {\n    // ... limpiar pantalla ...\n    \n    // Rotar el modelo\n    scene.modelInstance.transform.rotate(0, 1, 0, 30f * delta);\n\n    // Actualizar y renderizar\n    sceneManager.update(delta);\n    sceneManager.render();\n}\n\n@Override\npublic void resize(int width, int height) {\n    super.resize(width, height);\n    sceneManager.updateViewport(width, height);\n}`
    },
    {
      title: "Código Completo: SimpleGltfScreen",
      content: [
        "Este ejemplo carga un modelo GLB (asegúrate de tener un archivo 'Duck.glb' en tu carpeta assets) y lo muestra usando SceneManager."
      ],
      code: `package io.github.alfosua.exp3d.screens;\n\nimport com.badlogic.gdx.Gdx;\nimport com.badlogic.gdx.graphics.Color;\nimport com.badlogic.gdx.graphics.GL20;\nimport net.mgsx.gltf.loaders.glb.GLBLoader;\nimport net.mgsx.gltf.scene3d.lights.DirectionalLightEx;\nimport net.mgsx.gltf.scene3d.scene.Scene;\nimport net.mgsx.gltf.scene3d.scene.SceneAsset;\nimport net.mgsx.gltf.scene3d.scene.SceneManager;\nimport io.github.alfosua.exp3d.Main;\n\npublic class SimpleGltfScreen extends Base3DScreen {\n    private SceneManager sceneManager;\n    private SceneAsset sceneAsset;\n    private Scene scene;\n\n    public SimpleGltfScreen(Main game) {\n        super(game);\n        sceneManager = new SceneManager();\n        sceneManager.setCamera(cam);\n\n        DirectionalLightEx light = new DirectionalLightEx();\n        light.direction.set(1, -2, -1).nor();\n        light.color.set(Color.WHITE);\n        sceneManager.environment.add(light);\n        sceneManager.setAmbientLight(1f);\n\n        // Asegúrate de tener Duck.glb en tu carpeta assets\n        sceneAsset = new GLBLoader().load(Gdx.files.internal("Duck.glb"));\n        scene = new Scene(sceneAsset.scene);\n        sceneManager.addScene(scene);\n\n        cam.position.set(0f, 2f, 5f);\n        cam.lookAt(0, 0, 0);\n        cam.update();\n    }\n\n    @Override\n    public void render(float delta) {\n        Gdx.gl.glViewport(0, 0, Gdx.graphics.getWidth(), Gdx.graphics.getHeight());\n        Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT | GL20.GL_DEPTH_BUFFER_BIT);\n\n        scene.modelInstance.transform.rotate(0, 1, 0, 30f * delta);\n\n        sceneManager.update(delta);\n        sceneManager.render();\n    }\n\n    @Override\n    public void resize(int width, int height) {\n        super.resize(width, height);\n        sceneManager.updateViewport(width, height);\n    }\n\n    @Override\n    public void dispose() {\n        if (sceneManager != null) {\n            sceneManager.dispose();\n            sceneManager = null;\n        }\n        if (sceneAsset != null) {\n            sceneAsset.dispose();\n            sceneAsset = null;\n        }\n        super.dispose();\n    }\n}`
    }
  ],
  6: [
    {
      title: "Animaciones en GLTF",
      content: [
        "Los archivos GLTF pueden contener animaciones complejas, ya sea mediante esqueletos (huesos/armaduras) o transformaciones directas de nodos.",
        "La librería gdx-gltf facilita enormemente la reproducción de estas animaciones."
      ]
    },
    {
      title: "Cargando el Modelo Animado",
      content: [
        "En el constructor de nuestra pantalla, utilizamos 'GLTFLoader' para cargar el archivo y crear una nueva 'Scene' que añadiremos al 'SceneManager'.",
        "El proceso es idéntico a cargar un modelo estático, pero usamos GLTFLoader para archivos .gltf."
      ],
      code: `// Usamos GLTFLoader para cargar el archivo .gltf desde el constructor\nsceneAsset = new GLTFLoader().load(Gdx.files.internal("BoxAnimated.gltf"));\n\n// Creamos la escena a partir del asset y la añadimos al manager\nscene = new Scene(sceneAsset.scene);\nsceneManager.addScene(scene);`
    },
    {
      title: "El AnimationController",
      content: [
        "Cada objeto 'Scene' creado con gdx-gltf posee un 'animationController'.",
        "Este controlador se encarga de interpolar los fotogramas clave (keyframes) y aplicar las transformaciones al modelo en cada frame."
      ]
    },
    {
      title: "Iniciando una Animación",
      content: [
        "Para reproducir una animación, primero verificamos si el modelo contiene alguna.",
        "Luego, usamos setAnimation() indicando el ID de la animación y el número de repeticiones (-1 significa bucle infinito)."
      ],
      code: `// Verificamos si hay animaciones en el asset cargado\nif (sceneAsset.animations.size > 0) {\n    // Obtenemos el ID de la primera animación\n    String animId = sceneAsset.animations.first().id;\n    \n    // Reproducimos la animación en bucle infinito (-1)\n    scene.animationController.setAnimation(animId, -1);\n}`
    },
    {
      title: "Actualizando la Animación",
      content: [
        "Para que la animación avance, es crucial llamar a sceneManager.update(delta) en el método render.",
        "Esto actualiza el AnimationController internamente basándose en el tiempo transcurrido (delta)."
      ],
      code: `@Override\npublic void render(float delta) {\n    // ... limpiar pantalla ...\n\n    // Esto avanza el tiempo de la animación\n    sceneManager.update(delta);\n    \n    // Dibuja la escena con la pose actual\n    sceneManager.render();\n}`
    },
    {
      title: "Código Completo: AnimationScreen",
      content: [
        "Este ejemplo carga un modelo GLTF animado (asegúrate de tener 'BoxAnimated.gltf' en assets) y reproduce su animación por defecto."
      ],
      code: `package io.github.alfosua.exp3d.screens;\n\nimport com.badlogic.gdx.Gdx;\nimport com.badlogic.gdx.graphics.Color;\nimport com.badlogic.gdx.graphics.GL20;\nimport net.mgsx.gltf.loaders.gltf.GLTFLoader;\nimport net.mgsx.gltf.scene3d.lights.DirectionalLightEx;\nimport net.mgsx.gltf.scene3d.scene.Scene;\nimport net.mgsx.gltf.scene3d.scene.SceneAsset;\nimport net.mgsx.gltf.scene3d.scene.SceneManager;\nimport io.github.alfosua.exp3d.Main;\n\npublic class AnimationScreen extends Base3DScreen {\n    private SceneManager sceneManager;\n    private SceneAsset sceneAsset;\n    private Scene scene;\n\n    public AnimationScreen(Main game) {\n        super(game);\n        sceneManager = new SceneManager();\n        sceneManager.setCamera(cam);\n        \n        // Usamos GLTFLoader para archivos .gltf (texto/json)\n        sceneAsset = new GLTFLoader().load(Gdx.files.internal("BoxAnimated.gltf"));\n        scene = new Scene(sceneAsset.scene);\n        sceneManager.addScene(scene);\n        \n        // Reproducir la primera animación en bucle\n        if (sceneAsset.animations.size > 0) {\n            scene.animationController.setAnimation(sceneAsset.animations.first().id, -1);\n        }\n        \n        cam.position.set(4f, 4f, 4f);\n        cam.lookAt(0, 0, 0);\n        cam.update();\n\n        DirectionalLightEx light = new DirectionalLightEx();\n        light.direction.set(1, -3, 1).nor();\n        light.color.set(Color.WHITE);\n        sceneManager.environment.add(light);\n    }\n\n    @Override\n    public void render(float delta) {\n        Gdx.gl.glViewport(0, 0, Gdx.graphics.getWidth(), Gdx.graphics.getHeight());\n        Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT | GL20.GL_DEPTH_BUFFER_BIT);\n\n        sceneManager.update(delta);\n        sceneManager.render();\n    }\n\n    @Override\n    public void resize(int width, int height) {\n        super.resize(width, height);\n        sceneManager.updateViewport(width, height);\n    }\n\n    @Override\n    public void dispose() {\n        if (sceneManager != null) {\n            sceneManager.dispose();\n            sceneManager = null;\n        }\n        if (sceneAsset != null) {\n            sceneAsset.dispose();\n            sceneAsset = null;\n        }\n        super.dispose();\n    }\n}`
    }
  ],
  7: [
    {
      title: "Cámara en Primera Persona (FPS)",
      content: [
        "Para juegos estilo shooter o de exploración en primera persona, necesitamos mover la cámara con el teclado y rotarla con el ratón.",
        "LibGDX proporciona la clase 'FirstPersonCameraController' que implementa exactamente este comportamiento."
      ]
    },
    {
      title: "Configurando el Controlador",
      content: [
        "Creamos el controlador pasándole nuestra cámara. Podemos ajustar su sensibilidad (grados por píxel) y velocidad de movimiento."
      ],
      code: `camController = new FirstPersonCameraController(cam);\n// Sensibilidad del ratón\ncamController.setDegreesPerPixel(0.5f);\n// Velocidad de movimiento (WASD)\ncamController.setVelocity(10f);`
    },
    {
      title: "Atrapando el Cursor",
      content: [
        "Para una experiencia FPS real, el cursor del ratón no debe salir de la ventana del juego.",
        "Usamos Gdx.input.setCursorCatched(true) para ocultar y bloquear el cursor en el centro de la pantalla."
      ],
      code: `@Override\npublic void show() {\n    super.show();\n    // Añadimos el controlador de cámara para que reciba eventos de input\n    multiplexer.addProcessor(camController);\n    // Atrapamos el cursor\n    Gdx.input.setCursorCatched(true);\n}\n\n@Override\npublic void hide() {\n    super.hide();\n    // Liberamos el cursor al salir de la pantalla\n    Gdx.input.setCursorCatched(false);\n}`
    },
    {
      title: "Actualizando la Cámara",
      content: [
        "El controlador necesita actualizarse en cada frame para procesar el movimiento continuo de las teclas WASD."
      ],
      code: `@Override\npublic void render(float delta) {\n    super.render(delta);\n    // Actualiza la posición de la cámara según las teclas presionadas\n    camController.update(delta);\n    \n    // ... renderizar escena ...\n}`
    },
    {
      title: "Construyendo el Entorno de Prueba",
      content: [
        "Para probar nuestra cámara FPS, necesitamos un entorno físico por el cual movernos. Si solo tuviéramos un espacio vacío, no notaríamos el movimiento.",
        "Crearemos un suelo grande usando 'ModelBuilder' para tener una superficie de referencia."
      ],
      code: `ModelBuilder modelBuilder = new ModelBuilder();\n\n// Crear el suelo\nModel floorModel = modelBuilder.createBox(100f, 1f, 100f, \n        new Material(ColorAttribute.createDiffuse(Color.GRAY)),\n        VertexAttributes.Usage.Position | VertexAttributes.Usage.Normal);\n\nModelInstance floor = new ModelInstance(floorModel);\nfloor.transform.setToTranslation(0, -0.5f, 0);\ninstances.add(floor);`
    },
    {
      title: "Añadiendo Obstáculos (Pilares)",
      content: [
        "Para tener una mejor sensación de profundidad y movimiento, añadiremos varios pilares distribuidos en una cuadrícula.",
        "Usaremos un bucle anidado para colocar instancias de un cilindro, dejando el centro libre para que la cámara no aparezca dentro de un pilar."
      ],
      code: `// Crear un modelo de pilar\nMaterial pillarMaterial = new Material(ColorAttribute.createDiffuse(Color.BLUE));\nModel pillarModel = modelBuilder.createCylinder(2f, 10f, 2f, 16, pillarMaterial, \n        VertexAttributes.Usage.Position | VertexAttributes.Usage.Normal);\n\n// Distribuir pilares en una cuadrícula\nfor (int x = -40; x <= 40; x += 20) {\n    for (int z = -40; z <= 40; z += 20) {\n        if (x == 0 && z == 0) continue; // Dejar el centro libre\n        ModelInstance pillar = new ModelInstance(pillarModel);\n        pillar.transform.setToTranslation(x, 5f, z);\n        instances.add(pillar);\n    }\n}`
    },
    {
      title: "Código Completo: FpsCameraScreen",
      content: [
        "Este ejemplo crea un suelo y una cuadrícula de pilares, permitiéndote navegar por ellos en primera persona."
      ],
      code: `package io.github.alfosua.exp3d.screens;\n\nimport com.badlogic.gdx.Gdx;\nimport com.badlogic.gdx.graphics.Color;\nimport com.badlogic.gdx.graphics.VertexAttributes;\nimport com.badlogic.gdx.graphics.g3d.Material;\nimport com.badlogic.gdx.graphics.g3d.Model;\nimport com.badlogic.gdx.graphics.g3d.ModelInstance;\nimport com.badlogic.gdx.graphics.g3d.attributes.ColorAttribute;\nimport com.badlogic.gdx.graphics.g3d.utils.FirstPersonCameraController;\nimport com.badlogic.gdx.graphics.g3d.utils.ModelBuilder;\nimport com.badlogic.gdx.utils.Array;\nimport io.github.alfosua.exp3d.Main;\n\npublic class FpsCameraScreen extends Base3DScreen {\n    private Array<Model> models = new Array<>();\n    private Array<ModelInstance> instances = new Array<>();\n    private FirstPersonCameraController camController;\n\n    public FpsCameraScreen(Main game) {\n        super(game);\n        ModelBuilder modelBuilder = new ModelBuilder();\n        \n        // Crear el suelo\n        Model floorModel = modelBuilder.createBox(100f, 1f, 100f, \n                new Material(ColorAttribute.createDiffuse(Color.GRAY)),\n                VertexAttributes.Usage.Position | VertexAttributes.Usage.Normal);\n        models.add(floorModel);\n        ModelInstance floor = new ModelInstance(floorModel);\n        floor.transform.setToTranslation(0, -0.5f, 0);\n        instances.add(floor);\n\n        // Crear un modelo de pilar\n        Material pillarMaterial = new Material(ColorAttribute.createDiffuse(Color.BLUE));\n        Model pillarModel = modelBuilder.createCylinder(2f, 10f, 2f, 16, pillarMaterial, \n                VertexAttributes.Usage.Position | VertexAttributes.Usage.Normal);\n        models.add(pillarModel);\n\n        // Distribuir pilares en una cuadrícula\n        for (int x = -40; x <= 40; x += 20) {\n            for (int z = -40; z <= 40; z += 20) {\n                if (x == 0 && z == 0) continue; // Dejar el centro libre\n                ModelInstance pillar = new ModelInstance(pillarModel);\n                pillar.transform.setToTranslation(x, 5f, z);\n                instances.add(pillar);\n            }\n        }\n\n        // Posición inicial de la cámara\n        cam.position.set(0f, 3f, 0f);\n        cam.lookAt(0, 3f, -1f);\n        cam.up.set(0, 1, 0);\n        cam.update();\n\n        // Configurar el controlador FPS\n        camController = new FirstPersonCameraController(cam);\n        camController.setDegreesPerPixel(0.5f);\n        camController.setVelocity(10f);\n    }\n\n    @Override\n    public void show() {\n        super.show();\n        multiplexer.addProcessor(camController);\n        Gdx.input.setCursorCatched(true);\n    }\n\n    @Override\n    public void hide() {\n        super.hide();\n        Gdx.input.setCursorCatched(false);\n    }\n\n    @Override\n    public void render(float delta) {\n        super.render(delta);\n        camController.update(delta);\n        \n        modelBatch.begin(cam);\n        modelBatch.render(instances, environment);\n        modelBatch.end();\n    }\n\n    @Override\n    public void dispose() {\n        for (Model model : models) {\n            model.dispose();\n        }\n        models.clear();\n        super.dispose();\n    }\n}`
    }
  ]
};
