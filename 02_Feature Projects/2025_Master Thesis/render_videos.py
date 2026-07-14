import os
import sys
import cv2
import numpy as np

# Set console encoding to UTF-8
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Directory configurations
thesis_dir = r"C:\Users\chuns\Desktop\01_Career\08_Website\04_Antigravity\02_Feature Projects\2025_Master Thesis"
fonts_dir = r"C:\Users\chuns\.gemini\antigravity\brain\f18ab124-2ab0-4df6-943c-e29b313b6ec4\scratch\fonts"

# Font configurations for cv2 (using Hershey fonts for reliable rendering inside cv2)
FONT_HUD = cv2.FONT_HERSHEY_SIMPLEX
FONT_HUD_COMPACT = cv2.FONT_HERSHEY_PLAIN

# Design tokens matching the website and panels
COLOR_BG = (12, 13, 10)           # Deep forest charcoal BGR
COLOR_GRID = (25, 30, 25)         # Faint grid lines BGR
COLOR_BORDER = (45, 60, 50)       # Dark border lines BGR
COLOR_ACCENT = (162, 180, 0)      # Glowing teal BGR
COLOR_TEXT_PRIMARY = (245, 246, 244) # Off-white BGR
COLOR_TEXT_MUTED = (172, 176, 162)   # Sage-gray BGR

