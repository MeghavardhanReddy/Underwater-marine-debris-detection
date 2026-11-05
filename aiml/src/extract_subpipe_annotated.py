import zipfile
import json
from pathlib import Path

archive = Path(r"aiml\datasets\raw\subpipe\SubPipeMini2.zip")
output = Path(r"aiml\datasets\processed\subpipe_annotated")

sonar_types = ["SSS_HF_images", "SSS_LF_images"]

with zipfile.ZipFile(archive) as z:
    for sonar in sonar_types:
        base = f"SubPipeMiniSSS/DATA/{sonar}"
        annotation_path = f"{base}/COCO_Annotation/coco_format.json"

        with z.open(annotation_path) as f:
            data = json.load(f)

        annotated_names = {img["file_name"] for img in data["images"]}

        image_paths = {
            name.split("/")[-1]: name
            for name in z.namelist()
            if name.startswith(f"{base}/Image/")
            and name.lower().endswith(".pbm")
        }

        selected = [
            image_paths[name]
            for name in annotated_names
            if name in image_paths
        ]

        destination = output / sonar / "images"
        destination.mkdir(parents=True, exist_ok=True)

        print(f"\nExtracting {sonar}: {len(selected)} images")

        for i, path in enumerate(selected, 1):
            target = destination / Path(path).name

            with z.open(path) as src, open(target, "wb") as dst:
                dst.write(src.read())

            if i % 100 == 0:
                print(f"  Extracted {i}/{len(selected)}")

        annotation_destination = output / sonar / "coco_format.json"

        with z.open(annotation_path) as src:
            annotation_destination.write_bytes(src.read())

        print(f"Finished: {sonar}")

print("\nSelective extraction completed.")
print("Output:", output.resolve())
