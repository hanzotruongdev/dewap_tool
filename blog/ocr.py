from flask import (
    Blueprint, render_template,request, url_for, current_app, redirect, g
)
import cv2
import os
import uuid

import sys
sys.path.insert(1, "blog/lib")

# from ocr import process_img, dewarp_table, detect_table_v2
from dewarp import get_dewarped_doc

bp = Blueprint('ocr', __name__)

import pytesseract


@bp.route('/', methods=('GET', 'POST'))
def ocr():
    user_image = request.args.get('user_image')
    table_csv = request.args.get('table_csv')
    return render_template('ocr/index.html', user_image=user_image, table_csv=table_csv)

@bp.route('/upload_image', methods = ['POST'])
def upload_image():
    f = request.files['file']
    filename = f.filename
        
    if not filename:
        return redirect(url_for('ocr.ocr'))
    
    savepath = os.path.join(current_app.static_folder, 'upload', filename)
    f.save(savepath)
    relpath = url_for('static', filename='upload/'+filename)
    
    txt_table_corners = "187,35\n457,34\n456,295\n188,294\n"
 
            
    print('txt_table_corners: ', txt_table_corners)
    
    return redirect(url_for('ocr.ocr', user_image = relpath, txt_table_corners=txt_table_corners))

@bp.route('/extract_table', methods = ['POST'])
def extract_table():
    
    file_url = request.form.get('file_url')
    filename = file_url.split('/')[-1]
    image_path = os.path.join(current_app.static_folder, 'upload', filename)
    print('file_url: ', file_url)
    
    ran_name = str(uuid.uuid4()) + "." + filename.split('.')[-1]
    cropped = os.path.join(current_app.static_folder, 'upload', ran_name)
    
    txt_table_corners = request.form.get("txt_table_corners")
    print('txt_table_corners: ', txt_table_corners)
    
    if not txt_table_corners:
        txt_table_corners = "155,140\n22,449\n552,580\n626,200"
    points = txt_table_corners.split('\n')
    points = points[0:4]
    print('points: ', points)
    points = [[int(p.split(',')[0] ) , int(p.split(',')[1]) ] for p in points]
    print("points: ", points)
    
                                                
    
    im = cv2.imread(image_path)
    cropped_im = get_dewarped_doc(im, points)
    cv2.imwrite(cropped, cropped_im)

    cropped_rel_path = url_for('static', filename='upload/'+ran_name)
    print("cropped_rel_path: ", cropped_rel_path)
    
    
    return redirect(
        url_for('ocr.ocr', 
                user_image = file_url, 
                txt_table_corners=txt_table_corners,
               cropped=cropped_rel_path)
    )
    

@bp.route('/uploader', methods = ['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        f = request.files['file']
        filename = f.filename
        
        if filename:
            # filename = str(uuid.uuid4()) + "." + f.filename.split('.')[-1]
            savepath = os.path.join(current_app.static_folder, 'upload', filename)
            relpath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
            f.save(savepath)

            return redirect(url_for('ocr.ocr', user_image = relpath))
        return redirect(url_for('ocr.ocr'))
    