def draw_hud_base(canvas, title, serial_code, frame_idx, total_frames, param_name, param_val, param_unit):
    # 1. Subtle background grid across the entire canvas
    for x in range(0, 1280, 80):
        cv2.line(canvas, (x, 0), (x, 720), COLOR_GRID, 1)
    for y in range(0, 720, 80):
        cv2.line(canvas, (0, y), (1280, y), COLOR_GRID, 1)
        
    # 2. Outer Technical Border
    cv2.rectangle(canvas, (15, 15), (1265, 705), COLOR_BORDER, 1)
    # Corner ticks
    for cx, cy in [(15, 15), (1265, 15), (15, 705), (1265, 705)]:
        cv2.line(canvas, (cx - 10, cy), (cx + 10, cy), COLOR_ACCENT, 2)
        cv2.line(canvas, (cx, cy - 10), (cx, cy + 10), COLOR_ACCENT, 2)

    # 3. Vertical panel divider at x = 320
    cv2.line(canvas, (320, 15), (320, 705), COLOR_BORDER, 2)
    cv2.line(canvas, (320, 15), (320, 705), COLOR_ACCENT, 1)

    # 4. HUD Dashboard - Left Panel (x: 15 to 320)
    # Logo block
    cv2.putText(canvas, "MODULECELL BIOPHILIC LAB", (30, 45), FONT_HUD, 0.45, COLOR_TEXT_MUTED, 1, cv2.LINE_AA)
    cv2.putText(canvas, "THESIS PROJECT / 2005", (30, 65), FONT_HUD_COMPACT, 0.9, COLOR_ACCENT, 1, cv2.LINE_AA)
    cv2.line(canvas, (30, 75), (300, 75), COLOR_BORDER, 1)

    # Serial code & Project title
    cv2.putText(canvas, f"CODE: {serial_code}", (30, 105), FONT_HUD, 0.45, COLOR_ACCENT, 1, cv2.LINE_AA)
    # Wrap text or show title
    words = title.split()
    y_off = 135
    for word in words:
        cv2.putText(canvas, word, (30, y_off), FONT_HUD, 0.6, COLOR_TEXT_PRIMARY, 2, cv2.LINE_AA)
        y_off += 25
        
    cv2.line(canvas, (30, y_off + 10), (300, y_off + 10), COLOR_BORDER, 1)
    y_off += 35

    # Simulation stats
    status = "SIMULATING" if frame_idx < total_frames - 1 else "COMPLETED"
    status_color = COLOR_ACCENT if status == "SIMULATING" else COLOR_TEXT_PRIMARY
    cv2.putText(canvas, "SYS STATUS:", (30, y_off), FONT_HUD_COMPACT, 1.0, COLOR_TEXT_MUTED, 1, cv2.LINE_AA)
    cv2.putText(canvas, status, (130, y_off), FONT_HUD_COMPACT, 1.0, status_color, 1, cv2.LINE_AA)
    
    cv2.putText(canvas, "FRAME INDEX:", (30, y_off + 20), FONT_HUD_COMPACT, 1.0, COLOR_TEXT_MUTED, 1, cv2.LINE_AA)
    cv2.putText(canvas, f"{frame_idx:03d} / {total_frames:03d}", (130, y_off + 20), FONT_HUD_COMPACT, 1.0, COLOR_TEXT_PRIMARY, 1, cv2.LINE_AA)
    
    time_val = frame_idx / 30.0
    total_time = total_frames / 30.0
    cv2.putText(canvas, "TIME SECS:", (30, y_off + 40), FONT_HUD_COMPACT, 1.0, COLOR_TEXT_MUTED, 1, cv2.LINE_AA)
    cv2.putText(canvas, f"{time_val:.2f}s / {total_time:.2f}s", (130, y_off + 40), FONT_HUD_COMPACT, 1.0, COLOR_TEXT_PRIMARY, 1, cv2.LINE_AA)

    # Frame progress bar
    bar_x_start = 30
    bar_y = y_off + 60
    bar_w = 270
    bar_h = 6
    cv2.rectangle(canvas, (bar_x_start, bar_y), (bar_x_start + bar_w, bar_y + bar_h), COLOR_BORDER, 1)
    progress_w = int(bar_w * (frame_idx / (total_frames - 1)))
    cv2.rectangle(canvas, (bar_x_start, bar_y), (bar_x_start + progress_w, bar_y + bar_h), COLOR_ACCENT, -1)

    y_off += 95
    cv2.line(canvas, (30, y_off), (300, y_off), COLOR_BORDER, 1)
    y_off += 25

    # Parameter Readout
    cv2.putText(canvas, f"PARAM: {param_name}", (30, y_off), FONT_HUD, 0.45, COLOR_TEXT_MUTED, 1, cv2.LINE_AA)
    cv2.putText(canvas, f"{param_val} {param_unit}", (30, y_off + 28), FONT_HUD, 0.7, COLOR_ACCENT, 2, cv2.LINE_AA)
    
    y_off += 55
    cv2.line(canvas, (30, y_off), (300, y_off), COLOR_BORDER, 1)
    y_off += 25

    # Graphic Visualizer Area (x: 30 to 300, y: y_off to 680)
    cv2.putText(canvas, "MECHANISM DIAGRAM", (30, y_off), FONT_HUD_COMPACT, 1.0, COLOR_TEXT_MUTED, 1, cv2.LINE_AA)
    
    return y_off + 15

def draw_visualizer_book_store(canvas, start_y, frame_idx, total_frames):
    # Visualizer for Kangaroo Bookstore (jumping wave / sine wave louvers)
    center_x = 165
    center_y = start_y + 80
    
    # Draw a 5-bar mechanism representation
    # Draw ground line
    cv2.line(canvas, (60, center_y + 40), (270, center_y + 40), COLOR_BORDER, 1)
    
    t = frame_idx / (total_frames - 1)
    
    # 5 louver positions with phase lag
    num_louvers = 6
    spacing = 35
    for i in range(num_louvers):
        lx = 80 + i * spacing
        # Sine wave height mimicking kangaroo jumping height
        phase = t * np.pi * 2.0 - i * 0.8
        height = 40.0 + 30.0 * np.sin(phase)
        
        # Draw vertical guide track
        cv2.line(canvas, (lx, center_y - 40), (lx, center_y + 40), COLOR_BORDER, 1, cv2.LINE_AA)
        
        # Draw louver panel (moving up/down)
        ly = int(center_y - 20 + height - 30)
        cv2.rectangle(canvas, (lx - 10, ly - 15), (lx + 10, ly + 15), COLOR_ACCENT, 1)
        # Fill louver with faint transparency (cross-hatched)
        cv2.line(canvas, (lx - 10, ly - 15), (lx + 10, ly + 15), COLOR_BORDER, 1)
        cv2.line(canvas, (lx - 10, ly + 15), (lx + 10, ly - 15), COLOR_BORDER, 1)
        # Pivot point
        cv2.circle(canvas, (lx, ly), 3, COLOR_TEXT_PRIMARY, -1)

