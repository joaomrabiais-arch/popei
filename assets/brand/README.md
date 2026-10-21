# ALTRE — brand assets

| File | Use |
|---|---|
| `ALTRE_logo_3D_principal.png` | Main logo, 2160×2160, black background (#080808) |
| `ALTRE_logo_3D_transparente.png` | Main logo with transparent background — dark backgrounds only |
| `ALTRE_simbolo_3D_perfil_vinted.png` | Symbol only, enlarged — use as the Vinted / Instagram profile photo |
| `ALTRE_simbolo_3D_transparente.png` | Symbol only, transparent background |
| `ALTRE_simbolo_vetorial.svg` | Flat vector symbol for print, embroidery, stamps |
| `original/` | Previous flat version, kept unchanged |
| `3d_v1/` | First 3D attempt (2D shading), superseded |
| `source/` | Blender scene (`scene.py`) + compositing script to re-render at any size |

Palette: #080808 · #C8C9CC · #85878C · soft white highlights.
Type: Jost Medium (SIL Open Font License), ALTRE tracked +300, SELECTED RESALE tracked +700.

The 3D files are Cycles renders of real extruded geometry (bevelled, brushed anisotropic metal, studio area lights).
Re-render: `python source/scene.py out.png 2160 160 full|symbol` (needs the `bpy` package), then `python source/comp.py out.png final.png`.
They are bitmaps, not vectors:
for print or large formats use the SVG, or have it re-rendered at the needed size.
