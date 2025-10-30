# 🚀 Space Flyer - Juego Espacial

Un emocionante juego espacial desarrollado con React y TypeScript donde controlas un cohete que debe esquivar asteroides y recoger monedas.

## 🎮 Características

- **Sistema de registro de jugadores**: Guarda tu progreso y compite con otros jugadores
- **Recolección de monedas**: Gana puntos extra recogiendo monedas doradas
- **Ranking de jugadores**: Consulta el leaderboard para ver los mejores puntajes
- **Estadísticas personales**: Lleva un registro de tus partidas, mejor puntaje y monedas totales
- **Responsive**: Juega en cualquier dispositivo

## 🛠️ Tecnologías

- React 18
- TypeScript
- Vite
- Canvas API para gráficos
- LocalStorage para persistencia de datos

## 📦 Instalación

1. Instala las dependencias:
```bash
npm install
```

2. Inicia el servidor de desarrollo:
```bash
npm run dev
```

3. Abre tu navegador en `http://localhost:5173`

## 🎯 Cómo Jugar

1. **Registro**: Ingresa tu nombre para comenzar a jugar
2. **Controles**: 
   - Haz clic con el mouse o presiona la barra espaciadora para hacer volar el cohete
   - El cohete cae por gravedad, así que debes mantenerlo en el aire
3. **Objetivo**: 
   - Esquiva los asteroides
   - Recoge monedas para ganar +5 puntos extra
   - Intenta superar tu mejor puntaje
4. **Ranking**: Consulta tu posición en el leaderboard

## 🏗️ Estructura del Proyecto

```
space-flyer-game/
├── src/
│   ├── components/
│   │   ├── Game.tsx           # Componente principal del juego
│   │   ├── LoginScreen.tsx    # Pantalla de registro
│   │   ├── GameOver.tsx       # Pantalla de fin de juego
│   │   └── Leaderboard.tsx    # Tabla de clasificación
│   ├── utils/
│   │   └── localStorage.ts    # Gestión de datos del jugador
│   ├── types.ts               # Definiciones de TypeScript
│   ├── App.tsx                # Componente raíz
│   ├── main.tsx               # Punto de entrada
│   └── index.css              # Estilos globales
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 📊 Sistema de Puntuación

- **+1 punto**: Por cada asteroide superado
- **+5 puntos**: Por cada moneda recolectada
- Los puntajes se guardan automáticamente en tu perfil de jugador

## 🏆 Estadísticas del Jugador

Cada jugador tiene un perfil que registra:
- Mejor puntuación histórica
- Total de monedas recolectadas
- Número de partidas jugadas

## 🚀 Build para Producción

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`.

## 📝 Comandos Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Genera el build de producción
- `npm run preview` - Previsualiza el build de producción

## 🎨 Personalización

Puedes modificar los siguientes parámetros en el componente `Game.tsx`:
- Velocidad de caída del cohete (gravity)
- Fuerza del salto (jump)
- Tamaño del espacio entre asteroides (ASTEROID_GAP)
- Frecuencia de aparición de asteroides y monedas

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso personal y educativo.

---

¡Disfruta el juego y que tengas un buen vuelo! 🚀✨
