import os
import sys
from PIL import Image, ImageDraw, ImageFont, ImageOps, ImageFilter

# Set console encoding to UTF-8
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Directory configurations
thesis_dir = r"C:\Users\chuns\Desktop\01_Career\08_Website\04_Antigravity\02_Feature Projects\2025_Master Thesis"
fonts_dir = r"C:\Users\chuns\.gemini\antigravity\brain\f18ab124-2ab0-4df6-943c-e29b313b6ec4\scratch\fonts"

# Font paths
font_outfit_light = os.path.join(fonts_dir, "Outfit-Light.ttf")
font_outfit_medium = os.path.join(fonts_dir, "Outfit-Medium.ttf")
font_inter = os.path.join(fonts_dir, "Inter-Variable.ttf")
font_chinese_ttc = r"C:\Windows\Fonts\msjh.ttc"  # Microsoft JhengHei for Chinese text

# Design tokens (matching website styles.css)
COLOR_BG = (10, 13, 12)          # --bg-primary: #0a0d0c
COLOR_BG_CARD = (17, 22, 20)     # --bg-secondary: #111614
COLOR_ACCENT = (0, 180, 162)      # --accent: #00b4a2
COLOR_TEXT_PRIMARY = (244, 246, 245) # --text-primary: #f4f6f5
COLOR_TEXT_MUTED = (162, 176, 172)   # --text-secondary: #a2b0ac
COLOR_BORDER = (0, 180, 162, 38) # --border-color: rgba(0, 180, 162, 0.15)
COLOR_GRID = (0, 180, 162, 12)   # Faint grid lines: rgba(0, 180, 162, 0.05)

# Resolution setup
CANVAS_W = 6000
CANVAS_H = 4000

def draw_grid(img, spacing=150):
    draw = ImageDraw.Draw(img, "RGBA")
    for x in range(0, CANVAS_W, spacing):
        draw.line([(x, 0), (x, CANVAS_H)], fill=COLOR_GRID, width=1)
    for y in range(0, CANVAS_H, spacing):
        draw.line([(0, y), (CANVAS_W, y)], fill=COLOR_GRID, width=1)

def draw_header(img, title, subtitle):
    draw = ImageDraw.Draw(img, "RGBA")
    font_title = ImageFont.truetype(font_outfit_medium, 140)
    font_sub = ImageFont.truetype(font_outfit_light, 60)
    
    # Title
    draw.text((150, 120), title.upper(), font=font_title, fill=COLOR_TEXT_PRIMARY)
    
    # Divider line
    title_bbox = draw.textbbox((150, 120), title.upper(), font=font_title)
    line_x_start = title_bbox[2] + 60
    draw.line([(line_x_start, 200), (CANVAS_W - 900, 200)], fill=COLOR_ACCENT, width=4)
    
    # Subtitle (Right aligned)
    draw.text((CANVAS_W - 850, 165), subtitle.upper(), font=font_sub, fill=COLOR_TEXT_MUTED)

def draw_section_header(draw, title, number, position, font_h, font_n):
    x, y = position
    # Accent dot
    draw.ellipse([x, y + 25, x + 30, y + 55], fill=COLOR_ACCENT)
    # Number tag (e.g. S, M, L)
    draw.text((x + 60, y), title.upper(), font=font_h, fill=COLOR_TEXT_PRIMARY)
    draw.text((x + 60 + draw.textbbox((0,0), title.upper(), font=font_h)[2], y - 20), number, font=font_n, fill=COLOR_ACCENT)

def draw_text_wrapped_zh(draw, text, position, max_width, font, fill_color, line_spacing=1.4):
    x_start, y = position
    lines = []
    current_line = ""
    for char in text:
        if char == '\n':
            lines.append(current_line)
            current_line = ""
            continue
        test_line = current_line + char
        bbox = draw.textbbox((0, 0), test_line, font=font)
        line_w = bbox[2] - bbox[0]
        if line_w > max_width:
            lines.append(current_line)
            current_line = char
        else:
            current_line = test_line
    if current_line:
        lines.append(current_line)
        
    for line in lines:
        draw.text((x_start, y), line, font=font, fill=fill_color)
        # Using a dummy character that has typical Chinese height properties
        bbox = draw.textbbox((0, 0), "國", font=font)
        y += int((bbox[3] - bbox[1]) * line_spacing)
    return y

def extract_and_tint_lineart(orig_img, box_rel, line_color=COLOR_ACCENT, erase_boxes_rel=[]):
    w_orig, h_orig = orig_img.size
    crop_box = (
        int(box_rel[0] * w_orig),
        int(box_rel[1] * h_orig),
        int(box_rel[2] * w_orig),
        int(box_rel[3] * h_orig)
    )
    cropped = orig_img.crop(crop_box)
    
    # Convert to grayscale and invert
    gray = cropped.convert("L")
    inv = ImageOps.invert(gray)
    
    # Erase old text in the mask
    if erase_boxes_rel:
        draw_mask = ImageDraw.Draw(inv)
        crop_w, crop_h = cropped.size
        for eb in erase_boxes_rel:
            eb_pixel = (
                int(eb[0] * crop_w),
                int(eb[1] * crop_h),
                int(eb[2] * crop_w),
                int(eb[3] * crop_h)
            )
            draw_mask.rectangle(eb_pixel, fill=0)
            
    # Enhancement
    inv = inv.point(lambda p: 255 if p > 50 else (p * 5 if p > 10 else 0))
    
    rgba = Image.new("RGBA", cropped.size, (0, 0, 0, 0))
    line_layer = Image.new("RGBA", cropped.size, line_color + (255,))
    rgba = Image.composite(line_layer, rgba, inv)
    return rgba

