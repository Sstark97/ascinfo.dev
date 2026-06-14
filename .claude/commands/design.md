# Quick Design

Lanza el agente `ux-ui-designer` para diseñar una pantalla, componente o flujo de usuario.

## Task

$ARGUMENTS

## Steps

1. Si $ARGUMENTS está vacío, pregunta al usuario qué quiere diseñar.
2. Lee `CLAUDE.md` para tener contexto del design system.
3. Lanza `ux-ui-designer` con la descripción del diseño.
4. Tras el diseño, lee el fichero `DESIGN-{slug}.md` generado en `.claude/workspace/planning/`.
5. Muestra el diseño al usuario y pregunta: "¿El diseño te parece correcto? Puedes usar /do-task para implementarlo."
