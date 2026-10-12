#!/usr/bin/env python3
"""
Generiert die verbesserte Sigmoid-Modellvergleich SVG mit:
- Glatten Kurven (ohne Ecken)
- Projektionen der Datenpunkte auf die Kurven
"""

import numpy as np
import xml.etree.ElementTree as ET
from xml.dom import minidom

def sigmoid(z):
    """Sigmoid-Funktion"""
    return 1.0 / (1.0 + np.exp(-z))

def generate_sigmoid_svg():
    """Generiert die SVG-Grafik"""
    
    # Canvas-Einstellungen
    width = 640
    height = 400
    margin_left = 60
    margin_right = 60
    margin_top = 30
    margin_bottom = 70
    
    plot_width = width - margin_left - margin_right
    plot_height = height - margin_top - margin_bottom
    
    # Datenbereich
    x_min, x_max = -3, 7
    y_min, y_max = 0, 1
    
    # Datenpunkte (aus der Original-SVG)
    # x = 0.5, 1.0, 1.5, 2.0, 2.5, 3.0
    # y = 0, 0, 0, 0, 1, 1
    data_points = [
        (0.5, 0),
        (1.0, 0),
        (1.5, 0),
        (2.0, 0),
        (2.5, 1),
        (3.0, 1),
    ]
    
    # Modelle
    model_a = {"m": 1.0, "b": -1.8, "color": "#2a7de1", "name": "Modell A", "label": "σ(1.0x - 1.8)"}
    model_b = {"m": 1.4, "b": -2.9, "color": "#e14d2a", "name": "Modell B", "label": "σ(1.4x - 2.9)"}
    
    def data_to_canvas(x, y):
        """Konvertiert Datenpunkte zu Canvas-Koordinaten"""
        canvas_x = margin_left + (x - x_min) / (x_max - x_min) * plot_width
        canvas_y = margin_top + (1 - y) * plot_height  # Y-Achse ist umgekehrt
        return canvas_x, canvas_y
    
    # SVG aufbauen
    svg = ET.Element('svg')
    svg.set('xmlns', 'http://www.w3.org/2000/svg')
    svg.set('width', str(width))
    svg.set('height', str(height))
    svg.set('viewBox', f'0 0 {width} {height}')
    svg.set('role', 'img')
    svg.set('aria-label', 'Sigmoid-Kurven der Modelle A und B mit Datenpunkten und Projektionen')
    
    # Style
    style = ET.SubElement(svg, 'style')
    style.text = """
    .axis { stroke: #222; stroke-width: 1; }
    .grid { stroke: #ccc; stroke-width: 0.5; }
    .grid-fine { stroke: #eee; stroke-width: 0.4; }
    .label { font-family: Arial, sans-serif; font-size: 12px; fill: #222; }
    .legend { font-family: Arial, sans-serif; fill: #222; }
    """
    
    # Weisser Hintergrund
    rect = ET.SubElement(svg, 'rect')
    rect.set('x', '0')
    rect.set('y', '0')
    rect.set('width', str(width))
    rect.set('height', str(height))
    rect.set('fill', 'white')
    
    # Grid-Gruppe
    grid_group = ET.SubElement(svg, 'g')
    
    # Horizontale Gitter
    for i in np.arange(0, 1.1, 0.1):
        y_canvas = margin_top + (1 - i) * plot_height
        line = ET.SubElement(grid_group, 'line')
        line.set('class', 'grid')
        line.set('x1', str(margin_left))
        line.set('y1', str(y_canvas))
        line.set('x2', str(width - margin_right))
        line.set('y2', str(y_canvas))
        
        # Label
        label = ET.SubElement(grid_group, 'text')
        label.set('class', 'label')
        label.set('x', str(margin_left - 6))
        label.set('y', str(y_canvas + 4))
        label.set('text-anchor', 'end')
        label.text = f'{i:.1f}'
    
    # Vertikale Gitter
    for i in range(-3, 8, 2):
        x_canvas = margin_left + (i - x_min) / (x_max - x_min) * plot_width
        line = ET.SubElement(grid_group, 'line')
        line.set('class', 'grid')
        line.set('x1', str(x_canvas))
        line.set('y1', str(margin_top))
        line.set('x2', str(x_canvas))
        line.set('y2', str(height - margin_bottom))
        
        # Label
        label = ET.SubElement(grid_group, 'text')
        label.set('class', 'label')
        label.set('x', str(x_canvas))
        label.set('y', str(height - margin_bottom + 20))
        label.set('text-anchor', 'middle')
        label.text = str(i)
    
    # Achsen
    # X-Achse
    line = ET.SubElement(svg, 'line')
    line.set('class', 'axis')
    line.set('x1', str(margin_left))
    line.set('y1', str(height - margin_bottom))
    line.set('x2', str(width - margin_right))
    line.set('y2', str(height - margin_bottom))
    
    # Y-Achse
    line = ET.SubElement(svg, 'line')
    line.set('class', 'axis')
    line.set('x1', str(margin_left))
    line.set('y1', str(margin_top))
    line.set('x2', str(margin_left))
    line.set('y2', str(height - margin_bottom))
    
    # Achsen-Label
    label_x = ET.SubElement(svg, 'text')
    label_x.set('class', 'label')
    label_x.set('x', str(width / 2))
    label_x.set('y', str(height - 10))
    label_x.set('text-anchor', 'middle')
    label_x.text = 'x'
    
    label_y = ET.SubElement(svg, 'text')
    label_y.set('class', 'label')
    label_y.set('x', str(20))
    label_y.set('y', str(height / 2))
    label_y.set('text-anchor', 'middle')
    label_y.set('transform', 'rotate(-90 20 ' + str(height / 2) + ')')
    label_y.text = 'p'
    
    # Schwellenlinie bei p=0.5
    line = ET.SubElement(svg, 'line')
    line.set('x1', str(margin_left))
    line.set('y1', str(margin_top + plot_height / 2))
    line.set('x2', str(width - margin_right))
    line.set('y2', str(margin_top + plot_height / 2))
    line.set('stroke', '#888')
    line.set('stroke-width', '1')
    line.set('stroke-dasharray', '4 3')
    
    # Klassifizierungsregionen (halbdurchsichtige Hintergründe)
    # Modell A: x = 1.8
    x_threshold_a = 1.8
    x_canvas_a = margin_left + (x_threshold_a - x_min) / (x_max - x_min) * plot_width
    
    # Region für Klasse 0 (links von x_threshold_a) - Modell A
    rect_a0 = ET.SubElement(svg, 'rect')
    rect_a0.set('x', str(margin_left))
    rect_a0.set('y', str(margin_top))
    rect_a0.set('width', str(x_canvas_a - margin_left))
    rect_a0.set('height', str(plot_height))
    rect_a0.set('fill', model_a["color"])
    rect_a0.set('opacity', '0')
    
    # Region für Klasse 1 (rechts von x_threshold_a) - Modell A
    rect_a1 = ET.SubElement(svg, 'rect')
    rect_a1.set('x', str(x_canvas_a))
    rect_a1.set('y', str(margin_top))
    rect_a1.set('width', str(width - margin_right - x_canvas_a))
    rect_a1.set('height', str(plot_height))
    rect_a1.set('fill', model_a["color"])
    rect_a1.set('opacity', '0')
    
    # Modell B: x = 2.9/1.4 ≈ 2.071
    x_threshold_b = 2.9 / 1.4
    x_canvas_b = margin_left + (x_threshold_b - x_min) / (x_max - x_min) * plot_width
    
    # Region für Klasse 0 (links von x_threshold_b) - Modell B
    rect_b0 = ET.SubElement(svg, 'rect')
    rect_b0.set('x', str(margin_left))
    rect_b0.set('y', str(margin_top))
    rect_b0.set('width', str(x_canvas_b - margin_left))
    rect_b0.set('height', str(plot_height))
    rect_b0.set('fill', model_b["color"])
    rect_b0.set('opacity', '0')
    
    # Region für Klasse 1 (rechts von x_threshold_b) - Modell B
    rect_b1 = ET.SubElement(svg, 'rect')
    rect_b1.set('x', str(x_canvas_b))
    rect_b1.set('y', str(margin_top))
    rect_b1.set('width', str(width - margin_right - x_canvas_b))
    rect_b1.set('height', str(plot_height))
    rect_b1.set('fill', model_b["color"])
    rect_b1.set('opacity', '0')
    
    # Entscheidungsgrenzen (vertikale Linien - durchgehend mit höherer Opacity)
    # Modell A: x = 1.8
    x_threshold_a = 1.8
    x_canvas_a = margin_left + (x_threshold_a - x_min) / (x_max - x_min) * plot_width
    line_a = ET.SubElement(svg, 'line')
    line_a.set('x1', str(x_canvas_a))
    line_a.set('y1', str(margin_top))
    line_a.set('x2', str(x_canvas_a))
    line_a.set('y2', str(height - margin_bottom))
    line_a.set('stroke', model_a["color"])
    line_a.set('stroke-width', '1.2')
    line_a.set('opacity', '0.4')
    
    # Modell B: x = 2.9/1.4 ≈ 2.071
    x_threshold_b = 2.9 / 1.4
    x_canvas_b = margin_left + (x_threshold_b - x_min) / (x_max - x_min) * plot_width
    line_b = ET.SubElement(svg, 'line')
    line_b.set('x1', str(x_canvas_b))
    line_b.set('y1', str(margin_top))
    line_b.set('x2', str(x_canvas_b))
    line_b.set('y2', str(height - margin_bottom))
    line_b.set('stroke', model_b["color"])
    line_b.set('stroke-width', '1.2')
    line_b.set('opacity', '0.4')
    
    # Funktionskurven mit vielen Samples für glatte Linien
    for model in [model_a, model_b]:
        x_vals = np.linspace(x_min, x_max, 500)  # Viele Samples für glatte Kurve
        y_vals = sigmoid(model["m"] * x_vals + model["b"])
        
        points = []
        for x, y in zip(x_vals, y_vals):
            x_c, y_c = data_to_canvas(x, y)
            points.append(f'{x_c:.1f},{y_c:.1f}')
        
        polyline = ET.SubElement(svg, 'polyline')
        polyline.set('fill', 'none')
        polyline.set('stroke', model["color"])
        polyline.set('stroke-width', '2')
        polyline.set('stroke-linecap', 'round')
        polyline.set('stroke-linejoin', 'round')
        polyline.set('points', ' '.join(points))
    
    # Projektionen der Datenpunkte zeichnen
    projection_group = ET.SubElement(svg, 'g')
    projection_group.set('stroke', '#999')
    projection_group.set('stroke-width', '1')
    projection_group.set('stroke-dasharray', '2 2')
    projection_group.set('opacity', '0.6')
    
    # Projektionspunkte-Gruppe
    projection_points = ET.SubElement(svg, 'g')
    projection_points.set('fill', '#666')
    
    for x, y_true in data_points:
        x_canvas, y_canvas = data_to_canvas(x, y_true)
        
        # Projektion auf Modell A
        y_pred_a = sigmoid(model_a["m"] * x + model_a["b"])
        x_canvas_a, y_canvas_a = data_to_canvas(x, y_pred_a)
        line = ET.SubElement(projection_group, 'line')
        line.set('x1', str(x_canvas))
        line.set('y1', str(y_canvas))
        line.set('x2', str(x_canvas_a))
        line.set('y2', str(y_canvas_a))
        line.set('stroke', model_a["color"])
        line.set('stroke-dasharray', '2 2')
        
        # Punkt auf Kurve A
        circle_a = ET.SubElement(projection_points, 'circle')
        circle_a.set('cx', str(x_canvas_a))
        circle_a.set('cy', str(y_canvas_a))
        circle_a.set('r', '1.5')
        circle_a.set('fill', model_a["color"])
        
        # Projektion auf Modell B
        y_pred_b = sigmoid(model_b["m"] * x + model_b["b"])
        x_canvas_b, y_canvas_b = data_to_canvas(x, y_pred_b)
        
        # Spezialfall: Bei Punkt (2.5, 1) von A zu B in Rot
        if x == 2.5:
            line = ET.SubElement(projection_group, 'line')
            line.set('x1', str(x_canvas_a))
            line.set('y1', str(y_canvas_a))
            line.set('x2', str(x_canvas_b))
            line.set('y2', str(y_canvas_b))
            line.set('stroke', model_b["color"])
            line.set('stroke-dasharray', '2 2')
        else:
            # Normal: von Datenpunkt direkt zu B
            line = ET.SubElement(projection_group, 'line')
            line.set('x1', str(x_canvas))
            line.set('y1', str(y_canvas))
            line.set('x2', str(x_canvas_b))
            line.set('y2', str(y_canvas_b))
            line.set('stroke', model_b["color"])
            line.set('stroke-dasharray', '2 2')
        
        # Punkt auf Kurve B
        circle_b = ET.SubElement(projection_points, 'circle')
        circle_b.set('cx', str(x_canvas_b))
        circle_b.set('cy', str(y_canvas_b))
        circle_b.set('r', '1.5')
        circle_b.set('fill', model_b["color"])
    
    # Schwellenwert 0.5 auf beiden Funktionen markieren
    threshold_points = ET.SubElement(svg, 'g')
    threshold_points.set('fill', 'white')
    threshold_points.set('stroke', '#888')
    threshold_points.set('stroke-width', '2')
    
    # Modell A: finde x wo sigmoid(1.0*x - 1.8) = 0.5
    # sigmoid = 0.5 wenn z = 0, also 1.0*x - 1.8 = 0 => x = 1.8
    x_threshold_a = 1.8
    x_canvas_threshold_a, y_canvas_threshold_a = data_to_canvas(x_threshold_a, 0.5)
    rect_threshold_a = ET.SubElement(threshold_points, 'rect')
    rect_threshold_a.set('x', str(x_canvas_threshold_a - 2))
    rect_threshold_a.set('y', str(y_canvas_threshold_a - 2))
    rect_threshold_a.set('width', '4')
    rect_threshold_a.set('height', '4')
    
    # Modell B: finde x wo sigmoid(1.4*x - 2.9) = 0.5
    # sigmoid = 0.5 wenn z = 0, also 1.4*x - 2.9 = 0 => x = 2.9/1.4
    x_threshold_b = 2.9 / 1.4
    x_canvas_threshold_b, y_canvas_threshold_b = data_to_canvas(x_threshold_b, 0.5)
    rect_threshold_b = ET.SubElement(threshold_points, 'rect')
    rect_threshold_b.set('x', str(x_canvas_threshold_b - 2))
    rect_threshold_b.set('y', str(y_canvas_threshold_b - 2))
    rect_threshold_b.set('width', '4')
    rect_threshold_b.set('height', '4')
    
    # Datenpunkte zeichnen
    data_group = ET.SubElement(svg, 'g')
    
    for x, y_true in data_points:
        x_canvas, y_canvas = data_to_canvas(x, y_true)
        
        circle = ET.SubElement(data_group, 'circle')
        circle.set('cx', str(x_canvas))
        circle.set('cy', str(y_canvas))
        circle.set('r', '4')
        circle.set('fill', '#2a9d8f' if y_true == 1 else '#7b8794')
        circle.set('stroke', '#222')
        circle.set('stroke-width', '1')
    
    # Legende (kompakt)
    legend_group = ET.SubElement(svg, 'g')
    
    # Legendenbox
    rect = ET.SubElement(legend_group, 'rect')
    rect.set('x', '70')
    rect.set('y', '40')
    rect.set('width', '160')
    rect.set('height', '95')
    rect.set('fill', 'white')
    rect.set('stroke', '#ccc')
    
    # Legende - Modell A
    line = ET.SubElement(legend_group, 'line')
    line.set('x1', '80')
    line.set('y1', '48')
    line.set('x2', '100')
    line.set('y2', '48')
    line.set('stroke', model_a["color"])
    line.set('stroke-width', '2')
    line.set('stroke-linecap', 'round')
    
    text = ET.SubElement(legend_group, 'text')
    text.set('class', 'legend')
    text.set('x', '110')
    text.set('y', '51')
    text.set('font-size', '8.5')
    text.text = f'Modell A: p = {model_a["label"]}'
    
    # Legende - Modell B
    line = ET.SubElement(legend_group, 'line')
    line.set('x1', '80')
    line.set('y1', '56')
    line.set('x2', '100')
    line.set('y2', '56')
    line.set('stroke', model_b["color"])
    line.set('stroke-width', '2')
    line.set('stroke-linecap', 'round')
    
    text = ET.SubElement(legend_group, 'text')
    text.set('class', 'legend')
    text.set('x', '110')
    text.set('y', '59')
    text.set('font-size', '8.5')
    text.text = f'Modell B: p = {model_b["label"]}'
    
    # Legende - Datenpunkt 0 (wahre Werte)
    circle = ET.SubElement(legend_group, 'circle')
    circle.set('cx', '90')
    circle.set('cy', '66')
    circle.set('r', '3')
    circle.set('fill', '#7b8794')
    circle.set('stroke', '#222')
    circle.set('stroke-width', '0.5')
    
    text = ET.SubElement(legend_group, 'text')
    text.set('class', 'legend')
    text.set('x', '110')
    text.set('y', '69')
    text.set('font-size', '8.5')
    text.text = f'Punkt: 0 (wahre Werte)'
    
    # Legende - Datenpunkt 1 (wahre Werte)
    circle = ET.SubElement(legend_group, 'circle')
    circle.set('cx', '90')
    circle.set('cy', '76')
    circle.set('r', '3')
    circle.set('fill', '#2a9d8f')
    circle.set('stroke', '#222')
    circle.set('stroke-width', '0.5')
    
    text = ET.SubElement(legend_group, 'text')
    text.set('class', 'legend')
    text.set('x', '110')
    text.set('y', '79')
    text.set('font-size', '8.5')
    text.text = f'Punkt: 1 (wahre Werte)'
    
    # Legende - Schwelle
    line = ET.SubElement(legend_group, 'line')
    line.set('x1', '80')
    line.set('y1', '88')
    line.set('x2', '100')
    line.set('y2', '88')
    line.set('stroke', '#888')
    line.set('stroke-width', '1')
    line.set('stroke-dasharray', '2 2')
    
    text = ET.SubElement(legend_group, 'text')
    text.set('class', 'legend')
    text.set('x', '110')
    text.set('y', '91')
    text.set('font-size', '8.5')
    text.text = f'Schwelle p=0.5'

    # Legende - Schwellenpunkt (Quadrat)
    square = ET.SubElement(legend_group, 'rect')
    square.set('x', '86')
    square.set('y', '100')
    square.set('width', '4')
    square.set('height', '4')
    square.set('fill', 'white')
    square.set('stroke', '#888')
    square.set('stroke-width', '1.5')

    text = ET.SubElement(legend_group, 'text')
    text.set('class', 'legend')
    text.set('x', '110')
    text.set('y', '103')
    text.set('font-size', '8.5')
    text.text = f'Schwellenpunkt p=0.5'

    # Legende - Entscheidungsgrenze Modell A
    line = ET.SubElement(legend_group, 'line')
    line.set('x1', '80')
    line.set('y1', '112')
    line.set('x2', '100')
    line.set('y2', '112')
    line.set('stroke', model_a["color"])
    line.set('stroke-width', '1.2')
    line.set('opacity', '0.6')

    text = ET.SubElement(legend_group, 'text')
    text.set('class', 'legend')
    text.set('x', '110')
    text.set('y', '115')
    text.set('font-size', '8.5')
    text.text = f'Schwellengrenze Modell A'

    # Legende - Entscheidungsgrenze Modell B
    line = ET.SubElement(legend_group, 'line')
    line.set('x1', '80')
    line.set('y1', '122')
    line.set('x2', '100')
    line.set('y2', '122')
    line.set('stroke', model_b["color"])
    line.set('stroke-width', '1.2')
    line.set('opacity', '0.6')

    text = ET.SubElement(legend_group, 'text')
    text.set('class', 'legend')
    text.set('x', '110')
    text.set('y', '125')
    text.set('font-size', '8.5')
    text.text = f'Schwellengrenze Modell B'
    
    return svg

def prettify_xml(elem):
    """Gibt schönes formatiertes XML aus"""
    rough_string = ET.tostring(elem, 'utf-8')
    reparsed = minidom.parseString(rough_string)
    return reparsed.toprettyxml(indent="  ")

if __name__ == '__main__':
    svg = generate_sigmoid_svg()
    
    # XML schreiben
    xml_str = prettify_xml(svg)
    
    # Header entfernen
    xml_lines = xml_str.split('\n')[1:]
    xml_str = '\n'.join(xml_lines)
    
    # In Datei schreiben
    output_path = '/home/kbohn/repos/ki-unterricht/worksheets/md/svg/sigmoid_modelvergleich.svg'
    with open(output_path, 'w') as f:
        f.write(xml_str)
    
    print(f'SVG generiert: {output_path}')