def extract_photo_card(orig_img, box_rel, border_color=COLOR_ACCENT):
    w_orig, h_orig = orig_img.size
    crop_box = (
        int(box_rel[0] * w_orig),
        int(box_rel[1] * h_orig),
        int(box_rel[2] * w_orig),
        int(box_rel[3] * h_orig)
    )
    cropped = orig_img.crop(crop_box).convert("RGBA")
    
    card_w, card_h = cropped.size
    card = Image.new("RGBA", (card_w + 40, card_h + 40), (0, 0, 0, 0))
    
    draw = ImageDraw.Draw(card)
    draw.rounded_rectangle([10, 10, card_w + 30, card_h + 30], radius=30, fill=COLOR_BG_CARD)
    
    mask = Image.new("L", (card_w, card_h), 0)
    draw_mask = ImageDraw.Draw(mask)
    draw_mask.rounded_rectangle([0, 0, card_w, card_h], radius=20, fill=255)
    
    card.paste(cropped, (20, 20), mask)
    draw.rounded_rectangle([10, 10, card_w + 30, card_h + 30], radius=30, outline=border_color, width=4)
    return card

# ==============================================================================
# PANEL 1: DESIGN WITH ANIMALS
# ==============================================================================
def build_panel_1():
    print("Generating Panel 01...")
    img = Image.new("RGBA", (CANVAS_W, CANVAS_H), COLOR_BG)
    draw_grid(img)
    draw_header(img, "Design with Animals", "Dynamic Structure Design")
    
    orig = Image.open(os.path.join(thesis_dir, "01_old.jpg"))
    
    font_h = ImageFont.truetype(font_outfit_medium, 72)
    font_n = ImageFont.truetype(font_outfit_light, 200)
    font_body = ImageFont.truetype(font_chinese_ttc, 44, index=0)  # Use Microsoft JhengHei
    
    draw = ImageDraw.Draw(img)
    
    # 1. Introduction Text Box (Left column, upper area)
    intro_p1 = (
        "動物在人類文明中佔有極重要的地位，尤其在遠古時期，人類對於動物的理解和動物在人類早期文明發展中所扮演的角色，都不是一朝一夕就可以說得清楚的，例如在中華文化中，「龍」這種神話動物就代表了許多意義，他不僅是整個民族的精神象徵，更是政治上的最高圖騰；而在西方，「老鷹」則代表了英勇與智慧；在埃及，「獅子」更是神聖不可侵犯的動物。凡此種種，可以看出動物在人類文明發展中的重要性。\n\n"
        "早在公元前二千五百年的埃及，人面獅身像的矗立，就開啟了建築與動物之間糾纏四千多年的分分合合，近代的水利與建築之間的愛恨情仇，十九世紀末的新藝術運動，開啟仿生態建築的里程碑，二十世紀初強烈推動的有機建築也倡導一種與自然和諧共榮的建築理論，到了近代由於設計工具的進步以及技術層面的突破，許多建築設計案都不約而同地展現出一種自然傾向的特質，這樣的發展，使得建築與自然之間的關係有了更靠近的趨勢。"
    )
    draw.text((150, 360), "INTRODUCTION / 前言導論", font=font_h, fill=COLOR_ACCENT)
    draw_text_wrapped_zh(draw, intro_p1, (150, 480), 2600, font_body, COLOR_TEXT_MUTED)
    
    # 2. Extract & paste trajectories (Inverted & tinted to teal)
    # Gibbon steps
    gibbon_art = extract_and_tint_lineart(orig, (0.01, 0.02, 0.50, 0.39), COLOR_ACCENT, 
                                          erase_boxes_rel=[(0.12, 0.70, 0.98, 0.85), (0.10, 0.88, 0.98, 0.98)])
    gibbon_art = gibbon_art.resize((2600, 1200), Image.Resampling.LANCZOS)
    img.paste(gibbon_art, (150, 1150), gibbon_art)
    draw_section_header(draw, "Gibbon Motion Trajectory", "01", (150, 1100), font_h, font_n)
    
    # Kangaroo steps
    kanga_art = extract_and_tint_lineart(orig, (0.58, 0.20, 0.98, 0.40), COLOR_ACCENT,
                                         erase_boxes_rel=[(0.35, 0.40, 0.98, 0.55), (0.42, 0.58, 0.98, 0.68)])
    kanga_art = kanga_art.resize((2600, 800), Image.Resampling.LANCZOS)
    img.paste(kanga_art, (150, 2300), kanga_art)
    draw_section_header(draw, "Kangaroo Motion Trajectory", "02", (150, 2200), font_h, font_n)
    
    # Giraffe steps
    giraffe_art = extract_and_tint_lineart(orig, (0.16, 0.72, 0.65, 0.86), COLOR_ACCENT,
                                           erase_boxes_rel=[(0.48, 0.05, 0.98, 0.20)])
    giraffe_art = giraffe_art.resize((2600, 700), Image.Resampling.LANCZOS)
    img.paste(giraffe_art, (150, 3150), giraffe_art)
    draw_section_header(draw, "Giraffe Motion Trajectory", "03", (150, 3050), font_h, font_n)
    
    # Descriptions under each trajectory
    gibbon_desc = "長臂猿擺盪的動作是這樣做的，首先，將自己吊掛在樹枝或是藤蔓上，然後其中的一隻手臂抓住樹幹，並將身體拉近樹幹，呈現一種蓄勢待發的狀態，然後用力一蹬，此時以另一隻抓住藤蔓的手為軸心，將身體向鐘擺一樣的擺盪出去，當身體擺盪到一定高度，另一隻手臂便順勢拉住藤蔓，然後重複先前的動作，就這樣一直持續，直到到達目的地為止。"
    kanga_desc = "袋鼠跳躍的動作是先將雙腿微彎，然後奮力一蹬，整個身體就如彈簧一樣的彈跳出去，當身體彈跳到半空中時，袋鼠的身體與尾巴會成為一條直線，以保持平衡，落地後，其雙腿會像彈簧被壓縮一般，儲存下一次彈跳的能量，然後再次的凌空而起。"
    giraffe_desc = "長頸鹿喝水時首先逐步將身體重心壓低，並透過四肢的向外伸展，使身體前傾斜，此時頭部再順勢向下擺，直到可以喝到水的位置為止，這樣就完成了整個喝水的動作。主要由兩部分組成，第一是透過四肢將身體壓低，第二就是頭部的擺動，兩動作相互配合完成整個喝水流程。"
    
    draw_text_wrapped_zh(draw, gibbon_desc, (150, 1750), 2600, font_body, COLOR_TEXT_MUTED)
    draw_text_wrapped_zh(draw, kanga_desc, (150, 2750), 2600, font_body, COLOR_TEXT_MUTED)
    draw_text_wrapped_zh(draw, giraffe_desc, (150, 3580), 2600, font_body, COLOR_TEXT_MUTED)
    
    # 3. Right Column: Photo Gallery
    gibbon_photo = extract_photo_card(orig, (0.26, 0.45, 0.52, 0.70))
    gibbon_photo = gibbon_photo.resize((1200, 800), Image.Resampling.LANCZOS)
    img.paste(gibbon_photo, (3000, 360), gibbon_photo)
    
    kanga_photo = extract_photo_card(orig, (0.55, 0.44, 0.98, 0.71))
    kanga_photo = kanga_photo.resize((1400, 800), Image.Resampling.LANCZOS)
    img.paste(kanga_photo, (4400, 360), kanga_photo)
    
    giraffe_photo = extract_photo_card(orig, (0.18, 0.50, 0.33, 0.70))
    giraffe_photo = giraffe_photo.resize((1000, 1100), Image.Resampling.LANCZOS)
    img.paste(giraffe_photo, (3000, 1300), giraffe_photo)
    
    # Small animal references
    deer_photo = extract_photo_card(orig, (0.08, 0.64, 0.18, 0.75))
    deer_photo = deer_photo.resize((700, 500), Image.Resampling.LANCZOS)
    img.paste(deer_photo, (4200, 1300), deer_photo)
    
    camel_photo = extract_photo_card(orig, (0.85, 0.65, 0.98, 0.76))
    camel_photo = camel_photo.resize((700, 500), Image.Resampling.LANCZOS)
    img.paste(camel_photo, (5100, 1300), camel_photo)
    
    # 4. Biomechanics Box (bottom right)
    draw.text((3000, 2600), "BIOMECHANICS & SKULLS / 生物力學與骨骼系統", font=font_h, fill=COLOR_ACCENT)
    
    skulls_art = extract_and_tint_lineart(orig, (0.01, 0.70, 0.15, 0.98), COLOR_TEXT_MUTED)
    skulls_art = skulls_art.resize((800, 1100), Image.Resampling.LANCZOS)
    img.paste(skulls_art, (3000, 2750), skulls_art)
    
    human_art = extract_and_tint_lineart(orig, (0.65, 0.74, 0.80, 0.98), COLOR_TEXT_MUTED)
    human_art = human_art.resize((800, 1100), Image.Resampling.LANCZOS)
    img.paste(human_art, (4000, 2750), human_art)
    
    human_desc = "骨骼只是一個架構，就像是沒有人操作的木偶一樣，這樣的架構本身是不會動作的，因此肌肉系統就出現以解決這個問題，肌肉附著於骨骼上，透過肌肉的收縮與放鬆，我們的骨骼可以活動自如。"
    draw_text_wrapped_zh(draw, human_desc, (5000, 2750), 850, font_body, COLOR_TEXT_MUTED)
    
    img.convert("RGB").save(os.path.join(thesis_dir, "01.jpg"), "JPEG", quality=92)
    print("Panel 01 Complete.")

