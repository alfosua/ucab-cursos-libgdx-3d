import { Slide } from './slidesData';

export const slidesData5: Record<number, Slide[]> = {
  18: [
    {
      title: "Introducción a Bullet Physics",
      content: [
        "gdx-bullet es un wrapper de la popular biblioteca C++ Bullet Physics. Permite simular colisiones, gravedad y dinámicas de cuerpos rígidos (RigidBodies).",
        "Es fundamental inicializar Bullet antes de usar cualquier clase relacionada con físicas."
      ],
      code: `// Inicializar Bullet al inicio de la aplicación o pantalla\nBullet.init();`
    },
    {
      title: "El Mundo Dinámico (DynamicsWorld)",
      content: [
        "El DynamicsWorld es el contenedor donde ocurre toda la simulación física. Necesita varios componentes para funcionar:",
        "• CollisionConfiguration: Configura cómo se detectan las colisiones.",
        "• CollisionDispatcher: Despacha los eventos de colisión.",
        "• BroadphaseInterface: Filtra rápidamente qué objetos podrían colisionar (fase amplia).",
        "• ConstraintSolver: Resuelve las fuerzas y restricciones (fase estrecha)."
      ]
    },
    {
      title: "Configurando el Mundo",
      content: [
        "Creamos las instancias de los componentes y luego instanciamos el DiscreteDynamicsWorld, asignándole una gravedad."
      ],
      code: `btCollisionConfiguration collisionConfig = new btDefaultCollisionConfiguration();\nbtCollisionDispatcher dispatcher = new btCollisionDispatcher(collisionConfig);\nbtBroadphaseInterface broadphase = new btDbvtBroadphase();\nbtConstraintSolver solver = new btSequentialImpulseConstraintSolver();\n\ndynamicsWorld = new btDiscreteDynamicsWorld(dispatcher, broadphase, solver, collisionConfig);\ndynamicsWorld.setGravity(new Vector3(0, -9.81f, 0)); // Gravedad terrestre`
    },
    {
      title: "Cuerpos Rígidos (RigidBodies)",
      content: [
        "Un RigidBody representa un objeto físico. Necesita:",
        "• Masa (Mass): Si es 0, el objeto es estático. Si es > 0, es dinámico.",
        "• Forma de Colisión (CollisionShape): Define el volumen físico (caja, esfera, etc).",
        "• Estado de Movimiento (MotionState): Sincroniza la física con el modelo visual. Implementaremos uno personalizado para mayor control."
      ]
    },
    {
      title: "Clase GameObject y MotionState",
      content: [
        "Para organizar mejor el código, creamos una clase 'GameObject' que hereda de 'ModelInstance' y contiene su propio cuerpo físico y estado de movimiento.",
        "El 'MyMotionState' se encarga de copiar la matriz de transformación entre Bullet y LibGDX."
      ],
      code: `class MyMotionState extends btMotionState {
    Matrix4 transform;
    public MyMotionState(Matrix4 transform) { this.transform = transform; }
    @Override public void getWorldTransform(Matrix4 worldTrans) { worldTrans.set(transform); }
    @Override public void setWorldTransform(Matrix4 worldTrans) { transform.set(worldTrans); }
}

class GameObject extends ModelInstance {
    public final btRigidBody body;
    public final MyMotionState motionState;

    public GameObject(Model model, String node, btRigidBody.btRigidBodyConstructionInfo info) {
        super(model, node);
        motionState = new MyMotionState(this.transform);
        body = new btRigidBody(info);
        body.setMotionState(motionState);
    }
}`
    },
    {
      title: "Creando y Añadiendo Objetos",
      content: [
        "Con nuestra clase GameObject, crear un objeto físico es mucho más limpio. Solo necesitamos definir la forma y la información de construcción."
      ],
      code: `// Definir forma y masa
btCollisionShape boxShape = new btBoxShape(new Vector3(1f, 1f, 1f));
btRigidBody.btRigidBodyConstructionInfo info = new btRigidBody.btRigidBodyConstructionInfo(1f, null, boxShape, localInertia);

// Crear instancia del objeto
GameObject box = new GameObject(model, "box", info);
dynamicsWorld.addRigidBody(box.body);`
    },
    {
      title: "Sincronización y Simulación",
      content: [
        "En el método render(), debemos avanzar la simulación física llamando a stepSimulation().",
        "Bullet actualizará automáticamente las transformaciones (matrices) de los ModelInstances a través de los MotionStates."
      ],
      code: `// Avanzar la simulación (delta time, max sub steps)\ndynamicsWorld.stepSimulation(delta, 5);\n\n// Renderizar los modelos visuales\nmodelBatch.begin(cam);\nmodelBatch.render(instances, environment);\nmodelBatch.end();`
    },
    {
      title: "Código Completo: PhysicsScreen",
      content: [
        "Crea un suelo estático y hace caer varias cajas dinámicas que rebotan y colisionan entre sí."
      ],
      code: `package io.github.alfosua.exp3d.screens;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.VertexAttributes;
import com.badlogic.gdx.graphics.g3d.Material;
import com.badlogic.gdx.graphics.g3d.Model;
import com.badlogic.gdx.graphics.g3d.ModelInstance;
import com.badlogic.gdx.graphics.g3d.attributes.ColorAttribute;
import com.badlogic.gdx.graphics.g3d.utils.ModelBuilder;
import com.badlogic.gdx.math.Matrix4;
import com.badlogic.gdx.math.Vector3;
import com.badlogic.gdx.physics.bullet.Bullet;
import com.badlogic.gdx.physics.bullet.collision.*;
import com.badlogic.gdx.physics.bullet.dynamics.*;
import com.badlogic.gdx.physics.bullet.linearmath.btMotionState;
import com.badlogic.gdx.utils.Array;
import io.github.alfosua.exp3d.Main;

public class PhysicsScreen extends Base3DScreen {
    private btCollisionConfiguration collisionConfig;
    private btDispatcher dispatcher;
    private btBroadphaseInterface broadphase;
    private btConstraintSolver solver;
    private btDynamicsWorld dynamicsWorld;
    private btCollisionShape floorShape;
    private btCollisionShape boxShape;

    private Array<Model> models = new Array<>();
    private Array<GameObject> instances = new Array<>();

    class GameObject extends ModelInstance {
        public final btRigidBody body;
        public final MyMotionState motionState;

        public GameObject(Model model, String node, btRigidBody.btRigidBodyConstructionInfo constructionInfo) {
            super(model, node);
            motionState = new MyMotionState(this.transform);
            body = new btRigidBody(constructionInfo);
            body.setMotionState(motionState);
        }

        public void dispose() {
            body.dispose();
            motionState.dispose();
        }
    }

    class MyMotionState extends btMotionState {
        Matrix4 transform;
        public MyMotionState(Matrix4 transform) { this.transform = transform; }
        @Override public void getWorldTransform(Matrix4 worldTrans) { worldTrans.set(transform); }
        @Override public void setWorldTransform(Matrix4 worldTrans) { transform.set(worldTrans); }
    }

    public PhysicsScreen(Main game) {
        super(game);

        collisionConfig = new btDefaultCollisionConfiguration();
        dispatcher = new btCollisionDispatcher(collisionConfig);
        broadphase = new btDbvtBroadphase();
        solver = new btSequentialImpulseConstraintSolver();
        dynamicsWorld = new btDiscreteDynamicsWorld(dispatcher, broadphase, solver, collisionConfig);
        dynamicsWorld.setGravity(new Vector3(0, -9.81f, 0));

        ModelBuilder mb = new ModelBuilder();
        mb.begin();
        mb.node().id = "floor";
        mb.part("floor", GL20.GL_TRIANGLES, VertexAttributes.Usage.Position | VertexAttributes.Usage.Normal,
                new Material(ColorAttribute.createDiffuse(Color.DARK_GRAY)))
                .box(100f, 1f, 100f);
        mb.node().id = "box";
        mb.part("box", GL20.GL_TRIANGLES, VertexAttributes.Usage.Position | VertexAttributes.Usage.Normal,
                new Material(ColorAttribute.createDiffuse(Color.RED)))
                .box(2f, 2f, 2f);
        Model model = mb.end();
        models.add(model);

        floorShape = new btBoxShape(new Vector3(50f, 0.5f, 50f));
        btRigidBody.btRigidBodyConstructionInfo floorInfo = new btRigidBody.btRigidBodyConstructionInfo(0f, null, floorShape, Vector3.Zero);
        GameObject floor = new GameObject(model, "floor", floorInfo);
        dynamicsWorld.addRigidBody(floor.body);
        instances.add(floor);

        boxShape = new btBoxShape(new Vector3(1f, 1f, 1f));
        Vector3 localInertia = new Vector3();
        boxShape.calculateLocalInertia(1f, localInertia);
        btRigidBody.btRigidBodyConstructionInfo boxInfo = new btRigidBody.btRigidBodyConstructionInfo(1f, null, boxShape, localInertia);

        for (int i = 0; i < 30; i++) {
            GameObject box = new GameObject(model, "box", boxInfo);
            box.transform.setToTranslation((float) Math.random() * 10 - 5, 20f + i * 4f, (float) Math.random() * 10 - 5);
            box.transform.rotate(Vector3.X, (float)Math.random() * 360f);
            box.transform.rotate(Vector3.Y, (float)Math.random() * 360f);
            box.transform.rotate(Vector3.Z, (float)Math.random() * 360f);
            box.body.setWorldTransform(box.transform);
            dynamicsWorld.addRigidBody(box.body);
            instances.add(box);
        }
        floorInfo.dispose();
        boxInfo.dispose();
    }

    @Override
    public void render(float delta) {
        super.render(delta);
        dynamicsWorld.stepSimulation(delta, 5, 1f / 60f);
        modelBatch.begin(cam);
        for (GameObject obj : instances) {
            modelBatch.render(obj, environment);
        }
        modelBatch.end();
    }

    @Override
    public void dispose() {
        for (GameObject obj : instances) {
            dynamicsWorld.removeRigidBody(obj.body);
            obj.dispose();
        }
        instances.clear();
        if (floorShape != null) floorShape.dispose();
        if (boxShape != null) boxShape.dispose();
        dynamicsWorld.dispose();
        solver.dispose();
        broadphase.dispose();
        dispatcher.dispose();
        collisionConfig.dispose();
        for (Model m : models) m.dispose();
        models.clear();
        super.dispose();
    }
}`

    }
  ],
  19: [
    {
      title: "Físicas Avanzadas con Bullet",
      content: [
        "En un entorno tipo 'sandbox', podemos combinar diferentes formas de colisión, restricciones (constraints) y fuerzas para crear interacciones complejas.",
        "Bullet soporta formas compuestas (CompoundShapes), mallas estáticas complejas (BvhTriangleMeshShape) y articulaciones (Hinges, Sliders)."
      ]
    },
    {
      title: "Mallas de Colisión (Collision Meshes)",
      content: [
        "Para terrenos o niveles enteros, no podemos usar cajas o esferas simples. Necesitamos una malla de colisión que coincida con la geometría visual.",
        "BvhTriangleMeshShape es ideal para entornos estáticos (masa 0). Es muy eficiente para detectar colisiones contra miles de triángulos."
      ],
      code: `// Obtener la malla del modelo visual\nMesh mesh = model.meshes.get(0);\n\n// Crear la forma de colisión basada en los triángulos de la malla\nbtBvhTriangleMeshShape terrainShape = new btBvhTriangleMeshShape(mesh, true);\n\n// Crear el RigidBody estático\nbtRigidBody.btRigidBodyConstructionInfo info = new btRigidBody.btRigidBodyConstructionInfo(0f, null, terrainShape, Vector3.Zero);\nbtRigidBody terrainBody = new btRigidBody(info);\ndynamicsWorld.addRigidBody(terrainBody);`
    },
    {
      title: "Restricciones (Constraints)",
      content: [
        "Las restricciones limitan el movimiento relativo entre dos cuerpos rígidos.",
        "• HingeConstraint: Una bisagra (como una puerta o una rueda). Permite rotación en un solo eje.",
        "• SliderConstraint: Permite movimiento lineal a lo largo de un eje (como un pistón).",
        "• Point2PointConstraint: Une dos cuerpos en un punto específico (como una cadena o un péndulo)."
      ]
    },
    {
      title: "Aplicando Fuerzas e Impulsos",
      content: [
        "Para mover objetos dinámicos, no modificamos su posición directamente (eso rompe la simulación). En su lugar, aplicamos fuerzas.",
        "• applyCentralForce: Aplica una fuerza continua en el centro de masa (ej. un cohete).",
        "• applyCentralImpulse: Aplica un cambio instantáneo de velocidad (ej. una explosión o un salto).",
        "• applyTorque: Aplica una fuerza de rotación."
      ],
      code: `// Hacer saltar un objeto hacia arriba\nVector3 jumpImpulse = new Vector3(0, 10f, 0);\nplayerBody.applyCentralImpulse(jumpImpulse);\n\n// Empujar un objeto hacia adelante\nVector3 forwardForce = new Vector3(0, 0, -50f);\ncarBody.applyCentralForce(forwardForce);`
    },
    {
      title: "Código Completo: SandboxScreen",
      content: [
        "Crea un entorno con un suelo, una rampa (usando BvhTriangleMeshShape) y esferas que caen y ruedan por ella."
      ],
      code: `package io.github.alfosua.exp3d.screens;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.VertexAttributes;
import com.badlogic.gdx.graphics.g3d.Material;
import com.badlogic.gdx.graphics.g3d.Model;
import com.badlogic.gdx.graphics.g3d.ModelInstance;
import com.badlogic.gdx.graphics.g3d.attributes.ColorAttribute;
import com.badlogic.gdx.graphics.g3d.utils.ModelBuilder;
import com.badlogic.gdx.math.Matrix4;
import com.badlogic.gdx.math.Vector3;
import com.badlogic.gdx.physics.bullet.Bullet;
import com.badlogic.gdx.physics.bullet.collision.*;
import com.badlogic.gdx.physics.bullet.dynamics.*;
import com.badlogic.gdx.physics.bullet.linearmath.btMotionState;
import com.badlogic.gdx.utils.Array;
import io.github.alfosua.exp3d.Main;

public class SandboxScreen extends Base3DScreen {
    private btCollisionConfiguration collisionConfig;
    private btDispatcher dispatcher;
    private btBroadphaseInterface broadphase;
    private btConstraintSolver solver;
    private btDynamicsWorld dynamicsWorld;
    private btCollisionShape floorShape, rampShape, sphereShape;

    private Array<Model> models = new Array<>();
    private Array<GameObject> instances = new Array<>();

    class GameObject extends ModelInstance {
        public final btRigidBody body;
        public final MyMotionState motionState;

        public GameObject(Model model, String node, btRigidBody.btRigidBodyConstructionInfo constructionInfo) {
            super(model, node);
            motionState = new MyMotionState(this.transform);
            body = new btRigidBody(constructionInfo);
            body.setMotionState(motionState);
        }

        public void dispose() {
            body.dispose();
            motionState.dispose();
        }
    }

    class MyMotionState extends btMotionState {
        Matrix4 transform;
        public MyMotionState(Matrix4 transform) { this.transform = transform; }
        @Override public void getWorldTransform(Matrix4 worldTrans) { worldTrans.set(transform); }
        @Override public void setWorldTransform(Matrix4 worldTrans) { transform.set(worldTrans); }
    }

    public SandboxScreen(Main game) {
        super(game);

        collisionConfig = new btDefaultCollisionConfiguration();
        dispatcher = new btCollisionDispatcher(collisionConfig);
        broadphase = new btDbvtBroadphase();
        solver = new btSequentialImpulseConstraintSolver();
        dynamicsWorld = new btDiscreteDynamicsWorld(dispatcher, broadphase, solver, collisionConfig);
        dynamicsWorld.setGravity(new Vector3(0, -9.81f, 0));

        ModelBuilder mb = new ModelBuilder();
        mb.begin();
        mb.node().id = "floor";
        mb.part("floor", GL20.GL_TRIANGLES, VertexAttributes.Usage.Position | VertexAttributes.Usage.Normal,
                new Material(ColorAttribute.createDiffuse(Color.DARK_GRAY))).box(40f, 1f, 40f);
        mb.node().id = "ramp";
        mb.part("ramp", GL20.GL_TRIANGLES, VertexAttributes.Usage.Position | VertexAttributes.Usage.Normal,
                new Material(ColorAttribute.createDiffuse(Color.BLUE))).box(10f, 1f, 20f);
        mb.node().id = "sphere";
        mb.part("sphere", GL20.GL_TRIANGLES, VertexAttributes.Usage.Position | VertexAttributes.Usage.Normal,
                new Material(ColorAttribute.createDiffuse(Color.YELLOW))).sphere(2f, 2f, 2f, 20, 20);
        Model model = mb.end();
        models.add(model);

        // Suelo
        floorShape = new btBoxShape(new Vector3(20f, 0.5f, 20f));
        btRigidBody.btRigidBodyConstructionInfo floorInfo = new btRigidBody.btRigidBodyConstructionInfo(0f, null, floorShape, Vector3.Zero);
        GameObject floor = new GameObject(model, "floor", floorInfo);
        dynamicsWorld.addRigidBody(floor.body);
        instances.add(floor);

        // Rampa
        rampShape = new btBoxShape(new Vector3(5f, 0.5f, 10f));
        btRigidBody.btRigidBodyConstructionInfo rampInfo = new btRigidBody.btRigidBodyConstructionInfo(0f, null, rampShape, Vector3.Zero);
        GameObject ramp = new GameObject(model, "ramp", rampInfo);
        ramp.transform.setToTranslation(0, 5f, -5f);
        ramp.transform.rotate(Vector3.X, 30f);
        ramp.body.setWorldTransform(ramp.transform);
        dynamicsWorld.addRigidBody(ramp.body);
        instances.add(ramp);

        // Esferas
        sphereShape = new btSphereShape(1f);
        Vector3 localInertia = new Vector3();
        sphereShape.calculateLocalInertia(2f, localInertia);
        btRigidBody.btRigidBodyConstructionInfo sphereInfo = new btRigidBody.btRigidBodyConstructionInfo(2f, null, sphereShape, localInertia);

        for (int i = 0; i < 5; i++) {
            GameObject sphere = new GameObject(model, "sphere", sphereInfo);
            sphere.transform.setToTranslation((float)Math.random() * 4f - 2f, 15f + i * 4f, -10f);
            sphere.body.setWorldTransform(sphere.transform);
            sphere.body.setFriction(0.8f);
            sphere.body.setRollingFriction(0.1f);
            dynamicsWorld.addRigidBody(sphere.body);
            instances.add(sphere);
        }

        floorInfo.dispose();
        rampInfo.dispose();
        sphereInfo.dispose();
    }

    @Override
    public void render(float delta) {
        super.render(delta);
        dynamicsWorld.stepSimulation(delta, 5, 1f/60f);
        modelBatch.begin(cam);
        for (GameObject obj : instances) {
            modelBatch.render(obj, environment);
        }
        modelBatch.end();
    }

    @Override
    public void dispose() {
        for (GameObject obj : instances) {
            dynamicsWorld.removeRigidBody(obj.body);
            obj.dispose();
        }
        instances.clear();
        if (floorShape != null) floorShape.dispose();
        if (rampShape != null) rampShape.dispose();
        if (sphereShape != null) sphereShape.dispose();
        dynamicsWorld.dispose();
        solver.dispose();
        broadphase.dispose();
        dispatcher.dispose();
        collisionConfig.dispose();
        for (Model m : models) m.dispose();
        models.clear();
        super.dispose();
    }
}`

    }
  ],
  21: [
    {
      title: "Exploración de Entornos Grandes (Teoría)",
      content: [
        "Renderizar un mundo abierto o un entorno muy grande presenta desafíos significativos de rendimiento.",
        "No puedes enviar toda la geometría a la GPU en cada frame. Necesitas técnicas de optimización."
      ]
    },
    {
      title: "Frustum Culling",
      content: [
        "El Frustum de la cámara es el volumen de espacio (una pirámide truncada) que la cámara puede 'ver'.",
        "El Frustum Culling consiste en comprobar matemáticamente si un objeto está dentro de ese volumen antes de renderizarlo.",
        "Si está fuera, se descarta (no se envía al ModelBatch), ahorrando muchísimo procesamiento."
      ],
      code: `// Ejemplo básico de Frustum Culling en LibGDX\nfor (ModelInstance instance : instances) {\n    // Obtener la posición del objeto (simplificado)\n    Vector3 position = new Vector3();\n    instance.transform.getTranslation(position);\n    \n    // Comprobar si un punto (o una esfera delimitadora) está en el frustum\n    if (cam.frustum.sphereInFrustum(position, radius)) {\n        modelBatch.render(instance, environment);\n    }\n}`
    },
    {
      title: "Level of Detail (LOD)",
      content: [
        "Los objetos lejanos se ven más pequeños, por lo que no necesitan tantos detalles (polígonos).",
        "El LOD implica tener múltiples versiones de un mismo modelo (alta, media, baja resolución).",
        "Según la distancia a la cámara, se renderiza la versión adecuada. Esto reduce la carga en la GPU."
      ]
    },
    {
      title: "Chunking / Paging",
      content: [
        "Para mundos infinitos (como Minecraft), el mundo se divide en 'chunks' (trozos).",
        "Solo se cargan en memoria y se renderizan los chunks cercanos al jugador.",
        "A medida que el jugador se mueve, se cargan nuevos chunks y se descargan los lejanos de forma asíncrona."
      ]
    },
    {
      title: "Instancing (Renderizado Instanciado)",
      content: [
        "Si tienes miles de objetos idénticos (ej. árboles en un bosque, briznas de hierba), renderizarlos uno por uno es lento por las llamadas de dibujo (draw calls).",
        "El Instancing permite enviar la geometría a la GPU una sola vez, junto con una lista de posiciones/transformaciones.",
        "La GPU dibuja todas las copias en una sola llamada. gdx-gltf soporta instancing para mejorar el rendimiento masivamente."
      ]
    }
  ],
  20: [
    {
      title: "Raycasting (Trazado de Rayos)",
      content: [
        "El Raycasting es una técnica para disparar un rayo invisible desde un punto en una dirección y detectar si choca con algún objeto físico.",
        "Es esencial para mecánicas de disparo (hitscan), selección de objetos con el ratón (picking) o detección de suelo."
      ]
    },
    {
      title: "De Pantalla a Mundo 3D",
      content: [
        "Para seleccionar un objeto haciendo clic, necesitamos convertir las coordenadas 2D de la pantalla (X, Y) en un rayo 3D.",
        "La cámara de LibGDX tiene el método getPickRay(x, y) que hace exactamente esto."
      ],
      code: `// Obtener el rayo desde la posición del ratón/toque\nRay ray = cam.getPickRay(screenX, screenY);\n\n// Definir el punto de inicio (la cámara) y el punto final (lejos en la dirección del rayo)\nVector3 rayFrom = ray.origin;\nVector3 rayTo = ray.direction.scl(100f).add(rayFrom);`
    },
    {
      title: "Realizando el Raycast en Bullet",
      content: [
        "Usamos el dynamicsWorld para realizar el rayTest. Necesitamos un objeto Callback que almacenará el resultado de la colisión.",
        "ClosestRayResultCallback nos da el objeto más cercano que fue golpeado por el rayo."
      ],
      code: `ClosestRayResultCallback callback = new ClosestRayResultCallback(rayFrom, rayTo);\ndynamicsWorld.rayTest(rayFrom, rayTo, callback);\n\nif (callback.hasHit()) {\n    // ¡Golpeamos algo!\n    btCollisionObject hitObject = callback.getCollisionObject();\n    // Podemos obtener el punto exacto de impacto\n    Vector3 hitPoint = new Vector3();\n    callback.getHitPointWorld(hitPoint);\n}\n\n// Importante: liberar el callback (memoria C++)\ncallback.dispose();`
    },
    {
      title: "Código Completo: RaycastingScreen",
      content: [
        "Muestra varias esferas flotando. Al hacer clic en la pantalla, se lanza un rayo. Si el rayo golpea una esfera, esta cambia de color a verde."
      ],
      code: `package io.github.alfosua.exp3d.screens;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.InputAdapter;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.VertexAttributes;
import com.badlogic.gdx.graphics.g3d.Material;
import com.badlogic.gdx.graphics.g3d.Model;
import com.badlogic.gdx.graphics.g3d.ModelInstance;
import com.badlogic.gdx.graphics.g3d.attributes.ColorAttribute;
import com.badlogic.gdx.graphics.g3d.utils.ModelBuilder;
import com.badlogic.gdx.math.Matrix4;
import com.badlogic.gdx.math.Vector3;
import com.badlogic.gdx.math.collision.Ray;
import com.badlogic.gdx.physics.bullet.Bullet;
import com.badlogic.gdx.physics.bullet.collision.*;
import com.badlogic.gdx.physics.bullet.dynamics.*;
import com.badlogic.gdx.physics.bullet.linearmath.btMotionState;
import com.badlogic.gdx.utils.Array;
import io.github.alfosua.exp3d.Main;

public class RaycastingScreen extends Base3DScreen {
    private btCollisionConfiguration collisionConfig;
    private btDispatcher dispatcher;
    private btBroadphaseInterface broadphase;
    private btConstraintSolver solver;
    private btDynamicsWorld dynamicsWorld;
    private btCollisionShape sphereShape;

    private Array<Model> models = new Array<>();
    private Array<GameObject> instances = new Array<>();

    class GameObject extends ModelInstance {
        public final btRigidBody body;
        public final MyMotionState motionState;

        public GameObject(Model model, String node, btRigidBody.btRigidBodyConstructionInfo constructionInfo) {
            super(model, node);
            motionState = new MyMotionState(this.transform);
            body = new btRigidBody(constructionInfo);
            body.setMotionState(motionState);
        }

        public void dispose() {
            body.dispose();
            motionState.dispose();
        }
    }

    class MyMotionState extends btMotionState {
        Matrix4 transform;
        public MyMotionState(Matrix4 transform) { this.transform = transform; }
        @Override public void getWorldTransform(Matrix4 worldTrans) { worldTrans.set(transform); }
        @Override public void setWorldTransform(Matrix4 worldTrans) { transform.set(worldTrans); }
    }

    public RaycastingScreen(Main game) {
        super(game);

        collisionConfig = new btDefaultCollisionConfiguration();
        dispatcher = new btCollisionDispatcher(collisionConfig);
        broadphase = new btDbvtBroadphase();
        solver = new btSequentialImpulseConstraintSolver();
        dynamicsWorld = new btDiscreteDynamicsWorld(dispatcher, broadphase, solver, collisionConfig);
        dynamicsWorld.setGravity(new Vector3(0, 0, 0));

        ModelBuilder mb = new ModelBuilder();
        mb.begin();
        mb.node().id = "sphere";
        mb.part("sphere", GL20.GL_TRIANGLES, VertexAttributes.Usage.Position | VertexAttributes.Usage.Normal,
                new Material(ColorAttribute.createDiffuse(Color.RED))).sphere(2f, 2f, 2f, 20, 20);
        Model model = mb.end();
        models.add(model);

        sphereShape = new btSphereShape(1f);
        btRigidBody.btRigidBodyConstructionInfo info = new btRigidBody.btRigidBodyConstructionInfo(0f, null, sphereShape, Vector3.Zero);

        for (int i = 0; i < 5; i++) {
            GameObject sphere = new GameObject(model, "sphere", info);
            sphere.transform.setToTranslation(-8f + (i * 4f), 0f, 0f);
            sphere.body.setWorldTransform(sphere.transform);
            sphere.body.setUserValue(i);
            dynamicsWorld.addRigidBody(sphere.body);
            instances.add(sphere);
        }
        info.dispose();

        multiplexer.addProcessor(new InputAdapter() {
            @Override
            public boolean touchDown(int screenX, int screenY, int pointer, int button) {
                Ray ray = cam.getPickRay(screenX, screenY);
                Vector3 rayFrom = new Vector3(ray.origin);
                Vector3 rayTo = new Vector3(ray.direction).scl(100f).add(rayFrom);

                ClosestRayResultCallback callback = new ClosestRayResultCallback(rayFrom, rayTo);
                dynamicsWorld.rayTest(rayFrom, rayTo, callback);

                if (callback.hasHit()) {
                    btCollisionObject hitObject = callback.getCollisionObject();
                    int index = hitObject.getUserValue();
                    if (index >= 0 && index < instances.size) {
                        instances.get(index).materials.get(0).set(ColorAttribute.createDiffuse(Color.GREEN));
                    }
                }
                callback.dispose();
                return true;
            }
        });
    }

    @Override
    public void render(float delta) {
        super.render(delta);
        dynamicsWorld.stepSimulation(delta, 5, 1f/60f);
        modelBatch.begin(cam);
        for (GameObject obj : instances) {
            modelBatch.render(obj, environment);
        }
        modelBatch.end();
    }

    @Override
    public void dispose() {
        for (GameObject obj : instances) {
            dynamicsWorld.removeRigidBody(obj.body);
            obj.dispose();
        }
        instances.clear();
        if (sphereShape != null) sphereShape.dispose();
        dynamicsWorld.dispose();
        solver.dispose();
        broadphase.dispose();
        dispatcher.dispose();
        collisionConfig.dispose();
        for (Model m : models) m.dispose();
        models.clear();
        super.dispose();
    }
}`

    }
  ]
};
