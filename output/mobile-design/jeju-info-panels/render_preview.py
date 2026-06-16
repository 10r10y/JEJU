from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageFilter


ROOT = Path(__file__).resolve().parent
OUT = ROOT / "design.png"

W, H = 1540, 1120
INK = "#193845"
SOFT = "#46626d"
MUTED = "#7d97a1"
HAIR = "#dde8ea"
HAIR_STRONG = "#c4d5d8"
PAPER = "#e4edef"
SEA = "#b9dce3"
LAND = "#e7f4e7"
SURFACE = "#ffffff"
DAY = ["#2f8f9d", "#cf8a4c", "#4f74a8", "#6f9a64", "#b06d86"]


def font(size, bold=False, serif=False):
    candidates = [
        r"C:\Windows\Fonts\msyhbd.ttc" if bold else r"C:\Windows\Fonts\msyh.ttc",
        r"C:\Windows\Fonts\simsun.ttc" if serif else r"C:\Windows\Fonts\msyh.ttc",
        r"C:\Windows\Fonts\arialbd.ttf" if bold else r"C:\Windows\Fonts\arial.ttf",
    ]
    for item in candidates:
        if item and Path(item).exists():
            return ImageFont.truetype(item, size)
    return ImageFont.load_default()


F = {
    "h1": font(30, True),
    "h2": font(22, True),
    "body": font(13, True),
    "small": font(12, True),
    "tiny": font(10, True),
    "num": font(46, True, True),
    "brand": font(24, True, True),
    "card": font(17, True, True),
}


