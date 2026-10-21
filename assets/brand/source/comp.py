# composite a transparent Cycles render over the brand's near-black, with a barely-there lift and dither
import cv2, numpy as np, sys
src, dst = sys.argv[1], sys.argv[2]
im = cv2.imread(src, cv2.IMREAD_UNCHANGED).astype(np.float32)/65535
rgb, a = im[..., :3], im[..., 3:4]
h, w = a.shape[:2]
yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
r = np.sqrt(((xx-w/2)/(0.72*w))**2 + ((yy-0.47*h)/(0.72*h))**2)
bg = (8/255 + 0.016*np.clip(1-r, 0, 1)**2)[..., None]*np.ones(3, np.float32)
out = rgb*a + bg*(1-a)
out = np.clip(out + np.random.default_rng(1).normal(0, 0.5/255, out.shape).astype(np.float32), 0, 1)
cv2.imwrite(dst, (out*255).round().astype(np.uint8))
