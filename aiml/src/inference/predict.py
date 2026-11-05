"""
Sonar Pipeline Detector — YOLOv8n inference module.

Loads the trained SubPipe pipeline-detection checkpoint and runs
single-image inference, returning per-detection results with class ID,
class name, confidence, and bounding-box coordinates.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass
from pathlib import Path
from typing import List

import torch
from ultralytics import YOLO

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Project root is three levels up from this file:
#   <root>/aiml/src/inference/predict.py  →  <root>
# ---------------------------------------------------------------------------
PROJECT_ROOT = Path(__file__).resolve().parents[3]

DEFAULT_MODEL_REL_PATH = (
    "runs/detect/runs/detect/subpipe_pipeline_baseline/weights/best.pt"
)


# ---------------------------------------------------------------------------
# Detection result container
# ---------------------------------------------------------------------------
@dataclass
class Detection:
    """A single detected object returned by :meth:`SonarPipelineDetector.predict`.

    Attributes:
        class_id:   Integer class index assigned by the model.
        class_name: Human-readable class name (e.g. ``"Pipeline"``).
        confidence: Detection confidence score in ``[0, 1]``.
        x1:         Left   edge of the bounding box (pixels).
        y1:         Top    edge of the bounding box (pixels).
        x2:         Right  edge of the bounding box (pixels).
        y2:         Bottom edge of the bounding box (pixels).
    """

    class_id: int
    class_name: str
    confidence: float
    x1: float
    y1: float
    x2: float
    y2: float

    def to_dict(self) -> dict:
        """Return a plain-dict representation of this detection."""
        return {
            "class_id": self.class_id,
            "class_name": self.class_name,
            "confidence": self.confidence,
            "bbox": {
                "x1": self.x1,
                "y1": self.y1,
                "x2": self.x2,
                "y2": self.y2,
            },
        }


# ---------------------------------------------------------------------------
# Detector
# ---------------------------------------------------------------------------
class SonarPipelineDetector:
    """Load a trained YOLOv8n checkpoint and run inference on sonar images.

    Parameters
    ----------
    model_path : str | Path | None
        Absolute or *project-root-relative* path to the ``.pt`` checkpoint.
        Defaults to the SubPipe pipeline-baseline best weights.
    confidence_threshold : float
        Minimum confidence for a detection to be included (default ``0.25``).
    iou_threshold : float
        IoU threshold used during NMS (default ``0.45``).
    image_size : int
        Inference image size in pixels (default ``640``, matching training).
    """

    def __init__(
        self,
        model_path: str | Path | None = None,
        confidence_threshold: float = 0.25,
        iou_threshold: float = 0.45,
        image_size: int = 640,
    ) -> None:
        # --- Resolve model path (project-root-relative by default) ---------
        if model_path is None:
            model_path = PROJECT_ROOT / DEFAULT_MODEL_REL_PATH
        else:
            model_path = Path(model_path)
            if not model_path.is_absolute():
                model_path = PROJECT_ROOT / model_path

        if not model_path.is_file():
            raise FileNotFoundError(
                f"Model checkpoint not found: {model_path}\n"
                f"Expected relative to project root: {PROJECT_ROOT}"
            )

        # --- Select device -------------------------------------------------
        self.device: str = "cuda" if torch.cuda.is_available() else "cpu"
        logger.info("Using device: %s", self.device)

        # --- Load model ----------------------------------------------------
        self.model = YOLO(str(model_path))
        self.model.to(self.device)
        logger.info("Loaded model from %s", model_path)

        # --- Store inference parameters ------------------------------------
        self.confidence_threshold = confidence_threshold
        self.iou_threshold = iou_threshold
        self.image_size = image_size

    # -----------------------------------------------------------------------
    # Public API
    # -----------------------------------------------------------------------
    def predict(self, image_path: str | Path) -> List[Detection]:
        """Run detection on a single image.

        Parameters
        ----------
        image_path : str | Path
            Path to the input image (PNG, JPG, BMP, …).

        Returns
        -------
        list[Detection]
            One :class:`Detection` per object found above the confidence
            threshold, sorted by descending confidence.

        Raises
        ------
        FileNotFoundError
            If *image_path* does not point to an existing file.
        """
        image_path = Path(image_path)
        if not image_path.is_file():
            raise FileNotFoundError(f"Image not found: {image_path}")

        results = self.model.predict(
            source=str(image_path),
            conf=self.confidence_threshold,
            iou=self.iou_threshold,
            imgsz=self.image_size,
            device=self.device,
            verbose=False,
        )

        detections: List[Detection] = []

        for result in results:
            boxes = result.boxes
            if boxes is None or len(boxes) == 0:
                continue

            for box in boxes:
                cls_id = int(box.cls.item())
                cls_name = result.names.get(cls_id, f"class_{cls_id}")
                conf = float(box.conf.item())
                x1, y1, x2, y2 = box.xyxy[0].tolist()

                detections.append(
                    Detection(
                        class_id=cls_id,
                        class_name=cls_name,
                        confidence=conf,
                        x1=x1,
                        y1=y1,
                        x2=x2,
                        y2=y2,
                    )
                )

        # Highest confidence first.
        detections.sort(key=lambda d: d.confidence, reverse=True)

        logger.info(
            "Found %d detection(s) in %s", len(detections), image_path.name
        )
        return detections


# ---------------------------------------------------------------------------
# Convenience entry-point for quick testing
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import sys

    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    )

    if len(sys.argv) < 2:
        print(f"Usage: python {Path(__file__).name} <image_path> [model_path]")
        sys.exit(1)

    img = sys.argv[1]
    mdl = sys.argv[2] if len(sys.argv) > 2 else None

    detector = SonarPipelineDetector(model_path=mdl)
    dets = detector.predict(img)

    if not dets:
        print("No detections.")
    else:
        for i, d in enumerate(dets, 1):
            print(
                f"[{i}] {d.class_name} (id={d.class_id}) "
                f"conf={d.confidence:.4f}  "
                f"bbox=({d.x1:.1f}, {d.y1:.1f}, {d.x2:.1f}, {d.y2:.1f})"
            )

