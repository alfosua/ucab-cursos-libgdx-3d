import { Slide } from './slidesData';

export const slidesData3: Record<number, Slide[]> = {
  14: [
    {
      title: "Reflejos PBR (IBL)",
      content: [
        "Image-Based Lighting (IBL) es una técnica que usa una imagen (como un Cubemap) para iluminar una escena y generar reflejos realistas.",
        "En lugar de calcular luces individuales, el motor muestrea la imagen del entorno para determinar cuánta luz y de qué color llega a cada punto del objeto."
      ]
    },
    {
      title: "¿Qué es un Cubemap?",
      content: [
        "Un Cubemap es una textura compuesta por 6 imágenes cuadradas que representan las caras de un cubo alrededor de la escena.",
        "Se usa para simular el entorno lejano y para calcular los reflejos en los objetos metálicos o brillantes."
      ]
    },
    {
      title: "Generando un Cubemap (Tablero de Ajedrez)",
      content: [
        "Para visualizar claramente cómo se deforman los reflejos, generaremos un Cubemap procedural con un patrón de tablero de ajedrez usando Pixmap.",
        "Dibujamos cuadrados blancos y azules alternados en las caras laterales y superior, y un gris oscuro en la inferior."
      ],
      code: `Pixmap p = new Pixmap(256, 256, Pixmap.Format.RGBA8888);\nfor(int x=0; x<256; x+=64) {\n    for(int y=0; y<256; y+=64) {\n        if(( (x/64) + (y/64) ) % 2 == 0) p.setColor(Color.WHITE);\n        else p.setColor(Color.ROYAL);\n        p.fillRectangle(x, y, 64, 64);\n    }\n}\n\nPixmap pGround = new Pixmap(256, 256, Pixmap.Format.RGBA8888);\npGround.setColor(Color.DARK_GRAY);\npGround.fill();\n\ncubemap = new Cubemap(p, p, p, pGround, p, p);`
    },
    {
      title: "Configurando IBL en gdx-gltf",
      content: [
        "Para usar IBL, necesitamos un Cubemap. Luego, configuramos el entorno del SceneManager para que use este Cubemap tanto para la luz especular (reflejos) como difusa (iluminación general)."
      ],
      code: `// Configurar reflexiones de entorno de iluminación basada en imágenes PBR\nsceneManager.environment.set(PBRCubemapAttribute.createSpecularEnv(cubemap));\n\n// Proporcionar ambiente difuso que coincida con el cubemap\nsceneManager.environment.set(PBRCubemapAttribute.createDiffuseEnv(cubemap));\n\n// Reducir luz ambiental plana porque IBL proporcionará iluminación\nsceneManager.setAmbientLight(0.02f);`
    },
    {
      title: "Materiales Metálicos y Rugosidad",
      content: [
        "Para que un objeto refleje el entorno, su material debe ser metálico y tener baja rugosidad (roughness).",
        "Un metal puro (metallic = 1.0) con rugosidad 0.0 será un espejo perfecto. Una rugosidad mayor difuminará el reflejo."
      ],
      code: `Material mat = new Material();\nmat.set(PBRColorAttribute.createBaseColorFactor(Color.GOLD));\nmat.set(PBRFloatAttribute.createMetallic(1.0f)); // 100% metálico como un espejo\nmat.set(PBRFloatAttribute.createRoughness(0.1f)); // Ligera rugosidad para evitar artefactos negros puros`
    },
    {
      title: "Código Completo: ReflectionScreen",
      content: [
        "Crea un entorno con un patrón de tablero de ajedrez para visualizar claramente cómo se deforman los reflejos en una esfera dorada metálica."
      ],
      code: `package io.github.alfosua.exp3d.screens;\n\nimport com.badlogic.gdx.Gdx;\nimport com.badlogic.gdx.graphics.Color;\nimport com.badlogic.gdx.graphics.Cubemap;\nimport com.badlogic.gdx.graphics.GL20;\nimport com.badlogic.gdx.graphics.Pixmap;\nimport com.badlogic.gdx.graphics.VertexAttributes.Usage;\nimport com.badlogic.gdx.graphics.g3d.Material;\nimport com.badlogic.gdx.graphics.g3d.Model;\nimport com.badlogic.gdx.graphics.g3d.ModelInstance;\nimport com.badlogic.gdx.graphics.g3d.utils.ModelBuilder;\nimport com.badlogic.gdx.math.Vector3;\nimport net.mgsx.gltf.scene3d.attributes.PBRColorAttribute;\nimport net.mgsx.gltf.scene3d.attributes.PBRFloatAttribute;\nimport net.mgsx.gltf.scene3d.attributes.PBRCubemapAttribute;\nimport net.mgsx.gltf.scene3d.scene.Scene;\nimport net.mgsx.gltf.scene3d.scene.SceneManager;\nimport net.mgsx.gltf.scene3d.scene.SceneSkybox;\nimport io.github.alfosua.exp3d.Main;\n\npublic class ReflectionScreen extends Base3DScreen {\n    private SceneManager sceneManager;\n    private SceneSkybox skybox;\n    private Cubemap cubemap;\n    private Model sphere;\n\n    public ReflectionScreen(Main game) {\n        super(game);\n        cam.position.set(0f, 0f, 5f);\n        cam.lookAt(0, 0, 0);\n        cam.update();\n\n        sceneManager = new SceneManager();\n        sceneManager.setCamera(cam);\n\n        // Hacemos un cubemap estilo tablero de ajedrez para ver realmente las distorsiones de la reflexión\n        Pixmap p = new Pixmap(256, 256, Pixmap.Format.RGBA8888);\n        for(int x=0; x<256; x+=64) {\n            for(int y=0; y<256; y+=64) {\n                if(( (x/64) + (y/64) ) % 2 == 0) {\n                    p.setColor(Color.WHITE);\n                } else {\n                    p.setColor(Color.ROYAL);\n                }\n                p.fillRectangle(x, y, 64, 64);\n            }\n        }\n\n        Pixmap pGround = new Pixmap(256, 256, Pixmap.Format.RGBA8888);\n        pGround.setColor(Color.DARK_GRAY);\n        pGround.fill();\n\n        cubemap = new Cubemap(p, p, p, pGround, p, p);\n        skybox = new SceneSkybox(cubemap);\n        sceneManager.setSkyBox(skybox);\n\n        // Configurar reflexiones de entorno de iluminación basada en imágenes PBR\n        sceneManager.environment.set(PBRCubemapAttribute.createSpecularEnv(cubemap));\n        // Proporcionar ambiente difuso que coincida con el cubemap\n        sceneManager.environment.set(PBRCubemapAttribute.createDiffuseEnv(cubemap));\n\n        sceneManager.setAmbientLight(0.02f); // reducir luz ambiental plana porque IBL proporcionará iluminación\n\n        ModelBuilder modelBuilder = new ModelBuilder();\n        Material mat = new Material();\n        mat.set(PBRColorAttribute.createBaseColorFactor(Color.GOLD));\n        mat.set(PBRFloatAttribute.createMetallic(1.0f)); // 100% metálico como un espejo\n        mat.set(PBRFloatAttribute.createRoughness(0.1f)); // Ligera rugosidad para evitar artefactos negros puros\n\n        sphere = modelBuilder.createSphere(2.5f, 2.5f, 2.5f, 40, 40, mat, Usage.Position | Usage.Normal);\n        sceneManager.addScene(new Scene(new ModelInstance(sphere)));\n    }\n\n    @Override\n    public void render(float delta) {\n        Gdx.gl.glViewport(0, 0, Gdx.graphics.getWidth(), Gdx.graphics.getHeight());\n        Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT | GL20.GL_DEPTH_BUFFER_BIT);\n\n        // Rotar la cámara alrededor para ver cómo se deforman las reflexiones\n        cam.rotateAround(Vector3.Zero, Vector3.Y, 20f * delta);\n        cam.update();\n\n        sceneManager.update(delta);\n        sceneManager.render();\n    }\n\n    @Override\n    public void resize(int width, int height) {\n        super.resize(width, height);\n        sceneManager.updateViewport(width, height);\n    }\n\n    @Override\n    public void dispose() {\n        if (sceneManager != null) sceneManager.dispose();\n        if (skybox != null) skybox.dispose();\n        if (cubemap != null) cubemap.dispose();\n        if (sphere != null) sphere.dispose();\n        super.dispose();\n    }\n}`
    }
  ],
  15: [
    {
      title: "Renderizado Fotorrealista",
      content: [
        "El renderizado fotorrealista busca simular cómo la luz interactúa con los materiales en el mundo real.",
        "Para lograr esto en LibGDX, usamos materiales PBR (Physically Based Rendering) y modelos exportados en formato GLTF/GLB."
      ]
    },
    {
      title: "Configuración Básica PBR",
      content: [
        "Para que los materiales PBR se vean correctamente, necesitamos una buena iluminación.",
        "Una luz direccional fuerte (como el sol) y una luz ambiental adecuada son esenciales para resaltar los detalles del modelo."
      ],
      code: `// Configuración estándar para PBR\nDirectionalLightEx light = new DirectionalLightEx();\nlight.direction.set(1, -2, -1).nor();\nlight.color.set(Color.WHITE);\nsceneManager.environment.add(light);\n\n// Luz ambiental para rellenar las sombras\nsceneManager.setAmbientLight(1f);`
    },
    {
      title: "Cargando Modelos GLB",
      content: [
        "Los archivos .glb (GLTF binario) son ideales para PBR porque empaquetan la geometría, texturas (color, normales, rugosidad, metalicidad) y animaciones en un solo archivo.",
        "En el constructor de nuestra pantalla, usamos GLBLoader de gdx-gltf para cargarlos fácilmente."
      ],
      code: `// Cargar modelo fotorrealista desde el constructor\nSceneAsset sceneAsset = new GLBLoader().load(Gdx.files.internal("DamagedHelmet.glb"));\nScene scene = new Scene(sceneAsset.scene);\nsceneManager.addScene(scene);`
    },
    {
      title: "Código Completo: PbrGltfScreen",
      content: [
        "Carga un modelo GLB fotorrealista (como el clásico DamagedHelmet) y lo rota lentamente para apreciar cómo la luz interactúa con sus diferentes materiales."
      ],
      code: `package io.github.alfosua.exp3d.screens;\n\nimport com.badlogic.gdx.Gdx;\nimport com.badlogic.gdx.graphics.Color;\nimport com.badlogic.gdx.graphics.GL20;\nimport io.github.alfosua.exp3d.Main;\nimport net.mgsx.gltf.scene3d.lights.DirectionalLightEx;\nimport net.mgsx.gltf.scene3d.scene.Scene;\nimport net.mgsx.gltf.scene3d.scene.SceneManager;\nimport net.mgsx.gltf.loaders.glb.GLBLoader;\nimport net.mgsx.gltf.scene3d.scene.SceneAsset;\nimport com.badlogic.gdx.graphics.g3d.RenderableProvider;\n\npublic class PbrGltfScreen extends Base3DScreen {\n    private SceneManager sceneManager;\n    private SceneAsset sceneAsset;\n    private Scene scene;\n\n    public PbrGltfScreen(Main game) {\n        super(game);\n\n        sceneManager = new SceneManager();\n        sceneManager.setCamera(cam);\n\n        // Configuración estándar para PBR\n        DirectionalLightEx light = new DirectionalLightEx();\n        light.direction.set(1, -2, -1).nor();\n        light.color.set(Color.WHITE);\n        sceneManager.environment.add(light);\n\n        sceneManager.setAmbientLight(1f);\n\n        // Cargar modelo fotorrealista\n        sceneAsset = new GLBLoader().load(Gdx.files.internal("DamagedHelmet.glb"));\n        scene = new Scene(sceneAsset.scene);\n        sceneManager.addScene(scene);\n\n        cam.position.set(0f, 0f, 3f);\n        cam.lookAt(0, 0, 0);\n        cam.update();\n    }\n\n    @Override\n    public void render(float delta) {\n        Gdx.gl.glViewport(0, 0, Gdx.graphics.getWidth(), Gdx.graphics.getHeight());\n        Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT | GL20.GL_DEPTH_BUFFER_BIT);\n\n        // Rotar las escenas alrededor del eje Y lentamente\n        for (RenderableProvider provider : sceneManager.getRenderableProviders()) {\n            if (provider instanceof Scene) {\n                ((Scene) provider).modelInstance.transform.rotate(0, 1, 0, 15f * delta);\n            }\n        }\n\n        sceneManager.update(delta);\n        sceneManager.render();\n    }\n\n    @Override\n    public void resize(int width, int height) {\n        super.resize(width, height);\n        sceneManager.updateViewport(width, height);\n    }\n\n    @Override\n    public void dispose() {\n        if (sceneManager != null) {\n            sceneManager.dispose();\n            sceneManager = null;\n        }\n        if (sceneAsset != null) {\n            sceneAsset.dispose();\n            sceneAsset = null;\n        }\n        super.dispose();\n    }\n}`
    }
  ]
};
