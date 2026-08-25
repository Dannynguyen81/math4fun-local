# Math4Fun Reference-board Extraction

Use this reference when a user supplies a creature roster, a card grid, an elemental lineup, or a game-art board. It converts visual observations into reusable Math4Fun design data without copying character identity, species design, names, logos, or proprietary card layout.

## 1. Safe extraction rule

> Extract the **system** behind a board, never an individual creature from it.

Keep: roster cadence, readability hierarchy, material strategy, element-to-shape relationships, role distribution, skill readability, and asset production needs.

Do not keep: creature silhouette, anatomy, face, trademark-like name, unique marking, costume, move name, logo, exact border treatment, or an identifiable composition from a reference image.

## 2. Board-to-data matrix

| Board observation | Reusable Math4Fun data | Required redesign move |
| --- | --- | --- |
| Twenty lesson positions across two maps | `20` curriculum guardian slots, `10` stations per map, one learning link per slot | Generate a new anatomy and field-note metaphor for every slot |
| Two endpoint challenges | One Boss dossier per map with a larger silhouette and a two-stage magic read | Create an original species, title and signature anatomy; never reuse a dragon/serpent design seen on the board |
| Five visible element chips | Hỏa/Thủy/Mộc/Kim/Thổ taxonomy, icon-safe color families and shape languages | Use original Math4Fun emblems and Field Journal seals |
| Two visual roles per element | `vanguard` + `guide` as an anchor pair; expand to `guardian`/`trickster`/`finisher` for 20 slots | Vary body archetype, face grammar and motion before choosing color |
| Portrait card with index, element and learning label | `card_contract`: slot marker, element seal, portrait boundary, learning label, progression cue | Use parchment dossier/stamp grammar, not a copied card border/layout |
| Four to six compact ability rows | Basic, Signature, Utility, Ultimate plus readable spell icons | Make spell visuals grow from anatomy and avoid copied move names/effects |
| Polished 3D creature presentation | Soft cinematic key light, subtle rim light, high silhouette contrast, semi-gloss materials | Maintain Math4Fun Field Journal background and original creature construction |

## 3. Math4Fun roster architecture

### 3.1 Curriculum roster

Use the curriculum as the organizing layer rather than making an animal mascot for every subject.

| Layer | Contract |
| --- | --- |
| Map 1 | 10 station slots; each pet connects to one Grade 4 learning topic through a motion, tool, habitat or field-note metaphor |
| Map 2 | 10 station slots; introduce new silhouettes and secondary element roles rather than recoloring Map 1 pets |
| Boss 1 / Boss 2 | Each uses a two-stage dossier: readable sealed portrait, then battle pose with a unique cast source |
| Five elements | Distribute color, shape, material, spell source and role together; no element may rely on color alone |
| Roster pair | A 10-pet visual anchor batch can use two complementary roles per element: `vanguard` and `guide` |

For a 20-pet roster, aim for each element to span at least three body archetypes across the complete collection. No consecutive route positions may share all of `body archetype + face grammar + movement language`.

### 3.2 Element clarity system

| Element | Shape / motion grammar | Material cue | Card accent | Animation source |
| --- | --- | --- | --- | --- |
| Hỏa | Upward teardrops, soft wedges, hop/dash | ember glass, warm scale, flame tuft | coral, amber, cream | chest ember, tail plume, crest vent |
| Thủy | arcs, spirals, fins, glide/swim | pearl gloss, translucent fin, mist | aqua, teal, pale blue | fin ribbon, shell channel, bubble core |
| Mộc | leaves, branching curves, grounded hop | leaf fur, bark, bud, vine | moss, leaf, lime | antler bud, vine tail, seed pod |
| Kim | diamonds, rings, plates, precise turns | ceramic-metal, pale crystal, polished edge | ivory, pale gold, silver | rotating plate, collar ring, prism crest |
| Thổ | soft blocks, layered plates, stomp/roll | clay, stone, moss, amber crystal | ochre, sandstone, umber | back crystal, paw plate, shell seam |

## 4. Compact card and asset contract

At 48–96px, the child must identify the **element**, **pet silhouette** and **next learning relationship** before surface detail.

1. Keep the portrait boundary simple: circular stamp, oval specimen window or dossier window.
2. Reserve one corner for the element seal and the opposite corner for the route/station marker.
3. Use one short learning label; never turn the card into a multi-line stat table.
4. Make locked states a sealed specimen with taxonomy and evidence, not a gray empty card.
5. Package every approved pet with portrait, card crop, battle pose, element emblem, spell icon set and alt text.

## 5. Extraction worksheet

Complete this before designing a pet from a reference board.

```yaml
reference_provenance:
  source_type: user_reference_board
  source_summary: ""
  usable_principles:
    - roster_cadence
    - element_shape_mapping
    - compact_card_hierarchy
    - spell_readability
  do_not_copy:
    - individual_creature_silhouette
    - creature_name_or_lore
    - trademark_or_logo
    - exact_card_border_or_layout

roster_decision:
  map: map1
  topic_order: 1
  element: hoa
  element_slot: vanguard
  role: striker
  required_diversity_against: []

card_contract:
  portrait_boundary: stamp
  element_seal_position: top-right
  slot_marker_position: top-left
  learning_label: ""
  compact_readability_note: ""
```

## 6. Review checklist

Reject a design if any answer is true.

- Does its silhouette still point to a creature in the reference board after removing color?
- Does its face, tail, horn, scale pattern or crest preserve a recognizable trait from a reference creature?
- Is the card composition recognizably a copy rather than a Math4Fun field dossier?
- Does the magic appear as detached visual noise instead of emanating from original anatomy?
- Would a child fail to infer the element, pose purpose or learning hook at compact size?

Approve only after the standard six quality gates in `SKILL.md` also pass.
