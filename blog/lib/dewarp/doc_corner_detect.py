import cv2
import numpy as np


def detect_doc_corners(img):
    """detect 4 corners of a table

    Args:
        im (np.array): input image 

    Returns:
        list: 
            - case 1: table detected: [top-left, top-right, bottom-right, bottom-left]
            - case 2: no table detected: []
    """

    corners = []
    if img is not None:
        corners = get_default_corners(img)

    return corners
        

def get_default_corners(img):
    """Get default corners: return original corners
    """
    h, w, _ = img.shape
    tl = (0, 0)
    tr = (w, 0)
    br = (w, h)
    bl = (0, h)

    return [tl, tr, br, bl]