def draw_visualizer_dynamic_canopy(canvas, start_y, frame_idx, total_frames):
    # Visualizer for Dynamic Bus Stop (Sun tracking mechanism)
    center_x = 165
    center_y = start_y + 80
    
    t = frame_idx / (total_frames - 1)
    # Sun angle moves from 15 to 165 degrees (east to west)
    sun_angle_deg = 15.0 + 150.0 * t
    sun_rad = np.radians(sun_angle_deg)
    
    # Draw ground and seating shelter outline
    cv2.line(canvas, (60, center_y + 50), (270, center_y + 50), COLOR_BORDER, 1)
    # Seating structure
    cv2.rectangle(canvas, (110, center_y + 10), (140, center_y + 50), COLOR_BORDER, 1)
    
    # Sun position
    sun_x = int(center_x + 90 * np.cos(sun_rad + np.pi))
    sun_y = int(center_y - 20 - 70 * np.sin(sun_rad))
    # Draw solar rays
    cv2.line(canvas, (sun_x, sun_y), (center_x, center_y - 20), COLOR_GRID, 1)
    # Draw sun
    cv2.circle(canvas, (sun_x, sun_y), 8, (0, 200, 255), -1, cv2.LINE_AA) # Orange-ish sun
    
    # Louver angle tracking the sun to block direct rays
    louver_angle = 90.0 - sun_angle_deg
    louver_rad = np.radians(louver_angle)
    
    # Draw canopy pivot support
    cv2.line(canvas, (center_x, center_y + 50), (center_x, center_y - 20), COLOR_BORDER, 2)
    cv2.circle(canvas, (center_x, center_y - 20), 4, COLOR_TEXT_PRIMARY, -1)
    
    # Draw rotating shading louver
    lx1 = int(center_x - 45 * np.cos(louver_rad))
    ly1 = int(center_y - 20 - 45 * np.sin(louver_rad))
    lx2 = int(center_x + 45 * np.cos(louver_rad))
    ly2 = int(center_y - 20 + 45 * np.sin(louver_rad))
    
    cv2.line(canvas, (lx1, ly1), (lx2, ly2), COLOR_ACCENT, 3, cv2.LINE_AA)
    # Shading projection rays (perpendicular to sun angle)
    sh_rad = sun_rad + np.pi/2
    cv2.line(canvas, (lx1, ly1), (lx1 + int(20 * np.cos(sh_rad)), ly1 + int(20 * np.sin(sh_rad))), COLOR_BORDER, 1)
    cv2.line(canvas, (lx2, ly2), (lx2 + int(20 * np.cos(sh_rad)), ly2 + int(20 * np.sin(sh_rad))), COLOR_BORDER, 1)

