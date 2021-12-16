import cv2
import numpy as np
from .utils import distance


def get_dewarped_doc(img, corners):
    """Get dewarped doc
    """
    
    # check input 
    if img is None:
        return None
    if len(corners) != 4:
        return None

    # if corners == original corners the return original img
    h, w, _  = img.shape
    c_tl, c_tr, c_br, c_bl = corners
    if c_tl[0] == 0 and c_tl[1] == 0 \
        and c_tr[0] == w and c_tr[1] == 0 \
        and  c_br[0] == w and c_br[1] == h \
        and c_bl[0] == 0 and c_bl[1] == h:
        return img
    
    # perform dewarp
    target_w = int(max(distance(corners[0], corners[1]), distance(corners[2], corners[3])))
    target_h = int(max(distance(corners[0], corners[3]), distance(corners[1], corners[2])))
    target_corners = [[0, 0], [target_w, 0], [target_w, target_h], [0, target_h]]

    pts1 = np.float32(corners)
    pts2 = np.float32(target_corners)
    transform_matrix = cv2.getPerspectiveTransform(pts1, pts2)
    dewarped = cv2.warpPerspective(img, transform_matrix, (target_w, target_h))
    
    return dewarped