# ==============================================================================
# PANEL 2: ANIMALS, MAN-MADE + ARCHITECTURE
# ==============================================================================
def build_panel_2():
    print("Generating Panel 02...")
    img = Image.new("RGBA", (CANVAS_W, CANVAS_H), COLOR_BG)
    draw_grid(img)
    draw_header(img, "Animals, Man-Made + Architecture", "Dynamic Structure Design")
    
    orig = Image.open(os.path.join(thesis_dir, "02_old.jpg"))
    draw = ImageDraw.Draw(img)
    
    font_h = ImageFont.truetype(font_outfit_medium, 72)
    font_body = ImageFont.truetype(font_chinese_ttc, 44, index=0)
    
    # 1. Main Narrative Texts
    p2_txt1 = (
        "可動構造存在的歷史可追溯至遠古時期，而伴隨人類文明的演進，如今這些技術與構造物已經深入我們生活的每一個角落，小到眼鏡上的活動關節，大到巨型的水壩活門，各式各樣的變化，造就了我們身處的環境，本研究的背景之一便是觀察這些大大小小的科技應用如何協助我們的工作，改善我們的生活，將這些人類設計的心血結晶加以整理歸類，以作為未來實踐動態建築的基礎資料。\n\n"
        "可動構造的種類林林總總，類型繁多，無法完全收納，本研究主要以長頸鹿、長臂猿及袋鼠三種動物的運動模式為基礎，觀察整理類似其運動方式的可動構造，以此作為觀察的重心，並將觀察結果分為「開合型可動構造」、「擺動型可動構造」與「彈力型可動構造」三大類加以闡述。"
    )
    p2_txt2 = (
        "仿生建築更徹底的從形式到機能模擬大自然的法則，並且配合高技術的解決方案，企圖將建築推向一種生命體的境界。仿生建築的最高理想就是要把建築物從外表、材質甚至是內部的各種系統都加以生物化，透過這樣的一種理念設計出來的建築，最終將會像自然界的任何生命體一樣，在活著的時候順應自然的法則，在死後則回歸大地，成為自然的一部分，並且等待下一次重生的機會。"
    )
    
    draw.text((150, 360), "KINETIC BACKGROUND / 可動構造背景", font=font_h, fill=COLOR_ACCENT)
    draw_text_wrapped_zh(draw, p2_txt1, (150, 480), 2600, font_body, COLOR_TEXT_MUTED)
    
    draw.text((3100, 360), "BIOMIMETIC ARCHITECTURE IDEAL / 仿生建築理想", font=font_h, fill=COLOR_ACCENT)
    draw_text_wrapped_zh(draw, p2_txt2, (3100, 480), 2750, font_body, COLOR_TEXT_MUTED)
    
    # 2. Grid Mapping
    draw.text((150, 1150), "BIOMIMETIC CATEGORY MAPPING / 仿生機制與可動構造對照", font=font_h, fill=COLOR_ACCENT)
    
    row_headers = [
        ("GIRAFFE / 長頸鹿", "COLLAPSIBLE / 開合型"),
        ("GIBBON / 長臂猿", "SWING / 擺動型"),
        ("KANGAROO / 袋鼠", "SPRING / 彈力型")
    ]
    
    y_start = 1280
    row_height = 500
    x_offsets = [1150, 1950, 2750, 3550, 4350, 5150]
    
    for r_idx, (animal, mech) in enumerate(row_headers):
        r_y = y_start + r_idx * row_height
        
        # Row labels
        draw.text((150, r_y + 160), animal, font=ImageFont.truetype(font_outfit_medium, 48), fill=COLOR_TEXT_PRIMARY)
        draw.text((150, r_y + 230), mech, font=font_body, fill=COLOR_ACCENT)
        
        # Row divider line
        draw.line([(150, r_y + row_height - 30), (CANVAS_W - 150, r_y + row_height - 30)], fill=COLOR_BORDER, width=2)
        
        y_offset_rel = r_idx * 0.13
        
        row_boxes = [
            (0.08, 0.16 + y_offset_rel, 0.18, 0.27 + y_offset_rel), # animal
            (0.26, 0.16 + y_offset_rel, 0.35, 0.27 + y_offset_rel), # item 1
            (0.36, 0.16 + y_offset_rel, 0.44, 0.27 + y_offset_rel), # item 2
            (0.45, 0.16 + y_offset_rel, 0.54, 0.27 + y_offset_rel), # item 3
            (0.55, 0.16 + y_offset_rel, 0.63, 0.27 + y_offset_rel), # item 4
            (0.64, 0.16 + y_offset_rel, 0.72, 0.27 + y_offset_rel), # item 5
        ]
        
        for c_idx, box in enumerate(row_boxes):
            try:
                card = extract_photo_card(orig, box)
                card = card.resize((700, 420), Image.Resampling.LANCZOS)
                img.paste(card, (x_offsets[c_idx], r_y), card)
            except Exception as e:
                print(f"Error packing grid image r{r_idx}c{c_idx}: {e}")

    # 3. Bottom Row: Case Studies
    draw.text((150, 2850), "BIOMIMETIC ARCHITECTURE CASE STUDIES / 仿生與動態建築案例研究", font=font_h, fill=COLOR_ACCENT)
    
    case_boxes = [
        (0.26, 0.74, 0.35, 0.87), # Gehry
        (0.36, 0.74, 0.44, 0.87), # Calatrava
        (0.45, 0.74, 0.54, 0.87), # Piano
        (0.55, 0.74, 0.63, 0.87), # Festo
        (0.64, 0.74, 0.72, 0.87), # Sorkin
        (0.73, 0.74, 0.81, 0.87), # Jacob+MacFarlane
    ]
    
    animal_boxes = [
        (0.26, 0.88, 0.35, 0.98), # Fish
        (0.36, 0.88, 0.44, 0.98), # Eagle
        (0.45, 0.88, 0.54, 0.98), # Beetle
        (0.55, 0.88, 0.63, 0.98), # Dragonfly
        (0.64, 0.88, 0.72, 0.98), # Stingray
        (0.73, 0.88, 0.81, 0.98), # Manatee
    ]
    
    case_labels = [
        "DZ BANK (Gehry)\nFISH / 魚類仿生",
        "MILWAUKEE (Calatrava)\nEAGLE / 飛鷹仿生",
        "PARCO MUSICA (Piano)\nBEETLE / 甲蟲仿生",
        "AIRTECTURE (Festo)\nDRAGONFLY / 蜻蜓仿生",
        "BEACHED HOUSES (Sorkin)\nSTINGRAY / 魟魚仿生",
        "GEORGES REST. (Jacob)\nMANATEE / 海牛仿生"
    ]
    
    case_x_offsets = [150, 1110, 2070, 3030, 3990, 4950]
    
    for c_idx in range(6):
        try:
            card = extract_photo_card(orig, case_boxes[c_idx])
            card = card.resize((850, 580), Image.Resampling.LANCZOS)
            img.paste(card, (case_x_offsets[c_idx], 2980), card)
            
            anim = extract_photo_card(orig, animal_boxes[c_idx], border_color=COLOR_TEXT_MUTED)
            anim = anim.resize((350, 250), Image.Resampling.LANCZOS)
            img.paste(anim, (case_x_offsets[c_idx] + 460, 3310), anim)
            
            draw.text((case_x_offsets[c_idx] + 20, 3590), case_labels[c_idx], 
                      font=ImageFont.truetype(font_outfit_medium, 36), fill=COLOR_TEXT_PRIMARY)
        except Exception as e:
            print(f"Error packing case study card {c_idx}: {e}")
            
    img.convert("RGB").save(os.path.join(thesis_dir, "02.jpg"), "JPEG", quality=92)
    print("Panel 02 Complete.")