def draw_visualizer_mrt_entrance(canvas, start_y, frame_idx, total_frames):
    # Visualizer for MRT Entrance (sequential rotating fan canopy)
    center_x = 165
    center_y = start_y + 80
    
    # Draw stairs profile
    cv2.line(canvas, (60, center_y + 50), (120, center_y + 50), COLOR_BORDER, 1)
    cv2.line(canvas, (120, center_y + 50), (120, center_y + 20), COLOR_BORDER, 1)
    cv2.line(canvas, (120, center_y + 20), (180, center_y + 20), COLOR_BORDER, 1)
    cv2.line(canvas, (180, center_y + 20), (180, center_y - 10), COLOR_BORDER, 1)
    cv2.line(canvas, (180, center_y - 10), (270, center_y - 10), COLOR_BORDER, 1)
    
    t = frame_idx / (total_frames - 1)
    
    # Draw 5 layers of the rotating fan structural members
    num_members = 5
    for i in range(num_members):
        # Phase lag between members
        phase_offset = i * 0.4
        angle = 15.0 + 60.0 * np.sin((t * np.pi) + phase_offset)
        rad = np.radians(angle)
        
        # Center of rotation for each member is shifted along a line
        px = 90 + i * 20
        py = center_y + 30 - i * 15
        
        # Length of structural member
        length = 70 - i * 5
        tx = int(px + length * np.cos(rad + np.pi/2))
        ty = int(py - length * np.sin(rad + np.pi/2))
        
        # Support hinge
        cv2.circle(canvas, (px, py), 3, COLOR_BORDER, -1)
        # Member rod
        color = COLOR_ACCENT if i == 0 else COLOR_BORDER
        cv2.line(canvas, (px, py), (tx, ty), color, 1 if i > 0 else 2, cv2.LINE_AA)
        cv2.circle(canvas, (tx, ty), 3, COLOR_ACCENT, -1)

def process_video_file(filename_orig, filename_out, serial_code, title, param_name, param_unit, calc_param_fn, draw_viz_fn):
    p_orig = os.path.join(thesis_dir, filename_orig)
    if not os.path.exists(p_orig):
        print(f"Original file not found: {filename_orig}")
        return
        
    cap = cv2.VideoCapture(p_orig)
    if not cap.isOpened():
        print(f"Failed to open video: {filename_orig}")
        return
        
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps <= 0:
        fps = 30.0
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    
    print(f"Processing {filename_orig} -> {frame_count} frames at {fps} fps...")
    
    # Prepare Output Video Writers (both MP4 and AVI)
    p_out_mp4 = os.path.join(thesis_dir, filename_out + ".mp4")
    p_out_avi = os.path.join(thesis_dir, filename_out + ".avi")
    
    fourcc_mp4 = cv2.VideoWriter_fourcc(*'avc1')
    fourcc_avi = cv2.VideoWriter_fourcc(*'XVID')
    
    writer_mp4 = cv2.VideoWriter(p_out_mp4, fourcc_mp4, fps, (1280, 720))
    writer_avi = cv2.VideoWriter(p_out_avi, fourcc_avi, fps, (1280, 720))
    
    frame_idx = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break
            
        # 1. Process 3D video frame: resize and make it look like glowing blueprint
        frame_resized = cv2.resize(frame, (960, 720), interpolation=cv2.INTER_CUBIC)
        gray = cv2.cvtColor(frame_resized, cv2.COLOR_BGR2GRAY)
        
        # Invert grayscale (since original is white-bg)
        inv = 255 - gray
        
        # Increase contrast to isolate lines and shadows
        contrast = cv2.LUT(inv, np.array([0 if i < 35 else (255 if i > 215 else int((i - 35) * 255.0 / 180.0)) for i in range(256)], dtype=np.uint8))
        
        # Smooth and create a glow mask
        glow_mask = cv2.GaussianBlur(contrast, (9, 9), 0)
        
        # Create processed frame BGR
        frame_proc = np.zeros((720, 960, 3), dtype=np.uint8)
        frame_proc[:] = COLOR_BG
        
        # Overlay a subtle localized grid inside the video viewport
        for x in range(0, 960, 80):
            cv2.line(frame_proc, (x, 0), (x, 720), (22, 26, 22), 1)
        for y in range(0, 720, 80):
            cv2.line(frame_proc, (0, y), (960, y), (22, 26, 22), 1)
            
        # Draw the line-art with teal tint
        mask_f = contrast.astype(np.float32) / 255.0
        mask_f = np.expand_dims(mask_f, axis=2)
        
        glow_f = glow_mask.astype(np.float32) / 255.0
        glow_f = np.expand_dims(glow_f, axis=2)
        
        # Add glow layer (softer, wider)
        teal_glow = np.array(COLOR_ACCENT, dtype=np.float32) * 0.4
        frame_proc_glow = frame_proc.astype(np.float32) * (1.0 - glow_f) + teal_glow * glow_f
        
        # Add sharp line layer (crisp teal)
        teal_sharp = np.array(COLOR_ACCENT, dtype=np.float32)
        frame_proc_final = (frame_proc_glow * (1.0 - mask_f) + teal_sharp * mask_f).astype(np.uint8)
        
        # 2. Prepare full 1280x720 canvas
        canvas = np.zeros((720, 1280, 3), dtype=np.uint8)
        canvas[:] = COLOR_BG
        
        # 3. Paste processed video frame onto the right side (x: 320 to 1280)
        canvas[0:720, 320:1280] = frame_proc_final
        
        # 4. Calculate dynamic parameters for HUD readout
        t_percent = frame_idx / max(1, frame_count - 1)
        param_val = calc_param_fn(t_percent)
        
        # 5. Draw HUD base and visualizers on the left panel
        viz_y = draw_hud_base(canvas, title, serial_code, frame_idx, frame_count, param_name, param_val, param_unit)
        draw_viz_fn(canvas, viz_y, frame_idx, frame_count)
        
        # Write frames to video writers
        writer_mp4.write(canvas)
        writer_avi.write(canvas)
        
        frame_idx += 1
        
    cap.release()
    writer_mp4.release()
    writer_avi.release()
    print(f"Saved: {filename_out}.mp4 and {filename_out}.avi")

