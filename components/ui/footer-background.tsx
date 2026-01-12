import { DottedGlowBackground } from "./dotted-glow-background";

export function FooterBackground() {
  return (
    <DottedGlowBackground
      className="pointer-events-none mask-radial-to-90% mask-radial-at-center opacity-20 dark:opacity-100"
      opacity={1}
      gap={10}
      radius={1}
      colorLightVar="--color-neutral-500"
      glowColorLightVar="--color-neutral-600"
      colorDarkVar="--color-neutral-500"
      glowColorDarkVar="--color-sky-800"
      backgroundOpacity={0.5}
      speedMin={0.3}
      speedMax={1.6}
      speedScale={1}
    />
  );
}
