from app.scrapers.freecodecamp import FreeCodeCampScraper
from app.scrapers.kaggle_learn import KaggleLearnScraper
from app.scrapers.mit_ocw import MITOpenCourseWareScraper
from app.scrapers.roadmap_sh import RoadmapShScraper
from app.scrapers.deeplearning_ai import DeepLearningAIScraper
from app.scrapers.w3schools import W3SchoolsScraper
from app.scrapers.harvard_online import HarvardOnlineScraper
from app.scrapers.programiz import ProgramizScraper
from app.scrapers.digitalocean import DigitalOceanScraper
from app.scrapers.odin_project import OdinProjectScraper

ALL_SCRAPERS = [
    FreeCodeCampScraper,
    KaggleLearnScraper,
    MITOpenCourseWareScraper,
    RoadmapShScraper,
    DeepLearningAIScraper,
    W3SchoolsScraper,
    HarvardOnlineScraper,
    ProgramizScraper,
    DigitalOceanScraper,
    OdinProjectScraper,
]

__all__ = ["ALL_SCRAPERS"]