def shadowed(base, box, radius=28, fill=(0, 0, 0, 42), blur=26, dy=22):
    shadow = Image.new("RGBA", base.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    x, y, r, b = box
    sd.rounded_rectangle((x, y + dy, r, b + dy), radius=radius, fill=fill)
    shadow = shadow.filter(ImageFilter.GaussianBlur(blur))
    base.alpha_composite(shadow)


def text(draw, xy, value, fill=INK, f=None, anchor=None):
    draw.text(xy, value, fill=fill, font=f or F["body"], anchor=anchor)


def pill(draw, xy, label, active=False, w=70):
    x, y = xy
    fill = INK if active else "#eef4f5"
    outline = None if active else HAIR
    draw.rounded_rectangle((x, y, x + w, y + 32), radius=16, fill=fill, outline=outline)
    text(draw, (x + w / 2, y + 9), label, fill="#fff" if active else MUTED, f=F["small"], anchor="ma")


def checkbox(draw, x, y, checked=False, color=DAY[0]):
    if checked:
        draw.ellipse((x, y, x + 20, y + 20), fill=color)
        draw.line((x + 5, y + 10, x + 9, y + 14, x + 15, y + 6), fill="#fff", width=3, joint="curve")
    else:
        draw.ellipse((x, y, x + 20, y + 20), fill="#fff", outline=HAIR_STRONG, width=2)


def draw_map(draw, x, y):
    draw.rectangle((x, y, x + 440, y + 430), fill=SEA)
    island = [(x + 80, y + 244), (x + 120, y + 198), (x + 188, y + 168), (x + 282, y + 178),
              (x + 370, y + 216), (x + 324, y + 294), (x + 238, y + 326), (x + 137, y + 306)]
    draw.polygon(island, fill=LAND)
    draw.line(island + [island[0]], fill="#b7cbb4", width=2)
    draw.line((x + 120, y + 238, x + 185, y + 244, x + 242, y + 229, x + 330, y + 258), fill="#5e94a2", width=4)
    for i, (mx, my, c) in enumerate([(126, 238, DAY[0]), (185, 244, DAY[1]), (242, 229, DAY[2]), (330, 258, DAY[3])], 1):
        draw.ellipse((x + mx - 17, y + my - 17, x + mx + 17, y + my + 17), fill="#fff")
        draw.ellipse((x + mx - 14, y + my - 14, x + mx + 14, y + my + 14), fill=c)
        text(draw, (x + mx, y + my - 8), str(i), fill="#fff", f=F["small"], anchor="ma")


def brand(draw, x, y, eyebrow="Itinerary", title="JEJU 济州岛", meta="6.9 - 6.13 · 5天4晚"):
    draw.rounded_rectangle((x + 19, y + 16, x + 205, y + 100), radius=16, fill="#fafdfe", outline="#ffffff")
    text(draw, (x + 35, y + 30), eyebrow.upper(), fill=MUTED, f=F["tiny"])
    text(draw, (x + 35, y + 50), title, fill=INK, f=F["brand"])
    text(draw, (x + 35, y + 78), meta, fill=SOFT, f=F["tiny"])


def panel_tabs(draw, x, y, active):
    tabs = ["行程", "准备", "注意", "美食"]
    widths = [68, 68, 68, 68]
    cur = x + 22
    for tab, w in zip(tabs, widths):
        is_active = tab == active
        draw.rounded_rectangle((cur, y, cur + w, y + 34), radius=17, fill=INK if is_active else "#eef4f5",
                               outline=None if is_active else HAIR)
        text(draw, (cur + w / 2, y + 9), tab, fill="#fff" if is_active else MUTED, f=F["small"], anchor="ma")
        cur += w + 8


def phone_base(base, x, title):
    shadowed(base, (x, 150, x + 440, 1050), radius=34, blur=30, dy=25)
    draw = ImageDraw.Draw(base)
    draw.rounded_rectangle((x, 150, x + 440, 1050), radius=34, fill=PAPER)
    draw_map(draw, x, 150)
    brand(draw, x, 150, title=title)
    draw.rounded_rectangle((x, 564, x + 440, 1050), radius=30, fill=SURFACE)
    draw.rounded_rectangle((x + 199, 579, x + 241, 584), radius=3, fill=HAIR_STRONG)
    return draw


def card(draw, x, y, h, accent=None, fill=SURFACE):
    draw.rounded_rectangle((x, y, x + 396, y + h), radius=16, fill=fill, outline=accent or HAIR_STRONG, width=2)


def draw_prepare(base, x):
    draw = phone_base(base, x, "JEJU 济州岛")
    panel_tabs(draw, x, 602, "准备")
    text(draw, (x + 22, 674), "PREPARE", fill=MUTED, f=F["tiny"])
    text(draw, (x + 22, 700), "16", fill=DAY[0], f=F["num"])
    text(draw, (x + 70, 706), "/24", fill=MUTED, f=F["small"])
    text(draw, (x + 110, 676), "出发前准备", f=F["h2"])
    text(draw, (x + 110, 704), "可勾选 · 自动保存 · 关联 D4 汉拿山", fill=SOFT, f=F["small"])
    pill(draw, (x + 22, 730), "全部", True)
    pill(draw, (x + 100, 730), "未完成", False, 78)
    pill(draw, (x + 188, 730), "必带", False)
    pill(draw, (x + 266, 730), "汉拿山", False, 84)
    card(draw, x + 22, 786, 112)
    text(draw, (x + 38, 808), "证件与支付", fill=DAY[0], f=F["tiny"])
    checkbox(draw, x + 38, 828, True)
    text(draw, (x + 70, 831), "护照、机票与酒店订单截图", fill=SOFT, f=F["body"])
    checkbox(draw, x + 38, 864, False)
    text(draw, (x + 70, 867), "韩元现金、小额零钱、T-money 交通卡", f=F["body"])
    card(draw, x + 22, 914, 114)
    text(draw, (x + 38, 936), "D4 汉拿山", fill=DAY[3], f=F["tiny"])
    checkbox(draw, x + 38, 956, False)
    text(draw, (x + 70, 959), "登山鞋、薄外套、轻便雨衣", f=F["body"])
    checkbox(draw, x + 38, 992, False)
    text(draw, (x + 70, 995), "补水、能量棒、预约二维码", f=F["body"])


def draw_tips(base, x):
    draw = phone_base(base, x, "当地注意")
    panel_tabs(draw, x, 602, "注意")
    text(draw, (x + 22, 674), "TIPS", fill=MUTED, f=F["tiny"])
    text(draw, (x + 22, 700), "6", fill=DAY[4], f=F["num"])
    text(draw, (x + 62, 706), "类", fill=MUTED, f=F["small"])
    text(draw, (x + 110, 676), "当地习俗 / 注意事项", f=F["h2"])
    text(draw, (x + 110, 704), "折叠阅读 · 重点置顶 · 可转准备项", fill=SOFT, f=F["small"])
    pill(draw, (x + 22, 730), "重点", True)
    pill(draw, (x + 100, 730), "交通", False)
    pill(draw, (x + 178, 730), "餐饮", False)
    pill(draw, (x + 256, 730), "礼仪", False)
    card(draw, x + 22, 786, 88, accent=DAY[1], fill="#fff8f5")
    text(draw, (x + 38, 812), "清晨机场建议打车", fill=DAY[1], f=F["h2"])
    text(draw, (x + 38, 842), "6.13 早班机，公交不稳定；建议 05:30-05:45 出发。", fill=SOFT, f=F["body"])
    text(draw, (x + 350, 812), "D5", fill=DAY[1], f=F["tiny"])
    card(draw, x + 22, 902, 76)
    text(draw, (x + 38, 929), "牛岛还车和末班船", f=F["h2"])
    text(draw, (x + 38, 956), "建议 16:00-16:30 还车，17:00 前坐船返回。", fill=SOFT, f=F["body"])
    card(draw, x + 22, 996, 76)
    text(draw, (x + 38, 1023), "部分餐厅有 break time", f=F["h2"])
    text(draw, (x + 38, 1050), "美食卡显示营业时间，临近用餐前优先确认。", fill=SOFT, f=F["body"])


def draw_food(base, x):
    draw = phone_base(base, x, "美食清单")
    # extra restaurant markers on the map
    for mx, my in [(186, 252), (337, 256)]:
        draw.ellipse((x + mx - 15, 150 + my - 15, x + mx + 15, 150 + my + 15), fill="#fff", outline=INK, width=3)
        draw.line((x + mx - 6, 150 + my - 4, x + mx + 6, 150 + my - 4), fill=INK, width=2)
        draw.line((x + mx - 3, 150 + my - 4, x + mx - 3, 150 + my + 8), fill=INK, width=2)
        draw.line((x + mx + 3, 150 + my - 4, x + mx + 3, 150 + my + 8), fill=INK, width=2)
    panel_tabs(draw, x, 602, "美食")
    text(draw, (x + 22, 674), "FOOD", fill=MUTED, f=F["tiny"])
    text(draw, (x + 22, 700), "8", fill=DAY[1], f=F["num"])
    text(draw, (x + 62, 706), "家", fill=MUTED, f=F["small"])
    text(draw, (x + 110, 676), "美食清单", f=F["h2"])
    text(draw, (x + 110, 704), "地图联动 · 营业状态 · 可加入行程", fill=SOFT, f=F["small"])
    pill(draw, (x + 22, 730), "全部", True)
    pill(draw, (x + 100, 730), "营业中", False, 78)
    pill(draw, (x + 188, 730), "咸德", False)
    pill(draw, (x + 266, 730), "牛岛", False)
    card(draw, x + 22, 786, 126)
    text(draw, (x + 38, 812), "海女之家", fill=DAY[1], f=F["card"])
    draw.rounded_rectangle((x + 316, 802, x + 382, 826), radius=12, fill="#e8f4f1")
    text(draw, (x + 349, 806), "营业中", fill=DAY[0], f=F["tiny"], anchor="ma")
    text(draw, (x + 38, 840), "城山附近 · 10:00-20:00 · 海鲜锅 / 鲍鱼粥", fill=SOFT, f=F["body"])
    text(draw, (x + 38, 866), "适合作为 D2 牛岛前后午餐备选。", f=F["body"])
    draw.rounded_rectangle((x + 38, 882, x + 146, 908), radius=13, fill=INK)
    text(draw, (x + 92, 887), "加入 D2 午餐", fill="#fff", f=F["tiny"], anchor="ma")
    draw.rounded_rectangle((x + 156, 882, x + 222, 908), radius=13, fill="#eef4f5", outline=HAIR)
    text(draw, (x + 189, 887), "收藏", fill=MUTED, f=F["tiny"], anchor="ma")
    card(draw, x + 22, 934, 112)
    text(draw, (x + 38, 960), "咸德黑猪肉", fill=DAY[1], f=F["card"])
    draw.rounded_rectangle((x + 316, 946, x + 382, 970), radius=12, fill="#f7eee9")
    text(draw, (x + 349, 950), "晚餐", fill=DAY[1], f=F["tiny"], anchor="ma")
    text(draw, (x + 38, 988), "咸德海滩 · 17:00-23:00 · 黑猪肉 / 泡菜汤", fill=SOFT, f=F["body"])
    text(draw, (x + 38, 1014), "酒店附近，适合 D1 到达后轻松吃。", f=F["body"])


def main():
    base = Image.new("RGBA", (W, H), "#eef4f5")
    draw = ImageDraw.Draw(base)
    text(draw, (70, 55), "济州行程新增模块设计图", f=F["h1"])
    text(draw, (70, 94), "基于现有「地图 + 底部行程 sheet」结构，增加：准备清单、当地注意、美食清单", fill=SOFT, f=F["body"])
    draw_prepare(base, 70)
    draw_tips(base, 560)
    draw_food(base, 1050)
    text(draw, (92, 1088), "模块切换放在 DayTabs 上方：行程保留原地图路线，准备/注意以资料流展示，美食支持地图 marker 与加入行程。", fill=SOFT, f=F["body"])
    base.convert("RGB").save(OUT, quality=95)
    print(OUT)


if __name__ == "__main__":
    main()
