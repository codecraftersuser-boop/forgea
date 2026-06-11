from scraper.scrapers.freecodecamp import FreeCodeCampScraper
from scraper.scrapers.mit_ocw import MITOpenCourseWareScraper
from scraper.scrapers.harvard import HarvardOnlineScraper
from scraper.scrapers.kaggle_learn import KaggleLearnScraper
from scraper.scrapers.deeplearning_ai import DeepLearningAIScraper
from scraper.scrapers.roadmap_sh import RoadmapShScraper
from scraper.scrapers.w3schools import W3SchoolsScraper
from scraper.scrapers.geeksforgeeks import GeeksForGeeksScraper

ALL_SCRAPERS = [
    FreeCodeCampScraper,
    MITOpenCourseWareScraper,
    HarvardOnlineScraper,
    KaggleLearnScraper,
    DeepLearningAIScraper,
    RoadmapShScraper,
    W3SchoolsScraper,
    GeeksForGeeksScraper,
]

SCRAPER_MAP = {s.name: s for s in ALL_SCRAPERS}
