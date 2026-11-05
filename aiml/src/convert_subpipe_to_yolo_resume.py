import json
import hashlib
from pathlib import Path
from PIL import Image

ROOT = Path(r"aiml/datasets/processed/subpipe_annotated")
OUT = Path(r"aiml/datasets/processed/subpipe_yolo")

SONAR_TYPES = ["SSS_HF_images", "SSS_LF_images"]

def assign_split(filename):
    value = int(hashlib.md5(filename.encode()).hexdigest(), 16) % 100
    if value < 80:
        return "train"
    elif value < 90:
        return "val"
    return "test"

total_skipped = 0
total_converted = 0
failed = []

for sonar in SONAR_TYPES:
    prefix = "HF" if "HF" in sonar else "LF"
    folder = ROOT / sonar
    image_dir = folder / "images"

    with open(folder / "coco_format.json", encoding="utf-8") as f:
        coco = json.load(f)

    annotations_by_image = {}
    for ann in coco["annotations"]:
        annotations_by_image.setdefault(ann["image_id"], []).append(ann)

    records = coco["images"]
    print(f"\nProcessing {sonar}: {len(records)} images", flush=True)

    for i, record in enumerate(records, 1):
        filename = record["file_name"]
        split = assign_split(filename)

        output_name = f"{prefix}_{Path(filename).stem}.png"
        output_image = OUT / "images" / split / output_name
        output_label = OUT / "labels" / split / f"{prefix}_{Path(filename).stem}.txt"

        output_image.parent.mkdir(parents=True, exist_ok=True)
        output_label.parent.mkdir(parents=True, exist_ok=True)

        # Skip only when both image and label are already present.
        if output_image.exists() and output_label.exists():
            total_skipped += 1
        else:
            source = image_dir / filename

            try:
                with Image.open(source) as im:
                    im.load()
                    im.convert("L").save(output_image, format="PNG")

                width = record["width"]
                height = record["height"]
                lines = []

                for ann in annotations_by_image.get(record["id"], []):
                    x, y, w, h = ann["bbox"]
                    cx = (x + w / 2) / width
                    cy = (y + h / 2) / height
                    nw = w / width
                    nh = h / height

                    lines.append(
                        f"0 {cx:.6f} {cy:.6f} {nw:.6f} {nh:.6f}"
                    )

                output_label.write_text("\n".join(lines), encoding="utf-8")
                total_converted += 1

            except Exception as e:
                failed.append((sonar, filename, repr(e)))
                print(f"\nFAILED: {sonar}/{filename}: {e}", flush=True)

        if i % 25 == 0 or i == len(records):
            print(
                f"{sonar}: {i}/{len(records)} | "
                f"converted this run: {total_converted} | "
                f"skipped: {total_skipped} | failed: {len(failed)}",
                flush=True
            )

print("\n=== RESUMABLE CONVERSION SUMMARY ===")
print("Newly converted:", total_converted)
print("Skipped existing:", total_skipped)
print("Failed:", len(failed))

if failed:
    with open(OUT / "conversion_failures.txt", "w", encoding="utf-8") as f:
        for sonar, filename, error in failed:
            f.write(f"{sonar} | {filename} | {error}\n")
    print("Failures saved to:", OUT / "conversion_failures.txt")

(OUT / "data.yaml").write_text(
    f"path: {OUT.resolve().as_posix()}\n"
    "train: images/train\n"
    "val: images/val\n"
    "test: images/test\n"
    "nc: 1\n"
    "names: ['Pipeline']\n",
    encoding="utf-8"
)

print("Dataset YAML updated.")