# ==============================================================================
# PANEL 3: GIRAFFE DYNAMIC STRUCTURE
# ==============================================================================
def build_panel_3():
    print("Generating Panel 03...")
    img = Image.new("RGBA", (CANVAS_W, CANVAS_H), COLOR_BG)
    draw_grid(img)
    draw_header(img, "Giraffe Dynamic Structure", "Dynamic Structure Design")
    
    orig = Image.open(os.path.join(thesis_dir, "03_old.jpg"))
    draw = ImageDraw.Draw(img)
    
    font_h = ImageFont.truetype(font_outfit_medium, 72)
    font_n = ImageFont.truetype(font_outfit_light, 200)
    font_body = ImageFont.truetype(font_chinese_ttc, 44, index=0)
    
    # Headers
    draw_section_header(draw, "The Multi Chair", "S", (150, 360), font_h, font_n)
    draw_section_header(draw, "The Dynamic Canopy", "M", (3100, 360), font_h, font_n)
    
    # 1. Left Column: The Multi Chair Narrative
    chair_txt = (
        "構思一個小尺度的可動構造，是想從小尺度開始逐步練習，探索可動構造的可能性，初步想法是一種家具，主因是無法擺脫功能性的傳統思維，下意識的認為建築和一般藝術最大的不同就是建築具有功能性，所以還是採取設計功能性的構造作為設計的開端，在可動這件事上採取逐步開放的態度，沒有讓自己馬上上去嘗試以軌跡作為設計轉化的來源，而採取一種比較開放的態度，而決定從外型開始著手，這是一種最直接的切入方式，所以這家具的輪廓逐漸明朗：\n\n"
        "第一，他應該是一種外型神似長頸鹿的家具；\n"
        "第二，他是一種可以動的構造。就以這兩個原則開始長頸鹿家具設計。"
    )
    draw_text_wrapped_zh(draw, chair_txt, (150, 520), 1300, font_body, COLOR_TEXT_MUTED)
    
    # "= ?" Formula diagram (Inverted & Tinted)
    eq_diagram = extract_and_tint_lineart(orig, (0.01, 0.15, 0.36, 0.32), COLOR_ACCENT,
                                           erase_boxes_rel=[(0.01, 0.80, 0.98, 0.98)])
    eq_diagram = eq_diagram.resize((1300, 600), Image.Resampling.LANCZOS)
    img.paste(eq_diagram, (150, 1100), eq_diagram)
    
    # Multi Chair transformation steps (cards)
    draw.text((150, 1750), "TRANSFORMATION SECTOR / 家具形態變換步驟 (Table -> Ladder -> Chair)", font=font_h, fill=COLOR_ACCENT)
    step_boxes = [
        (0.01, 0.36, 0.12, 0.47), # step 1
        (0.12, 0.36, 0.23, 0.47), # step 2
        (0.23, 0.36, 0.34, 0.47), # step 3
        (0.34, 0.36, 0.45, 0.47), # step 4
        (0.45, 0.36, 0.56, 0.47), # step 5
        (0.56, 0.36, 0.67, 0.47), # step 6
    ]
    step_x_offsets = [150, 600, 1050, 1500, 1950, 2400]
    for idx, box in enumerate(step_boxes):
        try:
            card = extract_photo_card(orig, box)
            card = card.resize((400, 350), Image.Resampling.LANCZOS)
            img.paste(card, (step_x_offsets[idx], 1880), card)
        except Exception as e:
            print(f"Error packing multi chair step {idx}: {e}")
            
    # Seated figure renders
    render_boxes = [
        (0.01, 0.48, 0.16, 0.67), # sitting
        (0.16, 0.48, 0.36, 0.67), # climbing
        (0.36, 0.48, 0.67, 0.67), # standing
    ]
    render_x_offsets = [150, 1050, 1950]
    for idx, box in enumerate(render_boxes):
        try:
            card = extract_photo_card(orig, box)
            card = card.resize((850, 1100), Image.Resampling.LANCZOS)
            img.paste(card, (render_x_offsets[idx], 2300), card)
        except Exception as e:
            print(f"Error packing multi chair render {idx}: {e}")

    # 2. Right Column: The Dynamic Canopy
    canopy_txt = (
        "第二個設計在最初的設定中是要挑戰較大尺度的問題，一切的開始依舊是非常直覺的，是以一根直直的長條型立方體作為一切的開始，想像中，這根立方柱就是長頸鹿的脖子，然後以最簡單的方式模擬了這根方柱從一端圓心向下擺動的狀態，就這樣產生了第一根結構體，這根結構體運動正是模擬長頸鹿喝水時頸部擺動的狀態，整個擺動的幅最大約是15度到75度之間，重複的上下擺動，速度是等速，沒有做太多的變化，維持基本的預設值。\n\n"
        "接下來開始思考如何走下一步，思考後發現只有一根立方體是無法稱的上市構造物的，因為數量的關係，他顯得太孤單了，所以決定要運用「複製」這個絕佳的方式來快速解決這個問題，於是同時複製了二十個相同的桿件，以相同的間格距離作複製，因此得到了一整排整齊的桿件，這排整齊的傢伙會一起同時擺動，就像是一個呆板而有間隙的格柵板在空氣中活動著，這似乎不是一個好的結果。\n\n"
        "心中開始有點擔心，會不會走錯方向了？就在此時，先前的分析圖給了一些啟發，何不來個連續式的擺動呢？如果在大同一個時間裡，每一個桿件是呈現不同的擺動狀態，那會得到什麼呢？我們可以直接在電腦裡面嘗試測試，此時利用了時間軸的調整功能，使每一個桿件都比他的前一個桿件稍微慢了一些時間，於是就可以達到想像中的效果，連續處理使他們產生了曲面的效果，令人驚訝的是，這樣的連續曲線正如先前剖析圖所繪製出來的曲線。"
    )
    draw_text_wrapped_zh(draw, canopy_txt, (3100, 520), 1600, font_body, COLOR_TEXT_MUTED)
    
    # Large canopy rendering (top right card)
    try:
        canopy_main = extract_photo_card(orig, (0.87, 0.15, 0.98, 0.67))
        canopy_main = canopy_main.resize((1000, 1350), Image.Resampling.LANCZOS)
        img.paste(canopy_main, (4850, 480), canopy_main)
    except Exception as e:
        print(f"Error packing main canopy render: {e}")
        
    # Steps 1 to 4 (bottom right cards)
    draw.text((3100, 1900), "ROTATING SCHEMATIC STEPS / 連續擺動與曲面生成模擬步驟 (15° - 75°)", font=font_h, fill=COLOR_ACCENT)
    canopy_steps_box = (0.68, 0.36, 0.86, 0.67)
    try:
        steps_card = extract_photo_card(orig, canopy_steps_box)
        steps_card = steps_card.resize((1600, 950), Image.Resampling.LANCZOS)
        img.paste(steps_card, (3100, 2020), steps_card)
    except Exception as e:
        print(f"Error packing canopy steps: {e}")
        
    # Details or skeletal lineart (bottom corner)
    giraffe_sketch = extract_and_tint_lineart(orig, (0.68, 0.15, 0.86, 0.35), COLOR_TEXT_MUTED)
    giraffe_sketch = giraffe_sketch.resize((1000, 950), Image.Resampling.LANCZOS)
    img.paste(giraffe_sketch, (4850, 2020), giraffe_sketch)
    
    # Extra design process annotations in empty space
    draw.text((3100, 3100), "DESIGN ANALYSIS / 設計分析構造說明", font=font_h, fill=COLOR_ACCENT)
    extra_txt = "利用參數化時間差控制，使原本僵硬的機械格柵產生波浪般的連續流動感。這種運動方式不僅創造了豐富的立體光影曲面，更可依據外部氣候感應器動態調整遮陰的角度與面積，是小尺度家具跨越到大尺度建築皮層的仿生實踐。"
    draw_text_wrapped_zh(draw, extra_txt, (3100, 3220), 2750, font_body, COLOR_TEXT_MUTED)
        
    img.convert("RGB").save(os.path.join(thesis_dir, "03.jpg"), "JPEG", quality=92)
    print("Panel 03 Complete.")

