"""ALTRE emblem: real 3D geometry rendered in Cycles.
usage: python scene.py <out.png> <res> <samples> [full|symbol]
Layout units: 1 unit = 100 px of the original 1080 px layout, origin at the canvas centre.
Renders with a transparent film + shadow catcher; the background is composited afterwards."""
import bpy, bmesh, math, sys
from mathutils import Vector

OUT, RES, SAMPLES = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
MODE = sys.argv[4] if len(sys.argv) > 4 else 'full'
FONT = __file__.rsplit('/', 1)[0] + '/Jost500.ttf'

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene

# ---------------------------------------------------------------- materials
def lin(c):  # sRGB 0-255 -> linear
    c = c/255
    return c/12.92 if c <= 0.04045 else ((c+0.055)/1.055)**2.4

def metal(name, srgb, rough, aniso, brush_axis):
    m = bpy.data.materials.new(name); m.use_nodes = True
    nt = m.node_tree; N = nt.nodes; L = nt.links
    p = N['Principled BSDF']
    v = lin(srgb)
    p.inputs['Base Color'].default_value = (v, v, v*1.012, 1)
    p.inputs['Metallic'].default_value = 1.0
    p.inputs['Anisotropic'].default_value = aniso
    # brushed micro-variation in roughness
    tc = N.new('ShaderNodeTexCoord'); mp = N.new('ShaderNodeMapping')
    mp.inputs['Scale'].default_value = (2.0, 260.0, 2.0) if brush_axis == 'X' else (2.0, 2.0, 2.0)
    nz = N.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 6.0; nz.inputs['Detail'].default_value = 8
    mr = N.new('ShaderNodeMapRange')
    mr.inputs['To Min'].default_value = rough*0.82; mr.inputs['To Max'].default_value = rough*1.18
    L.new(tc.outputs['Object'], mp.inputs['Vector']); L.new(mp.outputs['Vector'], nz.inputs['Vector'])
    L.new(nz.outputs['Fac'], mr.inputs['Value']); L.new(mr.outputs['Result'], p.inputs['Roughness'])
    tg = N.new('ShaderNodeTangent'); tg.direction_type = 'RADIAL'
    tg.axis = 'Z' if brush_axis == 'CIRCULAR' else 'Y'   # Z: concentric (dial); Y: horizontal lines
    L.new(tg.outputs['Tangent'], p.inputs['Tangent'])
    return m

PLAT  = metal('platinum', 200, 0.20, 0.55, 'CIRCULAR')
GRAPH = metal('graphite', 100, 0.26, 0.55, 'CIRCULAR')
TXT   = metal('platinum_text', 212, 0.17, 0.45, 'X')
SUB   = metal('silver_sub', 190, 0.30, 0.0, 'X')

# ---------------------------------------------------------------- geometry
R, OFF, GAP, CY = 1.52, 0.30, 0.07, 1.08
DEPTH, BEV = 0.26, 0.05

def half_disc(name, cx, cy, up, mat):
    cu = bpy.data.curves.new(name, 'CURVE'); cu.dimensions = '2D'; cu.fill_mode = 'BOTH'
    cu.extrude = DEPTH/2; cu.bevel_depth = BEV; cu.bevel_resolution = 10
    cu.resolution_u = 64
    sp = cu.splines.new('POLY'); n = 360
    pts = []
    for i in range(n+1):
        a = math.pi*i/n
        pts.append((R*math.cos(a), (1 if up else -1)*R*math.sin(a)))
    sp.points.add(len(pts)-1)
    for p, (x, y) in zip(sp.points, pts): p.co = (x, y, 0, 1)
    sp.use_cyclic_u = True
    ob = bpy.data.objects.new(name, cu); sc.collection.objects.link(ob)
    ob.location = (cx, cy, DEPTH/2 + BEV)
    ob.data.materials.append(mat)
    return ob

d, g = R*OFF, R*GAP
top = half_disc('top', -d, CY + g/2, True, PLAT)
bot = half_disc('bot', d, CY - g/2, False, GRAPH)

font = bpy.data.fonts.load(FONT)
def text(name, body, size, depth, bev, mat):
    cu = bpy.data.curves.new(name, 'FONT'); cu.body = body; cu.font = font; cu.size = size
    cu.extrude = depth/2; cu.bevel_depth = bev; cu.bevel_resolution = 6
    cu.align_x = 'CENTER'; cu.align_y = 'BOTTOM_BASELINE'
    ob = bpy.data.objects.new(name, cu); sc.collection.objects.link(ob)
    ob.data.materials.append(mat); ob.location.z = depth/2 + bev
    return ob

def bounds(ob):
    bpy.context.view_layer.update()
    deps = bpy.context.evaluated_depsgraph_get(); e = ob.evaluated_get(deps)
    cs = [e.matrix_world @ Vector(c) for c in e.bound_box]
    return min(c.x for c in cs), max(c.x for c in cs), min(c.y for c in cs), max(c.y for c in cs)