if __name__ == "__main__":
    print("Starting thesis video modernization...")
    
    # 1. Kangaroo Bookstore (Book store.avi -> book_store)
    def calc_bookstore_val(t):
        # Displacement in mm (wave movement amplitude)
        return f"{50.0 * np.sin(t * np.pi * 2.0):+.1f}"
    process_video_file(
        "Book store.avi", 
        "book_store", 
        "MCell-TH-KGA", 
        "THE KANGAROO BOOKSTORE", 
        "FACADE DISPLACEMENT", 
        "mm", 
        calc_bookstore_val, 
        draw_visualizer_book_store
    )
    
    # 2. Dynamic Bus Stop (動態頂棚.avi -> dynamic_canopy)
    def calc_canopy_val(t):
        # Solar Elevation Angle
        solar_elevation = 15.0 + 150.0 * t  # sunrise to sunset (15 to 165 deg)
        louver_angle = 90.0 - solar_elevation
        return f"SLR:{solar_elevation:.1f} / LVR:{louver_angle:+.1f}"
    process_video_file(
        "動態頂棚.avi", 
        "dynamic_canopy", 
        "MCell-TH-GRF", 
        "THE DYNAMIC BUS STOP", 
        "TRACKING ANGLE (SUN/LVR)", 
        "deg", 
        calc_canopy_val, 
        draw_visualizer_dynamic_canopy
    )
    
    # 3. Dynamic Canopy / MRT Entrance (捷運入口.avi -> mrt_entrance)
    def calc_mrt_val(t):
        # Sequential fan rotation angle
        main_angle = 15.0 + 60.0 * np.sin(t * np.pi)
        return f"{main_angle:.1f}"
    process_video_file(
        "捷運入口.avi", 
        "mrt_entrance", 
        "MCell-TH-GBN", 
        "THE DYNAMIC MRT CANOPY", 
        "PIVOT SECTOR ANGLE", 
        "deg", 
        calc_mrt_val, 
        draw_visualizer_mrt_entrance
    )
    
    print("All thesis video animations rendered successfully in blueprint dark theme!")
