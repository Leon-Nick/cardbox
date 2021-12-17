// source: https://scryfall.com/docs/api/cards
export interface ScryfallData {
  // Core Card Fields

  scryfall_id: string;
  oracle_id: string;
  lang: string;
  prints_search_uri: string;
  rulings_uri: string;
  scryfall_uri: string;
  uri: string;

  // Gameplay Fields

  oversized: boolean;
  reserved: boolean;

  cmc: number;
  edhrec_rank: number;

  loyalty?: number;
  power?: number;
  toughness?: number;

  color_identity: Color[];
  color_indicator: Color[];
  colors: Color[];
  layout: Layout;
  legalities: Record<Format, Legality>;

  all_parts?: RelatedCard[];
  card_faces?: CardFace[];
  produced_mana?: Color[];

  keywords: string[];
  name: string;
  type_line: string;

  hand_modifier?: string;
  life_modifier?: string;
  mana_cost?: string;
  oracle_text?: string;

  // Print Fields

  booster: boolean;
  digital: boolean;
  full_art: boolean;
  highres_image: boolean;
  reprint: boolean;
  story_spotlight: boolean;
  textless: boolean;
  variation: boolean;

  content_warning?: boolean;

  card_back_id: string;
  collector_number: string;
  scryfall_set_uri: string;
  set_name: string;
  set_search_uri: string;
  set_type: string;
  set_uri: string;
  set: string;
  set_id: string;

  artist?: string;
  flavor_name?: string;
  flavor_text?: string;
  illustration_id?: string;
  printed_name?: string;
  printed_text?: string;
  printed_type_line?: string;
  variation_of?: string;
  watermark?: string;

  border_color: "black" | "white" | "borderless" | "silver" | "gold";
  frame: "1993" | "1997" | "2003" | "2015" | "future";
  image_status: "missing" | "placeholder" | "lowres" | "highres_scan";
  rarity: "common" | "uncommon" | "rare" | "special" | "mythic" | "bonus";
  finishes: ("foil" | "nonfoil" | "etched" | "glossy")[];
  games: ("paper" | "arena" | "mtgo")[];

  security_stamp?: "oval" | "triangle" | "acorn" | "arena";

  releasted_at: Date;
  related_uris: Record<string, URL>;

  image_uris?: Record<ImageType, URI>;
  frame_effects?: FrameEffect[];
  preview?: {
    previewed_at: Date;
    source_uri: string;
    source: string;
  };
}

type Format = string;
type Legality = "legal" | "not_legal" | "restricted" | "banned";
type ImageType =
  | "png"
  | "border_crop"
  | "art_crop"
  | "large"
  | "normal"
  | "small";
type URI = string;

interface RelatedCard {
  component: "token" | "meld_part" | "meld_result" | "combo_piece";

  id: string;
  name: string;
  type_line: string;
  uri: string;
}

interface CardFace {
  cmc?: number;
  loyalty?: number;
  power?: number;
  toughness?: number;

  artist?: string;
  flavor_text?: string;
  illustration_id?: string;
  layout?: string;
  mana_cost: string;
  name: string;
  oracle_id?: string;
  oracle_text?: string;
  printed_name?: string;
  printed_text?: string;
  printed_type_line?: string;
  type_line?: string;
  watermark?: string;

  color_indicator?: Color[];
  colors?: Color[];
  image_uris?: Record<ImageType, URI>;
}

export enum Color {
  W = "White",
  U = "Blue",
  B = "Black",
  R = "Red",
  G = "Green",
}

export enum Layout {
  normal = "normal",
  split = "split",
  flip = "flip",
  transform = "transform",
  modal_dfc = "modal_dfc",
  meld = "meld",
  leveler = "leveler",
  class = "class",
  saga = "saga",
  adventure = "adventure",
  planar = "planar",
  scheme = "scheme",
  vanguard = "vanguard",
  token = "token",
  double_faced_token = "double_faced_token",
  emblem = "emblem",
  augment = "augment",
  host = "host",
  art_series = "art_series",
  reversible_card = "reversible_card",
}

export enum FrameEffect {
  legendary = "legendary",
  miracle = "miracle",
  nyxtouched = "nyxtouched",
  draft = "draft",
  devoid = "devoid",
  tombstone = "tombstone",
  colorshifted = "colorshifted",
  inverted = "inverted",
  sunmoondfc = "sunmoondfc",
  compasslanddfc = "compasslanddfc",
  originpwdfc = "originpwdfc",
  mooneldrazidfc = "mooneldrazidfc",
  waxingandwaningmoondfc = "waxingandwaningmoondfc",
  showcase = "showcase",
  extendedart = "extendedart",
  companion = "companion",
  etched = "etched",
  snow = "snow",
  lesson = "lesson",
}
