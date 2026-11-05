import json
import hashlib
from pathlib import Path
from PIL import Image

ROOT = Path(r"aiml/datasets/processed/subpipe_annotated")
OUT = Path(r"aiml/datasets/processed/subpipe_yolo")

SONAR_TYPES = ["SSS_HF_images", "SSS_LF_images"]
SPLITS = ["train", "val", "test"]

for split in SPLITS:
    (OUT / "images" / split).mkdir(parents=True, exist_ok=True)
    (OUT / "labels" / split).mkdir(parents=True, exist_ok=True)

def assign_split(filename):
    # Stable split based on timestamp/name.
    # Matching HF/LF filenames will use the same split.
    value = int(hashlib.md5(filename.encode()).hexdigest(), 16) % 100

    if value < 80:
        return "train"
    elif value < 90:
        return "val"
    return "test"

total_images = 0
total_boxes = 0

for sonar in SONAR_TYPES:
    prefix = "HF" if "HF" in sonar else "LF"

    folder = ROOT / sonar
    image_dir = folder / "images"

    with open(folder / "coco_format.json", encoding="utf-8") as f:
        coco = json.load(f)

    annotations_by_image = {}

    for ann in coco["annotations"]:
        annotations_by_image.setdefault(ann["image_id"], []).append(ann)

    for record in coco["images"]:
        filename = record["file_name"]
        image_id = record["id"]

        split = assign_split(filename)

        source = image_dir / filename
        output_name = f"{prefix}_{Path(filename).stem}.png"

        output_image = OUT / "images" / split / output_name
        output_label = OUT / "labels" / split / f"{prefix}_{Path(filename).stem}.txt"

        # Convert PBM to PNG
        with Image.open(source) as im:
            im.convert("L").save(output_image, format="PNG")

        width = record["width"]
        height = record["height"]

        lines = []

        for ann in annotations_by_image.get(image_id, []):
            x, y, w, h = ann["bbox"]

            # COCO xywh -> YOLO normalized center xywh
            cx = (x + w / 2) / width
            cy = (y + h / 2) / height
            nw = w / width
            nh = h / height

            lines.append(
                f"0 {cx:.6f} {cy:.6f} {nw:.6f} {nh:.6f}"
            )

        output_label.write_text(
            "\n".join(lines),
            encoding="utf-8"
        )

        total_images += 1
        total_boxes += len(lines)

    print(f"Converted {sonar}: {len(coco['images'])} images")

data_yaml = OUT / "data.yaml"

data_yaml.write_text(
    f"path: {OUT.resolve().as_posix()}\n"
    "train: images/train\n"
    "val: images/val\n"
    "test: images/test\n"
    "nc: 1\n"
    "names: ['Pipeline']\n",
    encoding="utf-8"
)

print("\nConversion complete.")
print("Total images:", total_images)
print("Total bounding boxes:", total_boxes)
print("Dataset YAML:", data_yaml.resolve())
