import { Slide } from './slidesData';

export const slidesData2: Record<number, Slide[]> = {
  8: [
    {
      title: "Model Builders (Procedural)",
      content: [
        "ModelBuilder no solo sirve para cajas. Puede crear esferas, cilindros, cápsulas y conos de forma procedural.",
        "Esto es extremadamente útil para generar primitivas geométricas sin necesidad de software de modelado 3D externo como Blender."
      ]
    },
    {
      title: "Atributos de Vértice (VertexAttributes)",
      content: [
        "Al crear una primitiva, debemos especificar qué información tendrán sus vértices.",
        "• Usage.Position: Obligatorio. Define dónde está el vértice en el espacio 3D.",
        "• Usage.Normal: Necesario para que la iluminación funcione (define hacia dónde 'mira' la superficie).",
        "• Usage.TextureCoordinates: Necesario si vas a aplicar una textura de imagen al modelo."
      ],
      code: `long attributes = Usage.Position | Usage.Normal | Usage.TextureCoordinates;\nModel box = modelBuilder.createBox(2f, 2f, 2f, material, attributes);`
    },
    {
      title: "Primitiva: Caja (Box)",
      content: [
        "Para crear una caja o prisma rectangular, usamos 'createBox'.",
        "Requiere el ancho, alto y profundidad, además del material y los atributos."
      ],
      code: `// createBox(ancho, alto, profundidad, material, atributos)\nmodel = modelBuilder.createBox(5f, 5f, 5f, material, attributes);`
    },
    {
      title: "Primitiva: Esfera (Sphere)",
      content: [
        "Para crear una esfera, usamos 'createSphere'.",
        "Además de su tamaño (ancho, alto, profundidad), requiere dos parámetros extra: divisiones horizontales y verticales (cuántos polígonos la forman)."
      ],
      code: `// createSphere(ancho, alto, profundidad, divisionesU, divisionesV, material, atributos)\nmodel = modelBuilder.createSphere(5f, 5f, 5f, 20, 20, material, attributes);`
    },
    {
      title: "Primitiva: Cilindro (Cylinder)",
      content: [
        "Para crear un cilindro, usamos 'createCylinder'.",
        "Requiere ancho, alto, profundidad y el número de divisiones (caras laterales)."
      ],
      code: `// createCylinder(ancho, alto, profundidad, divisiones, material, atributos)\nmodel = modelBuilder.createCylinder(5f, 10f, 5f, 16, material, attributes);`
    },
    {
      title: "Primitiva: Cono (Cone)",
      content: [
        "Para crear un cono, usamos 'createCone'.",
        "Al igual que el cilindro, requiere ancho, alto, profundidad y el número de divisiones para su base circular."
      ],
      code: `// createCone(ancho, alto, profundidad, divisiones, material, atributos)\nmodel = modelBuilder.createCone(5f, 10f, 5f, 16, material, attributes);`
    },
    {
      title: "Primitiva: Cápsula (Capsule)",
      content: [
        "Para crear una cápsula (un cilindro con semiesferas en los extremos), usamos 'createCapsule'.",
        "Requiere el radio y la altura total, además del número de divisiones."
      ],
      code: `// createCapsule(radio, altura, divisiones, material, atributos)\nmodel = modelBuilder.createCapsule(2.5f, 10f, 16, material, attributes);`
    },
    {
      title: "Código Completo: ModelBuildersScreen",
      content: [
        "Genera varias primitivas geométricas (caja, esfera, cilindro, cápsula, cono) y las rota en pantalla."
      ],
      code: `package io.github.alfosua.exp3d.screens;\n\nimport com.badlogic.gdx.Gdx;\nimport com.badlogic.gdx.graphics.Color;\nimport com.badlogic.gdx.graphics.GL20;\nimport com.badlogic.gdx.graphics.VertexAttributes.Usage;\nimport com.badlogic.gdx.graphics.g3d.Material;\nimport com.badlogic.gdx.graphics.g3d.Model;\nimport com.badlogic.gdx.graphics.g3d.ModelInstance;\nimport com.badlogic.gdx.graphics.g3d.attributes.ColorAttribute;\nimport com.badlogic.gdx.graphics.g3d.utils.ModelBuilder;\nimport com.badlogic.gdx.math.Vector3;\nimport com.badlogic.gdx.utils.Array;\nimport io.github.alfosua.exp3d.Main;\n\npublic class ModelBuildersScreen extends Base3DScreen {\n    private Array<Model> models = new Array<Model>();\n    private Array<ModelInstance> instances = new Array<ModelInstance>();\n\n    public ModelBuildersScreen(Main game) {\n        super(game);\n        cam.position.set(0f, 5f, 15f);\n        cam.lookAt(0, 0, 0);\n        cam.update();\n\n        ModelBuilder modelBuilder = new ModelBuilder();\n\n        Material boxMaterial = new Material(ColorAttribute.createDiffuse(Color.RED));\n        Model box = modelBuilder.createBox(2f, 2f, 2f, boxMaterial, Usage.Position | Usage.Normal | Usage.TextureCoordinates);\n        ModelInstance boxInstance = new ModelInstance(box);\n        boxInstance.transform.setToTranslation(-6f, 0f, 0f);\n        models.add(box);\n        instances.add(boxInstance);\n\n        Material sphereMaterial = new Material(ColorAttribute.createDiffuse(Color.GREEN));\n        Model sphere = modelBuilder.createSphere(2f, 2f, 2f, 20, 20, sphereMaterial, Usage.Position | Usage.Normal | Usage.TextureCoordinates);\n        ModelInstance sphereInstance = new ModelInstance(sphere);\n        sphereInstance.transform.setToTranslation(-2f, 0f, 0f);\n        models.add(sphere);\n        instances.add(sphereInstance);\n\n        Material cylinderMaterial = new Material(ColorAttribute.createDiffuse(Color.BLUE));\n        Model cylinder = modelBuilder.createCylinder(2f, 4f, 2f, 20, cylinderMaterial, Usage.Position | Usage.Normal | Usage.TextureCoordinates);\n        ModelInstance cylinderInstance = new ModelInstance(cylinder);\n        cylinderInstance.transform.setToTranslation(2f, 0f, 0f);\n        models.add(cylinder);\n        instances.add(cylinderInstance);\n\n        Material capsuleMaterial = new Material(ColorAttribute.createDiffuse(Color.YELLOW));\n        Model capsule = modelBuilder.createCapsule(1f, 4f, 20, capsuleMaterial, Usage.Position | Usage.Normal | Usage.TextureCoordinates);\n        ModelInstance capsuleInstance = new ModelInstance(capsule);\n        capsuleInstance.transform.setToTranslation(6f, 0f, 0f);\n        models.add(capsule);\n        instances.add(capsuleInstance);\n\n        Material coneMaterial = new Material(ColorAttribute.createDiffuse(Color.MAGENTA));\n        Model cone = modelBuilder.createCone(2f, 4f, 2f, 20, coneMaterial, Usage.Position | Usage.Normal | Usage.TextureCoordinates);\n        ModelInstance coneInstance = new ModelInstance(cone);\n        coneInstance.transform.setToTranslation(0f, 0f, 4f);\n        models.add(cone);\n        instances.add(coneInstance);\n    }\n\n    @Override\n    public void render(float delta) {\n        Gdx.gl.glViewport(0, 0, Gdx.graphics.getWidth(), Gdx.graphics.getHeight());\n        Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT | GL20.GL_DEPTH_BUFFER_BIT);\n\n        for (ModelInstance instance : instances) {\n            instance.transform.rotate(Vector3.Y, 30f * delta);\n            instance.transform.rotate(Vector3.X, 15f * delta);\n        }\n\n        modelBatch.begin(cam);\n        modelBatch.render(instances, environment);\n        modelBatch.end();\n    }\n\n    @Override\n    public void dispose() {\n        super.dispose();\n        for (Model model : models) model.dispose();\n        models.clear();\n    }\n}`
    }
  ],
  9: [
    {
      title: "Generación de Mallas Personalizadas",
      content: [
        "Si las primitivas no son suficientes, puedes construir tus propias mallas vértice a vértice.",
        "Usamos MeshPartBuilder para definir triángulos, rectángulos o polígonos complejos de forma manual."
      ]
    },
    {
      title: "MeshPartBuilder",
      content: [
        "Iniciamos el ModelBuilder llamando a begin(). Luego, pedimos una 'part' (parte de la malla) y comenzamos a añadir vértices o triángulos.",
        "Al finalizar, llamamos a end() para obtener el Model compilado."
      ],
      code: `ModelBuilder modelBuilder = new ModelBuilder();\nmodelBuilder.begin();\n\n// Creamos una nueva parte llamada "diamond" formada por triángulos\nMeshPartBuilder builder = modelBuilder.part("diamond",\n        GL20.GL_TRIANGLES,\n        VertexAttributes.Usage.Position | VertexAttributes.Usage.ColorUnpacked | VertexAttributes.Usage.Normal,\n        new Material());\n\n// Podemos cambiar el color antes de definir cada triángulo\nbuilder.setColor(Color.CYAN);\nbuilder.triangle(v1, v2, v3);\n\ncustomModel = modelBuilder.end();`
    },
    {
      title: "Definiendo Triángulos",
      content: [
        "El método triangle() toma tres Vector3 que representan las esquinas del triángulo en el espacio 3D.",
        "El orden de los vértices (sentido horario o antihorario) determina hacia dónde apunta la 'normal' (qué lado es visible)."
      ],
      code: `Vector3 v1 = new Vector3(0, 5, 0);   // Punta superior\nVector3 v2 = new Vector3(-5, 0, 5);  // Esquina inferior izquierda\nVector3 v3 = new Vector3(5, 0, 5);   // Esquina inferior derecha\n\nbuilder.triangle(v1, v2, v3);`
    },
    {
      title: "Construyendo un Diamante: Los Vértices",
      content: [
        "Para construir un diamante, imaginemos sus puntos clave en el espacio 3D:",
        "• Una punta superior en (0, 5, 0)",
        "• Una punta inferior en (0, -5, 0)",
        "• Cuatro esquinas en el centro formando un cuadrado: (-5, 0, 5), (5, 0, 5), (5, 0, -5) y (-5, 0, -5)."
      ]
    },
    {
      title: "Construyendo un Diamante: Primera Mitad",
      content: [
        "Comenzaremos uniendo la punta superior con las esquinas centrales para formar la mitad de arriba (4 triángulos).",
        "Cambiamos el color antes de cada triángulo para poder distinguirlos fácilmente."
      ],
      code: `// Triángulo frontal\nbuilder.setColor(Color.CYAN);\nbuilder.triangle(new Vector3(0, 5, 0), new Vector3(-5, 0, 5), new Vector3(5, 0, 5));\n\n// Triángulo derecho\nbuilder.setColor(Color.MAGENTA);\nbuilder.triangle(new Vector3(0, 5, 0), new Vector3(5, 0, 5), new Vector3(5, 0, -5));\n\n// Triángulo trasero\nbuilder.setColor(Color.YELLOW);\nbuilder.triangle(new Vector3(0, 5, 0), new Vector3(5, 0, -5), new Vector3(-5, 0, -5));\n\n// Triángulo izquierdo\nbuilder.setColor(Color.GREEN);\nbuilder.triangle(new Vector3(0, 5, 0), new Vector3(-5, 0, -5), new Vector3(-5, 0, 5));`
    },
    {
      title: "Construyendo un Diamante: Segunda Mitad",
      content: [
        "Ahora hacemos lo mismo pero conectando la punta inferior (0, -5, 0) con las mismas esquinas centrales.",
        "Nota que el orden de los vértices cambia para que la cara visible apunte hacia afuera y no hacia adentro del diamante."
      ],
      code: `// Triángulo frontal inferior\nbuilder.setColor(Color.RED);\nbuilder.triangle(new Vector3(0, -5, 0), new Vector3(5, 0, 5), new Vector3(-5, 0, 5));\n\n// Triángulo derecho inferior\nbuilder.setColor(Color.ORANGE);\nbuilder.triangle(new Vector3(0, -5, 0), new Vector3(5, 0, -5), new Vector3(5, 0, 5));\n\n// ... y así sucesivamente para los otros dos`
    },
    {
      title: "Código Completo: CustomModelScreen",
      content: [
        "Construye un diamante 3D definiendo manualmente los 8 triángulos que lo componen, cada uno con un color diferente."
      ],
      code: `package io.github.alfosua.exp3d.screens;\n\nimport com.badlogic.gdx.graphics.Color;\nimport com.badlogic.gdx.graphics.VertexAttributes;\nimport com.badlogic.gdx.graphics.g3d.Material;\nimport com.badlogic.gdx.graphics.g3d.Model;\nimport com.badlogic.gdx.graphics.g3d.ModelInstance;\nimport com.badlogic.gdx.graphics.g3d.utils.MeshPartBuilder;\nimport com.badlogic.gdx.graphics.g3d.utils.ModelBuilder;\nimport com.badlogic.gdx.math.Vector3;\nimport com.badlogic.gdx.graphics.GL20;\nimport io.github.alfosua.exp3d.Main;\n\npublic class CustomModelScreen extends Base3DScreen {\n    private Model customModel;\n    private ModelInstance instance;\n\n    public CustomModelScreen(Main game) {\n        super(game);\n\n        ModelBuilder modelBuilder = new ModelBuilder();\n        modelBuilder.begin();\n\n        MeshPartBuilder builder = modelBuilder.part("diamond",\n                GL20.GL_TRIANGLES,\n                VertexAttributes.Usage.Position | VertexAttributes.Usage.ColorUnpacked | VertexAttributes.Usage.Normal,\n                new Material());\n\n        // Mitad superior\n        builder.setColor(Color.CYAN);\n        builder.triangle(new Vector3(0, 5, 0), new Vector3(-5, 0, 5), new Vector3(5, 0, 5));\n\n        builder.setColor(Color.MAGENTA);\n        builder.triangle(new Vector3(0, 5, 0), new Vector3(5, 0, 5), new Vector3(5, 0, -5));\n\n        builder.setColor(Color.YELLOW);\n        builder.triangle(new Vector3(0, 5, 0), new Vector3(5, 0, -5), new Vector3(-5, 0, -5));\n\n        builder.setColor(Color.GREEN);\n        builder.triangle(new Vector3(0, 5, 0), new Vector3(-5, 0, -5), new Vector3(-5, 0, 5));\n\n        // Mitad inferior\n        builder.setColor(Color.RED);\n        builder.triangle(new Vector3(0, -5, 0), new Vector3(5, 0, 5), new Vector3(-5, 0, 5));\n\n        builder.setColor(Color.ORANGE);\n        builder.triangle(new Vector3(0, -5, 0), new Vector3(5, 0, -5), new Vector3(5, 0, 5));\n\n        builder.setColor(Color.BLUE);\n        builder.triangle(new Vector3(0, -5, 0), new Vector3(-5, 0, -5), new Vector3(5, 0, -5));\n\n        builder.setColor(Color.PURPLE);\n        builder.triangle(new Vector3(0, -5, 0), new Vector3(-5, 0, 5), new Vector3(-5, 0, -5));\n\n        customModel = modelBuilder.end();\n        instance = new ModelInstance(customModel);\n        \n        cam.position.set(12f, 8f, 12f);\n        cam.lookAt(0, 0, 0);\n        cam.update();\n    }\n\n    @Override\n    public void render(float delta) {\n        super.render(delta);\n        instance.transform.rotate(0, 1, 0, 30f * delta);\n        modelBatch.begin(cam);\n        modelBatch.render(instance, environment);\n        modelBatch.end();\n    }\n\n    @Override\n    public void dispose() {\n        if (customModel != null) customModel.dispose();\n        super.dispose();\n    }\n}`
    }
  ],
  10: [
    {
      title: "Terrenos con Heightmaps",
      content: [
        "Un mapa de alturas (heightmap) es una matriz 2D donde cada valor representa la elevación (Y) en ese punto (X, Z).",
        "Podemos generar terrenos infinitos o basados en imágenes usando esta técnica, combinándola con MeshPartBuilder."
      ]
    },
    {
      title: "Generación Procedural de Alturas",
      content: [
        "En este ejemplo, usamos funciones matemáticas (seno y coseno) combinadas para generar colinas y valles de forma procedural.",
        "Almacenamos estos valores en un array bidimensional."
      ],
      code: `float[][] heights = new float[width][depth];\nfor (int x = 0; x < width; x++) {\n    for (int z = 0; z < depth; z++) {\n        // Combinamos seno y coseno para crear variaciones suaves\n        heights[x][z] = (float) (Math.sin(x * 0.2) + Math.cos(z * 0.2)) * 3f;\n    }\n}`
    },
    {
      title: "Construyendo la Malla del Terreno",
      content: [
        "Recorremos la matriz de alturas y creamos dos triángulos (un cuadrado o 'quad') por cada celda de la cuadrícula."
      ],
      code: `for (int x = 0; x < width - 1; x++) {\n    for (int z = 0; z < depth - 1; z++) {\n        // Definimos los 4 vértices del quad\n        Vector3 v1 = new Vector3(x * scale, heights[x][z], z * scale);\n        Vector3 v2 = new Vector3((x + 1) * scale, heights[x + 1][z], z * scale);\n        Vector3 v3 = new Vector3((x + 1) * scale, heights[x + 1][z + 1], (z + 1) * scale);\n        Vector3 v4 = new Vector3(x * scale, heights[x][z + 1], (z + 1) * scale);\n\n        // Creamos los dos triángulos\n        builder.triangle(v1, v3, v2);\n        builder.triangle(v1, v4, v3);\n    }\n}`
    },
    {
      title: "Coloreando el Terreno",
      content: [
        "Para darle un aspecto más realista, podemos cambiar el color de cada triángulo dependiendo de su altura.",
        "Por ejemplo, las zonas más altas pueden ser blancas (nieve), las intermedias marrones (tierra) y las bajas verdes (hierba)."
      ],
      code: `float h = heights[x][z];\nif (h > 2.5f) {\n    builder.setColor(Color.WHITE); // Nieve\n} else if (h > 0f) {\n    builder.setColor(Color.valueOf("8B4513")); // Tierra\n} else {\n    builder.setColor(Color.valueOf("228B22")); // Hierba\n}`
    },
    {
      title: "Código Completo: TerrainScreen",
      content: [
        "Genera un terreno procedural coloreado según la altura y permite explorarlo con la cámara FPS."
      ],
      code: `package io.github.alfosua.exp3d.screens;\n\nimport com.badlogic.gdx.graphics.Color;\nimport com.badlogic.gdx.graphics.GL20;\nimport com.badlogic.gdx.graphics.VertexAttributes;\nimport com.badlogic.gdx.graphics.g3d.Material;\nimport com.badlogic.gdx.graphics.g3d.Model;\nimport com.badlogic.gdx.graphics.g3d.ModelInstance;\nimport com.badlogic.gdx.graphics.g3d.utils.FirstPersonCameraController;\nimport com.badlogic.gdx.graphics.g3d.utils.MeshPartBuilder;\nimport com.badlogic.gdx.graphics.g3d.utils.ModelBuilder;\nimport com.badlogic.gdx.math.Vector3;\nimport io.github.alfosua.exp3d.Main;\n\npublic class TerrainScreen extends Base3DScreen {\n    private Model terrainModel;\n    private ModelInstance instance;\n    private FirstPersonCameraController camController;\n\n    public TerrainScreen(Main game) {\n        super(game);\n        int width = 50;\n        int depth = 50;\n        float scale = 2f;\n\n        ModelBuilder modelBuilder = new ModelBuilder();\n        modelBuilder.begin();\n\n        MeshPartBuilder builder = modelBuilder.part("terrain", GL20.GL_TRIANGLES,\n                VertexAttributes.Usage.Position | VertexAttributes.Usage.Normal | VertexAttributes.Usage.ColorUnpacked,\n                new Material());\n\n        float[][] heights = new float[width][depth];\n        for (int x = 0; x < width; x++) {\n            for (int z = 0; z < depth; z++) {\n                heights[x][z] = (float) (Math.sin(x * 0.2) + Math.cos(z * 0.2)) * 3f;\n            }\n        }\n\n        for (int x = 0; x < width - 1; x++) {\n            for (int z = 0; z < depth - 1; z++) {\n                float h = heights[x][z];\n                if (h > 2.5f) builder.setColor(Color.WHITE); // Nieve\n                else if (h > 0f) builder.setColor(Color.valueOf("8B4513")); // Tierra\n                else builder.setColor(Color.valueOf("228B22")); // Hierba\n\n                Vector3 v1 = new Vector3(x * scale, heights[x][z], z * scale);\n                Vector3 v2 = new Vector3((x + 1) * scale, heights[x + 1][z], z * scale);\n                Vector3 v3 = new Vector3((x + 1) * scale, heights[x + 1][z + 1], (z + 1) * scale);\n                Vector3 v4 = new Vector3(x * scale, heights[x][z + 1], (z + 1) * scale);\n\n                builder.triangle(v1, v3, v2);\n                builder.triangle(v1, v4, v3);\n            }\n        }\n\n        terrainModel = modelBuilder.end();\n        instance = new ModelInstance(terrainModel);\n        // Centrar el terreno\n        instance.transform.setToTranslation(-width * scale / 2f, 0, -depth * scale / 2f);\n\n        cam.position.set(0f, 20f, 30f);\n        cam.lookAt(0, 0, 0);\n        cam.up.set(0, 1, 0);\n        cam.update();\n\n        camController = new FirstPersonCameraController(cam);\n        camController.setDegreesPerPixel(0.5f);\n        camController.setVelocity(20f);\n    }\n\n    @Override\n    public void show() {\n        super.show();\n        multiplexer.addProcessor(camController);\n    }\n\n    @Override\n    public void render(float delta) {\n        super.render(delta);\n        camController.update(delta);\n        modelBatch.begin(cam);\n        modelBatch.render(instance, environment);\n        modelBatch.end();\n    }\n\n    @Override\n    public void dispose() {\n        if (terrainModel != null) terrainModel.dispose();\n        super.dispose();\n    }\n}`
    }
  ],
  11: [
    {
      title: "Tipos de Luces",
      content: [
        "LibGDX soporta varios tipos de luces básicas en su Environment. Comprender cómo funciona cada una es clave para dar atmósfera a tu escena.",
        "Añadimos las luces al objeto Environment que luego pasamos al ModelBatch durante el renderizado."
      ]
    },
    {
      title: "Luz Ambiental (AmbientLight)",
      content: [
        "Es una luz global que afecta a todo por igual en la escena.",
        "Evita que las sombras sean completamente negras, simulando la luz que rebota en el entorno."
      ],
      code: `// Luz ambiental gris oscura (R, G, B, Alpha)\nenvironment.set(new ColorAttribute(ColorAttribute.AmbientLight, 0.1f, 0.1f, 0.1f, 1f));`
    },
    {
      title: "Luz Direccional (DirectionalLight)",
      content: [
        "Simula una luz infinita y paralela, como el sol.",
        "Tiene dirección y color, pero no tiene una posición específica en el espacio."
      ],
      code: `// Luz direccional azulada tenue (R, G, B, dirX, dirY, dirZ)\nenvironment.add(new DirectionalLight().set(0.2f, 0.2f, 0.5f, -1f, -0.8f, -0.2f));`
    },
    {
      title: "Luz Puntual (PointLight)",
      content: [
        "Es una luz omnidireccional que emite desde un punto específico, como una bombilla.",
        "Tiene posición, color e intensidad. Su luz decae a medida que se aleja de la fuente."
      ],
      code: `// Bombilla roja a la izquierda (R, G, B, posX, posY, posZ, intensidad)\nenvironment.add(new PointLight().set(1f, 0f, 0f, -4f, 2f, 4f, 20f));`
    },
    {
      title: "Foco (SpotLight)",
      content: [
        "Emite luz en forma de cono, similar a una linterna o un reflector.",
        "Tiene posición, dirección, ángulo del cono (cutoffAngle) y decaimiento (exponent)."
      ],
      code: `// Linterna verde apuntando hacia abajo a la derecha\n// (R, G, B, posX, posY, posZ, dirX, dirY, dirZ, intensidad, cutoffAngle, exponent)\nenvironment.add(new SpotLight().set(0f, 1f, 0f, 4f, 5f, 0f, 0f, -1f, 0f, 20f, 10f, 25f));`
    },
    {
      title: "Añadiendo Modelos para la Luz",
      content: [
        "Para poder apreciar el efecto de las luces, necesitamos objetos en nuestra escena.",
        "Añadiremos un plano que sirva de suelo y varias primitivas (caja, esfera, cilindro) distribuidas en el espacio."
      ]
    },
    {
      title: "Límites de Luces",
      content: [
        "Por defecto, el shader estándar de LibGDX tiene un límite en la cantidad de luces que puede procesar simultáneamente (usualmente 5 direccionales, 5 puntuales).",
        "Si necesitas más luces, deberás usar shaders personalizados o técnicas como Deferred Rendering."
      ]
    },
    {
      title: "Código Completo: LightingScreen",
      content: [
        "Muestra cómo interactúan los diferentes tipos de luces con objetos básicos (caja, esfera, cilindro) sobre un plano."
      ],
      code: `package io.github.alfosua.exp3d.screens;\n\nimport com.badlogic.gdx.Gdx;\nimport com.badlogic.gdx.graphics.Color;\nimport com.badlogic.gdx.graphics.GL20;\nimport com.badlogic.gdx.graphics.VertexAttributes.Usage;\nimport com.badlogic.gdx.graphics.g3d.Environment;\nimport com.badlogic.gdx.graphics.g3d.Material;\nimport com.badlogic.gdx.graphics.g3d.Model;\nimport com.badlogic.gdx.graphics.g3d.ModelInstance;\nimport com.badlogic.gdx.graphics.g3d.attributes.ColorAttribute;\nimport com.badlogic.gdx.graphics.g3d.environment.DirectionalLight;\nimport com.badlogic.gdx.graphics.g3d.environment.PointLight;\nimport com.badlogic.gdx.graphics.g3d.environment.SpotLight;\nimport com.badlogic.gdx.graphics.g3d.utils.ModelBuilder;\nimport com.badlogic.gdx.utils.Array;\nimport io.github.alfosua.exp3d.Main;\n\npublic class LightingScreen extends Base3DScreen {\n    private Array<Model> models = new Array<Model>();\n    private Array<ModelInstance> instances = new Array<ModelInstance>();\n\n    public LightingScreen(Main game) {\n        super(game);\n        cam.position.set(0f, 5f, 15f);\n        cam.lookAt(0, 0, 0);\n        cam.update();\n\n        environment = new Environment();\n        environment.set(new ColorAttribute(ColorAttribute.AmbientLight, 0.1f, 0.1f, 0.1f, 1f));\n        // Sol azulado tenue\n        environment.add(new DirectionalLight().set(0.2f, 0.2f, 0.5f, -1f, -0.8f, -0.2f));\n        // Bombilla roja a la izquierda\n        environment.add(new PointLight().set(1f, 0f, 0f, -4f, 2f, 4f, 20f));\n        // Linterna verde apuntando hacia abajo a la derecha\n        environment.add(new SpotLight().set(0f, 1f, 0f, 4f, 5f, 0f, 0f, -1f, 0f, 20f, 10f, 25f));\n\n        ModelBuilder modelBuilder = new ModelBuilder();\n\n        Material floorMaterial = new Material(ColorAttribute.createDiffuse(Color.WHITE));\n        Model floor = modelBuilder.createBox(20f, 0.5f, 20f, floorMaterial, Usage.Position | Usage.Normal);\n        ModelInstance floorInstance = new ModelInstance(floor);\n        floorInstance.transform.setToTranslation(0f, -0.25f, 0f);\n        models.add(floor);\n        instances.add(floorInstance);\n\n        Material objMaterial = new Material(ColorAttribute.createDiffuse(Color.LIGHT_GRAY));\n        \n        Model box = modelBuilder.createBox(2f, 2f, 2f, objMaterial, Usage.Position | Usage.Normal);\n        ModelInstance boxInstance = new ModelInstance(box);\n        boxInstance.transform.setToTranslation(-4f, 1f, 0f);\n        models.add(box);\n        instances.add(boxInstance);\n\n        Model sphere = modelBuilder.createSphere(2.5f, 2.5f, 2.5f, 20, 20, objMaterial, Usage.Position | Usage.Normal);\n        ModelInstance sphereInstance = new ModelInstance(sphere);\n        sphereInstance.transform.setToTranslation(0f, 1.25f, 0f);\n        models.add(sphere);\n        instances.add(sphereInstance);\n\n        Model cylinder = modelBuilder.createCylinder(2f, 4f, 2f, 20, objMaterial, Usage.Position | Usage.Normal);\n        ModelInstance cylinderInstance = new ModelInstance(cylinder);\n        cylinderInstance.transform.setToTranslation(4f, 2f, 0f);\n        models.add(cylinder);\n        instances.add(cylinderInstance);\n    }\n\n    @Override\n    public void render(float delta) {\n        Gdx.gl.glViewport(0, 0, Gdx.graphics.getWidth(), Gdx.graphics.getHeight());\n        Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT | GL20.GL_DEPTH_BUFFER_BIT);\n\n        modelBatch.begin(cam);\n        modelBatch.render(instances, environment);\n        modelBatch.end();\n    }\n\n    @Override\n    public void dispose() {\n        super.dispose();\n        for (Model model : models) model.dispose();\n        models.clear();\n    }\n}`
    }
  ],
  12: [
    {
      title: "Sombras (Shadows)",
      content: [
        "Las sombras en tiempo real son costosas computacionalmente. En LibGDX, la forma más fácil y moderna de implementarlas es usando gdx-gltf y su SceneManager.",
        "Usaremos 'DirectionalShadowLight', que renderiza la escena desde el punto de vista de la luz hacia una textura especial llamada 'Shadow Map'."
      ]
    },
    {
      title: "Habilitando Shaders con Profundidad",
      content: [
        "Para que las sombras funcionen, el SceneManager necesita usar shaders que soporten renderizado de profundidad (PBRDepthShaderProvider).",
        "Configuramos el SceneManager pasándole los proveedores de shaders adecuados."
      ],
      code: `PBRShaderConfig config = new PBRShaderConfig();\nDepthShader.Config depthConfig = new DepthShader.Config();\n\nsceneManager = new SceneManager(\n    new PBRShaderProvider(config), \n    new PBRDepthShaderProvider(depthConfig)\n);`
    },
    {
      title: "Configurando DirectionalShadowLight",
      content: [
        "Creamos la luz de sombra especificando la resolución del Shadow Map (ej. 2048x2048) y el área que cubrirá la sombra (viewportWidth, viewportHeight).",
        "Luego la añadimos al environment y le indicamos al environment que use esta luz como su shadowMap."
      ],
      code: `// (ancho, alto, viewportWidth, viewportHeight, near, far)\nshadowLight = new DirectionalShadowLight(2048, 2048, 60f, 60f, 1f, 300f);\n// Color e intensidad (R, G, B, dirX, dirY, dirZ)\nshadowLight.set(0.8f, 0.8f, 0.8f, -1f, -0.8f, -0.2f);\n\nsceneManager.environment.add(shadowLight);\nsceneManager.environment.shadowMap = shadowLight;`
    },
    {
      title: "Añadiendo Modelos que Proyectan Sombras",
      content: [
        "Para ver las sombras en acción, necesitamos un suelo donde se proyecten y objetos que bloqueen la luz.",
        "Añadiremos un plano blanco como suelo, y una caja y una esfera flotando sobre él."
      ]
    },
    {
      title: "Código Completo: ShadowsScreen",
      content: [
        "Muestra objetos proyectando sombras dinámicas sobre un plano mientras rotan."
      ],
      code: `package io.github.alfosua.exp3d.screens;\n\nimport com.badlogic.gdx.Gdx;\nimport com.badlogic.gdx.graphics.Color;\nimport com.badlogic.gdx.graphics.GL20;\nimport com.badlogic.gdx.graphics.VertexAttributes.Usage;\nimport com.badlogic.gdx.graphics.g3d.Material;\nimport com.badlogic.gdx.graphics.g3d.Model;\nimport com.badlogic.gdx.graphics.g3d.ModelInstance;\nimport com.badlogic.gdx.graphics.g3d.attributes.ColorAttribute;\nimport com.badlogic.gdx.graphics.g3d.utils.ModelBuilder;\nimport com.badlogic.gdx.math.Vector3;\nimport com.badlogic.gdx.utils.Array;\nimport net.mgsx.gltf.scene3d.lights.DirectionalShadowLight;\nimport net.mgsx.gltf.scene3d.scene.Scene;\nimport net.mgsx.gltf.scene3d.scene.SceneManager;\nimport net.mgsx.gltf.scene3d.shaders.PBRShaderConfig;\nimport net.mgsx.gltf.scene3d.shaders.PBRShaderProvider;\nimport net.mgsx.gltf.scene3d.shaders.PBRDepthShaderProvider;\nimport com.badlogic.gdx.graphics.g3d.shaders.DepthShader;\nimport io.github.alfosua.exp3d.Main;\n\npublic class ShadowsScreen extends Base3DScreen {\n    private SceneManager sceneManager;\n    private DirectionalShadowLight shadowLight;\n    private Array<Model> models = new Array<Model>();\n    private Scene boxScene;\n    private Scene sphereScene;\n\n    public ShadowsScreen(Main game) {\n        super(game);\n        cam.position.set(0f, 10f, 15f);\n        cam.lookAt(0, 0, 0);\n        cam.update();\n\n        PBRShaderConfig config = new PBRShaderConfig();\n        DepthShader.Config depthConfig = new DepthShader.Config();\n        \n        sceneManager = new SceneManager(new PBRShaderProvider(config), new PBRDepthShaderProvider(depthConfig));\n        sceneManager.setCamera(cam);\n        sceneManager.setAmbientLight(0.3f);\n\n        shadowLight = new DirectionalShadowLight(2048, 2048, 60f, 60f, 1f, 300f);\n        shadowLight.set(0.8f, 0.8f, 0.8f, -1f, -0.8f, -0.2f);\n        sceneManager.environment.add(shadowLight);\n        sceneManager.environment.shadowMap = shadowLight;\n\n        ModelBuilder modelBuilder = new ModelBuilder();\n\n        Material floorMaterial = new Material(ColorAttribute.createDiffuse(Color.WHITE));\n        Model floor = modelBuilder.createBox(30f, 0.5f, 30f, floorMaterial, Usage.Position | Usage.Normal);\n        models.add(floor);\n        Scene floorScene = new Scene(new ModelInstance(floor));\n        floorScene.modelInstance.transform.setToTranslation(0f, -0.25f, 0f);\n        sceneManager.addScene(floorScene);\n\n        Material objMaterial = new Material(ColorAttribute.createDiffuse(Color.RED));\n        Model box = modelBuilder.createBox(2f, 2f, 2f, objMaterial, Usage.Position | Usage.Normal);\n        models.add(box);\n        boxScene = new Scene(new ModelInstance(box));\n        boxScene.modelInstance.transform.setToTranslation(-4f, 2f, 0f);\n        sceneManager.addScene(boxScene);\n\n        Material obj2Material = new Material(ColorAttribute.createDiffuse(Color.CYAN));\n        Model sphere = modelBuilder.createSphere(3f, 3f, 3f, 20, 20, obj2Material, Usage.Position | Usage.Normal);\n        models.add(sphere);\n        sphereScene = new Scene(new ModelInstance(sphere));\n        sphereScene.modelInstance.transform.setToTranslation(4f, 2f, -2f);\n        sceneManager.addScene(sphereScene);\n    }\n\n    @Override\n    public void render(float delta) {\n        Gdx.gl.glViewport(0, 0, Gdx.graphics.getWidth(), Gdx.graphics.getHeight());\n        Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT | GL20.GL_DEPTH_BUFFER_BIT);\n\n        boxScene.modelInstance.transform.rotate(Vector3.Y, 30f * delta);\n        sphereScene.modelInstance.transform.rotate(Vector3.X, 40f * delta);\n\n        sceneManager.update(delta);\n        sceneManager.render();\n    }\n\n    @Override\n    public void resize(int width, int height) {\n        super.resize(width, height);\n        sceneManager.updateViewport(width, height);\n    }\n\n    @Override\n    public void dispose() {\n        super.dispose();\n        if (sceneManager != null) sceneManager.dispose();\n        if (shadowLight != null) shadowLight.dispose();\n        for(Model m : models) m.dispose();\n        models.clear();\n    }\n}`
    }
  ],
  13: [
    {
      title: "Environment Skybox",
      content: [
        "Un Skybox es un cubo gigante que rodea la cámara y da la ilusión de un cielo o entorno lejano.",
        "Se compone de 6 texturas (arriba, abajo, izquierda, derecha, frente, atrás) formando un Cubemap.",
        "La cámara siempre está en el centro del Skybox, por lo que nunca puedes 'alcanzar' el cielo."
      ]
    },
    {
      title: "Generando un Cubemap Procedural",
      content: [
        "En lugar de cargar 6 imágenes externas, podemos generar las texturas del Cubemap en tiempo de ejecución usando Pixmap.",
        "Pixmap nos permite dibujar píxeles, líneas y rectángulos directamente en memoria antes de subirlos a la GPU.",
        "Esto es ideal para cielos dinámicos, gradientes suaves o patrones de prueba."
      ]
    },
    {
      title: "Creando un Cielo con Gradiente",
      content: [
        "Para crear un cielo realista, podemos dibujar un gradiente que interpole colores desde el cenit (arriba) hasta el horizonte (centro), y luego hacia el suelo (abajo).",
        "Usamos el método lerp() de la clase Color para mezclar los colores suavemente."
      ],
      code: `Pixmap sideFace = new Pixmap(resolution, resolution, Pixmap.Format.RGBA8888);\nfor (int y = 0; y < resolution; y++) {\n    Color c = new Color();\n    if (y < resolution / 2) {\n        // Del cenit al horizonte\n        float blend = (float) y / (resolution / 2 - 1);\n        c.set(colorZenith).lerp(colorHorizon, blend);\n    } else {\n        // Del horizonte al suelo\n        float blend = (float) (y - resolution / 2) / (resolution / 2 - 1);\n        c.set(colorHorizon).lerp(colorGround, blend);\n    }\n    sideFace.setColor(c);\n    sideFace.drawLine(0, y, resolution, y);\n}`
    },
    {
      title: "Aplicando el Skybox",
      content: [
        "Una vez que tenemos los Pixmaps para las caras del cubo (cielo, suelo y laterales), creamos el Cubemap.",
        "Luego, usamos SceneSkybox de gdx-gltf para aplicarlo fácilmente al SceneManager."
      ],
      code: `// Orden de las caras: positiveX, negativeX, positiveY, negativeY, positiveZ, negativeZ\nCubemap cubemap = new Cubemap(sideFace, sideFace, pSky, pGround, sideFace, sideFace);\n\nskybox = new SceneSkybox(cubemap);\nsceneManager.setSkyBox(skybox);`
    },
    {
      title: "Código Completo: SkyboxScreen",
      content: [
        "Crea un cielo con gradiente procedural (interpolando colores para el horizonte) y permite mirar alrededor con la cámara."
      ],
      code: `package io.github.alfosua.exp3d.screens;\n\nimport com.badlogic.gdx.Gdx;\nimport com.badlogic.gdx.graphics.Color;\nimport com.badlogic.gdx.graphics.Cubemap;\nimport com.badlogic.gdx.graphics.GL20;\nimport com.badlogic.gdx.graphics.Pixmap;\nimport com.badlogic.gdx.graphics.VertexAttributes.Usage;\nimport com.badlogic.gdx.graphics.g3d.Material;\nimport com.badlogic.gdx.graphics.g3d.Model;\nimport com.badlogic.gdx.graphics.g3d.ModelInstance;\nimport com.badlogic.gdx.graphics.g3d.utils.CameraInputController;\nimport com.badlogic.gdx.graphics.g3d.utils.ModelBuilder;\nimport com.badlogic.gdx.graphics.g3d.attributes.ColorAttribute;\nimport net.mgsx.gltf.scene3d.scene.Scene;\nimport net.mgsx.gltf.scene3d.scene.SceneManager;\nimport net.mgsx.gltf.scene3d.scene.SceneSkybox;\nimport io.github.alfosua.exp3d.Main;\n\npublic class SkyboxScreen extends Base3DScreen {\n    private SceneManager sceneManager;\n    private SceneSkybox skybox;\n    private Cubemap cubemap;\n    private Model box;\n    private Scene boxScene;\n    private CameraInputController camController;\n\n    public SkyboxScreen(Main game) {\n        super(game);\n        cam.position.set(0f, 0f, 5f);\n        cam.lookAt(0, 0, 0);\n        cam.update();\n\n        sceneManager = new SceneManager();\n        sceneManager.setCamera(cam);\n\n        int resolution = 512;\n        Color colorZenith = new Color(0.1f, 0.4f, 0.8f, 1f);\n        Color colorHorizon = new Color(0.8f, 0.9f, 1.0f, 1f);\n        Color colorGround = new Color(0.15f, 0.2f, 0.15f, 1f);\n        \n        // Cara superior (Cielo)\n        Pixmap pSky = new Pixmap(resolution, resolution, Pixmap.Format.RGBA8888);\n        pSky.setColor(colorZenith);\n        pSky.fill();\n        \n        // Cara inferior (Suelo)\n        Pixmap pGround = new Pixmap(resolution, resolution, Pixmap.Format.RGBA8888);\n        pGround.setColor(colorGround);\n        pGround.fill();\n        \n        // Caras laterales (Gradiente)\n        Pixmap sideFace = new Pixmap(resolution, resolution, Pixmap.Format.RGBA8888);\n        for (int y = 0; y < resolution; y++) {\n            Color c = new Color();\n            if (y < resolution / 2) {\n                float blend = (float) y / (resolution / 2 - 1);\n                c.set(colorZenith).lerp(colorHorizon, blend);\n            } else {\n                float blend = (float) (y - resolution / 2) / (resolution / 2 - 1);\n                c.set(colorHorizon).lerp(colorGround, blend);\n            }\n            sideFace.setColor(c);\n            sideFace.drawLine(0, y, resolution, y);\n        }\n\n        cubemap = new Cubemap(sideFace, sideFace, pSky, pGround, sideFace, sideFace);\n        skybox = new SceneSkybox(cubemap);\n        sceneManager.setSkyBox(skybox);\n\n        ModelBuilder modelBuilder = new ModelBuilder();\n        Material mat = new Material(ColorAttribute.createDiffuse(Color.WHITE));\n        box = modelBuilder.createBox(1f, 1f, 1f, mat, Usage.Position | Usage.Normal);\n        boxScene = new Scene(new ModelInstance(box));\n        sceneManager.addScene(boxScene);\n        \n        camController = new CameraInputController(cam);\n    }\n\n    @Override\n    public void show() {\n        super.show();\n        multiplexer.addProcessor(camController);\n    }\n\n    @Override\n    public void render(float delta) {\n        camController.update();\n        Gdx.gl.glViewport(0, 0, Gdx.graphics.getWidth(), Gdx.graphics.getHeight());\n        Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT | GL20.GL_DEPTH_BUFFER_BIT);\n\n        if (boxScene != null) boxScene.modelInstance.transform.rotate(1, 1, 0, 15f * delta);\n\n        sceneManager.update(delta);\n        sceneManager.render();\n    }\n\n    @Override\n    public void resize(int width, int height) {\n        super.resize(width, height);\n        sceneManager.updateViewport(width, height);\n    }\n\n    @Override\n    public void dispose() {\n        if (sceneManager != null) sceneManager.dispose();\n        if (skybox != null) skybox.dispose();\n        if (cubemap != null) cubemap.dispose();\n        if (box != null) box.dispose();\n        super.dispose();\n    }\n}`
    }
  ]
};