def fit(ob, x0, x1, y0, y1):
    """set tracking so the word spans x0..x1, then scale/shift so caps sit on y0..y1 (targets from the original layout)"""
    cu = ob.data
    for _ in range(12):  # secant on character spacing
        bx0, bx1, _, _ = bounds(ob); w = bx1 - bx0
        cu.space_character *= ((x1 - x0)/w)**1.6
    bx0, bx1, by0, by1 = bounds(ob)
    s = (y1 - y0)/(by1 - by0)
    if abs(s - 1) > 0.01:
        cu.size *= s
        for _ in range(12):
            bx0, bx1, _, _ = bounds(ob); cu.space_character *= ((x1 - x0)/(bx1 - bx0))**1.6
    bx0, bx1, by0, by1 = bounds(ob)
    ob.location.x += (x0 + x1)/2 - (bx0 + bx1)/2
    ob.location.y += y0 - by0

if MODE == 'full':
    title = text('title', 'ALTRE', 0.94, 0.10, 0.014, TXT); title.data.space_character = 2.0
    fit(title, -1.865, 1.865, -1.955, -1.265)
    sub = text('sub', 'SELECTED RESALE', 0.18, 0.02, 0.002, SUB); sub.data.space_character = 3.0
    fit(sub, -1.628, 1.628, -2.69, -2.56)

# ---------------------------------------------------------------- floor (shadow catcher)
bpy.ops.mesh.primitive_plane_add(size=60, location=(0, 0, 0))
floor = bpy.context.active_object; floor.is_shadow_catcher = True
fm = bpy.data.materials.new('floor'); fm.use_nodes = True
fm.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = (0.004, 0.004, 0.004, 1)
fm.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value = 0.6
floor.data.materials.append(fm)

# ---------------------------------------------------------------- lights: studio
def area(name, loc, size, power, target=(0, 0, 0), shape='RECTANGLE', size_y=None):
    l = bpy.data.lights.new(name, 'AREA'); l.energy = power; l.shape = shape
    l.size = size; l.size_y = size_y or size
    o = bpy.data.objects.new(name, l); sc.collection.objects.link(o); o.location = loc
    dvec = Vector(target) - Vector(loc); o.rotation_euler = dvec.to_track_quat('-Z', 'Y').to_euler()
    return o

area('key_softbox', (-3.0, 5.5, 7.0), 7.0, 1700, size_y=4.0)       # large, high, upper-left
area('top_fill',    (0, 0, 12.0), 16.0, 450)                         # broad overhead, keeps faces silver
area('rim_left',    (-9.0, 0.5, 1.6), 0.6, 900, size_y=10.0)        # narrow strips: crisp bevel edges
area('rim_right',   (9.0, -0.5, 1.4), 0.6, 520, size_y=10.0)
area('kicker_low',  (0.0, -9.0, 1.2), 10.0, 380, size_y=0.5)

w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True
w.node_tree.nodes['Background'].inputs['Color'].default_value = (0, 0, 0, 1)
w.node_tree.nodes['Background'].inputs['Strength'].default_value = 0

# ---------------------------------------------------------------- camera
TILT = math.radians(float(__import__('os').environ.get('TILT', '14')))
cam = bpy.data.cameras.new('cam'); cam.type = 'PERSP'; cam.lens = 135; cam.sensor_width = 36
co = bpy.data.objects.new('cam', cam); sc.collection.objects.link(co); sc.camera = co
if MODE == 'symbol':
    for o in (top, bot): o.location.y -= CY
FRAME = 10.8 if MODE == 'full' else 6.1           # visible width at the subject plane
dist = FRAME*cam.lens/cam.sensor_width
aim = Vector((0, -0.05 if MODE == 'full' else 0, 0.1))
co.location = aim + Vector((0, -math.sin(TILT)*dist, math.cos(TILT)*dist))
co.rotation_euler = (aim - co.location).to_track_quat('-Z', 'Y').to_euler()

# ---------------------------------------------------------------- render
sc.render.engine = 'CYCLES'
cy = sc.cycles; cy.device = 'CPU'; cy.samples = SAMPLES; cy.use_denoising = True
cy.max_bounces = 10; cy.glossy_bounces = 6
sc.render.resolution_x = sc.render.resolution_y = RES; sc.render.resolution_percentage = 100
sc.render.film_transparent = True
sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_mode = 'RGBA'
sc.render.image_settings.color_depth = '16'
sc.view_settings.view_transform = 'AgX'
try: sc.view_settings.look = 'AgX - Medium High Contrast'
except Exception: pass
sc.render.filepath = OUT
bpy.ops.render.render(write_still=True)
print('done', OUT)
