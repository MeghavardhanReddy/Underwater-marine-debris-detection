
import json
import shutil
from pathlib import Path

from PIL import Image


PROJECT_ROOT = Path(__file__).resolve().parents[2]

SOURCE_DIR = PROJECT_ROOT / "aiml" / "datasets" / "raw" / "ghostvision"
OUTPUT_DIR = PROJECT_ROOT / "aiml" / "datasets" / "processed" / "ghostvision_yolo"

SPLITS = {
    "train": "train",
    "valid": "val",
    "test": "test",
}

CLASS_NAMES = ["Crab-Pot"]
CLASS_TO_ID = {"Crab-Pot": 0}


def convert_bbox(bbox, image_width, image_height):
    """Convert pixel xywh bbox to normalized YOLO xywh."""

    x, y, w, h = bbox

    # Original bbox is x_min, y_min, width, height.
    x1 = max(0.0, float(x))
    y1 = max(0.0, float(y))
    x2 = min(float(image_width), float(x) + float(w))
    y2 = min(float(image_height), float(y) + float(h))

    # Ignore boxes that become invalid after clipping.
    if x2 <= x1 or y2 <= y1:
        return None

    center_x = ((x1 + x2) / 2) / image_width
    center_y = ((y1 + y2) / 2) / image_height
    box_width = (x2 - x1) / image_width
    box_height = (y2 - y1) / image_height

    return center_x, center_y, box_width, box_height


def process_split(source_split, output_split):
    source = SOURCE_DIR / source_split
    metadata_file = source / "metadata.jsonl"

    image_output = OUTPUT_DIR / "images" / output_split
    label_output = OUTPUT_DIR / "labels" / output_split

    image_output.mkdir(parents=True, exist_ok=True)
    label_output.mkdir(parents=True, exist_ok=True)

    total_images = 0
    skipped_images = 0
    total_objects = 0
    clipped_boxes = 0
    skipped_boxes = 0

    with metadata_file.open("r", encoding="utf-8") as f:
        for line in f:
            record = json.loads(line)

            filename = record["file_name"]
            image_path = source / filename

            if not image_path.exists():
                raise FileNotFoundError(f"Image missing: {image_path}")

            label_path = label_output / f"{image_path.stem}.txt"
            output_image_path = image_output / filename

            # Skip only when both output files already exist.
            if output_image_path.exists() and label_path.exists():
                skipped_images += 1
                continue

            with Image.open(image_path) as image:
                image_width, image_height = image.size

            # Copy the image if it has not been copied yet.
            if not output_image_path.exists():
                shutil.copy2(image_path, output_image_path)

            objects = record["objects"]
            labels = []

            for bbox, category in zip(
                objects["bbox"],
                objects["category"]
            ):
                if category not in CLASS_TO_ID:
                    continue

                x, y, w, h = bbox

                if (
                    x < 0 or y < 0 or
                    x + w > image_width or
                    y + h > image_height
                ):
                    clipped_boxes += 1

                converted = convert_bbox(
                    bbox, image_width, image_height
                )

                if converted is None:
                    skipped_boxes += 1
                    continue

                class_id = CLASS_TO_ID[category]
                cx, cy, bw, bh = converted

                labels.append(
                    f"{class_id} {cx:.6f} {cy:.6f} "
                    f"{bw:.6f} {bh:.6f}"
                )

                total_objects += 1

            label_path.write_text(
                "\n".join(labels),
                encoding="utf-8"
            )

            total_images += 1

    print(f"\n{source_split.upper()} -> {output_split}")
    print("New images processed:", total_images)
    print("Existing images skipped:", skipped_images)
    print("Objects converted:", total_objects)
    print("Boxes clipped:", clipped_boxes)
    print("Boxes skipped:", skipped_boxes)

def create_yaml():
    yaml_content = f"""path: {OUTPUT_DIR.as_posix()}
train: images/train
val: images/val
test: images/test

nc: {len(CLASS_NAMES)}
names: {CLASS_NAMES}
"""

    (OUTPUT_DIR / "data.yaml").write_text(
        yaml_content,
        encoding="utf-8"
    )


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    for source_split, output_split in SPLITS.items():
        process_split(source_split, output_split)

    create_yaml()

    print("\nDataset conversion completed.")
    print("Output:", OUTPUT_DIR)


if __name__ == "__main__":
    main()
