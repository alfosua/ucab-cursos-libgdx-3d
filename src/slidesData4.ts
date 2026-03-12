import { Slide } from './slidesData';

export const slidesData4: Record<number, Slide[]> = {
  16: [
    {
      title: "Shaders Personalizados (Interfaz Shader)",
      content: [
        "LibGDX permite crear shaders desde cero implementando la interfaz 'Shader'. Esto nos da un control total sobre el pipeline de renderizado.",
        "A diferencia de usar DefaultShader, aquí gestionamos manualmente los uniforms, atributos y el estado de OpenGL."
      ]
    },
    {
      title: "Vertex Shader: Posición y Pasado de Datos",
      content: [
        "El Vertex Shader calcula la posición de los vértices y prepara datos para el Fragment Shader.",
        "En este ejemplo, calculamos la posición en el espacio del mundo y la pasamos como 'v_pos' para usarla en efectos de color."
      ],
      code: `attribute vec3 a_position;
uniform mat4 u_projViewTrans;
uniform mat4 u_worldTrans;
varying vec3 v_pos;

void main() {
    vec4 pos = u_worldTrans * vec4(a_position, 1.0);
    v_pos = pos.xyz;
    gl_Position = u_projViewTrans * pos;
}`
    },
    {
      title: "Fragment Shader: Animación Psicodélica",
      content: [
        "El Fragment Shader define el color de cada píxel. Usamos la variable 'u_time' para animar los colores basándonos en funciones trigonométricas.",
        "El color resultante depende de la posición del píxel en el espacio 3D y del tiempo transcurrido."
      ],
      code: `#ifdef GL_ES
precision mediump float;
#endif
uniform float u_time;
varying vec3 v_pos;

void main() {
    float r = sin(v_pos.x * 2.0 + u_time * 2.0) * 0.5 + 0.5;
    float g = cos(v_pos.y * 3.0 + u_time) * 0.5 + 0.5;
    float b = sin(v_pos.z * 1.5 - u_time * 1.5) * 0.5 + 0.5;
    gl_FragColor = vec4(r, g, b, 1.0);
}`
    },
    {
      title: "Implementación de la Interfaz Shader",
      content: [
        "Debemos implementar métodos clave: 'init' para obtener locaciones de uniforms, 'begin' para configurar el estado global, y 'render' para dibujar cada objeto.",
        "Usamos 'RenderContext' para configurar pruebas de profundidad y culling de forma eficiente."
      ],
      code: `Shader customShader = new Shader() {
    int u_projViewTrans, u_worldTrans, u_time;
    float time;

    @Override
    public void init() {
        u_projViewTrans = shaderProgram.getUniformLocation("u_projViewTrans");
        u_worldTrans = shaderProgram.getUniformLocation("u_worldTrans");
        u_time = shaderProgram.getUniformLocation("u_time");
    }

    @Override
    public void begin(Camera camera, RenderContext context) {
        shaderProgram.bind();
        shaderProgram.setUniformMatrix(u_projViewTrans, camera.combined);
        time += Gdx.graphics.getDeltaTime();
        shaderProgram.setUniformf(u_time, time);
        context.setDepthTest(GL20.GL_LEQUAL);
        context.setCullFace(GL20.GL_BACK);
    }

    @Override
    public void render(Renderable renderable) {
        shaderProgram.setUniformMatrix(u_worldTrans, renderable.worldTransform);
        renderable.meshPart.render(shaderProgram);
    }
    // ... otros métodos ...
};`
    },
    {
      title: "Uso de DefaultShaderProvider",
      content: [
        "Para integrar nuestro shader en el sistema de renderizado de LibGDX, creamos un 'DefaultShaderProvider'.",
        "Este proveedor devolverá nuestra instancia de shader personalizada cuando el ModelBatch intente renderizar un objeto."
      ],
      code: `customBatch = new ModelBatch(new DefaultShaderProvider() {
    @Override
    protected Shader createShader(Renderable renderable) {
        return customShader;
    }
});`
    },
    {
      title: "Código Completo: CustomShaderScreen",
      content: [
        "Este código muestra cómo crear una esfera con un shader animado que cambia de color dinámicamente."
      ],
      code: `package io.github.alfosua.exp3d.screens;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.Camera;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.VertexAttributes;
import com.badlogic.gdx.graphics.g3d.Material;
import com.badlogic.gdx.graphics.g3d.Model;
import com.badlogic.gdx.graphics.g3d.ModelBatch;
import com.badlogic.gdx.graphics.g3d.ModelInstance;
import com.badlogic.gdx.graphics.g3d.Renderable;
import com.badlogic.gdx.graphics.g3d.Shader;
import com.badlogic.gdx.graphics.g3d.attributes.ColorAttribute;
import com.badlogic.gdx.graphics.g3d.utils.ModelBuilder;
import com.badlogic.gdx.graphics.g3d.utils.RenderContext;
import com.badlogic.gdx.graphics.g3d.utils.DefaultShaderProvider;
import com.badlogic.gdx.graphics.glutils.ShaderProgram;
import io.github.alfosua.exp3d.Main;

public class CustomShaderScreen extends Base3DScreen {
    private Model model;
    private ModelInstance instance;
    private ShaderProgram shaderProgram;
    private ModelBatch customBatch;

    private String vert = "attribute vec3 a_position;\\n" +
            "uniform mat4 u_projViewTrans;\\n" +
            "uniform mat4 u_worldTrans;\\n" +
            "varying vec3 v_pos;\\n" +
            "void main() {\\n" +
            "    vec4 pos = u_worldTrans * vec4(a_position, 1.0);\\n" +
            "    v_pos = pos.xyz;\\n" +
            "    gl_Position = u_projViewTrans * pos;\\n" +
            "}";

    private String frag = "#ifdef GL_ES\\n" +
            "precision mediump float;\\n" +
            "#endif\\n" +
            "uniform float u_time;\\n" +
            "varying vec3 v_pos;\\n" +
            "void main() {\\n" +
            "    float r = sin(v_pos.x * 2.0 + u_time * 2.0) * 0.5 + 0.5;\\n" +
            "    float g = cos(v_pos.y * 3.0 + u_time) * 0.5 + 0.5;\\n" +
            "    float b = sin(v_pos.z * 1.5 - u_time * 1.5) * 0.5 + 0.5;\\n" +
            "    gl_FragColor = vec4(r, g, b, 1.0);\\n" +
            "}";

    public CustomShaderScreen(Main game) {
        super(game);

        shaderProgram = new ShaderProgram(vert, frag);
        if (!shaderProgram.isCompiled()) {
            Gdx.app.error("CustomShader", "Shader compilation failed:\\n" + shaderProgram.getLog());
        }

        Shader customShader = new Shader() {
            int u_projViewTrans;
            int u_worldTrans;
            int u_time;
            float time;

            @Override
            public void init() {
                u_projViewTrans = shaderProgram.getUniformLocation("u_projViewTrans");
                u_worldTrans = shaderProgram.getUniformLocation("u_worldTrans");
                u_time = shaderProgram.getUniformLocation("u_time");
            }

            @Override
            public int compareTo(Shader other) { return 0; }

            @Override
            public boolean canRender(Renderable instance) { return true; }

            @Override
            public void begin(Camera camera, RenderContext context) {
                shaderProgram.bind();
                shaderProgram.setUniformMatrix(u_projViewTrans, camera.combined);
                time += Gdx.graphics.getDeltaTime();
                shaderProgram.setUniformf(u_time, time);
                context.setDepthTest(GL20.GL_LEQUAL);
                context.setCullFace(GL20.GL_BACK);
            }

            @Override
            public void render(Renderable renderable) {
                shaderProgram.setUniformMatrix(u_worldTrans, renderable.worldTransform);
                renderable.meshPart.render(shaderProgram);
            }

            @Override
            public void end() {}

            @Override
            public void dispose() { }
        };

        customShader.init();

        customBatch = new ModelBatch(new DefaultShaderProvider() {
            @Override
            protected Shader createShader(Renderable renderable) {
                return customShader;
            }
        });

        ModelBuilder modelBuilder = new ModelBuilder();
        model = modelBuilder.createSphere(5f, 5f, 5f, 32, 32,
                new Material(),
                VertexAttributes.Usage.Position);

        instance = new ModelInstance(model);
        
        cam.position.set(10f, 10f, 10f);
        cam.lookAt(0,0,0);
        cam.update();
    }

    @Override
    public void render(float delta) {
        Gdx.gl.glViewport(0, 0, Gdx.graphics.getWidth(), Gdx.graphics.getHeight());
        Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT | GL20.GL_DEPTH_BUFFER_BIT);

        customBatch.begin(cam);
        customBatch.render(instance);
        customBatch.end();
    }

    @Override
    public void dispose() {
        if (model != null) {
            model.dispose();
            model = null;
        }
        if (customBatch != null) {
            customBatch.dispose();
            customBatch = null;
        }
        if (shaderProgram != null) {
            shaderProgram.dispose();
            shaderProgram = null;
        }
        super.dispose();
    }
}
`
    }
  ],
  17: [
    {
      title: "Cell Shading (Toon Shading)",
      content: [
        "El Cell Shading es una técnica de renderizado no fotorrealista diseñada para hacer que los gráficos 3D parezcan dibujados a mano o estilo cómic/anime.",
        "En lugar de un gradiente suave de luz a sombra, se usan bandas de color discretas (posterización) para simular el sombreado de dibujos animados."
      ]
    },
    {
      title: "Interceptando el Shader PBR",
      content: [
        "gdx-gltf permite obtener el código fuente de sus shaders por defecto. Podemos obtener el Fragment Shader PBR y modificarlo antes de compilarlo.",
        "Esto es más eficiente que escribir un shader completo desde cero, ya que mantenemos toda la lógica de materiales, luces y huesos de gdx-gltf."
      ],
      code: `// Obtener el código fuente del fragment shader por defecto
String defaultFrag = PBRShaderProvider.getDefaultFragmentShader();

// Reemplazar el cálculo final del color con nuestra lógica toon
defaultFrag = defaultFrag.replace(
    "vec3 color = ambientColor + f_diffuse + f_specular;",
    "// ... nuestra lógica toon aquí ... "
);`
    },
    {
      title: "Lógica de Posterización",
      content: [
        "Para lograr el efecto 'toon', calculamos la intensidad de la luz recibida y la forzamos a valores específicos (escalones).",
        "También podemos modificar cómo se aplican los brillos especulares para que se sientan más estilizados."
      ],
      code: `vec3 rawLight = f_diffuse / max(baseColor.rgb, 0.001);
float lightInt = max(max(rawLight.r, rawLight.g), rawLight.b);

// Definir escalones de iluminación
float toonLight = lightInt > 0.4 ? 1.1 : (lightInt > 0.1 ? 0.7 : 0.4);

// Aplicar el color base multiplicado por el escalón
vec3 color = ambientColor + (baseColor.rgb * toonLight);

// Añadir brillo especular simplificado
float specInt = max(max(f_specular.r, f_specular.g), f_specular.b);
if (specInt > 0.1) color += mix(baseColor.rgb, vec3(1.0), 0.3);`
    },
    {
      title: "Configuración del SceneManager",
      content: [
        "Una vez modificado el string del shader, lo asignamos a un PBRShaderConfig y lo pasamos al SceneManager a través de un PBRShaderProvider.",
        "Es importante configurar el número de huesos (numBones) si el modelo tiene animaciones complejas."
      ],
      code: `PBRShaderConfig config = new PBRShaderConfig();
config.numBones = 60; // Necesario para modelos con muchos huesos
config.fragmentShader = defaultFrag;

// Configurar también el shader de profundidad para sombras
DepthShader.Config depthConfig = new DepthShader.Config();
depthConfig.numBones = 60;

sceneManager = new SceneManager(
    new PBRShaderProvider(config), 
    new PBRDepthShaderProvider(depthConfig)
);`
    },
    {
      title: "Carga del Modelo Anime (Miku)",
      content: [
        "Para este ejemplo, cargamos un modelo en formato GLB. Aunque gdx-gltf soporta muchos modelos, algunos archivos VRM complejos pueden requerir ajustes.",
        "Usamos GLBLoader para cargar el archivo y lo añadimos al SceneManager. También aplicamos un escalado si el modelo original es muy grande."
      ],
      code: `// Cargar el asset del modelo (miku.glb)
sceneAsset = new GLBLoader().load(Gdx.files.internal("miku.glb"));

// Crear la escena a partir del asset
scene = new Scene(sceneAsset.scene);

// Escalar el modelo (0.1 = 10% de su tamaño original)
scene.modelInstance.transform.scale(0.1f, 0.1f, 0.1f);

// Añadir a la gestión del SceneManager
sceneManager.addScene(scene);`
    },
    {
      title: "Código Completo: CellShadingScreen",
      content: [
        "Este ejemplo carga un modelo GLB (Miku) y aplica el shader modificado para lograr un estilo anime."
      ],
      code: `package io.github.alfosua.exp3d.screens;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.Camera;
import com.badlogic.gdx.graphics.g3d.Renderable;
import com.badlogic.gdx.graphics.g3d.Shader;
import com.badlogic.gdx.graphics.g3d.attributes.ColorAttribute;
import com.badlogic.gdx.graphics.g3d.shaders.DefaultShader;
import com.badlogic.gdx.graphics.g3d.utils.DefaultShaderProvider;
import net.mgsx.gltf.loaders.glb.GLBLoader;
import net.mgsx.gltf.scene3d.scene.Scene;
import net.mgsx.gltf.scene3d.scene.SceneAsset;
import net.mgsx.gltf.scene3d.scene.SceneManager;
import net.mgsx.gltf.scene3d.lights.DirectionalLightEx;
import net.mgsx.gltf.scene3d.shaders.PBRDepthShaderProvider;
import net.mgsx.gltf.scene3d.shaders.PBRShaderConfig;
import com.badlogic.gdx.graphics.g3d.shaders.DepthShader;
import net.mgsx.gltf.scene3d.shaders.PBRShaderProvider;
import io.github.alfosua.exp3d.Main;

public class CellShadingScreen extends Base3DScreen {
    private SceneManager sceneManager;
    private SceneAsset sceneAsset;
    private Scene scene;

    public CellShadingScreen(Main game) {
        super(game);

        // En lugar de escribir un shader toon GLSL personalizado completo que entienda los huesos GLTF,
        // Podemos anular PBRShaderProvider e inyectar GLSL personalizado, o simplemente podemos
        // usar un fragmento de shader de fragmentos personalizado para posterizar la salida del shader PBR.
        // Para un verdadero ejemplo de "cell shading", modificamos el shader de fragmentos
        // para posterizar el color final. Inyectamos un fragmento al final del shader.
        PBRShaderConfig config = new PBRShaderConfig();
        config.numBones = 60; // El modelo de Miku requiere 52 huesos

        // Interceptamos de forma segura el cálculo del color de iluminación sin romper la estructura del bloque \`#if\` de GLSL
        String defaultFrag = PBRShaderProvider.getDefaultFragmentShader();

        defaultFrag = defaultFrag.replace(
            "vec3 color = ambientColor + f_diffuse + f_specular;",
            "vec3 rawLight = f_diffuse / max(baseColor.rgb, 0.001);\\n" +
            "    float lightInt = max(max(rawLight.r, rawLight.g), rawLight.b);\\n" +
            "    float toonLight = lightInt > 0.4 ? 1.1 : (lightInt > 0.1 ? 0.7 : 0.4);\\n" +
            "    vec3 color = ambientColor + (baseColor.rgb * toonLight);\\n" +
            "    float specInt = max(max(f_specular.r, f_specular.g), f_specular.b);\\n" +
            "    if (specInt > 0.1) color += mix(baseColor.rgb, vec3(1.0), 0.3);"
        );

        config.fragmentShader = defaultFrag;

        DepthShader.Config depthConfig = new DepthShader.Config();
        depthConfig.numBones = 60;

        // Proporcionar la configuración personalizada al SceneManager
        sceneManager = new SceneManager(new PBRShaderProvider(config), new PBRDepthShaderProvider(depthConfig));
        sceneManager.setCamera(cam);

        sceneManager.setAmbientLight(0.4f);

        DirectionalLightEx light = new DirectionalLightEx();
        light.direction.set(1, -1, -0.5f).nor();
        light.color.set(Color.WHITE);
        sceneManager.environment.add(light);

        // Nota: Los archivos VRM son en realidad archivos GLB. Podemos usar GLBLoader.
        // Sin embargo, gdx-gltf lanza errores de análisis JSON en algunas extensiones VRM avanzadas.
        // En su lugar, usaremos un modelo de anime estándar miku.glb.
        sceneAsset = new GLBLoader().load(Gdx.files.internal("miku.glb"));
        scene = new Scene(sceneAsset.scene);

        // El modelo es demasiado grande, lo escalamos hacia abajo
        scene.modelInstance.transform.scale(0.1f, 0.1f, 0.1f);

        sceneManager.addScene(scene);

        cam.position.set(0f, 1f, 2f);
        cam.lookAt(0f, 1f, 0f);
        cam.update();
    }

    @Override
    public void render(float delta) {
        Gdx.gl.glViewport(0, 0, Gdx.graphics.getWidth(), Gdx.graphics.getHeight());
        Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT | GL20.GL_DEPTH_BUFFER_BIT);

        // Rotar lentamente la escena
        scene.modelInstance.transform.rotate(0, 1, 0, 15f * delta);

        sceneManager.update(delta);
        sceneManager.render();
    }

    @Override
    public void resize(int width, int height) {
        super.resize(width, height);
        sceneManager.updateViewport(width, height);
    }

    @Override
    public void dispose() {
        if (sceneManager != null) {
            sceneManager.dispose();
            sceneManager = null;
        }
        if (sceneAsset != null) {
            sceneAsset.dispose();
            sceneAsset = null;
        }
        super.dispose();
    }
}`
    }
  ]
};
