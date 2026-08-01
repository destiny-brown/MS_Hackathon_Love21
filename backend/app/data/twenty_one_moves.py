"""Trail location metadata for Captain's Corner (mirrors frontend 21 Moves)."""

from dataclasses import dataclass

TRAIL_LOCATION_COUNT = 6


@dataclass(frozen=True)
class TrailLocation:
    id: str
    label: str
    events_count: int


TRAIL_LOCATIONS: list[TrailLocation] = [
    TrailLocation(id="stadium", label="The Stadium", events_count=5),
    TrailLocation(id="harbour", label="The Harbour", events_count=5),
    TrailLocation(id="court", label="The Court", events_count=5),
    TrailLocation(id="wall", label="The Climbing Wall", events_count=5),
    TrailLocation(id="track", label="The Cycling Track", events_count=5),
    TrailLocation(id="festival", label="Finish Line Festival", events_count=5),
]


def resolve_trail_location(day_number: int) -> TrailLocation:
    safe_day = max(1, day_number)
    index = (safe_day - 1) % TRAIL_LOCATION_COUNT
    return TRAIL_LOCATIONS[index]