# ==============================================================================
# PANEL 4: GIBBON DYNAMIC STRUCTURE
# ==============================================================================
def build_panel_4():
    print("Generating Panel 04...")
    img = Image.new("RGBA", (CANVAS_W, CANVAS_H), COLOR_BG)
    draw_grid(img)
    draw_header(img, "Gibbon Dynamic Structure", "Dynamic Structure Design")
    
    orig = Image.open(os.path.join(thesis_dir, "04_old.jpg"))
    draw = ImageDraw.Draw(img)
    
    font_h = ImageFont.truetype(font_outfit_medium, 72)
    font_n = ImageFont.truetype(font_outfit_light, 200)
    font_body = ImageFont.truetype(font_chinese_ttc, 44, index=0)
    
    # Headers
    draw_section_header(draw, "The Gibbon Cradle", "S", (150, 360), font_h, font_n)
    draw_section_header(draw, "The Dynamic Bus Stop", "M", (2600, 360), font_h, font_n)
    draw_section_header(draw, "The Swing Restaurant", "L", (150, 2500), font_h, font_n)
    
    # 1. Cradle narrative & graphics
    cradle_desc = (
        "這是一個結合長臂猿與搖籃的作品，搖籃並不是新的發明，搖籃本來就是以搖擺作概念的產品。\n\n"
        "長臂猿的外型是特意加上去的，這樣的組合產生一種趣味，突顯出搖擺與長臂猿的相關性，這樣的組合可以表達在這個研究裡的一些發現，雖然結果很簡單。"
    )
    draw_text_wrapped_zh(draw, cradle_desc, (150, 480), 1100, font_body, COLOR_TEXT_MUTED)
    
    # Cradle diagram "= ?"
    c_diagram = extract_and_tint_lineart(orig, (0.01, 0.20, 0.26, 0.32), COLOR_ACCENT)
    c_diagram = c_diagram.resize((1100, 500), Image.Resampling.LANCZOS)
    img.paste(c_diagram, (150, 850), c_diagram)
    
    # Cradle baby renderings
    try:
        baby_card = extract_photo_card(orig, (0.01, 0.33, 0.26, 0.62))
        baby_card = baby_card.resize((1100, 950), Image.Resampling.LANCZOS)
        img.paste(baby_card, (150, 1400), baby_card)
        
        swing_card = extract_photo_card(orig, (0.26, 0.33, 0.50, 0.62))
        swing_card = swing_card.resize((1100, 950), Image.Resampling.LANCZOS)
        img.paste(swing_card, (1300, 1400), swing_card)
    except Exception as e:
        print(f"Error packing cradle renderings: {e}")

    # 2. Bus Stop narrative & graphics
    bus_desc = (
        "這個構造物的機能是一個可以隨時間改變遮陽位置的構造物，透過感應裝置的偵測與啟動，整個動態構造物可以依據太陽的移動軌跡，使整個構造適當的調整，讓陰影面始終維持在我們需要遮陽的位置上。\n\n"
        "我們將這個構造物應用在一個公車站的候車亭上，希望讓等候公車的人可以在艷陽高照的日子有一個舒適的遮陰空間。"
    )
    draw_text_wrapped_zh(draw, bus_desc, (2600, 480), 1500, font_body, COLOR_TEXT_MUTED)
    
    # Bus stop steps
    try:
        bus_steps = extract_photo_card(orig, (0.50, 0.18, 0.99, 0.32))
        bus_steps = bus_steps.resize((2100, 500), Image.Resampling.LANCZOS)
        img.paste(bus_steps, (2600, 850), bus_steps)
    except Exception as e:
        print(f"Error packing bus stop steps: {e}")
        
    # Bus stop renders
    try:
        bus_renders = extract_photo_card(orig, (0.51, 0.33, 0.99, 0.62))
        bus_renders = bus_renders.resize((3150, 950), Image.Resampling.LANCZOS)
        img.paste(bus_renders, (2600, 1400), bus_renders)
    except Exception as e:
        print(f"Error packing bus stop main renders: {e}")

    # 3. Swing Restaurant narrative & graphics
    restaurant_desc = (
        "這是一個在海邊的餐廳，主要為觀光客與餐飲美味的海洋食物作為主要的業務來源，但是這個餐廳和其他餐廳最大不同的地方，也是他的最大賣點就是他是全世界第一座搖擺餐廳！\n\n"
        "搖擺餐廳設置有獨一無二的戶外搖擺座位，讓客人可以更深入的坐在海洋中用餐，餐廳的搖擺區可以透過特殊設計的擺動構造，將整個座位區擺盪到更接近海洋的位置，讓您感受真正處身海洋中用餐的驚奇感受！"
    )
    draw_text_wrapped_zh(draw, restaurant_desc, (150, 2670), 1500, font_body, COLOR_TEXT_MUTED)
    
    # Restaurant steps
    try:
        rest_steps = extract_photo_card(orig, (0.01, 0.79, 0.30, 0.91))
        rest_steps = rest_steps.resize((1500, 650), Image.Resampling.LANCZOS)
        img.paste(rest_steps, (150, 3200), rest_steps)
    except Exception as e:
        print(f"Error packing restaurant steps: {e}")
        
    # Restaurant main rendering
    try:
        rest_main = extract_photo_card(orig, (0.30, 0.79, 0.99, 0.98))
        rest_main = rest_main.resize((4000, 1200), Image.Resampling.LANCZOS)
        img.paste(rest_main, (1800, 2650), rest_main)
    except Exception as e:
        print(f"Error packing restaurant main render: {e}")
        
    img.convert("RGB").save(os.path.join(thesis_dir, "04.jpg"), "JPEG", quality=92)
    print("Panel 04 Complete.")

