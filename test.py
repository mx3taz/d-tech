from PIL import Image

img = Image.open('img/saba.jpg').convert('RGBA')
datas = img.getdata()

new_data = []
for item in datas:
    # change all white (also shades of whites)
    # to transparent
    if item[0] > 220 and item[1] > 220 and item[2] > 220:
        new_data.append((255, 255, 255, 0))
    else:
        new_data.append(item)

img.putdata(new_data)
img.save('img/saba.png', 'PNG')
