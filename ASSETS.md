# Assets

**Art direction:** Field Journal Quest — parchment evidence cards, deep indigo ink, marigold compass marks, field-guide guardian seals and restrained elemental effects. All combat magic remains readable and calm enough for a Grade 4 learning experience.

| Asset | Role | URL |
| --- | --- | --- |
| Battle arena | Local, uncluttered 16:9 backdrop for training and Boss battles | `client/public/media/math4fun-battle-arena.webp` |
| World map | Atlas overview shown before the route evidence cards | `client/public/media/math4fun-world-map.png` |
| Element emblems | Visual reference for elemental spell buttons | `/manus-storage/math4fun-spell-elements_450241d7.png` |
| Profile compass | Visual reference for local profile/team UI | `/manus-storage/math4fun-profile-compass_bf90b6cf.png` |
| Battle loop | Nền âm thanh sau thao tác tấn công | `/manus-storage/math4fun-battle-loop_053e734b.wav` |
| Sáu clip ấn phép | Sổ Phép và hiệu ứng hệ | `MAGIC_MEDIA` trong `gameData.ts` |

The original Math4Fun guardian portraits are bundled in `client/public/guardians/original/`; the artwork catalog and gameplay-ID mapping are documented beside the files. The web code no longer depends on third-party creature sprites.

Combat effects use local arena art plus lightweight Framer Motion/CSS layers. The scene reserves the center for question-independent action feedback while the adjacent question panel remains readable.