# ==============================================================================
# PANEL 5: KANGAROO DYNAMIC STRUCTURE
# ==============================================================================
def build_panel_5():
    print("Generating Panel 05...")
    img = Image.new("RGBA", (CANVAS_W, CANVAS_H), COLOR_BG)
    draw_grid(img)
    draw_header(img, "Kangaroo Dynamic Structure", "Dynamic Structure Design")
    
    orig = Image.open(os.path.join(thesis_dir, "05_old.jpg"))
    draw = ImageDraw.Draw(img)
    
    font_h = ImageFont.truetype(font_outfit_medium, 72)
    font_n = ImageFont.truetype(font_outfit_light, 200)
    font_body = ImageFont.truetype(font_chinese_ttc, 44, index=0)
    
    # Headers
    draw_section_header(draw, "The Kangaroo Chair", "S", (3900, 360), font_h, font_n)
    draw_section_header(draw, "The Rainbow Bridge", "M", (150, 360), font_h, font_n)
    draw_section_header(draw, "The Kangaroo Bookstore", "L", (150, 2500), font_h, font_n)
    
    # 1. Chair narrative & graphics
    chair_desc = (
        "袋鼠的小尺度構造很單純的運用鋼體得彈力特性，設計出一個類似袋鼠腿部的形狀的椅子支撐主構造，以這樣的方式表示彈力的構造。"
    )
    draw_text_wrapped_zh(draw, chair_desc, (3900, 480), 1800, font_body, COLOR_TEXT_MUTED)
    
    # Chair formula "= ?"
    ch_diagram = extract_and_tint_lineart(orig, (0.60, 0.33, 0.78, 0.53), COLOR_ACCENT)
    ch_diagram = ch_diagram.resize((850, 750), Image.Resampling.LANCZOS)
    img.paste(ch_diagram, (3900, 720), ch_diagram)
    
    # Chair renderings
    try:
        ch_r1 = extract_photo_card(orig, (0.78, 0.10, 0.98, 0.32))
        ch_r1 = ch_r1.resize((900, 800), Image.Resampling.LANCZOS)
        img.paste(ch_r1, (4900, 720), ch_r1)
        
        ch_r2 = extract_photo_card(orig, (0.78, 0.33, 0.98, 0.53))
        ch_r2 = ch_r2.resize((900, 800), Image.Resampling.LANCZOS)
        img.paste(ch_r2, (4900, 1600), ch_r2)
        
        ch_r3 = extract_photo_card(orig, (0.60, 0.54, 0.78, 0.71))
        ch_r3 = ch_r3.resize((850, 800), Image.Resampling.LANCZOS)
        img.paste(ch_r3, (3900, 1600), ch_r3)
    except Exception as e:
        print(f"Error packing chair renderings: {e}")

    # 2. Rainbow Bridge narrative & graphics
    bridge_desc = (
        "中尺度的構造物是一種新的外殼構造設計，這樣的外殼是一種動態外殼系統，在外殼構造中加入了一種彈力構件，這種彈力構件在感應裝置的配合下，會在人經過的時候產生動態的變化。\n\n"
        "本案例是應用在一座橋樑的外殼上，當有人經過此橋樑時，動態外殼系統就會產生反應，而在殼體內部反覆彈跳，產生一種新奇的過橋經驗。"
    )
    draw_text_wrapped_zh(draw, bridge_desc, (150, 480), 1600, font_body, COLOR_TEXT_MUTED)
    
    # Bridge main render (top box)
    try:
        bridge_main = extract_photo_card(orig, (0.01, 0.10, 0.60, 0.32))
        bridge_main = bridge_main.resize((1750, 950), Image.Resampling.LANCZOS)
        img.paste(bridge_main, (1950, 480), bridge_main)
    except Exception as e:
        print(f"Error packing bridge main render: {e}")
        
    # Bridge steps
    try:
        bridge_steps = extract_photo_card(orig, (0.01, 0.33, 0.14, 0.71))
        bridge_steps = bridge_steps.resize((800, 1500), Image.Resampling.LANCZOS)
        img.paste(bridge_steps, (150, 920), bridge_steps)
        
        bridge_sec = extract_photo_card(orig, (0.14, 0.33, 0.60, 0.53))
        bridge_sec = bridge_sec.resize((2700, 950), Image.Resampling.LANCZOS)
        img.paste(bridge_sec, (1050, 1470), bridge_sec)
    except Exception as e:
        print(f"Error packing secondary bridge renders: {e}")

    # 3. Bookstore narrative & graphics
    book_desc = (
        "這個設計專案主要是改變我們對遮陽系統的既有觀念，傳統的遮陽系統主要是水平遮陽、垂直遮陽與混合遮陽，在這裡我們透過可動式的構造提出一種動態的遮陽系統。\n\n"
        "系統的動態變化主要是依據袋鼠跳躍的動作演變而來，連續的變化會呈現出波浪狀的擺動，也可以透過電腦模擬控制，採取不同的遮陽狀態，滿足不同時間太陽的照射角度與所需遮陽面積。"
    )
    draw_text_wrapped_zh(draw, book_desc, (150, 2620), 2100, font_body, COLOR_TEXT_MUTED)
    
    # Bookstore renderings
    try:
        b_r1 = extract_photo_card(orig, (0.01, 0.79, 0.20, 0.98))
        b_r1 = b_r1.resize((1100, 1150), Image.Resampling.LANCZOS)
        img.paste(b_r1, (2400, 2650), b_r1)
        
        b_r2 = extract_photo_card(orig, (0.20, 0.79, 0.40, 0.98))
        b_r2 = b_r2.resize((1100, 1150), Image.Resampling.LANCZOS)
        img.paste(b_r2, (3600, 2650), b_r2)
        
        b_r3 = extract_photo_card(orig, (0.40, 0.79, 0.99, 0.98))
        b_r3 = b_r3.resize((1100, 1150), Image.Resampling.LANCZOS)
        img.paste(b_r3, (4800, 2650), b_r3)
    except Exception as e:
        print(f"Error packing bookstore renders: {e}")
        
    img.convert("RGB").save(os.path.join(thesis_dir, "05.jpg"), "JPEG", quality=92)
    print("Panel 05 Complete.")


# Backup original files before regenerating
def backup_original_images():
    for name in ["01.jpg", "02.jpg", "03.jpg", "04.jpg", "05.jpg"]:
        old_name = name.replace(".jpg", "_old.jpg")
        old_path = os.path.join(thesis_dir, old_name)
        new_path = os.path.join(thesis_dir, name)
        if os.path.exists(new_path) and not os.path.exists(old_path):
            print(f"Backing up {name} to {old_name}...")
            os.rename(new_path, old_path)

if __name__ == "__main__":
    backup_original_images()
    build_panel_1()
    build_panel_2()
    build_panel_3()
    build_panel_4()
    build_panel_5()
    print("All thesis layout panels modernized successfully!")
